import { DialogueSession, TurnInput, TurnResponse } from '../dialogue/dialogue.manager.js';

/**
 * Call Flow 1: Worker Inbound Call (PPT F14 & F2 Call Path)
 * - Language selection (Tamil, English, Hindi)
 * - DTMF PIN Authentication for keypad workers
 * - Set Availability, Hear Jobs, Hear Earnings & *99# guidance, or Register by voice
 */
export function handleWorkerInboundFlow(session: DialogueSession, input: TurnInput): TurnResponse {
  switch (session.currentState) {
    case 'WELCOME_LANGUAGE_SELECT': {
      if (input.dtmfDigit === '1' || (input.spokenText && input.spokenText.toLowerCase().includes('tamil'))) {
        session.language = 'ta';
        session.currentState = 'AUTHENTICATE_WORKER';
        return {
          spokenPrompt: 'வணக்கம்! உங்கள் 4 இலக்க ரகசிய பின்னை உள்ளிடவும். (Welcome! Please enter your 4-digit PIN).',
          expectedInput: 'dtmf',
          nextState: 'AUTHENTICATE_WORKER',
        };
      } else if (input.dtmfDigit === '2' || (input.spokenText && input.spokenText.toLowerCase().includes('english'))) {
        session.language = 'en';
        session.currentState = 'AUTHENTICATE_WORKER';
        return {
          spokenPrompt: 'Welcome to TaskLink Cooperative. Please enter your 4-digit security PIN.',
          expectedInput: 'dtmf',
          nextState: 'AUTHENTICATE_WORKER',
        };
      } else if (input.dtmfDigit === '3' || (input.spokenText && input.spokenText.toLowerCase().includes('hindi'))) {
        session.language = 'hi';
        session.currentState = 'AUTHENTICATE_WORKER';
        return {
          spokenPrompt: 'टास्कलिंक में आपका स्वागत है। कृपया अपना 4 अंकों का पिन दर्ज करें।',
          expectedInput: 'dtmf',
          nextState: 'AUTHENTICATE_WORKER',
        };
      }

      return {
        spokenPrompt: 'TaskLink கூட்டுறவு தளத்திற்கு நல்வரவு. தமிழிற்கு 1 அழுத்தவும். For English press 2. हिंदी के लिए 3 दबाएं.',
        expectedInput: 'dtmf',
        nextState: 'WELCOME_LANGUAGE_SELECT',
      };
    }

    case 'AUTHENTICATE_WORKER': {
      // In simulation or test mode, accepts 1234 or any 4-digit PIN
      const pin = input.dtmfDigit || input.spokenText || '1234';
      session.slots.authenticated = true;

      const prompt = session.language === 'ta'
        ? 'அங்கீகரிக்கப்பட்டது. பிரதான மெனு: 1 - வேலை தயார் நிலை அமைக்க. 2 - இன்றைய வேலைகளைக் கேட்க. 3 - உங்கள் வருமானம் அறிய. 4 - புதிய தொழிலாளியாக பதிவு செய்ய. 9 - உதவி மையம்.'
        : 'Authenticated. Main Menu: Press 1 to set availability, 2 for today\'s jobs, 3 for earnings, 4 to register new worker, 9 for helpdesk.';

      return {
        spokenPrompt: prompt,
        expectedInput: 'dtmf',
        nextState: 'MAIN_MENU',
      };
    }

    case 'MAIN_MENU': {
      const choice = input.dtmfDigit;

      if (choice === '1') {
        // Set availability
        return {
          spokenPrompt: session.language === 'ta'
            ? 'இன்று நீங்கள் வேலை செய்ய தயாரா? தயார் எனில் 1 அழுத்தவும், விடுப்பு எனில் 2 அழுத்தவும்.'
            : 'Are you available to take jobs today? Press 1 for Available, 2 for Leave.',
          expectedInput: 'dtmf',
          nextState: 'SET_AVAILABILITY',
        };
      } else if (choice === '2') {
        // Hear today's pre-booked jobs
        return {
          spokenPrompt: session.language === 'ta'
            ? 'இன்று உங்களுக்கு 1 முன்பதிவு வேலை உள்ளது: மாலை 4 மணிக்கு காந்திபுரம், மின்சார வயரிங். கட்டணம் ரூ.350 (0% கமிஷன்). பிரதான மெனுவிற்கு 0 அழுத்தவும்.'
            : 'You have 1 scheduled job today: 4:00 PM at Gandhipuram, Electrical Rewiring. Full pay: Rs.350 with 0% platform commission. Press 0 for menu.',
          expectedInput: 'dtmf',
          nextState: 'POST_ACTION_MENU',
        };
      } else if (choice === '3') {
        // Hear earnings & *99# guidance (PPT F1 & F13)
        return {
          spokenPrompt: session.language === 'ta'
            ? 'இந்த வாரத்தில் உங்கள் மொத்த கூட்டுறவு வருமானம் ரூ.2,100. தளம் கமிஷன் ரூ.0. 100% தொகை உங்கள் வங்கிக் கணக்கிற்கு அனுப்பப்பட்டுள்ளது. கணக்கு இருப்பை அறிய உங்கள் போனில் *99# டயல் செய்யவும்.'
            : 'Your total cooperative earnings this week is Rs.2,100. Platform commission is Rs.0. 100% has been transferred to your account. To check balance, dial *99# on your keypad phone.',
          expectedInput: 'dtmf',
          nextState: 'POST_ACTION_MENU',
        };
      } else if (choice === '4') {
        // F2 Worker Onboarding Call Path
        return {
          spokenPrompt: session.language === 'ta'
            ? 'புதிய தொழிலாளர் பதிவு: உங்கள் தொழிலைத் தேர்ந்தெடுக்கவும்: 1 - எலக்ட்ரீஷியன், 2 - பிளம்பர், 3 - தச்சர்.'
            : 'New worker registration: Select your trade: 1 for Electrician, 2 for Plumber, 3 for Carpenter.',
          expectedInput: 'dtmf',
          nextState: 'REGISTER_SERVICE',
        };
      } else if (choice === '9') {
        // Helpdesk handoff
        return {
          spokenPrompt: session.language === 'ta'
            ? 'உங்கள் அழைப்பு கூட்டுறவு சங்க உதவி மையத்திற்கு இணைக்கப்படுகிறது. தயவுசெய்து காத்திருக்கவும்.'
            : 'Connecting your call to the cooperative society helpdesk. Please hold.',
          expectedInput: 'dtmf',
          nextState: 'COMPLETED',
          handedOff: true,
          isComplete: true,
        };
      }

      return {
        spokenPrompt: 'தயவுசெய்து சரியான எண்ணை அழுத்தவும்: 1 - தயார் நிலை, 2 - வேலைகள், 3 - வருமானம், 9 - உதவி மையம்.',
        expectedInput: 'dtmf',
        nextState: 'MAIN_MENU',
      };
    }

    case 'SET_AVAILABILITY': {
      const isOnline = input.dtmfDigit === '1';
      session.slots.isOnline = isOnline;

      const confirmText = session.language === 'ta'
        ? (isOnline ? 'உறுதிசெய்யப்பட்டது: நீங்கள் இன்று வேலைக்கு தயாராக உள்ளீர்கள் என குறிக்கப்பட்டது.' : 'உறுதிசெய்யப்பட்டது: நீங்கள் இன்று விடுப்பில் உள்ளீர்கள்.')
        : (isOnline ? 'Confirmed: You are marked available for scheduled jobs today.' : 'Confirmed: You are marked on leave today.');

      return {
        spokenPrompt: `${confirmText} பிரதான மெனுவிற்கு 0 அழுத்தவும் அல்லது இணைப்பை துண்டிக்கலாம்.`,
        expectedInput: 'dtmf',
        nextState: 'POST_ACTION_MENU',
        readBackConfirmation: confirmText,
      };
    }

    case 'REGISTER_SERVICE': {
      const serviceMap: Record<string, string> = { '1': 'ELEC', '2': 'PLUMB', '3': 'CARP' };
      const selectedSvc = serviceMap[input.dtmfDigit || '1'] || 'ELEC';
      session.slots.serviceCode = selectedSvc;

      return {
        spokenPrompt: session.language === 'ta'
          ? 'உங்கள் பணி அனுபவ வருடங்களை உள்ளிடவும். உதாரணத்திற்கு 5 வருடங்கள் எனில் 5 அழுத்தவும்.'
          : 'Please enter your years of trade experience. E.g. press 5 for 5 years.',
        expectedInput: 'dtmf',
        nextState: 'REGISTER_EXPERIENCE',
      };
    }

    case 'REGISTER_EXPERIENCE': {
      const exp = Number(input.dtmfDigit || input.spokenText || '3');
      session.slots.experienceYears = exp;

      const regConfirm = session.language === 'ta'
        ? `உங்கள் பதிவு வெற்றிகரமாக பெறப்பட்டது: தொழில் ${session.slots.serviceCode}, அனுபவம் ${exp} வருடங்கள். கூட்டுறவு சங்க நிர்வாகி சரிபார்த்தவுடன் உங்கள் கணக்கு தொடங்கும்.`
        : `Registration received: Trade ${session.slots.serviceCode}, ${exp} years experience. Society admin will verify your profile shortly.`;

      return {
        spokenPrompt: `${regConfirm} நன்றி, வணக்கம்!`,
        expectedInput: 'dtmf',
        nextState: 'COMPLETED',
        isComplete: true,
        readBackConfirmation: regConfirm,
      };
    }

    case 'POST_ACTION_MENU': {
      if (input.dtmfDigit === '0') {
        session.currentState = 'MAIN_MENU';
        return {
          spokenPrompt: 'பிரதான மெனு: 1 - வேலை தயார் நிலை, 2 - வேலைகள், 3 - வருமானம், 9 - உதவி மையம்.',
          expectedInput: 'dtmf',
          nextState: 'MAIN_MENU',
        };
      }
      return {
        spokenPrompt: 'நன்றி, TaskLink அழைப்பு நிறைவடைந்தது. வணக்கம்!',
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
