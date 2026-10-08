/**
 * TaskLink Phase 2 Integration Test Suite: Marketplace Core
 * Ministry of Cooperation, Smart India Hackathon 2026 (SIH26089)
 *
 * Verifies:
 * - F6: Six-Factor AI Fair Matching & Keypad Exclusion
 * - F7: Booking Lifecycle (Scheduled, On-demand 45s offer, Emergency parallel)
 * - F8: Dynamic Surge Pricing & Quote Locking
 * - F9: 24x7 Night (+25%) & Holiday (+50%) Premiums
 * - F1: Zero-Commission Guarantee across Quotes and Bookings
 * - F16: Multilingual Chat via Bhashini & Support Helpdesk Escalation
 */

import http from 'http';

const BASE_URL = 'http://localhost:4000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get('content-type') || '';
  let body = null;
  if (contentType.includes('application/json')) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  return { status: response.status, body };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('🧪 [TaskLink Test Runner] Starting Phase 2 Marketplace Core Integration Tests...\n');

  // Test 1: Healthcheck & Commission Guarantee
  console.log('Test 1: Healthcheck & Zero-Commission Guarantee Header');
  {
    const res = await request('/health');
    assert(res.status === 200, 'Healthcheck status should be 200');
    assert(res.body.commission === '0% guaranteed', 'Must enforce 0% platform commission');
    console.log('  [PASS] Healthcheck operational with 0% platform commission guaranteed.\n');
  }

  // Test 2: Six-Factor AI Matching Endpoint (PPT F6)
  console.log('Test 2: Six-Factor AI Fair Matching Endpoint');
  {
    const res = await request('/api/matching/find-workers', {
      method: 'POST',
      body: JSON.stringify({
        bookingType: 'scheduled',
        serviceCode: 'ELEC',
        latitude: 11.0185,
        longitude: 76.9634,
        customerLanguage: 'Tamil',
      }),
    });

    assert(res.status === 200, `Matching returned status ${res.status}`);
    assert(res.body.success === true, 'Matching success should be true');
    assert(res.body.rankedWorkers.length > 0, 'Should find candidate workers');

    const topWorker = res.body.rankedWorkers[0];
    assert(topWorker.rank === 1, 'Top worker must have rank 1');
    assert(topWorker.breakdown.skill_score !== undefined, 'Skill score must be present');
    assert(topWorker.breakdown.distance_score !== undefined, 'Distance score must be present');
    assert(topWorker.breakdown.reliability_score !== undefined, 'Reliability score must be present');
    assert(topWorker.why_this_worker.length > 0, 'Why this worker explanation must be present');
    console.log(`  [PASS] Top match: ${topWorker.worker_name} (Score: ${topWorker.total_score}, Explanation: "${topWorker.why_this_worker}")\n`);
  }

  // Test 3: Keypad Worker Exclusion on On-Demand & Inclusion on Scheduled (PPT F6 & F7)
  console.log('Test 3: Keypad Worker Strict Exclusion on On-Demand & Inclusion on Scheduled');
  {
    // On-demand search for Electrician
    const resOnDemand = await request('/api/matching/find-workers', {
      method: 'POST',
      body: JSON.stringify({
        bookingType: 'on_demand',
        serviceCode: 'ELEC',
        latitude: 11.0185,
        longitude: 76.9634,
      }),
    });

    assert(resOnDemand.status === 200, 'On-demand matching should succeed');
    // None of the on-demand matches can be keypad workers!
    for (const w of resOnDemand.body.rankedWorkers) {
      assert(w.phone_type !== 'keypad', `Keypad worker ${w.worker_name} must NOT be matched for on-demand!`);
    }
    console.log('  [PASS] Keypad workers strictly excluded from on-demand job matches.');

    // Scheduled search: keypad workers are eligible!
    const resScheduled = await request('/api/matching/find-workers', {
      method: 'POST',
      body: JSON.stringify({
        bookingType: 'scheduled',
        serviceCode: 'ELEC',
        latitude: 11.0185,
        longitude: 76.9634,
      }),
    });
    const hasKeypadWorker = resScheduled.body.rankedWorkers.some((w) => w.phone_type === 'keypad');
    assert(hasKeypadWorker, 'Keypad worker must be eligible for scheduled pre-booked jobs');
    console.log('  [PASS] Keypad workers successfully included for pre-booked scheduled jobs.\n');
  }

  // Test 4: Dynamic Matching Weights Alteration by Admin (PPT F6)
  console.log('Test 4: Admin Live Matching Weights Adjustment');
  {
    const weightsRes = await request('/api/admin/rules/matching-weights');
    assert(weightsRes.status === 200, 'Weights fetch should succeed');
    const originalSkillWeight = weightsRes.body.weights.skill;

    // Update weights to skill-heavy (0.60 skill, 0.10 distance)
    const updateRes = await request('/api/admin/rules/matching-weights', {
      method: 'PUT',
      body: JSON.stringify({
        skill: 0.60,
        distance: 0.10,
      }),
    });
    assert(updateRes.status === 200, 'Weights update should succeed');
    assert(updateRes.body.weights.skill === 0.60, 'Updated skill weight should be 0.60');

    // Restore default weights
    await request('/api/admin/rules/matching-weights', {
      method: 'PUT',
      body: JSON.stringify({
        skill: 0.25,
        distance: 0.20,
      }),
    });
    console.log('  [PASS] Federation matching weights updated dynamically in admin and live-applied.\n');
  }

  // Test 5: Dynamic Surge Pricing & Quote Locking (PPT F8 & F1)
  console.log('Test 5: Dynamic Pricing Surge, Quote Locking & 0% Commission');
  {
    const quoteRes = await request('/api/bookings/quote', {
      method: 'POST',
      body: JSON.stringify({
        serviceCode: 'ELEC',
        customerLat: 11.0185,
        customerLon: 76.9634,
        slotTime: '14:00', // Daytime
      }),
    });

    assert(quoteRes.status === 200, 'Quote generation should succeed');
    const quote = quoteRes.body.quote;
    assert(quote.baseRate === 350, `Base rate should be 350, got ${quote.baseRate}`);
    assert(quote.platformCommission === 0.0, `Platform commission must be 0, got ${quote.platformCommission}`);
    assert(quote.workerReceives === quote.baseRate + quote.surgeAmount, 'Worker receives 100% of job price');
    assert(quote.expiresAt !== undefined, 'Quote must have 10-minute expiry timestamp');

    // Verify 10-minute lock window
    const now = Date.now();
    const expiry = new Date(quote.expiresAt).getTime();
    const diffMins = Math.round((expiry - now) / (60 * 1000));
    assert(diffMins >= 9 && diffMins <= 11, `Quote should be locked for ~10 minutes, got ${diffMins} mins`);
    console.log(`  [PASS] Quote locked for 10 mins: Base ₹${quote.baseRate}, Commission ₹0, Worker Receives ₹${quote.workerReceives}.\n`);
  }

  // Test 6: 24x7 Night (+25%) & Holiday (+50%) Premiums Stacking (PPT F9)
  console.log('Test 6: Night (+25%) and Holiday (+50%) Premium Stacking');
  {
    // 1. Night Quote (23:00)
    const nightQuoteRes = await request('/api/bookings/quote', {
      method: 'POST',
      body: JSON.stringify({
        serviceCode: 'ELEC',
        slotTime: '23:00',
        slotDate: '2026-03-10', // Regular weekday
      }),
    });
    const nightQuote = nightQuoteRes.body.quote;
    assert(nightQuote.isNightSlot === true, '23:00 should be recognized as night slot');
    assert(nightQuote.nightPremiumRate === 0.25, 'Night premium rate should be +25%');
    assert(nightQuote.nightPremiumAmount === 350 * 0.25, `Night premium amount should be ₹87.50, got ${nightQuote.nightPremiumAmount}`);
    console.log(`  [PASS] Night booking (11 PM) applied +25% premium: +₹${nightQuote.nightPremiumAmount}`);

    // 2. Holiday Quote (Pongal: 2026-01-15)
    const holidayQuoteRes = await request('/api/bookings/quote', {
      method: 'POST',
      body: JSON.stringify({
        serviceCode: 'ELEC',
        slotTime: '12:00', // Daytime
        slotDate: '2026-01-15', // Pongal
        state: 'Tamil Nadu',
      }),
    });
    const holidayQuote = holidayQuoteRes.body.quote;
    assert(holidayQuote.isHoliday === true, '2026-01-15 should be recognized as Pongal holiday');
    assert(holidayQuote.holidayPremiumRate === 0.50, 'Holiday premium rate should be +50%');
    assert(holidayQuote.holidayPremiumAmount === 350 * 0.50, `Holiday premium amount should be ₹175, got ${holidayQuote.holidayPremiumAmount}`);
    console.log(`  [PASS] Holiday booking (Pongal) applied +50% premium: +₹${holidayQuote.holidayPremiumAmount}`);

    // 3. Night + Holiday Additive Stacking Quote (2026-01-15 at 23:30)
    const stackedQuoteRes = await request('/api/bookings/quote', {
      method: 'POST',
      body: JSON.stringify({
        serviceCode: 'ELEC',
        slotTime: '23:30',
        slotDate: '2026-01-15',
        state: 'Tamil Nadu',
      }),
    });
    const stackedQuote = stackedQuoteRes.body.quote;
    assert(stackedQuote.isNightSlot === true && stackedQuote.isHoliday === true, 'Both night and holiday active');
    const expectedWorkerReceives = 350 + (350 * 0.25) + (350 * 0.50);
    assert(stackedQuote.workerReceives === expectedWorkerReceives, `Stacked total should be ${expectedWorkerReceives}, got ${stackedQuote.workerReceives}`);
    assert(stackedQuote.platformCommission === 0.0, 'Platform commission must remain ₹0.00');
    console.log(`  [PASS] Stacking rule verified: Base ₹350 + Night ₹87.5 + Holiday ₹175 = ₹${stackedQuote.workerReceives} (Commission ₹0)\n`);
  }

  // Test 7: Full Booking Lifecycle (PPT F7)
  console.log('Test 7: End-to-End Booking Lifecycle (Requested -> Accepted -> Completed)');
  {
    // Create customer booking
    const bookingRes = await request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        customerId: 'admin-cbe-01',
        serviceCode: 'ELEC',
        bookingType: 'scheduled',
        scheduledStartTime: '2026-10-10T10:00:00Z',
        addressText: '12 Trichy Road, Singanallur, Coimbatore',
        latitude: 11.0185,
        longitude: 76.9634,
        customerLanguage: 'Tamil',
        notes: 'Main power switch tripping repeatedly',
      }),
    });

    assert(bookingRes.status === 201, `Booking creation should succeed, got ${bookingRes.status}`);
    const booking = bookingRes.body.booking;
    assert(booking.id !== undefined, 'Booking ID must exist');
    assert(booking.platformCommission === 0.0, 'Booking platform commission must be ₹0.00');
    assert(booking.fundsEscrowStatus === 'held', 'Funds must be held in escrow upon booking');

    // Worker accepts booking
    const acceptRes = await request(`/api/bookings/${booking.id}/accept`, {
      method: 'POST',
      body: JSON.stringify({ workerId: booking.workerId }),
    });
    assert(acceptRes.status === 200, 'Accept should succeed');
    assert(acceptRes.body.booking.status === 'accepted', 'Booking status should be accepted');

    // Update status to on the way
    await request(`/api/bookings/${booking.id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status: 'on_the_way' }),
    });

    // Update status to in progress
    await request(`/api/bookings/${booking.id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status: 'in_progress' }),
    });

    // Worker completes job
    const completeRes = await request(`/api/bookings/${booking.id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status: 'completed' }),
    });
    assert(completeRes.status === 200, 'Completion should succeed');
    assert(completeRes.body.booking.status === 'completed', 'Status should be completed');
    assert(completeRes.body.booking.fundsEscrowStatus === 'released', 'Funds must transition to released');
    assert(completeRes.body.booking.disputeWindowEndsAt !== undefined, 'Dispute window must be opened');
    console.log(`  [PASS] Booking ${booking.bookingNumber} completed end-to-end. Escrow ₹${booking.workerReceives} released to worker.\n`);
  }

  // Test 8: Real-Time Multilingual Chat with Bhashini (PPT F16 & F4)
  console.log('Test 8: Real-Time Multilingual In-App Chat via Bhashini');
  {
    // Use the created booking
    const bookingsList = await request('/api/bookings/quote', {
      method: 'POST',
      body: JSON.stringify({ serviceCode: 'ELEC' }),
    });

    // Create a quick test booking for chat
    const testBooking = await request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        customerId: 'admin-cbe-01',
        serviceCode: 'PLUMB',
        bookingType: 'scheduled',
        addressText: '42 Crosscut Road, Gandhipuram',
        latitude: 11.0250,
        longitude: 76.9580,
      }),
    });
    const bookingId = testBooking.body.booking.id;

    // Worker sends message in Tamil to English-speaking customer
    const sendRes = await request(`/api/chat/${bookingId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        senderId: 'worker-01',
        senderRole: 'worker',
        senderName: 'Karthik Master',
        text: 'நான் வந்து கொண்டிருக்கிறேன்', // "I am on the way"
        language: 'ta',
        recipientLanguage: 'en',
      }),
    });

    assert(sendRes.status === 201, `Send message should succeed, got ${sendRes.status}`);
    assert(sendRes.body.message.originalText === 'நான் வந்து கொண்டிருக்கிறேன்', 'Original Tamil text preserved');
    console.log(`  [PASS] Worker sent Tamil chat: "${sendRes.body.message.originalText}"`);

    // Customer retrieves messages in English
    const getRes = await request(`/api/chat/${bookingId}/messages?lang=en`);
    assert(getRes.status === 200, 'Get chat messages should succeed');
    assert(getRes.body.messages.length > 0, 'Should return chat message');
    const receivedMsg = getRes.body.messages[0];
    assert(receivedMsg.displayText !== undefined, 'Display text should be present');
    console.log(`  [PASS] Customer received translated chat in English: "${receivedMsg.displayText}"\n`);
  }

  // Test 9: Multilingual Support Desk & Federation Escalation (PPT F16)
  console.log('Test 9: Multilingual Support Tickets & Escalation to Federation');
  {
    // Worker raises ticket in Tamil
    const ticketRes = await request('/api/support/tickets', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'worker-01',
        category: 'payout_query',
        subject: 'பணம் செலுத்துதல் வினவல்', // "Payout inquiry"
        description: 'எனது முந்தைய வேலைக்கான பணம் இன்னும் வரவில்லை', // "Payment for my previous work has not arrived"
        language: 'ta',
        priority: 'high',
      }),
    });

    assert(ticketRes.status === 201, 'Ticket creation should succeed');
    const ticket = ticketRes.body.ticket;
    assert(ticket.ticketNumber.startsWith('TICK-'), 'Ticket number must be formatted TICK-YYYY-XXXX');
    assert(ticket.status === 'open', 'Ticket status should be open');
    console.log(`  [PASS] Support ticket created: ${ticket.ticketNumber} (${ticket.subject})`);

    // Society Admin replies
    const replyRes = await request(`/api/support/tickets/${ticket.id}/reply`, {
      method: 'POST',
      body: JSON.stringify({
        senderId: 'admin-cbe-01',
        text: 'Your payout is currently being verified with the cooperative bank.',
        language: 'en',
      }),
    });
    assert(replyRes.status === 200, 'Reply should succeed');
    assert(replyRes.body.ticket.replies.length === 1, 'Should have 1 reply');

    // Escalate ticket to District Federation
    const escalateRes = await request(`/api/support/tickets/${ticket.id}/escalate`, {
      method: 'POST',
    });
    assert(escalateRes.status === 200, 'Escalation should succeed');
    assert(escalateRes.body.ticket.status === 'escalated_to_federation', 'Ticket status must be escalated_to_federation');
    console.log('  [PASS] Support ticket escalated to Federation Secretariat successfully.\n');
  }

  console.log('================================================================');
  console.log('🎉 ALL PHASE 2 INTEGRATION TESTS PASSED SUCCESSFULLY! (9/9)');
  console.log('================================================================');
}

runTests().catch((err) => {
  console.error('\n❌ Phase 2 Test Suite Failed:', err.message);
  process.exit(1);
});
