import { Router, Request, Response } from 'express';
import { aadhaarKycAdapter } from '../services/aadhaar.adapter.js';
import { store } from '../data/store.js';

const router = Router();

/**
 * POST /api/kyc/aadhaar/otp
 * Initiates Aadhaar e-KYC verification by dispatching OTP to the UIDAI-registered mobile number.
 * Requires user consent per DPDP Act 2023.
 */
router.post('/aadhaar/otp', (req: Request, res: Response) => {
  try {
    const { aadhaarNumber, workerName, consentGiven = true } = req.body;

    if (!aadhaarNumber) {
      return res.status(400).json({ error: '12-digit Aadhaar number is required.' });
    }

    if (!consentGiven) {
      return res.status(400).json({ error: 'Explicit user consent is mandatory for Aadhaar e-KYC verification.' });
    }

    const otpResponse = aadhaarKycAdapter.requestOtp(aadhaarNumber, workerName);

    // Record consent in DPDP ledger if workerId is known
    const workerId = (req as any).user?.userId;
    if (workerId) {
      store.addConsent({
        userId: workerId,
        purpose: 'communications',
        languageShown: 'en',
        status: 'granted',
        channel: 'mobile_app',
      });
    }

    return res.json(otpResponse);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to request Aadhaar OTP.' });
  }
});

/**
 * POST /api/kyc/aadhaar/verify
 * Verifies Aadhaar OTP with UIDAI / DigiLocker gateway.
 * Extracts verified demographic details, masks Aadhaar (XXXXXXXX1234), and binds to worker record.
 */
router.post('/aadhaar/verify', (req: Request, res: Response) => {
  try {
    const { sessionId, otp, workerId, workerName } = req.body;

    if (!sessionId || !otp) {
      return res.status(400).json({ error: 'sessionId and OTP are required for verification.' });
    }

    const targetWorkerId = workerId || (req as any).user?.userId;
    const worker = targetWorkerId ? store.getWorker(targetWorkerId) : undefined;
    const expectedName = workerName || (worker ? store.users.get(worker.userId)?.fullName : undefined) || 'Cooperative Artisan';

    const kycResult = aadhaarKycAdapter.verifyOtp(sessionId, otp, expectedName);

    // If worker exists, bind Aadhaar e-KYC status
    if (targetWorkerId && worker) {
      store.setWorkerAadhaarKyc(targetWorkerId, {
        maskedAadhaar: kycResult.maskedAadhaar,
        referenceId: kycResult.referenceId,
        verifiedName: kycResult.verifiedName,
      });
    }

    return res.json({
      success: true,
      kycResult,
      message: 'Aadhaar e-KYC verified successfully. Masked Aadhaar recorded.',
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Aadhaar OTP verification failed.' });
  }
});

/**
 * POST /api/kyc/aadhaar/direct-verify
 * Direct instant e-KYC for assisted onboarding at cooperative society secretariat offices.
 */
router.post('/aadhaar/direct-verify', (req: Request, res: Response) => {
  try {
    const { aadhaarNumber, workerId, workerName } = req.body;

    if (!aadhaarNumber || !workerId) {
      return res.status(400).json({ error: 'aadhaarNumber and workerId are required.' });
    }

    const worker = store.getWorker(workerId);
    if (!worker) {
      return res.status(404).json({ error: 'Worker record not found.' });
    }

    const nameToVerify = workerName || store.users.get(worker.userId)?.fullName || 'Cooperative Artisan';
    const kycResult = aadhaarKycAdapter.directVerify(aadhaarNumber, nameToVerify);

    store.setWorkerAadhaarKyc(workerId, {
      maskedAadhaar: kycResult.maskedAadhaar,
      referenceId: kycResult.referenceId,
      verifiedName: kycResult.verifiedName,
    });

    return res.json({
      success: true,
      kycResult,
      message: 'Worker Aadhaar e-KYC completed and verified directly.',
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Direct Aadhaar verification failed.' });
  }
});

/**
 * GET /api/kyc/aadhaar/status/:workerId
 * Returns Aadhaar e-KYC verification status and masked Aadhaar for a worker.
 */
router.get('/aadhaar/status/:workerId', (req: Request, res: Response) => {
  const worker = store.getWorker(req.params.workerId);
  if (!worker) {
    return res.status(404).json({ error: 'Worker not found.' });
  }

  return res.json({
    success: true,
    workerId: worker.id,
    aadhaarKycVerified: Boolean(worker.aadhaarKycVerified),
    aadhaarMasked: worker.aadhaarMasked || null,
    aadhaarKycRef: worker.aadhaarKycRef || null,
    aadhaarVerifiedName: worker.aadhaarVerifiedName || null,
    aadhaarVerifiedAt: worker.aadhaarVerifiedAt || null,
    badges: worker.badges,
  });
});

export default router;
