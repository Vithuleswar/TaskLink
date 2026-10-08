-- TaskLink Comprehensive Seed Data
-- 2 Federations, 3 Cooperative Societies, 24 Verified Workers (6 Keypad, 18 Smartphone)
-- 4 Crews, Before/After Portfolios, 0% Platform Commission Guarantee

INSERT INTO federations (id, name, code, district, state, contact_email, contact_phone)
VALUES ('f1111111-1111-1111-1111-111111111101', 'Coimbatore District Labour Cooperative Federation', 'CDLCF-01', 'Coimbatore', 'Tamil Nadu', 'admin@coimbatorecoop.org.in', '+91 422 2304911')
ON CONFLICT (id) DO NOTHING;
INSERT INTO federations (id, name, code, district, state, contact_email, contact_phone)
VALUES ('f1111111-1111-1111-1111-111111111102', 'Tirupur District Labour & Construction Cooperative Federation', 'TDLCCF-02', 'Tirupur', 'Tamil Nadu', 'secretariat@tirupurcoop.org.in', '+91 421 2218702')
ON CONFLICT (id) DO NOTHING;

INSERT INTO societies (id, federation_id, name, registration_number, address, district, contact_person, phone)
VALUES ('s1111111-1111-1111-1111-111111111101', 'f1111111-1111-1111-1111-111111111101', 'Kongu Artisans & Electrical Labour Cooperative Society', 'TN/CBE/CS-2018/441', '42 Crosscut Road, Gandhipuram, Coimbatore 641012', 'Coimbatore', 'S. Ramanathan', '+91 98422 11001')
ON CONFLICT (id) DO NOTHING;
INSERT INTO societies (id, federation_id, name, registration_number, address, district, contact_person, phone)
VALUES ('s1111111-1111-1111-1111-111111111102', 'f1111111-1111-1111-1111-111111111102', 'Noyyal Plumbers & Carpenters Guild Cooperative', 'TN/TPR/CS-2020/812', '15 Avinashi Road, Kumar Nagar, Tirupur 641603', 'Tirupur', 'M. Palanisamy', '+91 98433 22002')
ON CONFLICT (id) DO NOTHING;
INSERT INTO societies (id, federation_id, name, registration_number, address, district, contact_person, phone)
VALUES ('s1111111-1111-1111-1111-111111111103', 'f1111111-1111-1111-1111-111111111101', 'Siruvani Rural Multi-Trades Cooperative Society', 'TN/CBE/CS-2022/903', '8 Trichy Road, Sulur, Coimbatore 641402', 'Coimbatore', 'K. Murugesan', '+91 98425 33003')
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('11111111-1111-1111-1111-111111111101', 'ELEC', 'Electrician', 'इलेक्ट्रीशियन', 'மின்பணியாளர்', 'Electrical', 350, 1800, 'zap')
ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('11111111-1111-1111-1111-111111111102', 'PLUMB', 'Plumber', 'प्लंबर', 'குழாய்ப் பணியாளர்', 'Plumbing', 300, 1600, 'droplet')
ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('11111111-1111-1111-1111-111111111103', 'CARP', 'Carpenter', 'बढ़ई', 'தச்சர்', 'Carpentry', 400, 2000, 'hammer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('11111111-1111-1111-1111-111111111104', 'PAINT', 'Painter', 'पेंटर', 'வண்ணப்பூச்சாளர்', 'Painting', 350, 1800, 'paint-roller')
ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('11111111-1111-1111-1111-111111111105', 'DOMHELP', 'Domestic Helper', 'घरेलू सहायक', 'வீட்டுப் பணியாளர்', 'Domestic', 200, 1000, 'home')
ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('11111111-1111-1111-1111-111111111106', 'CAREGIVER', 'Caregiver', 'देखभालकर्ता', 'பராமரிப்பாளர்', 'Care', 450, 2200, 'heart')
ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('11111111-1111-1111-1111-111111111107', 'DRIVER', 'Driver', 'चालक', 'ஓட்டுநர்', 'Transport', 300, 1500, 'truck')
ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('11111111-1111-1111-1111-111111111108', 'GARDENER', 'Gardener', 'माली', 'தோட்டக்காரர்', 'Gardening', 250, 1200, 'flower')
ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('11111111-1111-1111-1111-111111111109', 'CLEAN', 'Deep Cleaner', 'सफाई कर्मी', 'துப்புரவுப் பணியாளர்', 'Cleaning', 250, 1300, 'sparkles')
ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('11111111-1111-1111-1111-111111111110', 'TECH', 'Appliance Technician', 'उपकरण तकनीशियन', 'பழுதுபார்ப்பாளர்', 'Appliances', 400, 2100, 'tool')
ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('11111111-1111-1111-1111-111111111111', 'CONST_CREW', 'Construction Crew', 'निर्माण श्रमिक दल', 'கட்டுமானக் குழு', 'Group Labour', 2500, 12000, 'hard-hat')
ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('11111111-1111-1111-1111-111111111112', 'AGRI_CREW', 'Agricultural Harvest Crew', 'कृषि श्रमिक दल', 'விவசாய அறுவடைக் குழு', 'Group Labour', 2000, 10000, 'wheat')
ON CONFLICT (id) DO NOTHING;

INSERT INTO config_matching_weights (federation_id, weight_skill, weight_availability, weight_distance, weight_reliability, weight_workload, weight_customer_pref)
VALUES ('f1111111-1111-1111-1111-111111111101', 0.25, 0.20, 0.20, 0.15, 0.10, 0.10)
ON CONFLICT (federation_id) DO UPDATE SET weight_skill = EXCLUDED.weight_skill;
INSERT INTO price_rules (federation_id, k_sensitivity, r0_baseline_ratio, surge_cap, refresh_interval_seconds, quote_lock_minutes)
VALUES ('f1111111-1111-1111-1111-111111111101', 0.50, 1.00, 1.50, 120, 10)
ON CONFLICT DO NOTHING;
INSERT INTO premium_rules (federation_id, night_start_time, night_end_time, night_premium_rate, holiday_premium_rate, stacking_rule)
VALUES ('f1111111-1111-1111-1111-111111111101', '22:00:00', '06:00:00', 0.25, 0.50, 'additive')
ON CONFLICT DO NOTHING;
INSERT INTO config_matching_weights (federation_id, weight_skill, weight_availability, weight_distance, weight_reliability, weight_workload, weight_customer_pref)
VALUES ('f1111111-1111-1111-1111-111111111102', 0.25, 0.20, 0.20, 0.15, 0.10, 0.10)
ON CONFLICT (federation_id) DO UPDATE SET weight_skill = EXCLUDED.weight_skill;
INSERT INTO price_rules (federation_id, k_sensitivity, r0_baseline_ratio, surge_cap, refresh_interval_seconds, quote_lock_minutes)
VALUES ('f1111111-1111-1111-1111-111111111102', 0.50, 1.00, 1.50, 120, 10)
ON CONFLICT DO NOTHING;
INSERT INTO premium_rules (federation_id, night_start_time, night_end_time, night_premium_rate, holiday_premium_rate, stacking_rule)
VALUES ('f1111111-1111-1111-1111-111111111102', '22:00:00', '06:00:00', 0.25, 0.50, 'additive')
ON CONFLICT DO NOTHING;

-- Worker 1: Karthik Subramanian (smartphone, 3MQ-5J9-5M7M)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220001', 'worker', '+91 9842100001', 'Karthik Subramanian', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111101')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330001', 'u2222222-2222-2222-2222-222222220001', 's1111111-1111-1111-1111-111111111101', 'f1111111-1111-1111-1111-111111111101', 'smartphone', 'verified', NOW(),
  9, 'karthiksubramanian@upi', TRUE, 'UAN 2026 1000 4000', TRUE,
  TRUE, TRUE, 4.88, 99, 142, 0.96, 0.99,
  11.0185, 76.9634, ST_SetSRID(ST_MakePoint(76.9634, 11.0185), 4326),
  '3MQ-5J9-5M7M', true, true, true, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330001', '11111111-1111-1111-1111-111111111101', 9, 350, 1800, TRUE, 'Govt Wireman Licence Class-A')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 2: P. Velmurugan (smartphone, 3MQ-5J3-5FF3)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220002', 'worker', '+91 9842100002', 'P. Velmurugan', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111101')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330002', 'u2222222-2222-2222-2222-222222220002', 's1111111-1111-1111-1111-111111111101', 'f1111111-1111-1111-1111-111111111101', 'smartphone', 'verified', NOW(),
  12, 'pvelmurugan@upi', TRUE, 'UAN 2026 1001 4001', TRUE,
  TRUE, TRUE, 4.79, 150, 215, 0.96, 0.99,
  11.0092, 76.9458, ST_SetSRID(ST_MakePoint(76.9458, 11.0092), 4326),
  '3MQ-5J3-5FF3', true, false, true, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330002', '11111111-1111-1111-1111-111111111102', 12, 300, 1600, TRUE, 'National Skill Development Corp (NSDC) Level 4')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 3: R. Selvaraj (smartphone, 3PL-2CF-3J9C)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220003', 'worker', '+91 9842100003', 'R. Selvaraj', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111101')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330003', 'u2222222-2222-2222-2222-222222220003', 's1111111-1111-1111-1111-111111111101', 'f1111111-1111-1111-1111-111111111101', 'smartphone', 'verified', NOW(),
  15, 'rselvaraj@upi', TRUE, 'UAN 2026 1002 4002', TRUE,
  TRUE, TRUE, 4.92, 217, 310, 0.96, 0.99,
  11.0267, 77.0125, ST_SetSRID(ST_MakePoint(77.0125, 11.0267), 4326),
  '3PL-2CF-3J9C', true, false, false, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330003', '11111111-1111-1111-1111-111111111103', 15, 400, 2000, TRUE, 'ITI Modular Carpenter Certification')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 4: Arumugam Natarajan (keypad, 3PL-26Q-268F)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220004', 'worker', '+91 9842100004', 'Arumugam Natarajan', 'ta', 'keypad', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111103')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330004', 'u2222222-2222-2222-2222-222222220004', 's1111111-1111-1111-1111-111111111103', 'f1111111-1111-1111-1111-111111111101', 'keypad', 'verified', NOW(),
  18, 'arumugamnatarajan@upi', TRUE, 'UAN 2026 1003 4003', TRUE,
  TRUE, TRUE, 4.65, 125, 180, 0.96, 0.99,
  10.9998, 77.0267, ST_SetSRID(ST_MakePoint(77.0267, 10.9998), 4326),
  '3PL-26Q-268F', false, false, false, true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330004', '11111111-1111-1111-1111-111111111104', 18, 350, 1800, TRUE, 'Cooperative Master Painter Badge')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 5: M. Chinnasamy (keypad, 3PL-2KJ-7J6F)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220005', 'worker', '+91 9842100005', 'M. Chinnasamy', 'ta', 'keypad', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111103')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330005', 'u2222222-2222-2222-2222-222222220005', 's1111111-1111-1111-1111-111111111103', 'f1111111-1111-1111-1111-111111111101', 'keypad', 'verified', NOW(),
  14, 'mchinnasamy@upi', TRUE, 'UAN 2026 1004 4004', TRUE,
  TRUE, TRUE, 4.55, 94, 135, 0.96, 0.99,
  11.0289, 77.1264, ST_SetSRID(ST_MakePoint(77.1264, 11.0289), 4326),
  '3PL-2KJ-7J6F', false, false, false, true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330005', '11111111-1111-1111-1111-111111111108', 14, 250, 1200, TRUE, 'Horticulture Society Certified')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 6: S. Divya (smartphone, 3MQ-955-335K)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220006', 'worker', '+91 9842100006', 'S. Divya', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111101')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330006', 'u2222222-2222-2222-2222-222222220006', 's1111111-1111-1111-1111-111111111101', 'f1111111-1111-1111-1111-111111111101', 'smartphone', 'verified', NOW(),
  6, 'sdivya@upi', TRUE, 'UAN 2026 1005 4005', TRUE,
  TRUE, TRUE, 4.85, 68, 98, 0.96, 0.99,
  11.0782, 76.9945, ST_SetSRID(ST_MakePoint(76.9945, 11.0782), 4326),
  '3MQ-955-335K', true, true, true, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330006', '11111111-1111-1111-1111-111111111110', 6, 400, 2100, TRUE, 'Samsung & LG Certified Service Tech')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 7: K. Lakshmi (smartphone, 3MQ-5JF-74QK)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220007', 'worker', '+91 9842100007', 'K. Lakshmi', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111101')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330007', 'u2222222-2222-2222-2222-222222220007', 's1111111-1111-1111-1111-111111111101', 'f1111111-1111-1111-1111-111111111101', 'smartphone', 'verified', NOW(),
  7, 'klakshmi@upi', TRUE, 'UAN 2026 1006 4006', TRUE,
  TRUE, TRUE, 4.7, 58, 84, 0.96, 0.99,
  11.0281, 76.9423, ST_SetSRID(ST_MakePoint(76.9423, 11.0281), 4326),
  '3MQ-5JF-74QK', true, false, false, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330007', '11111111-1111-1111-1111-111111111105', 7, 200, 1000, TRUE, 'Cooperative Care & Sanitation Badge')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 8: J. Mariappan (smartphone, 3MQ-556-JKJ7)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220008', 'worker', '+91 9842100008', 'J. Mariappan', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111103')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330008', 'u2222222-2222-2222-2222-222222220008', 's1111111-1111-1111-1111-111111111103', 'f1111111-1111-1111-1111-111111111101', 'smartphone', 'verified', NOW(),
  11, 'jmariappan@upi', TRUE, 'UAN 2026 1007 4007', TRUE,
  TRUE, TRUE, 4.62, 112, 160, 0.96, 0.99,
  10.9521, 76.9712, ST_SetSRID(ST_MakePoint(76.9712, 10.9521), 4326),
  '3MQ-556-JKJ7', true, true, true, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330008', '11111111-1111-1111-1111-111111111107', 11, 300, 1500, TRUE, 'Commercial Badge Heavy/Light PSV')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 9: V. Senthilkumar (keypad, 3MQ-5KM-MM2K)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220009', 'worker', '+91 9842100009', 'V. Senthilkumar', 'ta', 'keypad', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111101')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330009', 'u2222222-2222-2222-2222-222222220009', 's1111111-1111-1111-1111-111111111101', 'f1111111-1111-1111-1111-111111111101', 'keypad', 'verified', NOW(),
  8, 'vsenthilkumar@upi', TRUE, 'UAN 2026 1008 4008', TRUE,
  TRUE, TRUE, 4.4, 50, 72, 0.96, 0.99,
  11.0425, 76.9765, ST_SetSRID(ST_MakePoint(76.9765, 11.0425), 4326),
  '3MQ-5KM-MM2K', false, false, false, true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330009', '11111111-1111-1111-1111-111111111101', 8, 350, 1800, TRUE, 'Tamil Nadu Electricity Board (TNEB) Apprentice')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 10: P. Kavitha (smartphone, 3PL-2C8-L47J)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220010', 'worker', '+91 9842100010', 'P. Kavitha', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111103')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330010', 'u2222222-2222-2222-2222-222222220010', 's1111111-1111-1111-1111-111111111103', 'f1111111-1111-1111-1111-111111111101', 'smartphone', 'verified', NOW(),
  5, 'pkavitha@upi', TRUE, 'UAN 2026 1009 4009', TRUE,
  TRUE, TRUE, 4.75, 78, 112, 0.96, 0.99,
  11.0234, 77.0189, ST_SetSRID(ST_MakePoint(77.0189, 11.0234), 4326),
  '3PL-2C8-L47J', true, false, false, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330010', '11111111-1111-1111-1111-111111111109', 5, 250, 1300, TRUE, 'Industrial Hygiene Certified')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 11: D. Ganesan (smartphone, 3MQ-943-3L5Q)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220011', 'worker', '+91 9842100011', 'D. Ganesan', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111101')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330011', 'u2222222-2222-2222-2222-222222220011', 's1111111-1111-1111-1111-111111111101', 'f1111111-1111-1111-1111-111111111101', 'smartphone', 'verified', NOW(),
  10, 'dganesan@upi', TRUE, 'UAN 2026 1010 4010', TRUE,
  TRUE, TRUE, 4.58, 91, 130, 0.96, 0.99,
  11.0799, 76.9412, ST_SetSRID(ST_MakePoint(76.9412, 11.0799), 4326),
  '3MQ-943-3L5Q', true, true, true, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330011', '11111111-1111-1111-1111-111111111102', 10, 300, 1600, TRUE, 'CPVC & Hydrostatic Testing Certified')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 12: Anitha Ramesh (smartphone, 3MK-QPM-6CJM)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220012', 'worker', '+91 9842100012', 'Anitha Ramesh', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111103')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330012', 'u2222222-2222-2222-2222-222222220012', 's1111111-1111-1111-1111-111111111103', 'f1111111-1111-1111-1111-111111111101', 'smartphone', 'verified', NOW(),
  8, 'anitharamesh@upi', TRUE, 'UAN 2026 1011 4011', TRUE,
  TRUE, TRUE, 4.9, 45, 65, 0.96, 0.99,
  10.9324, 76.9388, ST_SetSRID(ST_MakePoint(76.9388, 10.9324), 4326),
  '3MK-QPM-6CJM', true, true, true, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330012', '11111111-1111-1111-1111-111111111106', 8, 450, 2200, TRUE, 'St John Ambulance First Aid & Geriatric Care')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 13: M. Anand (smartphone, 3PL-83Q-776P)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220013', 'worker', '+91 9843100013', 'M. Anand', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111102')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330013', 'u2222222-2222-2222-2222-222222220013', 's1111111-1111-1111-1111-111111111102', 'f1111111-1111-1111-1111-111111111102', 'smartphone', 'verified', NOW(),
  10, 'manand@upi', TRUE, 'UAN 2026 1012 4012', TRUE,
  TRUE, TRUE, 4.82, 122, 175, 0.96, 0.99,
  11.1075, 77.3456, ST_SetSRID(ST_MakePoint(77.3456, 11.1075), 4326),
  '3PL-83Q-776P', true, true, true, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330013', '11111111-1111-1111-1111-111111111101', 10, 350, 1800, TRUE, 'Industrial Panel & HT Wiring Certified')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 14: G. Ponraj (keypad, 3PL-875-5K3M)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220014', 'worker', '+91 9843100014', 'G. Ponraj', 'ta', 'keypad', 'f1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111102')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330014', 'u2222222-2222-2222-2222-222222220014', 's1111111-1111-1111-1111-111111111102', 'f1111111-1111-1111-1111-111111111102', 'keypad', 'verified', NOW(),
  16, 'gponraj@upi', TRUE, 'UAN 2026 1013 4013', TRUE,
  TRUE, TRUE, 4.45, 98, 140, 0.96, 0.99,
  11.1145, 77.3512, ST_SetSRID(ST_MakePoint(77.3512, 11.1145), 4326),
  '3PL-875-5K3M', false, false, false, true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330014', '11111111-1111-1111-1111-111111111103', 16, 400, 2000, TRUE, 'Timber Joinery Guild Certified')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 15: K. Sureshbabu (smartphone, 3PL-877-8C7J)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220015', 'worker', '+91 9843100015', 'K. Sureshbabu', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111102')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330015', 'u2222222-2222-2222-2222-222222220015', 's1111111-1111-1111-1111-111111111102', 'f1111111-1111-1111-1111-111111111102', 'smartphone', 'verified', NOW(),
  13, 'ksureshbabu@upi', TRUE, 'UAN 2026 1014 4014', TRUE,
  TRUE, TRUE, 4.89, 168, 240, 0.96, 0.99,
  11.1256, 77.3298, ST_SetSRID(ST_MakePoint(77.3298, 11.1256), 4326),
  '3PL-877-8C7J', true, false, false, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330015', '11111111-1111-1111-1111-111111111104', 13, 350, 1800, TRUE, 'Asian Paints Pro Master Applicator')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 16: S. Muthuvel (keypad, 3PL-844-L5J5)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220016', 'worker', '+91 9843100016', 'S. Muthuvel', 'ta', 'keypad', 'f1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111102')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330016', 'u2222222-2222-2222-2222-222222220016', 's1111111-1111-1111-1111-111111111102', 'f1111111-1111-1111-1111-111111111102', 'keypad', 'verified', NOW(),
  6, 'smuthuvel@upi', TRUE, 'UAN 2026 1015 4015', TRUE,
  TRUE, TRUE, 3.85, 31, 45, 0.96, 0.99,
  11.085, 77.3712, ST_SetSRID(ST_MakePoint(77.3712, 11.085), 4326),
  '3PL-844-L5J5', false, false, false, true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330016', '11111111-1111-1111-1111-111111111102', 6, 300, 1600, TRUE, 'Basic Plumbing Trade Certificate')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 17: C. Thangaraj (smartphone, 3PL-4MM-8854)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220017', 'worker', '+91 9843100017', 'C. Thangaraj', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111102')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330017', 'u2222222-2222-2222-2222-222222220017', 's1111111-1111-1111-1111-111111111102', 'f1111111-1111-1111-1111-111111111102', 'smartphone', 'verified', NOW(),
  9, 'cthangaraj@upi', TRUE, 'UAN 2026 1016 4016', TRUE,
  TRUE, TRUE, 4.78, 136, 195, 0.96, 0.99,
  11.0721, 77.3312, ST_SetSRID(ST_MakePoint(77.3312, 11.0721), 4326),
  '3PL-4MM-8854', true, true, true, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330017', '11111111-1111-1111-1111-111111111107', 9, 300, 1500, TRUE, 'Safe Commercial Driving Honours')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 18: T. Boopathi (smartphone, 3PL-8FQ-8K2J)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220018', 'worker', '+91 9843100018', 'T. Boopathi', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111102')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330018', 'u2222222-2222-2222-2222-222222220018', 's1111111-1111-1111-1111-111111111102', 'f1111111-1111-1111-1111-111111111102', 'smartphone', 'verified', NOW(),
  17, 'tboopathi@upi', TRUE, 'UAN 2026 1017 4017', TRUE,
  TRUE, TRUE, 4.86, 196, 280, 0.96, 0.99,
  11.1782, 77.3489, ST_SetSRID(ST_MakePoint(77.3489, 11.1782), 4326),
  '3PL-8FQ-8K2J', true, false, false, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330018', '11111111-1111-1111-1111-111111111111', 17, 2500, 12000, TRUE, 'Govt Certified Mason Master Class')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 19: N. Kandasamy (keypad, 3PL-87L-4CM7)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220019', 'worker', '+91 9843100019', 'N. Kandasamy', 'ta', 'keypad', 'f1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111102')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330019', 'u2222222-2222-2222-2222-222222220019', 's1111111-1111-1111-1111-111111111102', 'f1111111-1111-1111-1111-111111111102', 'keypad', 'verified', NOW(),
  11, 'nkandasamy@upi', TRUE, 'UAN 2026 1018 4018', TRUE,
  TRUE, TRUE, 4.1, 42, 60, 0.96, 0.99,
  11.1412, 77.321, ST_SetSRID(ST_MakePoint(77.321, 11.1412), 4326),
  '3PL-87L-4CM7', false, false, false, true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330019', '11111111-1111-1111-1111-111111111110', 11, 400, 2100, TRUE, 'Brass & Motor Machinery Welder')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 20: R. Dharmalingam (smartphone, 3PL-9C8-8JL7)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220020', 'worker', '+91 9843100020', 'R. Dharmalingam', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111102')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330020', 'u2222222-2222-2222-2222-222222220020', 's1111111-1111-1111-1111-111111111102', 'f1111111-1111-1111-1111-111111111102', 'smartphone', 'verified', NOW(),
  20, 'rdharmalingam@upi', TRUE, 'UAN 2026 1019 4019', TRUE,
  TRUE, TRUE, 4.91, 244, 350, 0.96, 0.99,
  11.161, 77.445, ST_SetSRID(ST_MakePoint(77.445, 11.161), 4326),
  '3PL-9C8-8JL7', true, false, false, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330020', '11111111-1111-1111-1111-111111111112', 20, 2000, 10000, TRUE, 'Agricultural Cooperative Farm Lead')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 21: B. Manikandan (smartphone, 3PL-754-6Q2P)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220021', 'worker', '+91 9843100021', 'B. Manikandan', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111102')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330021', 'u2222222-2222-2222-2222-222222220021', 's1111111-1111-1111-1111-111111111102', 'f1111111-1111-1111-1111-111111111102', 'smartphone', 'verified', NOW(),
  7, 'bmanikandan@upi', TRUE, 'UAN 2026 1020 4020', TRUE,
  TRUE, TRUE, 4.68, 62, 89, 0.96, 0.99,
  11.0821, 77.2654, ST_SetSRID(ST_MakePoint(77.2654, 11.0821), 4326),
  '3PL-754-6Q2P', true, false, true, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330021', '11111111-1111-1111-1111-111111111102', 7, 300, 1600, TRUE, 'Sanitary Sewerage Specialist')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 22: S. Prabhakaran (smartphone, 3PL-7Q4-PMP9)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220022', 'worker', '+91 9843100022', 'S. Prabhakaran', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111102', 's1111111-1111-1111-1111-111111111102')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330022', 'u2222222-2222-2222-2222-222222220022', 's1111111-1111-1111-1111-111111111102', 'f1111111-1111-1111-1111-111111111102', 'smartphone', 'verified', NOW(),
  8, 'sprabhakaran@upi', TRUE, 'UAN 2026 1021 4021', TRUE,
  TRUE, TRUE, 4.74, 72, 104, 0.96, 0.99,
  11.1923, 77.269, ST_SetSRID(ST_MakePoint(77.269, 11.1923), 4326),
  '3PL-7Q4-PMP9', true, true, true, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330022', '11111111-1111-1111-1111-111111111101', 8, 350, 1800, TRUE, 'Solar Rooftop & Inverter Certified')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 23: K. Rajendran (smartphone, 3PL-37K-LCF2)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220023', 'worker', '+91 9843100023', 'K. Rajendran', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111103')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330023', 'u2222222-2222-2222-2222-222222220023', 's1111111-1111-1111-1111-111111111103', 'f1111111-1111-1111-1111-111111111101', 'smartphone', 'verified', NOW(),
  14, 'krajendran@upi', TRUE, 'UAN 2026 1022 4022', TRUE,
  TRUE, TRUE, 4.8, 115, 165, 0.96, 0.99,
  10.9982, 77.2023, ST_SetSRID(ST_MakePoint(77.2023, 10.9982), 4326),
  '3PL-37K-LCF2', true, false, false, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330023', '11111111-1111-1111-1111-111111111103', 14, 400, 2000, TRUE, 'Modular Kitchen & CNC Fabricator')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Worker 24: Meenakshi Sundaram (smartphone, 3PC-LMC-9C88)
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('u2222222-2222-2222-2222-222222220024', 'worker', '+91 9842100024', 'Meenakshi Sundaram', 'ta', 'smartphone', 'f1111111-1111-1111-1111-111111111101', 's1111111-1111-1111-1111-111111111103')
ON CONFLICT (id) DO NOTHING;
INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  'w3333333-3333-3333-3333-333333330024', 'u2222222-2222-2222-2222-222222220024', 's1111111-1111-1111-1111-111111111103', 'f1111111-1111-1111-1111-111111111101', 'smartphone', 'verified', NOW(),
  12, 'meenakshisundaram@upi', TRUE, 'UAN 2026 1023 4023', TRUE,
  TRUE, TRUE, 4.95, 77, 110, 0.96, 0.99,
  10.9234, 77.0421, ST_SetSRID(ST_MakePoint(77.0421, 10.9234), 4326),
  '3PC-LMC-9C88', true, true, true, false
) ON CONFLICT (id) DO NOTHING;
INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('w3333333-3333-3333-3333-333333330024', '11111111-1111-1111-1111-111111111106', 12, 450, 2200, TRUE, 'Red Cross Certified Home Health Aide')
ON CONFLICT (worker_id, service_id) DO NOTHING;

