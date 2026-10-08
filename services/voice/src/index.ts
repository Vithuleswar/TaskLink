import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import { dialogueManager } from './dialogue/dialogue.manager.js';
import { handleWorkerInboundFlow } from './flows/worker_inbound.flow.js';
import { handleWorkerOutboundOfferFlow } from './flows/worker_outbound.flow.js';
import { handleCustomerBookingFlow } from './flows/customer_booking.flow.js';
import { landmarkProvider, telecomLbsProvider } from './location/location.provider.js';
import { exotelTelephony } from './telephony/telephony.adapter.js';

const app = express();
const server = http.createServer(app);
const PORT = parseInt(process.env.VOICE_PORT || '4001', 10);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  return res.json({
    status: 'healthy',
    service: 'TaskLink AI Voice Gateway (Exotel <-> Bhashini <-> Dialogue)',
    supportedFlows: ['worker_inbound', 'worker_outbound_offer', 'customer_phone_booking'],
    locationEngines: ['LandmarkFallbackProvider', 'TelecomLbsProvider', 'AppGpsProvider'],
  });
});

/**
 * POST /voice/turn/worker-inbound
 * Processes a turn in the Worker Inbound call flow (PPT F14 & F2).
 */
app.post('/voice/turn/worker-inbound', (req: Request, res: Response) => {
  try {
    const { sessionId, callerNumber = '+919842100003', dtmfDigit, spokenText, speechConfidence } = req.body;
    const session = dialogueManager.getOrCreateSession(sessionId || `w_in_${Date.now()}`, callerNumber, 'worker');

    const turnResponse = dialogueManager.processTurn(
      session.sessionId,
      { dtmfDigit, spokenText, speechConfidence },
      handleWorkerInboundFlow
    );

    return res.json({
      success: true,
      sessionId: session.sessionId,
      currentState: session.currentState,
      turnResponse,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Worker inbound turn failed' });
  }
});

/**
 * POST /voice/turn/worker-outbound
 * Processes a turn in the Worker Outbound job offer call flow (PPT F14 & F7).
 */
app.post('/voice/turn/worker-outbound', (req: Request, res: Response) => {
  try {
    const { sessionId, callerNumber = '+919842100003', dtmfDigit, spokenText, job } = req.body;
    const session = dialogueManager.getOrCreateSession(sessionId || `w_out_${Date.now()}`, callerNumber, 'worker', 'WELCOME_OFFER');

    const jobDetails = job || {
      bookingId: 'bk-test-01',
      bookingNumber: 'TL-2026-00042',
      serviceName: 'Electrician',
      slotDate: '2026-10-12',
      slotTime: '10:00 AM',
      locationText: 'Gandhipuram, Coimbatore',
      workerPayRupees: 350,
    };

    const turnResponse = dialogueManager.processTurn(
      session.sessionId,
      { dtmfDigit, spokenText },
      (sess, inp) => handleWorkerOutboundOfferFlow(sess, inp, jobDetails)
    );

    return res.json({
      success: true,
      sessionId: session.sessionId,
      currentState: session.currentState,
      turnResponse,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Worker outbound turn failed' });
  }
});

/**
 * POST /voice/turn/customer-booking
 * Processes a turn in the Customer Phone Booking call flow (PPT F14, F15, F13).
 */
app.post('/voice/turn/customer-booking', async (req: Request, res: Response) => {
  try {
    const { sessionId, callerNumber = '+919842000000', dtmfDigit, spokenText } = req.body;
    const session = dialogueManager.getOrCreateSession(sessionId || `c_bk_${Date.now()}`, callerNumber, 'customer');

    // Asynchronous flow handler supporting Landmark fallback geocoding
    const turnResponse = await handleCustomerBookingFlow(session, { dtmfDigit, spokenText });
    session.currentState = turnResponse.nextState;

    return res.json({
      success: true,
      sessionId: session.sessionId,
      currentState: session.currentState,
      turnResponse,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Customer booking turn failed' });
  }
});

/**
 * POST /voice/location/resolve
 * Resolves location using Landmark fallback (live today) or Telecom LBS (with DPDP consent check).
 */
app.post('/voice/location/resolve', async (req: Request, res: Response) => {
  try {
    const { engine = 'landmark', phoneNumber, landmarkText, hasConsent = false } = req.body;

    if (engine === 'telecom') {
      const fix = await telecomLbsProvider.resolveLocation({
        phoneNumber,
        hasConsent: !!hasConsent,
      });
      return res.json({ success: true, engine: 'telecom_cell_id', fix });
    }

    const fix = await landmarkProvider.resolveLocation({
      phoneNumber,
      landmarkText,
      hasConsent: true,
    });
    return res.json({ success: true, engine: 'landmark_fallback', fix });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Location resolution failed' });
  }
});

/**
 * WebSocket Server for Exotel Real-time Bidirectional Audio Streaming (PPT F14)
 * Listens for 8kHz μ-law/PCM packets, streams to/from Bhashini STT/TTS.
 */
const wss = new WebSocketServer({ server, path: '/stream' });

wss.on('connection', (ws: WebSocket) => {
  console.log('🎙️ [Exotel Voice Stream] Bidirectional audio WebSocket connected.');

  ws.on('message', (message: Buffer) => {
    // Process inbound audio stream chunk
    // In production, forwards to Bhashini WebSocket STT
  });

  ws.on('close', () => {
    console.log('🎙️ [Exotel Voice Stream] WebSocket disconnected.');
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🎙️ [TaskLink Voice Gateway] Running on http://localhost:${PORT}`);
    console.log(`📡 WebSocket audio stream active on ws://localhost:${PORT}/stream`);
  });
}

export default app;
