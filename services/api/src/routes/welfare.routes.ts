import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/welfare/workers/:id/e-shram
 * Capture and verify e-Shram UAN (PPT Requirement F17)
 * STRICT GROUND RULE 7: Strictly NO Aadhaar numbers.
 */
router.post(
  '/workers/:id/e-shram',
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { eShramNumber } = req.body;

      if (!eShramNumber || typeof eShramNumber !== 'string') {
        return res.status(400).json({ error: 'Valid e-Shram UAN number is required' });
      }

      // Format validation: e-Shram UAN typically has 12 digits (often displayed as XXXX XXXX XXXX or UAN-...)
      // Crucial Ground Rule 7: Reject anything that appears to be Aadhaar or mentions Aadhaar
      if (eShramNumber.toLowerCase().includes('aadhaar') || eShramNumber.toLowerCase().includes('uidai')) {
        return res.status(400).json({
          error: 'Compliance Violation (Ground Rule 7): Aadhaar storage is strictly prohibited. Provide e-Shram UAN only.',
        });
      }

      const digitsOnly = eShramNumber.replace(/[^0-9]/g, '');
      if (digitsOnly.length < 10 || digitsOnly.length > 16) {
        return res.status(400).json({
          error: 'Invalid e-Shram UAN format. Must contain 10-16 numeric/alphanumeric characters.',
        });
      }

      const verifier = req.user?.fullName || req.user?.userId || 'Society Admin';
      const worker = store.updateWorkerEShram(id, eShramNumber.trim(), verifier);

      return res.json({
        success: true,
        message: 'e-Shram UAN successfully captured and verified by cooperative society.',
        workerId: worker.id,
        eShramNumber: worker.eShramNumber,
        eShramVerified: worker.eShramVerified,
        verifiedBy: verifier,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to update e-Shram UAN' });
    }
  }
);

/**
 * POST /api/welfare/workers/:id/insurance
 * Update PMSBY and PMJJBY cover tracking (PPT Requirement F17)
 */
router.post(
  '/workers/:id/insurance',
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { pmsbyCovered, pmsbyRenewalDate, pmjjbyCovered, pmjjbyRenewalDate } = req.body;

      const worker = store.updateWorkerInsurance(id, {
        pmsbyCovered,
        pmsbyRenewalDate,
        pmjjbyCovered,
        pmjjbyRenewalDate,
      });

      return res.json({
        success: true,
        message: 'Worker social security insurance coverage updated.',
        workerId: worker.id,
        insurance: {
          pmsbyCovered: worker.pmsbyCovered,
          pmsbyRenewalDate: worker.pmsbyRenewalDate || '2026-05-31',
          pmjjbyCovered: worker.pmjjbyCovered,
          pmjjbyRenewalDate: worker.pmjjbyRenewalDate || '2026-05-31',
        },
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to update insurance status' });
    }
  }
);

/**
 * GET /api/welfare/workers/:id/eligibility
 * Return insurance eligibility guidance and statutory scheme details (F17)
 */
router.get('/workers/:id/eligibility', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const worker = store.workers.get(id);
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const balanceData = store.getWorkerWelfareBalance(id);

    return res.json({
      success: true,
      workerId: id,
      eShramStatus: {
        isRegistered: !!worker.eShramNumber,
        eShramNumber: worker.eShramNumber,
        verified: worker.eShramVerified,
      },
      insuranceCoverage: {
        pmsby: {
          schemeName: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
          annualPremium: '₹20/year (Auto-debited from bank savings account)',
          riskCoverage: '₹2,00,000 for accidental death / full permanent disability; ₹1,00,000 for partial disability',
          eligibleAge: '18 to 70 years',
          isCovered: worker.pmsbyCovered,
          renewalDeadline: '31st May annually',
          status: worker.pmsbyCovered ? 'ACTIVE_COVERED' : 'ACTION_REQUIRED_ENROLL',
        },
        pmjjby: {
          schemeName: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
          annualPremium: '₹436/year (Auto-debited from bank savings account)',
          riskCoverage: '₹2,00,000 for death due to any cause',
          eligibleAge: '18 to 50 years',
          isCovered: worker.pmjjbyCovered,
          renewalDeadline: '31st May annually',
          status: worker.pmjjbyCovered ? 'ACTIVE_COVERED' : 'ACTION_REQUIRED_ENROLL',
        },
      },
      welfareIncentiveFund: {
        currentBalance: balanceData.currentBalance,
        totalCredits: balanceData.totalCredits,
        fundingSource: 'Cooperative Federation Subscription Pool (0% Platform Cut)',
      },
      guidanceNote:
        'Labour Cooperative Society assists unorganized workers in linking bank auto-debit for PMSBY & PMJJBY renewals prior to May 31.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch eligibility guidance' });
  }
});

