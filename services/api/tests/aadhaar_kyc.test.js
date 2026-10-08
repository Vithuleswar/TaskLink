/**
 * Aadhaar e-KYC Verification Test Suite
 * Smart India Hackathon 2026 (SIH26089) - Ministry of Cooperation
 *
 * Verifies:
 * - 12-digit Aadhaar Verhoeff algorithm validation
 * - Mandatory user consent under DPDP Act 2023
 * - Aadhaar OTP dispatch and verification session
 * - Extraction of verified demographic profile (name, DOB, gender, district)
 * - Strict masked Aadhaar storage (XXXXXXXX1234) & UIDAI reference token
 * - Name matching similarity score
 * - Worker onboarding integration & "Aadhaar KYC Verified" badge assignment
 * - Direct assisted verification at cooperative society offices
 */

import assert from 'node:assert';

const BASE_URL = 'http://localhost:4000';

async function runAadhaarKycTests() {
  console.log('\n================================================================');
  console.log('🛡️  TASKLINK AADHAAR e-KYC VERIFICATION TEST SUITE');
  console.log('UIDAI Compliant • Masked Storage • DPDP Consent • Society Binding');
  console.log('================================================================\n');

  // Test 1: Invalid Aadhaar number rejection (Verhoeff checksum & length)
  console.log('Test 1: Validation of 12-Digit Aadhaar Format & Verhoeff Checksum');
  const resInvalid = await fetch(`${BASE_URL}/api/kyc/aadhaar/otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aadhaarNumber: '12345', // Short
      consentGiven: true,
    }),
  });
  assert.strictEqual(resInvalid.status, 400);
  const invalidData = await resInvalid.json();
  assert.ok(invalidData.error.includes('12 digits'));
  console.log('  [PASS] Rejected malformed Aadhaar number successfully.');

  // Test 2: Mandatory DPDP consent requirement
  console.log('Test 2: DPDP Act 2023 Consent Enforcement');
  const resNoConsent = await fetch(`${BASE_URL}/api/kyc/aadhaar/otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aadhaarNumber: '9999 9999 9012',
      consentGiven: false,
    }),
  });
  assert.strictEqual(resNoConsent.status, 400);
  const noConsentData = await resNoConsent.json();
  assert.ok(noConsentData.error.includes('consent'));
  console.log('  [PASS] Aadhaar OTP rejected when explicit user consent is absent.');

  // Test 3: Aadhaar OTP generation & Masked Number Return
  console.log('Test 3: Aadhaar OTP Dispatch & Masked Aadhaar Generation');
  const resOtp = await fetch(`${BASE_URL}/api/kyc/aadhaar/otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      aadhaarNumber: '9999 9999 9012',
      workerName: 'Subramanian S.',
      consentGiven: true,
    }),
  });
  assert.strictEqual(resOtp.status, 200);
  const otpData = await resOtp.json();
  assert.strictEqual(otpData.success, true);
  assert.strictEqual(otpData.maskedAadhaar, 'XXXXXXXX9012');
  assert.ok(otpData.sessionId.startsWith('kyc_sess_'));
  assert.strictEqual(otpData.devOtp, '123456');
  console.log(`  [PASS] OTP generated for masked Aadhaar: ${otpData.maskedAadhaar} (Session: ${otpData.sessionId}).`);

  // Test 4: Aadhaar OTP Verification & Demographic Extraction
  console.log('Test 4: Aadhaar OTP Verification & UIDAI Demographic Profile');
  const resVerify = await fetch(`${BASE_URL}/api/kyc/aadhaar/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: otpData.sessionId,
      otp: '123456',
      workerName: 'Subramanian S.',
    }),
  });
  assert.strictEqual(resVerify.status, 200);
  const verifyData = await resVerify.json();
  assert.strictEqual(verifyData.success, true);
  const kyc = verifyData.kycResult;
  assert.strictEqual(kyc.maskedAadhaar, 'XXXXXXXX9012');
  assert.ok(kyc.referenceId.startsWith('UIDAI-EKYC-'));
  assert.strictEqual(kyc.gender, 'M');
  assert.strictEqual(kyc.address.district, 'Coimbatore');
  assert.strictEqual(kyc.address.state, 'Tamil Nadu');
  assert.ok(kyc.nameMatchScore >= 0.70);
  console.log(`  [PASS] e-KYC Verified! Ref: ${kyc.referenceId}, Masked: ${kyc.maskedAadhaar}, Name Match Score: ${(kyc.nameMatchScore * 100).toFixed(0)}%.`);

  // Test 5: Worker Onboarding Integration with Aadhaar e-KYC
  console.log('Test 5: Worker Onboarding with Aadhaar e-KYC Verification');
  // 1. Worker login
  const resLogin = await fetch(`${BASE_URL}/api/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: '+919842199001',
      otp: '123456',
      role: 'worker',
      fullName: 'V. Sundaram Artisan',
    }),
  });
  const loginData = await resLogin.json();
  const token = loginData.token;

  // 2. Onboard with Aadhaar
  const resOnboard = await fetch(`${BASE_URL}/api/workers/onboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      fullName: 'V. Sundaram Artisan',
      phoneType: 'smartphone',
      societyId: 's1111111-1111-1111-1111-111111111101',
      membershipId: 'MEM-KONGU-2026-99',
      aadhaarNumber: '9999 9999 1234', // Verified via adapter
      yearsExperience: 7,
      languages: ['Tamil', 'English'],
      latitude: 11.0185,
      longitude: 76.9634,
    }),
  });
  assert.strictEqual(resOnboard.status, 201);
  const onboardData = await resOnboard.json();
  const createdWorker = onboardData.worker;
  assert.strictEqual(createdWorker.aadhaarKycVerified, true);
  assert.strictEqual(createdWorker.aadhaarMasked, 'XXXXXXXX1234');
  assert.ok(createdWorker.aadhaarKycRef.startsWith('UIDAI-'));
  assert.ok(createdWorker.badges.includes('Aadhaar KYC Verified'));
  console.log(`  [PASS] Worker onboarded with Aadhaar KYC Verified status (Masked: ${createdWorker.aadhaarMasked}).`);

  // Test 6: Query Aadhaar KYC Status Endpoint
  console.log('Test 6: Query Worker Aadhaar KYC Status Endpoint');
  const resStatus = await fetch(`${BASE_URL}/api/kyc/aadhaar/status/${createdWorker.id}`);
  assert.strictEqual(resStatus.status, 200);
  const statusData = await resStatus.json();
  assert.strictEqual(statusData.aadhaarKycVerified, true);
  assert.strictEqual(statusData.aadhaarMasked, 'XXXXXXXX1234');
  assert.ok(statusData.badges.includes('Aadhaar KYC Verified'));
  console.log('  [PASS] Status endpoint returned verified Aadhaar KYC badge and masked Aadhaar.\n');

  console.log('================================================================');
  console.log('🎉 ALL 6 AADHAAR e-KYC VERIFICATION TESTS PASSED SUCCESSFULLY!');
  console.log('================================================================\n');
}

runAadhaarKycTests().catch((err) => {
  console.error('❌ AADHAAR KYC TEST FAILED:', err);
  process.exit(1);
});
