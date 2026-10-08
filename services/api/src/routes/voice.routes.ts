import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';

const router = Router();

/**
 * POST /api/voice/outbound/job-offer
 * Triggers an AI voice call to a keypad worker for a pre-booked job (PPT F14 & F7).
 */
router.post('/outbound/job-offer', async (req: Request, res: Response) => {
  try {
    const { bookingId, workerId } = req.body;

    const booking = store.getBooking(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const worker = store.getWorkerById(workerId || booking.workerId || '');
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const workerUser = store.users.get(worker.userId);

    // Prepare outbound job offer payload with 100% transparent pay (₹0 commission)
    const callPayload = {
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      serviceName: booking.serviceName,
      slotDate: booking.scheduledStartTime.split('T')[0],
      slotTime: new Date(booking.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      locationText: booking.addressText,
      workerPayRupees: booking.workerReceives,
      commissionRupees: 0.0,
      phoneType: worker.phoneType,
    };

    return res.json({
      success: true,
      callQueued: true,
      workerPhone: workerUser?.phone,
      phoneType: worker.phoneType,
      callSid: `call_exo_${Date.now()}`,
      jobOfferDetails: callPayload,
      zeroCommissionStatement: '0% Platform Commission: 100% of Rs.' + booking.workerReceives + ' offered to artisan.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to dispatch voice call' });
  }
});

/**
 * POST /api/voice/webhook/exotel
 * Exotel telephony webhook for incoming call handling.
 */
router.post('/webhook/exotel', (req: Request, res: Response) => {
  const { CallSid, From, To, Digits } = req.body;
  console.log(`📞 [Exotel Webhook] CallSid: ${CallSid} | From: ${From} | Digits: ${Digits}`);

  return res.json({
    success: true,
    action: 'stream',
    webSocketUrl: 'wss://voice.tasklink.internal/stream',
    bargeIn: true,
  });
});

export default router;
