import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store, BookingEntity, BookingAssignmentEntity } from '../data/store.js';
import { pricingService } from '../services/pricing.service.js';
import { matchingClient } from '../services/matching.client.js';
import { io } from '../index.js';

const router = Router();

/**
 * POST /api/bookings/quote
 * Generates transparent price quote with surge, night/holiday premium, and ₹0 platform commission.
 */
router.post('/quote', (req: Request, res: Response) => {
  try {
    const { federationId, serviceCode, slotDate, slotTime, customerLat, customerLon, paymentMethod } = req.body;

    if (!serviceCode) {
      return res.status(400).json({ error: 'serviceCode is required' });
    }

    const quote = pricingService.generateQuote({
      federationId,
      serviceCode,
      slotDate,
      slotTime,
      customerLat,
      customerLon,
      paymentMethod,
    });

    return res.json({
      success: true,
      quote,
      zeroCommissionStatement: '0% Platform Commission Guaranteed: 100% of job payment is received directly by the cooperative worker.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate quote' });
  }
});

/**
 * POST /api/bookings
 * Creates a new booking (Scheduled, On-Demand, or Emergency).
 * Enforces keypad exclusion for on-demand & emergency jobs.
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      serviceCode,
      bookingType = 'scheduled',
      quoteId,
      scheduledStartTime,
      addressText,
      digipin,
      latitude,
      longitude,
      customerLanguage = 'Tamil',
      notes,
    } = req.body;

    if (!customerId || !serviceCode || !addressText || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        error: 'Missing required booking fields: customerId, serviceCode, addressText, latitude, longitude',
      });
    }

    // 1. Resolve Quote
    let quote = quoteId ? store.getQuote(quoteId) : undefined;
    if (!quote || new Date(quote.expiresAt).getTime() < Date.now()) {
      quote = pricingService.generateQuote({
        serviceCode,
        customerLat: latitude,
        customerLon: longitude,
      });
    }

    // 2. Perform 6-Factor Matching
    const rankedCandidates = await matchingClient.findRankedWorkers({
      booking_type: bookingType,
      service_code: serviceCode,
      customer_lat: latitude,
      customer_lon: longitude,
      customer_language: customerLanguage,
      is_night_slot: quote.isNightSlot,
    });

    if (rankedCandidates.length === 0) {
      return res.status(404).json({
        error: 'No available verified cooperative workers found matching criteria in this service area.',
      });
    }

    // 3. Keypad Exclusion Verification for On-Demand and Emergency (PPT F6 & F7)
    if (bookingType === 'on_demand' || bookingType === 'emergency') {
      const topCand = rankedCandidates[0];
      if (topCand.phone_type === 'keypad') {
        return res.status(400).json({
          error: 'Rule Violation: Keypad-phone workers can only be offered pre-booked / scheduled jobs.',
        });
      }
    }

    const topWorker = rankedCandidates[0];
    const workerEntity = store.getWorkerById(topWorker.worker_id);
    const workerUser = workerEntity ? store.users.get(workerEntity.userId) : undefined;
    const customerUser = store.users.get(customerId);

    const bookingCount = store.bookings.size + 1;
    const bookingNumber = `TL-${new Date().getFullYear()}-${String(bookingCount).padStart(5, '0')}`;

    // 4. Create Booking Entity
    const booking = store.createBooking({
      bookingNumber,
      customerId,
      customerName: customerUser?.fullName || 'Customer',
      customerPhone: customerUser?.phone,
      workerId: topWorker.worker_id,
      workerName: topWorker.worker_name,
      workerPhone: workerUser?.phone,
      workerPhoneType: topWorker.phone_type as 'smartphone' | 'keypad',
      serviceCode: serviceCode.toUpperCase(),
      serviceName: quote.serviceName,
      bookingType,
      status: bookingType === 'scheduled' ? 'confirmed' as any : 'offered',
      scheduledStartTime: scheduledStartTime || new Date().toISOString(),
      addressText,
      digipin,
      latitude,
      longitude,
      baseRate: quote.baseRate,
      surgeMultiplier: quote.surgeMultiplier,
      surgeAmount: quote.surgeAmount,
      isNightTime: quote.isNightSlot,
      nightPremiumAmount: quote.nightPremiumAmount,
      isHoliday: quote.isHoliday,
      holidayPremiumAmount: quote.holidayPremiumAmount,
      workerReceives: quote.workerReceives,
      platformCommission: 0.0, // PPT F1 STRICT CHECK
      paymentGatewayFee: quote.paymentGatewayFee,
      totalPayable: quote.totalPayable,
      matchScore: topWorker.total_score,
      matchBreakdown: topWorker.breakdown,
      whyThisWorker: topWorker.why_this_worker,
      notes,
      fundsEscrowStatus: 'held', // Funds captured into escrow at booking
    });

    // 5. Dispatch Offers according to Booking Type (PPT F7)
    if (bookingType === 'on_demand') {
      // Sequential offer to top-ranked worker with 45s accept timeout
      const assignmentId = uuidv4();
      const assignment: BookingAssignmentEntity = {
        id: assignmentId,
        bookingId: booking.id,
        workerId: topWorker.worker_id,
        status: 'offered',
        offeredAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 45 * 1000).toISOString(), // 45 seconds placeholder
      };
      store.assignments.set(assignmentId, assignment);

      // Emit Socket.IO event to worker & customer rooms
      io.to(`booking:${booking.id}`).emit('booking:offered', {
        bookingId: booking.id,
        workerId: topWorker.worker_id,
        timeoutSeconds: 45,
      });
    } else if (bookingType === 'emergency') {
      // Parallel offers to top 5 workers, first accept wins
      const topFive = rankedCandidates.slice(0, 5);
      topFive.forEach((cand) => {
        const assignmentId = uuidv4();
        const assignment: BookingAssignmentEntity = {
          id: assignmentId,
          bookingId: booking.id,
          workerId: cand.worker_id,
          status: 'offered',
          offeredAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
        };
        store.assignments.set(assignmentId, assignment);
      });

      io.to(`booking:${booking.id}`).emit('booking:emergency_broadcast', {
        bookingId: booking.id,
        candidateCount: topFive.length,
      });
    }

    return res.status(201).json({
      success: true,
      booking,
      matchedWorker: {
        workerId: topWorker.worker_id,
        name: topWorker.worker_name,
        phoneType: topWorker.phone_type,
        matchScore: topWorker.total_score,
        whyThisWorker: topWorker.why_this_worker,
        breakdown: topWorker.breakdown,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create booking' });
  }
});

/**
 * GET /api/bookings/:id
 * Fetches booking details with real-time status and transparent ledger breakdown.
 */
