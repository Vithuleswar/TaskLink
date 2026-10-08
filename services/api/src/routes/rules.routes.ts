import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

// ==================== 1. Matching Weights (PPT F6) ====================

router.get('/matching-weights', (req: Request, res: Response) => {
  const fedId = (req.query.federationId as string) || store.federations[0]?.id;
  const weights = store.getMatchingWeights(fedId);
  return res.json({ success: true, federationId: fedId, weights });
});

router.put('/matching-weights', (req: Request, res: Response) => {
  try {
    const { federationId, skill, availability, distance, reliability, workload, customerPref } = req.body;
    const fedId = federationId || store.federations[0]?.id;

    const updated = store.setMatchingWeights(fedId, {
      ...(skill !== undefined && { skill: Number(skill) }),
      ...(availability !== undefined && { availability: Number(availability) }),
      ...(distance !== undefined && { distance: Number(distance) }),
      ...(reliability !== undefined && { reliability: Number(reliability) }),
      ...(workload !== undefined && { workload: Number(workload) }),
      ...(customerPref !== undefined && { customerPref: Number(customerPref) }),
    });

    return res.json({
      success: true,
      message: 'Matching weights updated for federation. Matching engine will score candidates using new weights live.',
      federationId: fedId,
      weights: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update matching weights' });
  }
});

// ==================== 2. Dynamic Pricing Rules (PPT F8) ====================

router.get('/pricing', (req: Request, res: Response) => {
  const fedId = (req.query.federationId as string) || store.federations[0]?.id;
  const rule = store.getPriceRule(fedId);
  return res.json({ success: true, federationId: fedId, rule });
});

router.put('/pricing', (req: Request, res: Response) => {
  try {
    const { federationId, kSensitivity, r0BaselineRatio, surgeCap, quoteLockMinutes } = req.body;
    const fedId = federationId || store.federations[0]?.id;

    const updated = store.setPriceRule(fedId, {
      ...(kSensitivity !== undefined && { kSensitivity: Number(kSensitivity) }),
      ...(r0BaselineRatio !== undefined && { r0BaselineRatio: Number(r0BaselineRatio) }),
      ...(surgeCap !== undefined && { surgeCap: Number(surgeCap) }),
      ...(quoteLockMinutes !== undefined && { quoteLockMinutes: Number(quoteLockMinutes) }),
    });

    return res.json({
      success: true,
      message: 'Dynamic pricing rule updated successfully.',
      federationId: fedId,
      rule: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update price rule' });
  }
});

// ==================== 3. Premium Rules (PPT F9) ====================

router.get('/premiums', (req: Request, res: Response) => {
  const fedId = (req.query.federationId as string) || store.federations[0]?.id;
  const rule = store.getPremiumRule(fedId);
  const holidays = store.getHolidays();
  return res.json({ success: true, federationId: fedId, rule, holidays });
});

router.put('/premiums', (req: Request, res: Response) => {
  try {
    const { federationId, nightStartTime, nightEndTime, nightPremiumRate, holidayPremiumRate, stackingRule } = req.body;
    const fedId = federationId || store.federations[0]?.id;

    const updated = store.setPremiumRule(fedId, {
      ...(nightStartTime && { nightStartTime }),
      ...(nightEndTime && { nightEndTime }),
      ...(nightPremiumRate !== undefined && { nightPremiumRate: Number(nightPremiumRate) }),
      ...(holidayPremiumRate !== undefined && { holidayPremiumRate: Number(holidayPremiumRate) }),
      ...(stackingRule && { stackingRule }),
    });

    return res.json({
      success: true,
      message: 'Premium rules updated. New quotes will reflect updated rates.',
      federationId: fedId,
      rule: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update premium rule' });
  }
});

// ==================== 4. Welfare Incentive Rules (PPT F17) ====================

router.get('/welfare', (req: Request, res: Response) => {
  const fedId = (req.query.federationId as string) || store.federations[0]?.id;
  const rules = store.getWelfareRules(fedId);
  return res.json({ success: true, federationId: fedId, rules });
});

router.put('/welfare', (req: Request, res: Response) => {
  try {
    const { federationId, triggerType, creditAmount, active } = req.body;
    const fedId = federationId || store.federations[0]?.id;

    if (!triggerType) {
      return res.status(400).json({ error: 'triggerType required' });
    }

    const updated = store.setWelfareRule(
      fedId,
      triggerType,
      Number(creditAmount),
      active !== undefined ? active : true
    );

    return res.json({
      success: true,
      message: 'Welfare incentive rule updated.',
      federationId: fedId,
      rule: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update welfare rule' });
  }
});

export default router;
