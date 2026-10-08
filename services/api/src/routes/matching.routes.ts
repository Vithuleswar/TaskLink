import { Router, Request, Response } from 'express';
import { matchingClient } from '../services/matching.client.js';

const router = Router();

/**
 * POST /api/matching/find-workers
 * Direct entrypoint for Six-Factor AI Matching Engine (PPT F6).
 * Returns ranked workers, individual factor breakdown, and human-readable 'why this worker' text.
 */
router.post('/find-workers', async (req: Request, res: Response) => {
  try {
    const {
      bookingType = 'scheduled',
      serviceCode,
      latitude,
      longitude,
      customerLanguage = 'Tamil',
      isNightSlot = false,
      federationId,
    } = req.body;

    if (!serviceCode || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'serviceCode, latitude, and longitude are required' });
    }

    const rankedWorkers = await matchingClient.findRankedWorkers({
      booking_type: bookingType,
      service_code: serviceCode,
      customer_lat: latitude,
      customer_lon: longitude,
      customer_language: customerLanguage,
      is_night_slot: isNightSlot,
      federation_id: federationId,
    });

    return res.json({
      success: true,
      serviceCode: serviceCode.toUpperCase(),
      bookingType,
      matchedCount: rankedWorkers.length,
      rankedWorkers,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Matching failed' });
  }
});

export default router;
