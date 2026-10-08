# TaskLink — 5-Minute Demo Script (SIH 2026 Judge Walkthrough)
> Team TaskLink · ID 170331 · PS SIH26089 · Ministry of Cooperation

---

## Pre-Demo Setup (30 seconds)
1. Open browser tabs:
   - **Tab 1** — http://localhost:5175 (Unified App — Customer/Worker/Admin)
   - **Tab 2** — http://localhost:4000/health (API health check)
   - **Tab 3** — pps/sim/index.html (Demo Control Room, open as file)
2. Run: powershell -ExecutionPolicy Bypass -File .\start.ps1 all

---

## MINUTE 1 — Customer Experience (App Booking)

**[Tab 1 ? Select "Customer" role]**

1. Show **role selector**: "Dial or Tap, Zero Commission — Cooperative Gig Services"
2. Select **"I'm a Customer"** ? CustomerPlatform loads
3. Point to **map** with 24 verified worker pins (Coimbatore/Tirupur area)
4. Click on a worker pin ? **MiniProfileCard** appears
   - Show: ? 4.8 rating, "Verified Cooperative Member" badge, "eKYC ?"
   - Show: ?350/hr · 0% Platform Fee · 100% to Worker
5. Click **"Book Now"** ? booking modal opens
6. Show **price breakdown**: Base ?350 + Night Premium ?0 + Surge ?0 + Commission ?0.00
7. Say: *"Every rupee the customer pays — the worker keeps. Zero platform cut."*

**Key claim proven: R1 (0% commission), R10 (AI matching), R11 (verified profiles)**

---

## MINUTE 2 — Feature-Phone Worker Registration (Voice)

**[Tab 3 ? "?? Phone Sim" tab]**

1. Click **"?? Register Worker by Voice (Tamil)"** scenario
2. Show the IVR dialogue playing out:
   - Language selection: press 1 ? Tamil selected
   - DTMF PIN authentication (1234)
   - Voice agent reads worker registration form
   - Mock SMS with Worker ID appears in pink SMS box
3. Switch to **Tab 1 ? "Society Admin" role ? Verification Queue tab**
4. Show the voice-registered worker in the queue with:
   - RegistrationChannel: ivr_voice
   - Status: pending_kyc
   - Tamil transcript visible
5. Click **"? Verify"** ? worker status ? erified

*"A feature-phone worker who has never touched a smartphone is now fully registered on the cooperative platform."*

**Key claim proven: R2, R18, R22, R36**

---

## MINUTE 3 — *99# USSD Payment (No Internet Required)

**[Tab 3 ? "*99# USSD" tab]**

1. Click **"?? Dial *99#"**
2. Type 1 ? Send Money
3. Type 	asklink.b-x1234@rbl ? UPI ID (generated from booking)
4. Type 350 ? Amount
5. Type 1234 ? PIN
6. Show: **"? PAYMENT SUCCESSFUL. Worker payout: ?350 (100%). Platform commission: ?0.00"**
7. Switch to **"?? Flow Trace" tab** ? Select "4. Keypad Worker Voice + *99# USSD" ? Run Flow
8. Show the full PPT payment diagram playing out in colour:
   - ?? Voice AI steps
   - ?? Payment backend steps
   - ?? Confirmation steps

*"This worker used no internet — just a basic phone and *99# USSD banking — yet received 100% of their earnings."*

**Key claim proven: R19, R21, R25, R37**

---

## MINUTE 4 — Cooperative Admin Dashboard

**[Tab 1 ? "Society Admin" role]**

1. Show **Overview tab**: KPI cards
   - Active Workers: 24, Active Jobs: 12
   - Platform Commission: ?0.00 (highlighted green)
   - Keypad Workers: 4/24 (16.7%)
   - e-Shram Enrolled: 18/24 (75%)
2. Show **"Live Rules" tab**:
   - Drag "Distance/ETA" weight slider from 20% ? 30%
   - Say: *"This instantly changes which worker the AI recommends next — audit-logged"*
3. Show **"Welfare" tab**:
   - PMSBY coverage 75%, PMJJBY 66%
   - Click "Send Renewal Reminders" ? SMS/IVR dispatched
4. Show **"DPDP Compliance" tab**:
   - Section 11 Data Access export
   - Section 12 Erasure button
   - Location purge (Cell-ID data auto-purged after job window)

**Key claim proven: R9, R10, R23, R30, R3**

---

## MINUTE 5 — 6-Factor Matching + Multilingual Chat

**[Tab 3 ? "?? Flow Trace" ? Scenario 5 (Marathi/Telugu chat) ? Run]**

1. Show the translation flow animating:
   - Customer sends message in Marathi
   - Bhashini NMT translates to Telugu for worker
   - Worker replies in Telugu ? Marathi for customer
2. Back to **Tab 1 ? Customer ? Book a worker**:
   - Show "Why this worker?" card: 6 factor contributions
   - Top 3 factors listed in plain English
3. Switch to landing page **"?? Landing" tab in sim**:
   - Show R28 stat cards: 6.37L drivers, 23.5M workers, 9.7% keypad users
   - 0% Commission Calculator: show ?2,500 extra/month at 20 jobs × ?500

**Final line:** *"TaskLink: Sahakar se Samriddhi — where every keypad press is an economic vote for cooperative ownership."*

---

## Emergency Scenario (30s bonus if time allows)

1. **[Tab 3 ? Demo Controls ? Time Travel ? "11 PM + Holiday" ? Apply]**
2. **[Phone Sim ? "?? Emergency Job (Press 9)"]**
3. Show price breakdown: Base + Night +25% + Holiday +50% + Emergency +30% = **2.05x**
4. Show: worker payout 100% of 2.05x rate, platform commission = ?0.00

---

## Demo Logins (Dev Quick-Login)

| Role | Phone | OTP |
|------|-------|-----|
| Customer (Priya Rajan) | +91 98421 00010 | 123456 |
| Worker (Karthik, Electrician) | +91 98421 00001 | 123456 |
| Society Admin (Coimbatore Coop) | +91 99400 55000 | 123456 |
| Federation Admin | +91 99400 00100 | 123456 |
| Support Agent | +91 98421 00099 | 123456 |

> OTP 123456 works for all accounts in dev/demo mode.

---

## Simulated vs Real (Transparency)

| Feature | Demo Status | Required for Production |
|---------|------------|------------------------|
| Bhashini STT/NMT/TTS | Simulated (offline dictionary) | Bhashini production API key |
| Exotel IVR | Simulated (WebSocket mock) | Exotel commercial account |
| NPCI *99# USSD | Simulated (mock bank) | NPCI PSP agreement |
| Razorpay payments | Simulated (mock orders) | Razorpay test/prod keys |
| Telecom Cell-ID LBS | Simulated (seeded towers) | Telecom operator LBS agreement |
| Aadhaar eKYC | Simulated (mock UIDAI) | UIDAI AUA/KUA credentials |
| e-Shram API | Simulated (UAN validation) | Ministry of Labour API access |
| AWS S3 uploads | Simulated (base64 mock) | AWS credentials |
| PostgreSQL | Local Docker or cloud | PostGIS 3.4 on PostgreSQL 16 |

---

*Team TaskLink · 170331 · SIH26089 · Ministry of Cooperation · October 2026*