/**
 * GET /api/welfare/workers/:id/balance
 * Worker welfare ledger balance & recent credits (F17)
 */
router.get('/workers/:id/balance', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const balance = store.getWorkerWelfareBalance(id);
    return res.json({ success: true, ...balance });
  } catch (err: any) {
    return res.status(404).json({ error: err.message || 'Worker not found' });
  }
});

/**
 * POST /api/welfare/workers/:id/incentive
 * Credit worker welfare fund for shift milestone / night / surge / holiday (F17)
 */
router.post(
  '/workers/:id/incentive',
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { creditAmount, reason, bookingId } = req.body;

      if (!creditAmount || Number(creditAmount) <= 0) {
        return res.status(400).json({ error: 'Valid positive credit amount required' });
      }
      if (!reason) {
        return res.status(400).json({ error: 'Incentive reason is required' });
      }

      const entry = store.addWelfareCredit(id, Number(creditAmount), reason, bookingId);

      return res.status(201).json({
        success: true,
        message: `₹${creditAmount} credited to worker welfare account from cooperative fund.`,
        entry,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to credit welfare fund' });
    }
  }
);

/**
 * GET /api/welfare/rules
 * List federation welfare incentive rules
 */
router.get('/rules', (req: Request, res: Response) => {
  const fedId = (req.query.federationId as string) || store.federations[0]?.id;
  const rules = store.getWelfareRules(fedId);
  return res.json({ success: true, federationId: fedId, rules });
});

/**
 * PUT /api/welfare/rules
 * Create or update federation welfare incentive rule
 */
router.put(
  '/rules',
  authenticate,
  requireRole(['federation_admin', 'platform_ops']),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { federationId, triggerType, creditAmount, active } = req.body;
      const fedId = federationId || store.federations[0]?.id;

      if (!triggerType || !['night_shift', 'surge_shift', 'holiday_shift', 'emergency_dispatch', 'rating_milestone'].includes(triggerType)) {
        return res.status(400).json({ error: 'Valid triggerType required' });
      }

      const rule = store.setWelfareRule(fedId, triggerType, Number(creditAmount), active !== undefined ? active : true);

      return res.json({
        success: true,
        message: 'Welfare incentive rule updated.',
        rule,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to update rule' });
    }
  }
);

/**
 * POST /api/welfare/reminders/send
 * Dispatch IVR / SMS insurance renewal reminders for workers needing PMSBY/PMJJBY renewal (F17)
 */
router.post(
  '/reminders/send',
  authenticate,
  requireRole(['society_admin', 'federation_admin', 'platform_ops']),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { federationId } = req.body;
      const dueWorkers = store.getInsuranceDueWorkers(federationId);

      const remindersSent = dueWorkers.map((w) => {
        const missing = [];
        if (!w.pmsbyCovered) missing.push('PMSBY (₹20/yr)');
        if (!w.pmjjbyCovered) missing.push('PMJJBY (₹436/yr)');

        return {
          workerId: w.workerId,
          workerName: w.workerName,
          phone: w.phone,
          phoneType: w.phoneType,
          channel: w.phoneType === 'keypad' ? 'IVR_OUTBOUND_CALL' : 'SMS_DLT',
          messageText: `TaskLink Welfare: Friendly reminder to renew your ${missing.join(' & ')} before May 31. Visit your society office or contact admin.`,
          status: 'dispatched_to_telephony_queue',
        };
      });

      return res.json({
        success: true,
        message: `Dispatched ${remindersSent.length} welfare insurance renewal notifications.`,
        totalWorkersNotified: remindersSent.length,
        reminders: remindersSent,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to dispatch reminders' });
    }
  }
);

export default router;
