import { DialogueSession, TurnInput, TurnResponse } from '../dialogue/dialogue.manager.js';
import { landmarkProvider } from '../location/location.provider.js';
import { exotelTelephony } from '../telephony/telephony.adapter.js';

/**
 * Call Flow 3: Customer Phone Booking Flow (PPT F14, F15, F6, F13)
 * - Customer books service by phone call in Tamil, English, or Hindi
 * - Landmark Fallback geocoding with spoken confirmation (F15)
 * - Transparent price read-back (Commission ₹0)
 * - *99# USSD virtual UPI ID payment read-back
 */
export async function handleCustomerBookingFlow(
  session: DialogueSession,
  input: TurnInput
): Promise<TurnResponse> {
  switch (session.currentState) {
    case 'WELCOME_LANGUAGE_SELECT': {
      if (input.dtmfDigit === '1' || (input.spokenText && input.spokenText.includes('tamil'))) {
        session.language = 'ta';
        session.currentState = 'SELECT_SERVICE';
        return {
          spokenPrompt: 'வணக்கம்! TaskLink கூட்டுறவு தளத்திற்கு நல்வரவு. உங்களுக்கு என்ன சேவை தேவை? 1 - எலக்ட்ரீஷியன், 2 - பிளம்பர், 3 - தச்சர்.',
          expectedInput: 'dtmf',
          nextState: 'SELECT_SERVICE',
        };
      } else if (input.dtmfDigit === '2' || (input.spokenText && input.spokenText.includes('english'))) {
        session.language = 'en';
        session.currentState = 'SELECT_SERVICE';
        return {
          spokenPrompt: 'Welcome to TaskLink Labour Cooperative. What service do you need? Press 1 for Electrician, 2 for Plumber, 3 for Carpenter.',
          expectedInput: 'dtmf',
          nextState: 'SELECT_SERVICE',
        };
      } else if (input.dtmfDigit === '3' || (input.spokenText && input.spokenText.includes('hindi'))) {
        session.language = 'hi';
        session.currentState = 'SELECT_SERVICE';
        return {
          spokenPrompt: 'टास्कलिंक में आपका स्वागत है। आपको क्या सेवा चाहिए? 1 - इलेक्ट्रीशियन, 2 - प्लंबर, 3 - बढ़ई।',
          expectedInput: 'dtmf',
          nextState: 'SELECT_SERVICE',
        };
      }

      return {
        spokenPrompt: 'TaskLink கூட்டுறவு முன்பதிவு: தமிழிற்கு 1 அழுத்தவும். For English press 2. हिंदी के लिए 3 दबाएं.',
        expectedInput: 'dtmf',
        nextState: 'WELCOME_LANGUAGE_SELECT',
      };
    }

    case 'SELECT_SERVICE': {
      const serviceMap: Record<string, { code: string; name: string; baseRate: number }> = {
        '1': { code: 'ELEC', name: 'Electrician', baseRate: 350 },
        '2': { code: 'PLUMB', name: 'Plumber', baseRate: 300 },
        '3': { code: 'CARP', name: 'Carpenter', baseRate: 400 },
      };

      const selected = serviceMap[input.dtmfDigit || '1'] || serviceMap['1'];
      session.slots.service = selected;

      return {
        spokenPrompt: session.language === 'ta'
          ? `நீங்கள் ${selected.name} தேர்ந்தெடுத்துள்ளீர்கள். உங்கள் பகுதி அல்லது முக்கிய அடையாளத்தைக் கூறவும் அல்லது தட்டச்சு செய்யவும். உதாரணத்திற்கு: காந்திபுரம், பீளமேடு, அவினாசி.`
          : `You selected ${selected.name}. Please say or enter your village, area, or landmark. E.g., Gandhipuram, Peelamedu, or Avinashi.`,
        expectedInput: 'both',
        nextState: 'COLLECT_LOCATION',
      };
    }

    case 'COLLECT_LOCATION': {
      const landmarkText = input.spokenText || 'Gandhipuram';
      const locFix = await landmarkProvider.resolveLocation({
        phoneNumber: session.callerNumber,
        landmarkText,
        hasConsent: true,
      });

      session.slots.locationFix = locFix;

      // Spoken Confirmation of approximate landmark (PPT F15)
      const prompt = session.language === 'ta'
        ? `உங்கள் பகுதி '${locFix.landmarkName}' அருகில் உள்ளதா? உறுதி செய்ய 1 அழுத்தவும், மாற்ற 2 அழுத்தவும்.`
        : `Is your location near '${locFix.landmarkName}'? Press 1 to confirm, 2 to change.`;

      return {
        spokenPrompt: prompt,
        expectedInput: 'dtmf',
        nextState: 'CONFIRM_LOCATION',
      };
    }

    case 'CONFIRM_LOCATION': {
      if (input.dtmfDigit === '2') {
        return {
          spokenPrompt: session.language === 'ta'
            ? 'தயவுசெய்து உங்கள் சரியான பகுதி அல்லது முக்கிய அடையாளத்தைக் கூறவும்.'
            : 'Please say or enter your village, area, or landmark again.',
          expectedInput: 'both',
          nextState: 'COLLECT_LOCATION',
        };
      }

      // Read back transparent price quote (PPT F1 & F8/F9)
      const svc = session.slots.service;
      const baseRate = svc.baseRate;
      const totalAmount = baseRate;
      session.slots.totalAmount = totalAmount;

      const pricePrompt = session.language === 'ta'
        ? `முன்பதிவு விலை விவரம்: அடிப்படை கட்டணம் ரூ.${baseRate}, தளம் கமிஷன் ரூ.0. முழு கட்டணம் ரூ.${totalAmount} நேரடியாக தொழிலாளருக்கு செல்லும். முன்பதிவை உறுதி செய்ய 1 அழுத்தவும்.`
        : `Transparent price breakdown: Base rate Rs.${baseRate}, platform commission Rs.0. Total Rs.${totalAmount} goes 100% to the verified cooperative worker. Press 1 to confirm booking.`;

      return {
        spokenPrompt: pricePrompt,
        expectedInput: 'dtmf',
        nextState: 'CONFIRM_BOOKING',
      };
    }

    case 'CONFIRM_BOOKING': {
      if (input.dtmfDigit === '1') {
        const bookingNumber = `IVR-${Date.now().toString().slice(-5)}`;
        const cleanBooking = bookingNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const virtualUpiId = `tasklink.${cleanBooking}@razorpay`;

        session.slots.bookingNumber = bookingNumber;
        session.slots.virtualUpiId = virtualUpiId;

        // Send *99# USSD Payment instructions SMS (PPT F13 & F14)
        exotelTelephony.sendSms({
          to: session.callerNumber,
          templateKey: 'KEYPAD_PAYMENT_INSTRUCTION',
          params: {
            bookingNumber,
            amount: session.slots.totalAmount,
            virtualUpiId,
          },
        });

        // Spoken payment readout for keypad phones (PPT F13)
        const successPrompt = session.language === 'ta'
          ? `முன்பதிவு எண் ${bookingNumber} உறுதியானது! கட்டணம் ரூ.${session.slots.totalAmount}. செலுத்த உங்கள் போனில் *99# டயல் செய்து, விர்ச்சுவல் யுபிஐ ஐடி '${virtualUpiId}' உள்ளிடவும். SMS விவரங்கள் அனுப்பப்பட்டுள்ளது. நன்றி, வணக்கம்!`
          : `Booking ${bookingNumber} confirmed! To pay Rs.${session.slots.totalAmount}, dial *99# on your keypad phone and send to Virtual UPI ID '${virtualUpiId}'. SMS with instructions sent. Thank you!`;

        return {
          spokenPrompt: successPrompt,
          expectedInput: 'dtmf',
          nextState: 'COMPLETED',
          isComplete: true,
          readBackConfirmation: `Booking ${bookingNumber} confirmed with virtual UPI ID ${virtualUpiId}`,
        };
      }

      return {
        spokenPrompt: 'முன்பதிவு ரத்து செய்யப்பட்டது. உதவிக்கு 9 அழுத்தவும் அல்லது அழைப்பை துண்டிக்கலாம்.',
        expectedInput: 'dtmf',
        nextState: 'COMPLETED',
        isComplete: true,
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
