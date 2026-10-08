import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/consent
 * Record DPDP Act 2023 opt-in consent (PPT Requirement F20)
 */
router.post('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const {
    purpose,
    languageShown = 'en',
    channel = 'mobile_app',
  } = req.body;

  if (!purpose || !['approximate_location', 'call_recording_transcript', 'communications'].includes(purpose)) {
    return res.status(400).json({
      error: 'Invalid consent purpose. Must be one of: approximate_location, call_recording_transcript, communications',
    });
  }

  const userId = req.user!.userId;

  const record = store.addConsent({
    userId,
    purpose,
    languageShown,
    status: 'granted',
    channel,
  });

  console.log(`📜 [DPDP Consent] Granted: User ${userId} for '${purpose}' in language '${languageShown}'`);

  return res.status(201).json({
    success: true,
    message: `Consent granted for purpose '${purpose}' under DPDP Act 2023 regulations.`,
    consent: record,
  });
});

/**
 * POST /api/consent/:id/withdraw
 * Withdraw previously granted consent
 */
router.post('/:id/withdraw', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const record = store.withdrawConsent(req.params.id);
  if (!record) {
    return res.status(404).json({ error: 'Consent record not found' });
  }

  console.log(`🚫 [DPDP Consent] Withdrawn: Record ${record.id} for '${record.purpose}'`);

  return res.json({
    success: true,
    message: 'Consent withdrawn successfully. Further processing for this purpose is restricted.',
    consent: record,
  });
});

/**
 * GET /api/consent/my
 * View active and past consents for the authenticated user
 */
router.get('/my', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const userConsents = store.getUserConsents(req.user!.userId);
  return res.json({
    success: true,
    consents: userConsents,
  });
});

/**
 * POST /api/consent/data-access
 * Digital Personal Data Protection Act 2023 (Section 11) - Right to Access Personal Data (PPT F20)
 */
router.post('/data-access', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.body.userId || req.user!.userId;
    const report = store.getDataAccessReport(userId);

    return res.json({
      success: true,
      report,
    });
  } catch (err: any) {
    return res.status(404).json({ error: err.message || 'Failed to generate data access report' });
  }
});

/**
 * POST /api/consent/data-erasure
 * Digital Personal Data Protection Act 2023 (Section 12) - Right to Correction and Erasure (PPT F20)
 */
router.post('/data-erasure', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const targetUserId = req.body.userId || req.user!.userId;
    const requestedBy = req.user!.userId;

    const result = store.eraseUserData(targetUserId, requestedBy);

    return res.json({
      success: true,
      result,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to process data erasure request' });
  }
});

/**
 * POST /api/consent/purge-locations
 * Auto-expire and redact historical location data older than retention limit (F20)
 */
router.post('/purge-locations', authenticate, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { retentionHours = 24 } = req.body;
    const purgeReport = store.purgeOldLocations(Number(retentionHours));

    return res.json({
      success: true,
      message: `Completed automated location retention purge for bookings older than ${retentionHours} hours.`,
      purgeReport,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Location purge failed' });
  }
});

/**
 * GET /api/consent/grievance-officer
 * DPDP Act 2023 (Section 8(9)) - Statutory Contact Details for Grievance Redressal (PPT F20)
 */
router.get('/grievance-officer', (req: Request, res: Response) => {
  const officer = store.getGrievanceOfficer();
  return res.json({
    success: true,
    grievanceOfficer: officer,
  });
});

export default router;
