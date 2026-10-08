-- TaskLink Core Database Schema
-- Ministry of Cooperation, SIH 2026 (Problem SIH26089)
-- PostGIS spatial extensions for rural & urban geo-matching

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Cooperative Federations (Tenancy root)
CREATE TABLE IF NOT EXISTS federations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Cooperative Societies
CREATE TABLE IF NOT EXISTS societies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    federation_id UUID NOT NULL REFERENCES federations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    contact_person VARCHAR(150),
    phone VARCHAR(20) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(30) NOT NULL CHECK (role IN ('customer', 'worker', 'group_lead', 'society_admin', 'federation_admin', 'platform_ops')),
    phone VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    language_code VARCHAR(10) DEFAULT 'en',
    phone_type VARCHAR(20) DEFAULT 'smartphone' CHECK (phone_type IN ('smartphone', 'keypad')),
    federation_id UUID REFERENCES federations(id) ON DELETE SET NULL,
    society_id UUID REFERENCES societies(id) ON DELETE SET NULL,
    dtmf_pin_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Service Categories
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100),
    name_ta VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    default_base_rate NUMERIC(10, 2) NOT NULL,
    default_daily_rate NUMERIC(10, 2) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    active BOOLEAN DEFAULT TRUE
);

-- 5. Workers
CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE RESTRICT,
    federation_id UUID NOT NULL REFERENCES federations(id) ON DELETE RESTRICT,
    phone_type VARCHAR(20) DEFAULT 'smartphone' CHECK (phone_type IN ('smartphone', 'keypad')),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'suspended')),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    avatar_url TEXT,
    bio TEXT,
    languages TEXT[] DEFAULT ARRAY['en'],
    years_experience INTEGER DEFAULT 1,
    payout_upi_id VARCHAR(100),
    payout_account_verified BOOLEAN DEFAULT FALSE,
    e_shram_number VARCHAR(50),
    e_shram_verified BOOLEAN DEFAULT FALSE,
    pmsby_covered BOOLEAN DEFAULT FALSE,
    pmjjby_covered BOOLEAN DEFAULT FALSE,
    rating_average NUMERIC(3, 2) DEFAULT 4.50,
    rating_count INTEGER DEFAULT 0,
    jobs_completed INTEGER DEFAULT 0,
    on_time_rate NUMERIC(3, 2) DEFAULT 0.95,
    completion_rate NUMERIC(3, 2) DEFAULT 0.98,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    geom geography(Point, 4326),
    service_radius_km NUMERIC(5, 2) DEFAULT 15.00,
    digipin VARCHAR(15),
    is_online BOOLEAN DEFAULT TRUE,
    available_nights BOOLEAN DEFAULT FALSE,
    accepts_emergency BOOLEAN DEFAULT FALSE,
    is_keypad_pre_book_only BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workers_geom ON workers USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_workers_status ON workers (verification_status, is_online);

-- 6. Worker Services & Skills
CREATE TABLE IF NOT EXISTS worker_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    experience_years INTEGER DEFAULT 1,
    hourly_rate NUMERIC(10, 2) NOT NULL,
    daily_rate NUMERIC(10, 2) NOT NULL,
    is_certified BOOLEAN DEFAULT FALSE,
    certificate_name VARCHAR(150),
    certificate_url TEXT,
    UNIQUE(worker_id, service_id)
);

-- 7. Worker Groups / Crews
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    crew_type VARCHAR(50) NOT NULL CHECK (crew_type IN ('construction', 'agriculture', 'cleaning', 'other')),
    lead_worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE RESTRICT,
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE RESTRICT,
    headcount INTEGER NOT NULL,
    daily_rate_per_person NUMERIC(10, 2) NOT NULL,
    rating_average NUMERIC(3, 2) DEFAULT 4.70,
    rating_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Group Members & Payout Shares
CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    payout_share_percent NUMERIC(5, 2) NOT NULL CHECK (payout_share_percent >= 0 AND payout_share_percent <= 100),
    confirmed_attendance BOOLEAN DEFAULT TRUE,
    UNIQUE(group_id, worker_id)
);

