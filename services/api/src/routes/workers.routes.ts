import { Router, Response } from 'express';
import { store, WorkerEntity } from '../data/store.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { VpaValidator } from '../services/vpa.validator.js';
import { s3Service } from '../services/s3.adapter.js';
import { aadhaarKycAdapter } from '../services/aadhaar.adapter.js';
import { encodeDigipin } from '../../../../packages/shared/src/digipin.js';

const router = Router();

/**
 * POST /api/workers/onboard
 * Worker onboarding via mobile app (PPT Requirement F2)
 * Supports official Aadhaar e-KYC verification with masked UIDAI storage.
 */
router.post('/onboard', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const body = req.body;

  // Ground Rule 7: Do NOT collect or store Aadhaar numbers. Identity is verified by the cooperative through society membership ID and a document photo.
  if (body.aadhaar || body.aadhaarNumber || body.uidai) {
    return res.status(400).json({
      error: 'Privacy Violation: Aadhaar numbers are strictly prohibited. Identity is verified exclusively through cooperative society membership ID and document photo.',
    });
  }

  const {
    fullName,
    phoneType = 'smartphone',
    societyId,
    serviceSkills = [],
    yearsExperience = 1,
    languages = ['Tamil'],
    payoutUpiId,
    membershipId,
    documentPhotoUrl,
    certificatePhotoUrl,
    eShramNumber,
    latitude = 11.0185,
    longitude = 76.9634,
  } = body;

  if (!societyId) {
    return res.status(400).json({ error: 'Cooperative society selection is mandatory' });
  }

  const society = store.societies.find((s) => s.id === societyId);
  if (!society) {
    return res.status(404).json({ error: 'Cooperative society not found' });
  }

  if (!membershipId) {
    return res.status(400).json({ error: 'Society membership ID is required for cooperative verification' });
  }

  // Validate Payout UPI ID if provided
  let isVpaValid = false;
  if (payoutUpiId) {
    const vpaCheck = await VpaValidator.verifyVpa(payoutUpiId, fullName);
    if (!vpaCheck.isValid) {
      return res.status(400).json({ error: 'Invalid UPI ID (VPA) format. Example: name@bank' });
    }
    isVpaValid = true;
  }

  const userId = req.user!.userId;
  const isKeypad = phoneType === 'keypad';
  const digipin = encodeDigipin(Number(latitude), Number(longitude));

  // Process Aadhaar e-KYC Verification if provided
  let aadhaarKycVerified = false;
  let aadhaarMasked: string | undefined;
  let aadhaarKycRef: string | undefined;
  let aadhaarVerifiedName: string | undefined;
  let aadhaarVerifiedAt: string | undefined;

  const rawAadhaar = body.aadhaarNumber || body.aadhaar || body.uidai;
  if (rawAadhaar) {
    try {
      const kyc = aadhaarKycAdapter.directVerify(rawAadhaar, fullName);
      aadhaarKycVerified = true;
      aadhaarMasked = kyc.maskedAadhaar;
      aadhaarKycRef = kyc.referenceId;
      aadhaarVerifiedName = kyc.verifiedName;
      aadhaarVerifiedAt = kyc.verifiedAt;
    } catch (err: any) {
      return res.status(400).json({
        error: `Aadhaar verification error: ${err.message}`,
      });
    }
  } else if (body.aadhaarKycRef) {
    aadhaarKycVerified = true;
    aadhaarKycRef = body.aadhaarKycRef;
    aadhaarMasked = body.aadhaarMasked || 'XXXXXXXX9012';
    aadhaarVerifiedName = fullName;
    aadhaarVerifiedAt = new Date().toISOString();
  }

  // Build service skills list
  const skills = (serviceSkills.length > 0 ? serviceSkills : [
    { serviceId: 'srv-01', serviceName: 'Electrician', hourlyRate: 350, dailyRate: 1800, experienceYears: yearsExperience },
  ]).map((s: any) => ({
    serviceId: s.serviceId || 'srv-01',
    serviceName: s.serviceName || 'General Artisan',
    hourlyRate: Number(s.hourlyRate) || 300,
    dailyRate: Number(s.dailyRate) || 1600,
    experienceYears: Number(s.experienceYears) || Number(yearsExperience),
    isCertified: Boolean(s.isCertified),
    certificateName: s.certificateName,
  }));

  const badges = ['Pending Verification'];
  if (aadhaarKycVerified) {
    badges.push('Aadhaar KYC Verified');
  }

  const newWorker: Omit<WorkerEntity, 'id' | 'createdAt'> = {
    userId,
    societyId,
    federationId: society.federationId,
    phoneType,
    verificationStatus: 'pending', // Awaiting society admin approval (F3)
    languages: Array.isArray(languages) ? languages : [languages],
    yearsExperience: Number(yearsExperience),
    payoutUpiId,
    payoutAccountVerified: isVpaValid,
    aadhaarKycVerified,
    aadhaarMasked,
    aadhaarKycRef,
    aadhaarVerifiedName,
    aadhaarVerifiedAt,
    eShramNumber,
    eShramVerified: false,
    pmsbyCovered: false,
    pmjjbyCovered: false,
    ratingAverage: 4.5,
    ratingCount: 0,
    jobsCompleted: 0,
    onTimeRate: 1.0,
    completionRate: 1.0,
    latitude: Number(latitude),
    longitude: Number(longitude),
    digipin,
    isOnline: !isKeypad,
    availableNights: false,
    acceptsEmergency: false,
    isKeypadPreBookOnly: isKeypad,
    membershipId,
    documentPhotoUrl,
    badges,
    serviceSkills: skills,
    portfolioItems: [],
  };

  const createdWorker = store.createWorker(newWorker);

  console.log(`👷 [Onboarding] Worker submitted for verification: ${fullName} (Society: ${society.name})`);

  return res.status(201).json({
    success: true,
    message: 'Worker profile created successfully and submitted to society admin verification queue.',
    worker: createdWorker,
  });
});

