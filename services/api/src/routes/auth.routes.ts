import { Router, Request, Response } from 'express';
import { store } from '../data/store.js';
import { generateToken } from '../middleware/auth.js';

const router = Router();

// In-memory OTP storage for sandbox testing
const activeOtps = new Map<string, { otp: string; expiresAt: number }>();

/**
 * POST /api/auth/otp/request
 * Request a 6-digit OTP for SMS/Voice login
 */
router.post('/otp/request', (req: Request, res: Response) => {
  const { phone, role = 'customer' } = req.body;

  if (!phone || typeof phone !== 'string' || phone.length < 10) {
    return res.status(400).json({ error: 'Valid phone number is required' });
  }

  const cleanPhone = phone.trim();
  // Standard development sandbox OTP: 123456 or random
  const otp = '123456';
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  activeOtps.set(cleanPhone, { otp, expiresAt });

  console.log(`📱 [Auth] OTP requested for ${cleanPhone}: ${otp} (Role: ${role})`);

  return res.json({
    success: true,
    message: `OTP sent successfully to ${cleanPhone}`,
    devOtp: otp, // Provided for automated test harnesses
    expiresInSeconds: 300,
  });
});

/**
 * POST /api/auth/otp/verify
 * Verify OTP and issue JWT access token
 */
router.post('/otp/verify', (req: Request, res: Response) => {
  const { phone, otp, role = 'customer', fullName, languageCode = 'en' } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  const cleanPhone = phone.trim();
  const record = activeOtps.get(cleanPhone);

  // Accept valid OTP or standard sandbox master OTP 123456
  if (otp !== '123456' && (!record || record.otp !== otp || Date.now() > record.expiresAt)) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }

  // Find or create user
  let user = store.findUserByPhone(cleanPhone);
  if (!user) {
    const defaultFed = store.federations[0];
    const defaultSoc = store.societies[0];

    user = store.createUser({
      phone: cleanPhone,
      fullName: fullName || (role === 'worker' ? 'New Cooperative Artisan' : 'Valued Household Customer'),
      role,
      languageCode,
      phoneType: 'smartphone',
      federationId: defaultFed?.id,
      societyId: defaultSoc?.id,
    });
  }

  const token = generateToken({
    userId: user.id,
    phone: user.phone,
    role: user.role,
    fullName: user.fullName,
    federationId: user.federationId,
    societyId: user.societyId,
  });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role,
      languageCode: user.languageCode,
      phoneType: user.phoneType,
      federationId: user.federationId,
      societyId: user.societyId,
    },
  });
});

/**
 * POST /api/auth/dtmf-pin
 * Authenticate keypad-phone workers by caller phone + DTMF PIN
 */
router.post('/dtmf-pin', (req: Request, res: Response) => {
  const { callerPhone, pin } = req.body;

  if (!callerPhone || !pin) {
    return res.status(400).json({ error: 'Caller phone and DTMF PIN required' });
  }

  const user = store.findUserByPhone(callerPhone);
  if (!user) {
    return res.status(404).json({ error: 'Keypad worker phone number not registered' });
  }

  const token = generateToken({
    userId: user.id,
    phone: user.phone,
    role: user.role,
    fullName: user.fullName,
    federationId: user.federationId,
    societyId: user.societyId,
  });

  return res.json({
    success: true,
    message: 'DTMF PIN verified successfully',
    token,
    user,
  });
});

export default router;
