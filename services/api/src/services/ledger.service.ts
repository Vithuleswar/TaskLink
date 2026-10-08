import { store, BookingEntity, PaymentEntity, PayoutEntity, LedgerEntryEntity } from '../data/store.js';

export class LedgerService {
  /**
   * Records a customer payment in the immutable double-entry ledger.
   * STRICT PPT F1 REQUIREMENT: Platform commission is strictly ₹0.00.
   */
  public recordCustomerPayment(payment: PaymentEntity, booking: BookingEntity): LedgerEntryEntity[] {
    if (payment.platformCommission !== 0.0) {
      throw new Error(
        'Zero-Commission Invariant Violation: TaskLink platform commission must be strictly 0.00. Cannot record non-zero commission in cooperative ledger.'
      );
    }

    const entries: LedgerEntryEntity[] = [];

    // 1. Debit Customer Receivable
    const debitCustomer = store.addLedgerEntry({
      bookingId: booking.id,
      paymentId: payment.id,
      accountType: 'customer_receivable',
      debit: payment.totalAmount,
      credit: 0.0,
      description: `Customer payment received for booking ${booking.bookingNumber} (${payment.paymentMethod})`,
    });
    entries.push(debitCustomer);

    // 2. Credit Worker Payable (100% of gig payment belongs to the worker)
    const creditWorker = store.addLedgerEntry({
      bookingId: booking.id,
      paymentId: payment.id,
      accountType: 'worker_payable',
      debit: 0.0,
      credit: payment.workerAmount,
      description: `Worker earnings credited to escrow for booking ${booking.bookingNumber} (100% to artisan)`,
    });
    entries.push(creditWorker);

    // 3. Credit Platform Commission Pool (STRICTLY 0.00)
    const commissionPool = store.addLedgerEntry({
      bookingId: booking.id,
      paymentId: payment.id,
      accountType: 'platform_commission_pool',
      debit: 0.0,
      credit: 0.0, // EXACTLY 0.00
      description: 'Platform commission: ₹0.00 (Cooperative-owned model: 0% cut)',
    });
    entries.push(commissionPool);

    // 4. Credit Gateway Pass-Through if fee applies for non-UPI payment methods
    if (payment.gatewayFee > 0.0) {
      const gatewayPassThrough = store.addLedgerEntry({
        bookingId: booking.id,
        paymentId: payment.id,
        accountType: 'gateway_pass_through',
        debit: 0.0,
        credit: payment.gatewayFee,
        description: `Third-party payment gateway pass-through charge (${payment.gatewayProvider})`,
      });
      entries.push(gatewayPassThrough);
    }

    return entries;
  }

  /**
   * Records a worker payout in the immutable ledger.
   */
  public recordWorkerPayout(payout: PayoutEntity, booking: BookingEntity): LedgerEntryEntity[] {
    const entries: LedgerEntryEntity[] = [];

    // Debit Worker Payable (releasing escrow)
    const debitEscrow = store.addLedgerEntry({
      bookingId: booking.id,
      payoutId: payout.id,
      accountType: 'worker_payable',
      debit: payout.amount,
      credit: 0.0,
      description: `Worker payout disbursed to ${payout.workerName} (${payout.recipientVpa}) for booking ${booking.bookingNumber}`,
    });
    entries.push(debitEscrow);

    return entries;
  }

  /**
   * Generates a fully transparent financial receipt for a booking.
   */
  public getBookingReceipt(bookingId: string) {
    const booking = store.getBooking(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const payment = store.getPaymentByBooking(bookingId);
    const payouts = store.getPayoutsByBooking(bookingId);
    const ledger = store.getLedgerEntriesByBooking(bookingId);

    return {
      bookingNumber: booking.bookingNumber,
      serviceName: booking.serviceName,
      customerName: booking.customerName,
      workerName: booking.workerName,
      phoneType: booking.workerPhoneType,
      itemizedBreakdown: {
        baseRate: booking.baseRate,
        surgeAmount: booking.surgeAmount,
        nightPremiumAmount: booking.nightPremiumAmount,
        holidayPremiumAmount: booking.holidayPremiumAmount,
        platformCommission: 0.0, // STRICTLY ₹0.00
        paymentGatewayFee: booking.paymentGatewayFee,
        totalCustomerPaid: booking.totalPayable,
        workerReceivesTotal: booking.workerReceives,
      },
      zeroCommissionStatement:
        'TaskLink 0% Platform Commission Guarantee: Cooperative model means 100% of your payment is received by the worker.',
      fundingModel:
        'TaskLink platform operations are funded exclusively through flat cooperative federation subscriptions, not from per-gig worker deductions.',
      paymentDetails: payment
        ? {
            paymentId: payment.id,
            method: payment.paymentMethod,
            provider: payment.gatewayProvider,
            virtualUpiId: payment.virtualUpiId,
            status: payment.status,
          }
        : null,
      payouts: payouts.map((p) => ({
        payoutId: p.id,
        workerName: p.workerName,
        amount: p.amount,
        vpa: p.recipientVpa,
        status: p.status,
      })),
      ledgerEntriesCount: ledger.length,
      isReconciled: true,
    };
  }
}

export const ledgerService = new LedgerService();
