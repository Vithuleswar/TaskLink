import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { paymentGateway } from '../services/payment.adapter.js';
import { ledgerService } from '../services/ledger.service.js';

const router = Router();

/**
 * POST /api/payments/create-order
 * Creates a UPI payment order / *99# virtual UPI ID for a booking.
 */
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const { bookingId, paymentMethod = 'upi' } = req.body;

    const booking = store.getBooking(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const customer = store.users.get(booking.customerId);

    // Call payment gateway adapter (Razorpay primary / Cashfree fallback)
    const orderResult = await paymentGateway.createOrder({
      bookingId: booking.id,
      amount: booking.totalPayable,
      customerPhone: customer?.phone || '+919842000000',
      customerName: customer?.fullName || 'Customer',
      method: paymentMethod,
      isKeypadUser: customer?.phoneType === 'keypad',
    });

    // Create payment entity in store with strictly 0% commission (PPT F1)
    const payment = store.createPayment({
      bookingId: booking.id,
      customerId: booking.customerId,
      totalAmount: booking.totalPayable,
      workerAmount: booking.workerReceives,
      platformCommission: 0.0, // STRICTLY 0.00 (F1)
      gatewayFee: booking.paymentGatewayFee,
      paymentMethod,
      gatewayProvider: orderResult.provider,
      virtualUpiId: orderResult.virtualUpiId,
      status: 'pending',
    });

    return res.json({
      success: true,
      paymentId: payment.id,
      order: orderResult,
      zeroCommissionStatement: '0% Platform Commission: 100% of job payment is received directly by the cooperative artisan.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create payment order' });
  }
});

/**
 * POST /api/payments/webhook
 * Idempotent gateway webhook handler for Razorpay / Cashfree / *99# reconciliation.
 */
router.post('/webhook', (req: Request, res: Response) => {
  try {
    const { event, bookingId, paymentId, transactionReference } = req.body;

    const booking = store.getBooking(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    let payment = store.getPaymentByBooking(bookingId);
    if (!payment) {
      // Create payment record if created asynchronously via webhook
      payment = store.createPayment({
        bookingId: booking.id,
        customerId: booking.customerId,
        totalAmount: booking.totalPayable,
        workerAmount: booking.workerReceives,
        platformCommission: 0.0,
        gatewayFee: booking.paymentGatewayFee,
        paymentMethod: 'upi',
        gatewayProvider: 'razorpay',
        transactionReference: transactionReference || `TXN-${Date.now()}`,
        status: 'captured',
      });
    } else {
      payment = store.updatePaymentStatus(payment.id, 'captured', {
        transactionReference: transactionReference || `TXN-${Date.now()}`,
      })!;
    }

    // Record customer payment in double-entry ledger
    ledgerService.recordCustomerPayment(payment, booking);

    // Update booking status
    if (booking.status === 'requested') {
      store.updateBookingStatus(booking.id, 'offered');
    }

    return res.json({
      success: true,
      message: 'Payment captured and double-entry ledger updated with 0% platform commission.',
      payment,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Webhook processing failed' });
  }
});

/**
 * POST /api/payments/payout
 * Disburses 100% of worker funds from escrow to worker UPI ID (PPT F1 & F13).
 */
router.post('/payout', async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    const booking = store.getBooking(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'Payout can only be released for completed bookings.' });
    }

    const worker = store.getWorkerById(booking.workerId || '');
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const recipientVpa = worker.payoutUpiId || `${worker.id}@upi`;

    // Process payout through payment gateway adapter
    const payoutResult = await paymentGateway.createPayout({
      bookingId: booking.id,
      workerId: worker.id,
      amount: booking.workerReceives,
      recipientVpa,
      notes: `Job payment for ${booking.bookingNumber}`,
    });

    // Record payout in store
    const payout = store.createPayout({
      bookingId: booking.id,
      workerId: worker.id,
      workerName: store.users.get(worker.userId)?.fullName || 'Worker',
      amount: booking.workerReceives,
      payoutMethod: 'upi',
      recipientVpa,
      status: 'processed',
      gatewayPayoutId: payoutResult.payoutId,
      processedAt: new Date().toISOString(),
    });

    // Record payout in double-entry ledger
    ledgerService.recordWorkerPayout(payout, booking);

    return res.json({
      success: true,
      payout,
      reconciliationMessage: `Worker payout of ₹${payout.amount} successfully processed to ${recipientVpa}. 100% of gig price delivered to artisan.`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Payout failed' });
  }
});

/**
 * GET /api/payments/receipt/:bookingId
 * Returns complete price transparency receipt and ledger breakdown.
 */
router.get('/receipt/:bookingId', (req: Request, res: Response) => {
  try {
    const receipt = ledgerService.getBookingReceipt(req.params.bookingId);
    return res.json({ success: true, receipt });
  } catch (err: any) {
    return res.status(404).json({ error: err.message || 'Receipt not found' });
  }
});

/**
 * GET /api/payments/ledger/:bookingId
 * Returns immutable double-entry ledger records for audit.
 */
router.get('/ledger/:bookingId', (req: Request, res: Response) => {
  const entries = store.getLedgerEntriesByBooking(req.params.bookingId);
  return res.json({ success: true, count: entries.length, entries });
});

/**
 * GET /api/payments/funding-model
 * "How TaskLink is funded" explanation screen (PPT F1 & F19).
 */
router.get('/funding-model', (req: Request, res: Response) => {
  const commissionCollected = store.getCommissionCollected();

  return res.json({
    success: true,
    platformCommissionRate: '0%',
    commissionCollectedToDate: `₹${commissionCollected.toFixed(2)}`,
    title: 'How TaskLink Operates at 0% Commission',
    principles: [
      {
        title: 'Cooperative Ownership',
        description: 'TaskLink is owned and governed by Labour Cooperative Societies and District Federations.',
      },
      {
        title: 'Flat Federation Subscription',
        description: 'Operations and servers are funded through a flat annual cooperative federation subscription, never through deductions on worker wages.',
      },
      {
        title: '100% Take-Home Pay',
        description: 'Private gig platforms charge 20%–30% in commission. With TaskLink, every rupee paid for the service goes directly to the worker.',
      },
      {
        title: 'Transparent Pass-Through',
        description: 'UPI transactions carry 0% transaction fee. Non-UPI methods incur only actual banking pass-through fees without platform markups.',
      },
    ],
  });
});

export default router;
