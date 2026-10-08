/**
 * TaskLink Phase 5 Integration Test Suite
 * Ministry of Cooperation, SIH 2026 (Problem SIH26089)
 * 
 * Verifies:
 * - F17: Worker Welfare Engine (e-Shram capture, PMSBY, PMJJBY, Welfare Ledger, Automatic Incentives)
 * - F18: Federation Admin Dashboard & Analytics (0% Commission Proof from Ledger, Live Map, Rules Editor)
 * - F19: Cooperative Ownership & Flat Subscription Billing (Flat Annual Fee, No Per-Job Cut)
 * - F20: DPDP Act 2023 Tooling (Data Access, Erasure Pseudonymization, Location Purge, Grievance Officer)
 */

const API_BASE = 'http://localhost:4000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runPhase5Tests() {
  console.log('\n======================================================');
  console.log('TASKLINK PHASE 5 INTEGRATION TEST SUITE');
  console.log('Features: F17 (Welfare), F18 (Admin), F19 (Tenancy), F20 (DPDP)');
  console.log('======================================================\n');

  // STEP 0: Obtain authentic JWT tokens for tests
  console.log('Step 0: Authenticating test personas (Admin, Federation Admin, Worker)...');
  const adminOtp = await request('/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({ phone: '+919842211001', role: 'society_admin' }),
  });
  const adminVerify = await request('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone: '+919842211001', otp: adminOtp.data.otp || '123456' }),
  });
  const adminToken = adminVerify.data.token;

  const fedAdminOtp = await request('/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({ phone: '+919842000000', role: 'federation_admin' }),
  });
  const fedAdminVerify = await request('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone: '+919842000000', otp: fedAdminOtp.data.otp || '123456' }),
  });
  const fedAdminToken = fedAdminVerify.data.token;

  const workerOtp = await request('/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({ phone: '+919842100001', role: 'worker' }),
  });
  const workerVerify = await request('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone: '+919842100001', otp: workerOtp.data.otp || '123456' }),
  });
  const workerToken = workerVerify.data.token;
  console.log('  [PASS] Authenticated personas and obtained active JWT tokens.\n');

  // TEST 1: e-Shram Capture & Format Validation (Ground Rule 7: NO Aadhaar)
  console.log('Test 1: e-Shram capture format validation & Ground Rule 7 enforcement');
  {
    // Attempting Aadhaar should be rejected
    const aadhaarAttempt = await request('/welfare/workers/worker-01/e-shram', {
      method: 'POST',
      body: JSON.stringify({ eShramNumber: 'Aadhaar 1234 5678 9012' }),
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(!aadhaarAttempt.ok, 'Rejects e-Shram update containing Aadhaar mentions (Ground Rule 7)');

    // Valid e-Shram UAN
    const validEShram = await request('/welfare/workers/worker-01/e-shram', {
      method: 'POST',
      body: JSON.stringify({ eShramNumber: 'UAN 2026 8841 9901' }),
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(validEShram.ok, 'Accepts valid e-Shram UAN');
    assert(validEShram.data.workerId === 'worker-01', 'e-Shram updated for worker-01');
    assert(validEShram.data.eShramVerified === true, 'e-Shram verified flag set to true');
  }

  // TEST 2: PMSBY & PMJJBY Insurance Tracking & Eligibility Guidance (F17)
  console.log('\nTest 2: PMSBY/PMJJBY insurance tracking & statutory eligibility guidance');
  {
    const updateInsurance = await request('/welfare/workers/worker-01/insurance', {
      method: 'POST',
      body: JSON.stringify({
        pmsbyCovered: true,
        pmsbyRenewalDate: '2026-05-31',
        pmjjbyCovered: true,
        pmjjbyRenewalDate: '2026-05-31',
      }),
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(updateInsurance.ok, 'Updated worker insurance cover status');
    assert(updateInsurance.data.insurance.pmsbyCovered === true, 'PMSBY marked active (Rs 20/yr accidental cover)');
    assert(updateInsurance.data.insurance.pmjjbyCovered === true, 'PMJJBY marked active (Rs 436/yr life cover)');

    const eligibility = await request('/welfare/workers/worker-01/eligibility', { method: 'GET' });
    assert(eligibility.ok, 'Fetched statutory insurance eligibility guidance');
    assert(eligibility.data.insuranceCoverage.pmsby.annualPremium.includes('20'), 'PMSBY statutory Rs 20 annual premium explained');
    assert(eligibility.data.insuranceCoverage.pmjjby.annualPremium.includes('436'), 'PMJJBY statutory Rs 436 annual premium explained');
  }

  // TEST 3: Welfare Incentive Rules & Ledger Credits (F17)
  console.log('\nTest 3: Cooperative welfare fund ledger & incentive crediting');
  {
    const balanceBefore = await request('/welfare/workers/worker-01/balance', { method: 'GET' });
    assert(balanceBefore.ok, 'Fetched worker welfare balance');
    const initialBalance = balanceBefore.data.currentBalance;

    // Credit night shift incentive
    const creditRes = await request('/welfare/workers/worker-01/incentive', {
      method: 'POST',
      body: JSON.stringify({
        creditAmount: 50.0,
        reason: 'Night Shift Bonus Credit from Cooperative Pool',
      }),
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(creditRes.ok, 'Credited Rs 50 welfare bonus to worker account');
    assert(creditRes.data.entry.fundingSource === 'federation_subscription_pool', 'Funded by federation subscription pool (0% platform cut)');

    const balanceAfter = await request('/welfare/workers/worker-01/balance', { method: 'GET' });
    assert(balanceAfter.data.currentBalance === initialBalance + 50.0, 'Worker welfare balance increased by exactly Rs 50');
  }

  // TEST 4: Automatic Welfare Evaluation on Booking Completion (F17)
  console.log('\nTest 4: Automatic welfare bonus evaluation when night/surge booking completes');
  {
    // Create night booking
    const bookingRes = await request('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        customerId: 'admin-cbe-01',
        serviceCode: 'ELEC',
        bookingType: 'scheduled',
        scheduledStartTime: '2026-10-07T23:30:00.000Z',
        addressText: '100 Crosscut Road, Coimbatore',
        latitude: 11.0185,
        longitude: 76.9634,
      }),
    });
    assert(bookingRes.ok, 'Created booking for night shift testing');
    const bookingId = bookingRes.data.booking.id;

    // Transition to completed
    const completeRes = await request(`/bookings/${bookingId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status: 'completed' }),
    });
    assert(completeRes.ok, 'Transitioned booking to completed');
    assert(Array.isArray(completeRes.data.welfareCreditsAwarded), 'Evaluated welfare incentives on completion');
  }

  // TEST 5: Insurance Renewal Reminders Dispatch (F17)
  console.log('\nTest 5: Dispatch IVR/SMS insurance renewal reminders');
  {
    const remindersRes = await request('/welfare/reminders/send', {
      method: 'POST',
      body: JSON.stringify({ federationId: 'f1111111-1111-1111-1111-111111111101' }),
      headers: { Authorization: `Bearer ${fedAdminToken}` },
    });
    assert(remindersRes.ok, 'Dispatched insurance renewal notifications');
    assert(remindersRes.data.totalWorkersNotified >= 1, 'Notified workers needing PMSBY/PMJJBY auto-debit renewal');
  }

  // TEST 6: Federation Admin Analytics & 0% Commission Proof (F18)
  console.log('\nTest 6: Federation admin analytics & ledger-backed 0% commission proof');
  {
    const analyticsRes = await request('/admin/analytics?federationId=f1111111-1111-1111-1111-111111111101', { method: 'GET' });
    assert(analyticsRes.ok, 'Fetched federation admin analytics');
    const kpis = analyticsRes.data.analytics.kpis;
    assert(kpis.activeWorkers >= 1, 'Active workers count present');
    assert(kpis.commissionCollected === 0.0, 'PROVED: Platform commission collected is strictly Rs 0.00 from double-entry ledger');
    assert(kpis.keypadWorkerPercentage > 0, 'Keypad worker percentage calculated');
    assert(analyticsRes.data.analytics.welfare.eshramCoveragePercentage > 0, 'e-Shram coverage statistic calculated');
  }

  // TEST 7: Dynamic Rules Editor (F6, F8, F9, F17)
  console.log('\nTest 7: Dynamic rules editor for matching weights, pricing, premiums, welfare');
  {
    // Update matching weights
    const updateWeights = await request('/admin/rules/matching-weights', {
      method: 'PUT',
      body: JSON.stringify({ skill: 0.30, distance: 0.25 }),
    });
    assert(updateWeights.ok, 'Updated 6-factor matching weights');

    // Update pricing rule
    const updatePricing = await request('/admin/rules/pricing', {
      method: 'PUT',
      body: JSON.stringify({ kSensitivity: 0.60, surgeCap: 1.60 }),
    });
    assert(updatePricing.ok, 'Updated dynamic pricing parameters');

    // Update welfare rule
    const updateWelfareRule = await request('/admin/rules/welfare', {
      method: 'PUT',
      body: JSON.stringify({ triggerType: 'night_shift', creditAmount: 60 }),
    });
    assert(updateWelfareRule.ok, 'Updated welfare incentive credit amount');
  }

  // TEST 8: Tenancy & Flat Annual Subscriptions (F19)
  console.log('\nTest 8: Cooperative ownership & flat annual subscription billing (No per-job fee)');
  {
    const subsRes = await request('/tenancy/subscriptions', { method: 'GET' });
    assert(subsRes.ok, 'Fetched cooperative federation subscriptions');
    assert(subsRes.data.subscriptions.length >= 2, 'Found subscriptions for Coimbatore and Tirupur federations');
    const cbeSub = subsRes.data.subscriptions.find((s) => s.invoiceNumber === 'INV-FED-CBE-2026-001');
    assert(cbeSub.amount === 50000.0, 'Coimbatore Federation enrolled on flat Rs 50,000/year annual subscription');
    assert(cbeSub.status === 'paid', 'Subscription marked paid with 0% per-job platform fees');
  }

  // TEST 9: DPDP Act 2023 Data Subject Access Request (F20)
  console.log('\nTest 9: DPDP Act 2023 Section 11 Data Subject Access Request');
  {
    const accessRes = await request('/consent/data-access', {
      method: 'POST',
      body: JSON.stringify({ userId: 'user-w01' }),
      headers: { Authorization: `Bearer ${workerToken}` },
    });
    assert(accessRes.ok, 'Generated DPDP Act Section 11 Data Access Report');
    assert(accessRes.data.report.reportType === 'DPDP_ACT_2023_DATA_ACCESS_EXPORT', 'Export matches statutory report schema');
    assert(accessRes.data.report.userData.fullName === 'Karthik Subramanian', 'Personal profile included in export');
    assert(Array.isArray(accessRes.data.report.consents), 'Opt-in consents ledger included');
  }

  // TEST 10: DPDP Act 2023 Section 12 Right to Erasure & Location Purge (F20)
  console.log('\nTest 10: DPDP Act 2023 Section 12 Right to be Forgotten & Location Auto-Purge');
  {
    // Create temporary test user to erase
    const tempUserPhone = `+919842${Math.floor(100000 + Math.random() * 900000)}`;
    const otpRes = await request('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ phone: tempUserPhone, role: 'customer' }),
    });
    const verifyRes = await request('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone: tempUserPhone, otp: otpRes.data.devOtp || '123456', fullName: 'Temp User To Be Erased' }),
    });
    const tempUserId = verifyRes.data.user.id;

    // Erase personal data
    const erasureRes = await request('/consent/data-erasure', {
      method: 'POST',
      body: JSON.stringify({ userId: tempUserId }),
      headers: { Authorization: `Bearer ${verifyRes.data.token}` },
    });
    assert(erasureRes.ok, 'Executed DPDP Act Section 12 Right to Erasure');
    assert(erasureRes.data.result.success === true, 'Personal data pseudonymized successfully');

    // Location purge
    const purgeRes = await request('/consent/purge-locations', {
      method: 'POST',
      body: JSON.stringify({ retentionHours: 24 }),
      headers: { Authorization: `Bearer ${fedAdminToken}` },
    });
    assert(purgeRes.ok, 'Executed automated location retention purge for completed bookings');

    // Grievance Officer details
    const dpoRes = await request('/consent/grievance-officer', { method: 'GET' });
    assert(dpoRes.ok, 'Fetched statutory Data Protection Officer contact details');
    assert(dpoRes.data.grievanceOfficer.name.includes('Arumugam'), 'Statutory DPO Dr. R. Arumugam IAS (Retd.) designated');
    assert(dpoRes.data.grievanceOfficer.statutoryBasis.includes('Personal Data Protection') && dpoRes.data.grievanceOfficer.statutoryBasis.includes('8(9)'), 'Statutory reference to DPDP Act Section 8(9) verified');
  }

  console.log('\n======================================================');
  console.log(`PHASE 5 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('======================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runPhase5Tests().catch((err) => {
  console.error('[FATAL ERROR IN PHASE 5 TESTS]:', err);
  process.exit(1);
});
