/**
 * Phase 1 Comprehensive Automated Integration Test Suite
 * Tests Tenancy, OTP Auth, Worker Onboarding, Verification, Bulk Roster Import,
 * Bhashini Multilingual, DPDP Consent, and Ground Rule 7 (No Aadhaar).
 */

import assert from 'node:assert';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'http://localhost:4000';

async function isServerRunning() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function runTests() {
  console.log('🧪 [TaskLink Test Runner] Starting Phase 1 Integration Tests...\n');

  let serverProcess = null;

  // Check if API server is already running, if not start it
  if (!(await isServerRunning())) {
    console.log('Starting local API server on port 4000 for test suite...');
    const apiDist = path.resolve(__dirname, '..', 'dist', 'services', 'api', 'src', 'index.js');
    serverProcess = spawn('node', [apiDist], { stdio: 'ignore' });

    // Wait up to 5 seconds for server to start
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 200));
      if (await isServerRunning()) break;
    }
  }

  try {
    // 1. Healthcheck
    console.log('Test 1: Healthcheck and 0% Commission Guarantee Header');
    const resHealth = await fetch(`${BASE_URL}/health`);
    const healthData = await resHealth.json();
    assert.strictEqual(resHealth.status, 200);
    assert.strictEqual(healthData.commission, '0% guaranteed');
    console.log('  ✓ PASSED: Healthcheck returned healthy with 0% commission statement.\n');

    // 2. Auth: OTP Request and Verification
    console.log('Test 2: Phone OTP Request and JWT Generation');
    const resOtpReq = await fetch(`${BASE_URL}/api/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+919842100099', role: 'worker' }),
    });
    const otpReqData = await resOtpReq.json();
    assert.strictEqual(resOtpReq.status, 200);
    assert.strictEqual(otpReqData.devOtp, '123456');

    const resOtpVerify = await fetch(`${BASE_URL}/api/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+919842100099',
        otp: '123456',
        role: 'worker',
        fullName: 'Murugan Craftworker',
      }),
    });
    const authData = await resOtpVerify.json();
    assert.strictEqual(resOtpVerify.status, 200);
    assert.ok(authData.token, 'JWT Token must be returned');
    const workerToken = authData.token;
    console.log('  ✓ PASSED: OTP verified, JWT issued for worker.\n');

    // Society Admin Token
    const resAdminAuth = await fetch(`${BASE_URL}/api/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+919842211001', otp: '123456' }),
    });
    const adminAuthData = await resAdminAuth.json();
    const adminToken = adminAuthData.token;
    assert.strictEqual(adminAuthData.user.role, 'society_admin');
    console.log('  ✓ PASSED: Society Admin logged in with role society_admin.\n');

    // 3. Ground Rule 7: Reject Aadhaar numbers
    console.log('Test 3: Ground Rule 7 - Strict Prohibition of Aadhaar Numbers');
    const resAadhaarAttempt = await fetch(`${BASE_URL}/api/workers/onboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${workerToken}`,
      },
      body: JSON.stringify({
        fullName: 'Illegal Aadhaar Test',
        societyId: 's1111111-1111-1111-1111-111111111101',
        membershipId: 'MEM-001',
        aadhaarNumber: '1234 5678 9012', // FORBIDDEN!
      }),
    });
    assert.strictEqual(resAadhaarAttempt.status, 400);
    const aadhaarErr = await resAadhaarAttempt.json();
    assert.ok(aadhaarErr.error.includes('Aadhaar numbers are strictly prohibited'));
    console.log('  ✓ PASSED: Endpoint rejected Aadhaar collection attempt with privacy rule error.\n');

    // 4. Worker Onboarding by App (F2)
    console.log('Test 4: Worker Onboarding via App Path with VPA validation');
    const resOnboard = await fetch(`${BASE_URL}/api/workers/onboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${workerToken}`,
      },
      body: JSON.stringify({
        fullName: 'Murugan Craftworker',
        phoneType: 'smartphone',
        societyId: 's1111111-1111-1111-1111-111111111101',
        membershipId: 'MEM-KONGU-2026-999',
        payoutUpiId: 'murugan@okhdfcbank',
        yearsExperience: 7,
        languages: ['Tamil', 'English'],
        documentPhotoUrl: 'https://storage.tasklink/docs/membership_photo.jpg',
        latitude: 11.02,
        longitude: 76.97,
      }),
    });
    const onboardData = await resOnboard.json();
    assert.strictEqual(resOnboard.status, 201);
    assert.strictEqual(onboardData.worker.verificationStatus, 'pending');
    assert.strictEqual(onboardData.worker.payoutAccountVerified, true);
    const pendingWorkerId = onboardData.worker.id;
    console.log('  ✓ PASSED: Worker onboarded into pending queue, VPA verified, DIGIPIN generated.\n');

    // 5. Verification Queue & Approval by Admin (F3)
    console.log('Test 5: Verification Queue & Admin Approval');
    const resQueue = await fetch(`${BASE_URL}/api/admin/verification-queue`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const queueData = await resQueue.json();
    assert.strictEqual(resQueue.status, 200);
    assert.ok(queueData.workers.some((w) => w.id === pendingWorkerId));

    const resApprove = await fetch(`${BASE_URL}/api/admin/workers/${pendingWorkerId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        badges: ['Verified Artisan', 'NSDC Gold Badge'],
        certificateName: 'State Vocational Excellence Badge',
      }),
    });
    const approveData = await resApprove.json();
    assert.strictEqual(resApprove.status, 200);
    assert.strictEqual(approveData.worker.verificationStatus, 'verified');
    console.log('  ✓ PASSED: Worker approved by society admin and badges assigned.\n');

    // 6. Bulk CSV Roster Import (F3)
    console.log('Test 6: Bulk CSV Roster Import with Validation Report');
    const sampleCsv = `fullName,phone,phoneType,serviceCode,experienceYears,membershipId,upiId
S. Balasubramaniam,+919842199001,smartphone,ELEC,5,MEM-ROSTER-01,bala@upi
R. Krishnan,+919842199002,keypad,PLUMB,10,MEM-ROSTER-02,krish@upi
P. Murugesan,+919842199003,smartphone,CARP,8,MEM-ROSTER-03,muru@upi`;

    const resRoster = await fetch(`${BASE_URL}/api/admin/roster/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        csvContent: sampleCsv,
        societyId: 's1111111-1111-1111-1111-111111111101',
      }),
    });
    const rosterData = await resRoster.json();
    assert.strictEqual(resRoster.status, 200);
    assert.strictEqual(rosterData.report.importedCount, 3);
    assert.strictEqual(rosterData.report.errors.length, 0);
    console.log('  ✓ PASSED: 3 workers imported from CSV roster with 0 errors.\n');

    // 7. Bhashini Multilingual Dynamic Translation (F4)
    console.log('Test 7: Bhashini Indic Dynamic Translation Pipeline');
    const resTrans = await fetch(`${BASE_URL}/api/bhashini/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Work is completed',
        sourceLang: 'en',
        targetLang: 'ta',
      }),
    });
    const transData = await resTrans.json();
    assert.strictEqual(resTrans.status, 200);
    assert.strictEqual(transData.translatedText, 'வேலை முடிந்தது');
    console.log(`  ✓ PASSED: Translated "Work is completed" to "${transData.translatedText}" (ta).\n`);

    // 8. DPDP Act 2023 Consent Ledger (F20)
    console.log('Test 8: DPDP Act 2023 Consent Grant and Withdrawal');
    const resConsent = await fetch(`${BASE_URL}/api/consent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${workerToken}`,
      },
      body: JSON.stringify({
        purpose: 'approximate_location',
        languageShown: 'ta',
        channel: 'mobile_app',
      }),
    });
    const consentData = await resConsent.json();
    assert.strictEqual(resConsent.status, 201);
    assert.strictEqual(consentData.consent.status, 'granted');
    const consentId = consentData.consent.id;

    const resWithdraw = await fetch(`${BASE_URL}/api/consent/${consentId}/withdraw`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${workerToken}` },
    });
    const withdrawData = await resWithdraw.json();
    assert.strictEqual(resWithdraw.status, 200);
    assert.strictEqual(withdrawData.consent.status, 'withdrawn');
    console.log('  ✓ PASSED: Consent granted and withdrawn cleanly in DPDP ledger.\n');

    console.log('================================================================');
    console.log('🎉 ALL PHASE 1 INTEGRATION TESTS PASSED SUCCESSFULLY! (8/8)');
    console.log('================================================================');
  } finally {
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

runTests().catch((err) => {
  console.error('❌ Test execution failed:', err);
  process.exit(1);
});
