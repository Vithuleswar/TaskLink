import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

/**
 * GET /api/tenancy/federations
 * List active cooperative federations
 */
router.get('/federations', (req: Request, res: Response) => {
  return res.json({
    success: true,
    federations: store.federations,
  });
});

/**
 * GET /api/tenancy/societies
 * List cooperative societies, optionally filtered by federation
 */
router.get('/societies', (req: Request, res: Response) => {
  const { federationId, district } = req.query;

  let societies = store.societies;
  if (federationId) {
    societies = societies.filter((s) => s.federationId === federationId);
  }
  if (district) {
    societies = societies.filter((s) => s.district.toLowerCase() === String(district).toLowerCase());
  }

  return res.json({
    success: true,
    societies,
  });
});

/**
 * GET /api/tenancy/services
 * List master trade categories and rates
 */
router.get('/services', (req: Request, res: Response) => {
  return res.json({
    success: true,
    services: store.services,
  });
});

/**
 * GET /api/tenancy/subscriptions
 * List federation flat annual subscriptions (PPT Requirement F19 - Flat Fee, 0% Per-Job Commission)
 */
router.get('/subscriptions', (req: Request, res: Response) => {
  const { federationId } = req.query;
  const subscriptions = store.getSubscriptions(federationId as string);

  return res.json({
    success: true,
    message: 'Cooperative federations operate on a flat annual subscription model. Platform takes 0% per-job commission.',
    zeroCommissionRevenueModel: 'Flat annual software & maintenance subscription per federation, plus central/state cooperative welfare grants.',
    subscriptions,
  });
});

/**
 * POST /api/tenancy/subscriptions
 * Record annual subscription renewal for a federation (F19)
 */
router.post('/subscriptions', (req: Request, res: Response) => {
  try {
    const { federationId, billingPeriodStart, billingPeriodEnd, amount = 50000.0, invoiceNumber, planName } = req.body;

    if (!federationId || !billingPeriodStart || !billingPeriodEnd) {
      return res.status(400).json({ error: 'federationId, billingPeriodStart, and billingPeriodEnd are required' });
    }

    const fed = store.federations.find((f) => f.id === federationId);
    if (!fed) {
      return res.status(404).json({ error: 'Federation not found' });
    }

    const sub = store.createSubscription({
      federationId,
      billingPeriodStart,
      billingPeriodEnd,
      amount: Number(amount),
      status: 'paid',
      invoiceNumber: invoiceNumber || `INV-FED-${Date.now().toString().slice(-6)}`,
      planName: planName || 'Cooperative Federation Annual Plan - 0% Platform Commission',
    });

    return res.status(201).json({
      success: true,
      message: `Annual subscription recorded for ${fed.name}. Valid until ${billingPeriodEnd}.`,
      subscription: sub,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to create subscription record' });
  }
});

/**
 * GET /api/tenancy/federations/:id
 * Retrieve specific cooperative federation details
 */
router.get('/federations/:id', (req: Request, res: Response) => {
  const fed = store.federations.find((f) => f.id === req.params.id);
  if (!fed) {
    return res.status(404).json({ error: 'Federation not found' });
  }

  const affiliatedSocieties = store.societies.filter((s) => s.federationId === fed.id);
  const subscription = store.getSubscriptions(fed.id).find((s) => s.status === 'paid');

  return res.json({
    success: true,
    federation: fed,
    affiliatedSocietiesCount: affiliatedSocieties.length,
    activeSubscription: subscription || null,
  });
});

export default router;
