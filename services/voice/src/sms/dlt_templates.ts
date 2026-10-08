/**
 * TRAI DLT-Registered SMS Templates for Exotel SMS Gateway
 * Ministry of Cooperation, SIH 2026 (Problem SIH26089)
 *
 * Telecom Regulatory Authority of India (TRAI) requires pre-registered template IDs
 * and explicit sender headers (e.g. TLINKC) for transactional service communications.
 */

export interface DltTemplate {
  templateId: string;
  senderHeader: string;
  templateType: 'service_implicit' | 'service_explicit';
  templateFormat: string;
  fill: (params: Record<string, string | number>) => string;
}

export const DLT_TEMPLATES: Record<string, DltTemplate> = {
  // 1. Worker Job Offer for Pre-booked Job
  WORKER_JOB_OFFER: {
    templateId: '14071689000101',
    senderHeader: 'TSKLNK',
    templateType: 'service_implicit',
    templateFormat: 'TaskLink: New job offer for {service}. Date: {date}, Time: {time}, Loc: {location}. Pay: Rs.{amount} (0% commission). Call {phone} or reply 1 to accept.',
    fill: (p) =>
      `TaskLink: New job offer for ${p.service}. Date: ${p.date}, Time: ${p.time}, Loc: ${p.location}. Pay: Rs.${p.amount} (0% commission). Call ${p.phone} or reply 1 to accept.`,
  },

  // 2. Worker Booking Confirmation
  WORKER_BOOKING_CONFIRMED: {
    templateId: '14071689000102',
    senderHeader: 'TSKLNK',
    templateType: 'service_implicit',
    templateFormat: 'TaskLink: Booking {bookingNumber} confirmed. Customer: {customerName}, Phone: {customerPhone}, Loc: {location}. Full payment Rs.{amount} guaranteed by cooperative escrow.',
    fill: (p) =>
      `TaskLink: Booking ${p.bookingNumber} confirmed. Customer: ${p.customerName}, Phone: ${p.customerPhone}, Loc: ${p.location}. Full payment Rs.${p.amount} guaranteed by cooperative escrow.`,
  },

  // 3. Customer Keypad *99# USSD Payment Instructions
  KEYPAD_PAYMENT_INSTRUCTION: {
    templateId: '14071689000103',
    senderHeader: 'TSKLNK',
    templateType: 'service_explicit',
    templateFormat: 'TaskLink: To pay Rs.{amount} for Booking {bookingNumber}, dial *99# on your phone, choose Send Money, enter UPI ID: {virtualUpiId}. 0% platform fee.',
    fill: (p) =>
      `TaskLink: To pay Rs.${p.amount} for Booking ${p.bookingNumber}, dial *99# on your phone, choose Send Money, enter UPI ID: ${p.virtualUpiId}. 0% platform fee.`,
  },

  // 4. Worker Payout Disbursed
  WORKER_PAYOUT_DISBURSED: {
    templateId: '14071689000104',
    senderHeader: 'TSKLNK',
    templateType: 'service_implicit',
    templateFormat: 'TaskLink: Full payout of Rs.{amount} for Booking {bookingNumber} sent to {vpa}. 0% commission deducted. Check balance via *99# or bank app.',
    fill: (p) =>
      `TaskLink: Full payout of Rs.${p.amount} for Booking ${p.bookingNumber} sent to ${p.vpa}. 0% commission deducted. Check balance via *99# or bank app.`,
  },
};