-- 9. Dynamic Pricing Configuration (Editable per Federation)
CREATE TABLE IF NOT EXISTS price_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    federation_id UUID NOT NULL REFERENCES federations(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    k_sensitivity NUMERIC(5, 2) DEFAULT 0.50,
    r0_baseline_ratio NUMERIC(5, 2) DEFAULT 1.00,
    surge_cap NUMERIC(5, 2) DEFAULT 1.50,
    refresh_interval_seconds INTEGER DEFAULT 120,
    quote_lock_minutes INTEGER DEFAULT 10,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Night and Holiday Premium Rules
CREATE TABLE IF NOT EXISTS premium_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    federation_id UUID NOT NULL REFERENCES federations(id) ON DELETE CASCADE,
    night_start_time TIME DEFAULT '22:00:00',
    night_end_time TIME DEFAULT '06:00:00',
    night_premium_rate NUMERIC(4, 2) DEFAULT 0.25, -- +25%
    holiday_premium_rate NUMERIC(4, 2) DEFAULT 0.50, -- +50%
    stacking_rule VARCHAR(30) DEFAULT 'additive' CHECK (stacking_rule IN ('additive', 'compounded', 'highest_only')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Government Holidays List (per state)
CREATE TABLE IF NOT EXISTS holidays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state VARCHAR(100) NOT NULL,
    holiday_date DATE NOT NULL,
    title VARCHAR(150) NOT NULL,
    UNIQUE(state, holiday_date)
);

-- 12. Six-Factor Matching Weights (Editable per Federation)
CREATE TABLE IF NOT EXISTS config_matching_weights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    federation_id UUID UNIQUE NOT NULL REFERENCES federations(id) ON DELETE CASCADE,
    weight_skill NUMERIC(4, 2) DEFAULT 0.25,
    weight_availability NUMERIC(4, 2) DEFAULT 0.20,
    weight_distance NUMERIC(4, 2) DEFAULT 0.20,
    weight_reliability NUMERIC(4, 2) DEFAULT 0.15,
    weight_workload NUMERIC(4, 2) DEFAULT 0.10,
    weight_customer_pref NUMERIC(4, 2) DEFAULT 0.10,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Bookings
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    crew_group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    booking_type VARCHAR(20) NOT NULL CHECK (booking_type IN ('scheduled', 'on_demand', 'emergency')),
    status VARCHAR(30) DEFAULT 'requested' CHECK (status IN ('requested', 'offered', 'accepted', 'on_the_way', 'in_progress', 'completed', 'cancelled', 'disputed')),
    scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end_time TIMESTAMP WITH TIME ZONE,
    address_text TEXT NOT NULL,
    digipin VARCHAR(15),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    geom geography(Point, 4326),
    base_rate NUMERIC(10, 2) NOT NULL,
    surge_multiplier NUMERIC(4, 2) DEFAULT 1.00,
    surge_amount NUMERIC(10, 2) DEFAULT 0.00,
    is_night_time BOOLEAN DEFAULT FALSE,
    night_premium_amount NUMERIC(10, 2) DEFAULT 0.00,
    is_holiday BOOLEAN DEFAULT FALSE,
    holiday_premium_amount NUMERIC(10, 2) DEFAULT 0.00,
    worker_receives NUMERIC(10, 2) NOT NULL,
    platform_commission NUMERIC(10, 2) DEFAULT 0.00,
    payment_gateway_fee NUMERIC(10, 2) DEFAULT 0.00,
    total_payable NUMERIC(10, 2) NOT NULL,
    match_score NUMERIC(4, 3),
    match_breakdown JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_geom ON bookings USING GIST (geom);

-- 14. Payments Table - WITH HARD DATABASE CONSTRAINT ENFORCING 0% COMMISSION
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    total_amount NUMERIC(10, 2) NOT NULL,
    worker_amount NUMERIC(10, 2) NOT NULL,
    platform_commission NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    gateway_fee NUMERIC(10, 2) DEFAULT 0.00,
    payment_method VARCHAR(30) DEFAULT 'upi' CHECK (payment_method IN ('upi', 'ussd_99', 'card', 'netbanking')),
    gateway_provider VARCHAR(30) DEFAULT 'razorpay' CHECK (gateway_provider IN ('razorpay', 'cashfree', 'npci_ussd')),
    transaction_reference VARCHAR(150),
    virtual_upi_id VARCHAR(100),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'refunded', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- CRITICAL PPT REQUIREMENT F1: Zero-Commission Enforcement in Database
    CONSTRAINT check_zero_platform_commission CHECK (platform_commission = 0.00)
);

-- 15. Payouts to Workers / Crew Members
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE RESTRICT,
    amount NUMERIC(10, 2) NOT NULL,
    payout_method VARCHAR(30) DEFAULT 'upi' CHECK (payout_method IN ('upi', 'bank_transfer', 'ussd_balance')),
    recipient_vpa VARCHAR(100),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    gateway_payout_id VARCHAR(150),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Immutable Financial Ledger
CREATE TABLE IF NOT EXISTS ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_number BIGSERIAL,
    booking_id UUID REFERENCES bookings(id),
    payment_id UUID REFERENCES payments(id),
    payout_id UUID REFERENCES payouts(id),
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('customer_receivable', 'worker_payable', 'platform_commission_pool', 'gateway_pass_through')),
    debit NUMERIC(10, 2) DEFAULT 0.00,
    credit NUMERIC(10, 2) DEFAULT 0.00,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Reviews and Ratings
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    comment TEXT,
    translated_comment TEXT,
    worker_reply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. Worker Portfolio (Before & After Photos)
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. DPDP Act 2023 Consent Ledger
CREATE TABLE IF NOT EXISTS consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    purpose VARCHAR(50) NOT NULL CHECK (purpose IN ('approximate_location', 'call_recording_transcript', 'communications')),
    language_shown VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'granted' CHECK (status IN ('granted', 'withdrawn')),
    channel VARCHAR(30) DEFAULT 'mobile_app' CHECK (channel IN ('mobile_app', 'ivr_voice', 'web')),
    ip_address VARCHAR(50),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    withdrawn_at TIMESTAMP WITH TIME ZONE
);

-- 20. Worker Welfare Ledger & Incentive Rules
CREATE TABLE IF NOT EXISTS welfare_incentive_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    federation_id UUID NOT NULL REFERENCES federations(id) ON DELETE CASCADE,
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('night_shift', 'surge_shift', 'rating_milestone', 'emergency_dispatch')),
    credit_amount NUMERIC(10, 2) NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS welfare_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id),
    e_shram_number VARCHAR(50),
    credit_amount NUMERIC(10, 2) NOT NULL,
    reason VARCHAR(150) NOT NULL,
    funding_source VARCHAR(100) DEFAULT 'federation_subscription_pool',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 21. Federation Flat Subscriptions (No per-job fee)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    federation_id UUID NOT NULL REFERENCES federations(id) ON DELETE CASCADE,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'overdue')),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 22. Audit Logs
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