-- Crew: Tirupur Masonry & Reinforcement Crew
INSERT INTO groups (id, name, crew_type, lead_worker_id, society_id, headcount, daily_rate_per_person, rating_average, rating_count, active)
VALUES ('c4444444-4444-4444-4444-444444440001', 'Tirupur Masonry & Reinforcement Crew', 'construction', 'w3333333-3333-3333-3333-333333330018', 's1111111-1111-1111-1111-111111111102', 4, 1800, 4.88, 42, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('c4444444-4444-4444-4444-444444440001', 'w3333333-3333-3333-3333-333333330018', 30, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;
INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('c4444444-4444-4444-4444-444444440001', 'w3333333-3333-3333-3333-333333330014', 25, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;
INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('c4444444-4444-4444-4444-444444440001', 'w3333333-3333-3333-3333-333333330015', 25, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;
INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('c4444444-4444-4444-4444-444444440001', 'w3333333-3333-3333-3333-333333330016', 20, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;

-- Crew: Siruvani Organic Farm Harvest Crew
INSERT INTO groups (id, name, crew_type, lead_worker_id, society_id, headcount, daily_rate_per_person, rating_average, rating_count, active)
VALUES ('c4444444-4444-4444-4444-444444440002', 'Siruvani Organic Farm Harvest Crew', 'agriculture', 'w3333333-3333-3333-3333-333333330020', 's1111111-1111-1111-1111-111111111102', 3, 1500, 4.92, 42, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('c4444444-4444-4444-4444-444444440002', 'w3333333-3333-3333-3333-333333330020', 40, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;
INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('c4444444-4444-4444-4444-444444440002', 'w3333333-3333-3333-3333-333333330005', 30, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;
INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('c4444444-4444-4444-4444-444444440002', 'w3333333-3333-3333-3333-333333330008', 30, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;

-- Crew: Gandhipuram Deep Clean & Sanitise Team
INSERT INTO groups (id, name, crew_type, lead_worker_id, society_id, headcount, daily_rate_per_person, rating_average, rating_count, active)
VALUES ('c4444444-4444-4444-4444-444444440003', 'Gandhipuram Deep Clean & Sanitise Team', 'cleaning', 'w3333333-3333-3333-3333-333333330010', 's1111111-1111-1111-1111-111111111103', 2, 1400, 4.78, 42, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('c4444444-4444-4444-4444-444444440003', 'w3333333-3333-3333-3333-333333330010', 55, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;
INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('c4444444-4444-4444-4444-444444440003', 'w3333333-3333-3333-3333-333333330007', 45, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;

-- Crew: Kongu Home Renovation Finishing Crew
INSERT INTO groups (id, name, crew_type, lead_worker_id, society_id, headcount, daily_rate_per_person, rating_average, rating_count, active)
VALUES ('c4444444-4444-4444-4444-444444440004', 'Kongu Home Renovation Finishing Crew', 'construction', 'w3333333-3333-3333-3333-333333330003', 's1111111-1111-1111-1111-111111111101', 3, 1900, 4.9, 42, TRUE)
ON CONFLICT (id) DO NOTHING;
INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('c4444444-4444-4444-4444-444444440004', 'w3333333-3333-3333-3333-333333330003', 40, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;
INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('c4444444-4444-4444-4444-444444440004', 'w3333333-3333-3333-3333-333333330001', 30, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;
INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('c4444444-4444-4444-4444-444444440004', 'w3333333-3333-3333-3333-333333330002', 30, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;

INSERT INTO portfolio_items (id, worker_id, title, description, before_image_url, after_image_url)
VALUES ('p5555555-5555-5555-5555-555555550001', 'w3333333-3333-3333-3333-333333330001', 'Complete Industrial Power Distribution Rewiring', 'Upgraded vintage fuse board to RCCB/MCB distribution panel in Peelamedu workshop.', 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&q=80', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80')
ON CONFLICT (id) DO NOTHING;
INSERT INTO portfolio_items (id, worker_id, title, description, before_image_url, after_image_url)
VALUES ('p5555555-5555-5555-5555-555555550002', 'w3333333-3333-3333-3333-333333330002', 'High-Pressure Overhead Tank Booster & Leak Repair', 'Replaced corroded galvanized iron risers with CPVC pipeline and automated level controller.', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80')
ON CONFLICT (id) DO NOTHING;
INSERT INTO portfolio_items (id, worker_id, title, description, before_image_url, after_image_url)
VALUES ('p5555555-5555-5555-5555-555555550003', 'w3333333-3333-3333-3333-333333330003', 'Custom Teak Modular Wardrobe and Study Nook', 'Designed and installed termite-resistant engineered hardwood wardrobe with soft-close hinges.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80')
ON CONFLICT (id) DO NOTHING;
INSERT INTO portfolio_items (id, worker_id, title, description, before_image_url, after_image_url)
VALUES ('p5555555-5555-5555-5555-555555550004', 'w3333333-3333-3333-3333-333333330015', 'Monsoon-Proof Exterior Elastomeric Weathercoat', 'High-pressure wash, crack filling and two-coat premium anti-fungal paint on 3-storey building.', 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&q=80', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- Federation Subscriptions (Flat Fee - No Per Job Cuts)
INSERT INTO subscriptions (federation_id, billing_period_start, billing_period_end, amount, status, invoice_number)
VALUES
('f1111111-1111-1111-1111-111111111101', '2026-10-01', '2026-10-31', 25000.00, 'paid', 'INV-2026-CBE-10'),
('f1111111-1111-1111-1111-111111111102', '2026-10-01', '2026-10-31', 25000.00, 'paid', 'INV-2026-TPR-10')
ON CONFLICT (invoice_number) DO NOTHING;
