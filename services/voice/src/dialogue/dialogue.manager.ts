/**
 * TaskLink Deterministic Dialogue Manager (PPT F14)
 *
 * Rules:
 * 1. A deterministic state machine owns anything involving money, confirmation or identity.
 * 2. LLM with a constrained tool schema handles intent and slot extraction only.
 * 3. Read back every confirmation before committing.
 * 4. Handle DTMF at every step with barge-in.
 * 5. Low confidence (< 0.70) or failure hands off to the cooperative society helpdesk.
 */

export interface DialogueSession {
  sessionId: string;
  callerNumber: string;
  language: 'ta' | 'hi' | 'en';
  role: 'worker' | 'customer';
  currentState: string;
  slots: Record<string, any>;
  hasConsent: boolean;
  history: { speaker: 'user' | 'agent'; text: string; dtmf?: string; timestamp: string }[];
  isCompleted: boolean;
  handedOffToHelpdesk: boolean;
}

export interface TurnInput {
  spokenText?: string;
  dtmfDigit?: string;
  speechConfidence?: number; // 0.0 - 1.0
}

export interface TurnResponse {
  spokenPrompt: string;
  dtmfOptions?: Record<string, string>;
  expectedInput: 'dtmf' | 'speech' | 'both';
  nextState: string;
  readBackConfirmation?: string;
  isComplete?: boolean;
  handedOff?: boolean;
}

export class DialogueManager {
  private sessions: Map<string, DialogueSession> = new Map();

  public getOrCreateSession(
    sessionId: string,
    callerNumber: string,
    role: 'worker' | 'customer',
    initialState: string = 'WELCOME_LANGUAGE_SELECT'
  ): DialogueSession {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        callerNumber,
        language: 'ta', // Default to Tamil in Coimbatore/Tirupur cluster
        role,
        currentState: initialState,
        slots: {},
        hasConsent: true,
        history: [],
        isCompleted: false,
        handedOffToHelpdesk: false,
      };
      this.sessions.set(sessionId, session);
    }
    return session;
  }

  public getSession(sessionId: string): DialogueSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Process a single dialogue turn with deterministic state transitions,
   * DTMF fallback on low speech recognition confidence, and confirmation read-backs.
   */
  public processTurn(sessionId: string, input: TurnInput, flowHandler: (session: DialogueSession, input: TurnInput) => TurnResponse): TurnResponse {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Dialogue session '${sessionId}' not found.`);
    }

    // Record turn history if consent granted (DPDP Act 2023 - PPT F20)
    if (session.hasConsent) {
      session.history.push({
        speaker: 'user',
        text: input.spokenText || '',
        dtmf: input.dtmfDigit,
        timestamp: new Date().toISOString(),
      });
    }

    // Fallback: If speech recognition confidence is low (< 0.70) and no DTMF provided
    if (input.spokenText && (input.speechConfidence || 1.0) < 0.70 && !input.dtmfDigit) {
      console.warn(`[Dialogue] Low confidence (${input.speechConfidence}) in state ${session.currentState}. Falling back to DTMF prompts.`);
      return {
        spokenPrompt: 'மன்னிக்கவும், தெளிவாக கேட்கவில்லை. பொத்தான்களைப் பயன்படுத்தி தேர்வு செய்யவும். (Speech unclear, please press keypad button).',
        expectedInput: 'dtmf',
        nextState: session.currentState,
      };
    }

    // Execute flow-specific deterministic state handler
    const response = flowHandler(session, input);

    session.currentState = response.nextState;
    if (response.isComplete) session.isCompleted = true;
    if (response.handedOff) session.handedOffToHelpdesk = true;

    if (session.hasConsent) {
      session.history.push({
        speaker: 'agent',
        text: response.spokenPrompt,
        timestamp: new Date().toISOString(),
      });
    }

    return response;
  }
}

export const dialogueManager = new DialogueManager();