router.get('/:id', (req: Request, res: Response) => {
  const booking = store.getBooking(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  return res.json({ success: true, booking });
});

/**
 * POST /api/bookings/:id/accept
 * Worker accepts the booking offer.
 */
router.post('/:id/accept', (req: Request, res: Response) => {
  const { workerId } = req.body;
  const booking = store.getBooking(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  // Update status to accepted
  const updated = store.updateBookingStatus(booking.id, 'accepted', {
    workerId: workerId || booking.workerId,
  });

  io.to(`booking:${booking.id}`).emit('booking:status_changed', {
    bookingId: booking.id,
    status: 'accepted',
    workerId: updated?.workerId,
    timestamp: new Date().toISOString(),
  });

  return res.json({ success: true, booking: updated });
});

/**
 * POST /api/bookings/:id/status
 * Transitions booking state: 'on_the_way' -> 'in_progress' -> 'completed' -> 'cancelled'.
 */
router.post('/:id/status', (req: Request, res: Response) => {
  const { status, cancellationReason } = req.body;
  const validStatuses = ['on_the_way', 'in_progress', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const booking = store.getBooking(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const updates: Partial<BookingEntity> = {};
  if (cancellationReason) {
    updates.cancellationReason = cancellationReason;
  }

  const updated = store.updateBookingStatus(booking.id, status, updates);

  io.to(`booking:${booking.id}`).emit('booking:status_changed', {
    bookingId: booking.id,
    status,
    disputeWindowEndsAt: updated?.disputeWindowEndsAt,
    fundsEscrowStatus: updated?.fundsEscrowStatus,
    timestamp: new Date().toISOString(),
  });

  let welfareCredits: any[] = [];
  if (status === 'completed') {
    welfareCredits = store.evaluateBookingWelfareIncentives(booking.id);
  }

  return res.json({
    success: true,
    booking: updated,
    welfareCreditsAwarded: welfareCredits,
    message: status === 'completed'
      ? 'Booking marked completed. ₹' + updated?.workerReceives + ' released to worker balance (0% commission).' +
        (welfareCredits.length > 0 ? ` ₹${welfareCredits.reduce((s, c) => s + c.creditAmount, 0)} welfare bonus credited.` : '')
      : `Booking transitioned to ${status}`,
  });
});

export default router;