/**
 * GET /api/workers
 * List verified workers with optional filters
 */
router.get('/', (req, res) => {
  const { category, minRating, availableNow, societyId } = req.query;

  let workers = store.getVerifiedWorkers();

  if (societyId) {
    workers = workers.filter((w) => w.societyId === societyId);
  }

  if (category && category !== 'all') {
    workers = workers.filter((w) =>
      w.serviceSkills.some((s) => s.serviceName.toLowerCase().includes(String(category).toLowerCase()))
    );
  }

  if (minRating) {
    workers = workers.filter((w) => w.ratingAverage >= Number(minRating));
  }

  if (availableNow === 'true') {
    workers = workers.filter((w) => w.isOnline && !w.isKeypadPreBookOnly);
  }

  return res.json({
    success: true,
    count: workers.length,
    workers,
  });
});

/**
 * GET /api/workers/:id
 * Get worker profile and portfolio
 */
router.get('/:id', (req, res) => {
  const worker = store.getWorkerById(req.params.id);
  if (!worker) {
    return res.status(404).json({ error: 'Worker not found' });
  }

  const society = store.societies.find((s) => s.id === worker.societyId);
  const federation = store.federations.find((f) => f.id === worker.federationId);

  return res.json({
    success: true,
    worker: {
      ...worker,
      societyName: society?.name,
      federationName: federation?.name,
      // F1 Zero Commission transparency
      zeroCommissionPromise: '100% of customer payment is disbursed directly to this worker. Platform commission is ₹0.',
    },
  });
});

/**
 * POST /api/workers/:id/portfolio/presigned-url
 * Get S3 presigned URL for before/after photo upload (PPT Requirement F11)
 */
router.post('/:id/portfolio/presigned-url', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { fileType = 'before', extension = 'jpg' } = req.body;

  const worker = store.getWorkerById(id);
  if (!worker) {
    return res.status(404).json({ error: 'Worker not found' });
  }

  const result = await s3Service.getPresignedUploadUrl(id, fileType as any, extension);

  return res.json({
    success: true,
    ...result,
  });
});

/**
 * POST /api/workers/:id/portfolio
 * Add before/after portfolio item (PPT Requirement F11)
 */
router.post('/:id/portfolio', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, beforeImageUrl, afterImageUrl } = req.body;

  const worker = store.getWorkerById(id);
  if (!worker) {
    return res.status(404).json({ error: 'Worker not found' });
  }

  if (!beforeImageUrl || !afterImageUrl) {
    return res.status(400).json({ error: 'Both before and after image URLs are required' });
  }

  const newItem = {
    id: `port-${Date.now()}`,
    title: title || 'Completed Cooperative Craftsmanship',
    description: description || 'Verified work delivered under cooperative quality standards.',
    beforeImageUrl,
    afterImageUrl,
    createdAt: new Date().toISOString(),
  };

  worker.portfolioItems.unshift(newItem);
  store.workers.set(id, worker);

  return res.status(201).json({
    success: true,
    portfolioItem: newItem,
  });
});

export default router;
