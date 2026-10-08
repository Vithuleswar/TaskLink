import { DialogueSession, TurnInput, TurnResponse } from '../dialogue/dialogue.manager.js';
import { exotelTelephony } from '../telephony/telephony.adapter.js';

export interface OutboundJobDetails {
  bookingId: string;
  bookingNumber: string;
  serviceName: string;
  slotDate: string;
  slotTime: string;
  locationText: string;
  workerPayRupees: number;
}

/**
 * Call Flow 2: Worker Outbound Pre-Booked Job Offer (PPT F14 & F7)
 * - Agent calls keypad worker about a scheduled job
 * - Reads service, date, time, location, and full worker pay with 0% commission explicitly stated
 * - Worker accepts or declines by voice or DTMF (1 = accept, 2 = decline)
 * - Sends TRAI DLT-registered SMS confirmation
 */
export function handleWorkerOutboundOfferFlow(
  session: DialogueSession,
  input: TurnInput,
  job: OutboundJobDetails
): TurnResponse {
  switch (session.currentState) {
    case 'WELCOME_LANGUAGE_SELECT':
    case 'WELCOME_OFFER': {
      // Announce the pre-booked job offer with full payment transparency (PPT F1 & F14)
      const prompt = session.language === 'ta'
        ? `வணக்கம்! TaskLink கூட்டுறவு தளத்திலிருந்து புதிய முன்பதிவு வேலை வந்துள்ளது. தொழில்: ${job.serviceName}. நாள்: ${job.slotDate}, நேரம்: ${job.slotTime}. இடம்: ${job.locationText}. உங்கள் முழு ஊதியம் ரூ.${job.workerPayRupees}, தளம் கமிஷன் ரூ.0. இந்த வேலையை ஏற்க 1 அழுத்தவும், நிராகரிக்க 2 அழுத்தவும்.`
        : `Hello! TaskLink Labour Cooperative has a new scheduled job offer. Service: ${job.serviceName}. Date: ${job.slotDate}, Time: ${job.slotTime}. Location: ${job.locationText}. Full payment: Rs.${job.workerPayRupees} with 0% platform commission. Press 1 to accept, 2 to decline.`;

      session.currentState = 'DECIDE_OFFER';
      return {
        spokenPrompt: prompt,
        expectedInput: 'dtmf',
        nextState: 'DECIDE_OFFER',
      };
    }

    case 'DECIDE_OFFER': {
      const choice = input.dtmfDigit;
      const isVoiceAccept = input.spokenText && (input.spokenText.includes('accept') || input.spokenText.includes('சரி') || input.spokenText.includes('ஆம்'));
      const isVoiceDecline = input.spokenText && (input.spokenText.includes('decline') || input.spokenText.includes('வேண்டாம்') || input.spokenText.includes('இல்லை'));

      if (choice === '1' || isVoiceAccept) {
        session.slots.offerAccepted = true;

        // Dispatch DLT-registered SMS confirmation to worker (PPT F14)
        exotelTelephony.sendSms({
          to: session.callerNumber,
          templateKey: 'WORKER_BOOKING_CONFIRMED',
          params: {
            bookingNumber: job.bookingNumber,
            customerName: 'Customer',
            customerPhone: '+919842000000',
            location: job.locationText,
            amount: job.workerPayRupees,
          },
        });

        const confirmText = session.language === 'ta'
          ? `வேலை வெற்றிகரமாக ஏற்றுக்கொள்ளப்பட்டது. முன்பதிவு எண் ${job.bookingNumber}. விவரங்கள் மற்றும் வாடிக்கையாளர் எண் உங்களுக்கு SMS மூலம் அனுப்பப்பட்டுள்ளது. நன்றி, வணக்கம்!`
          : `Job accepted successfully! Booking ${job.bookingNumber}. Customer contact and location details have been dispatched via SMS. Thank you!`;

        return {
          spokenPrompt: confirmText,
          expectedInput: 'dtmf',
          nextState: 'COMPLETED',
          isComplete: true,
          readBackConfirmation: confirmText,
        };
      } else if (choice === '2' || isVoiceDecline) {
        session.slots.offerAccepted = false;

        const declineText = session.language === 'ta'
          ? 'வேலை நிராகரிக்கப்பட்டது. உங்கள் கூட்டுறவு கணக்கில் பதிவு செய்யப்பட்டது. அடுத்த வேலை வரும்போது அழைக்கிறோம். நன்றி, வணக்கம்!'
          : 'Job offer declined. Noted in your cooperative roster. We will reach out when the next pre-booked job arrives. Thank you!';

        return {
          spokenPrompt: declineText,
          expectedInput: 'dtmf',
          nextState: 'COMPLETED',
          isComplete: true,
          readBackConfirmation: declineText,
        };
      }

      // Clarification prompt if ambiguous input
      return {
        spokenPrompt: session.language === 'ta'
          ? `தயவுசெய்து தேர்வு செய்யவும்: வேலையை ஏற்க 1 அழுத்தவும், நிராகரிக்க 2 அழுத்தவும்.`
          : `Please press 1 to accept this job for Rs.${job.workerPayRupees}, or press 2 to decline.`,
        expectedInput: 'dtmf',
        nextState: 'DECIDE_OFFER',
      };
    }

    default:
      return {
        spokenPrompt: 'நன்றி, வணக்கம்.',
        expectedInput: 'dtmf',
        nextState: 'COMPLETED',
        isComplete: true,
      };
  }
}
