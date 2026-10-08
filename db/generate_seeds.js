// Script to generate rich seed data with exact DIGIPIN codes for Coimbatore and Tirupur regions

const DIGIPIN_BOUNDS = {
  MIN_LAT: 2.5,
  MAX_LAT: 38.5,
  MIN_LON: 63.5,
  MAX_LON: 99.5,
};

const DIGIPIN_CHARS = [
  '2', '3', '4', '5',
  '6', '7', '8', '9',
  'C', 'F', 'J', 'K',
  'L', 'M', 'P', 'Q'
];

function encodeDigipin(lat, lon, length = 10) {
  let minLat = DIGIPIN_BOUNDS.MIN_LAT;
  let maxLat = DIGIPIN_BOUNDS.MAX_LAT;
  let minLon = DIGIPIN_BOUNDS.MIN_LON;
  let maxLon = DIGIPIN_BOUNDS.MAX_LON;

  let code = '';
  for (let step = 0; step < length; step++) {
    const latSpan = (maxLat - minLat) / 4;
    const lonSpan = (maxLon - minLon) / 4;

    const row = Math.min(3, Math.max(0, Math.floor((lat - minLat) / latSpan)));
    const col = Math.min(3, Math.max(0, Math.floor((lon - minLon) / lonSpan)));

    code += DIGIPIN_CHARS[row * 4 + col];

    minLat = minLat + row * latSpan;
    maxLat = minLat + latSpan;
    minLon = minLon + col * lonSpan;
    maxLon = minLon + lonSpan;
  }
  return `${code.substring(0, 3)}-${code.substring(3, 6)}-${code.substring(6, 10)}`;
}

const fs = require('fs');
const path = require('path');

const services = [
  { id: '11111111-1111-1111-1111-111111111101', code: 'ELEC', name_en: 'Electrician', name_hi: 'इलेक्ट्रीशियन', name_ta: 'மின்பணியாளர்', category: 'Electrical', base_rate: 350.00, daily_rate: 1800.00, icon: 'zap' },
  { id: '11111111-1111-1111-1111-111111111102', code: 'PLUMB', name_en: 'Plumber', name_hi: 'प्लंबर', name_ta: 'குழாய்ப் பணியாளர்', category: 'Plumbing', base_rate: 300.00, daily_rate: 1600.00, icon: 'droplet' },
  { id: '11111111-1111-1111-1111-111111111103', code: 'CARP', name_en: 'Carpenter', name_hi: 'बढ़ई', name_ta: 'தச்சர்', category: 'Carpentry', base_rate: 400.00, daily_rate: 2000.00, icon: 'hammer' },
  { id: '11111111-1111-1111-1111-111111111104', code: 'PAINT', name_en: 'Painter', name_hi: 'पेंटर', name_ta: 'வண்ணப்பூச்சாளர்', category: 'Painting', base_rate: 350.00, daily_rate: 1800.00, icon: 'paint-roller' },
  { id: '11111111-1111-1111-1111-111111111105', code: 'DOMHELP', name_en: 'Domestic Helper', name_hi: 'घरेलू सहायक', name_ta: 'வீட்டுப் பணியாளர்', category: 'Domestic', base_rate: 200.00, daily_rate: 1000.00, icon: 'home' },
  { id: '11111111-1111-1111-1111-111111111106', code: 'CAREGIVER', name_en: 'Caregiver', name_hi: 'देखभालकर्ता', name_ta: 'பராமரிப்பாளர்', category: 'Care', base_rate: 450.00, daily_rate: 2200.00, icon: 'heart' },
  { id: '11111111-1111-1111-1111-111111111107', code: 'DRIVER', name_en: 'Driver', name_hi: 'चालक', name_ta: 'ஓட்டுநர்', category: 'Transport', base_rate: 300.00, daily_rate: 1500.00, icon: 'truck' },
  { id: '11111111-1111-1111-1111-111111111108', code: 'GARDENER', name_en: 'Gardener', name_hi: 'माली', name_ta: 'தோட்டக்காரர்', category: 'Gardening', base_rate: 250.00, daily_rate: 1200.00, icon: 'flower' },
  { id: '11111111-1111-1111-1111-111111111109', code: 'CLEAN', name_en: 'Deep Cleaner', name_hi: 'सफाई कर्मी', name_ta: 'துப்புரவுப் பணியாளர்', category: 'Cleaning', base_rate: 250.00, daily_rate: 1300.00, icon: 'sparkles' },
  { id: '11111111-1111-1111-1111-111111111110', code: 'TECH', name_en: 'Appliance Technician', name_hi: 'उपकरण तकनीशियन', name_ta: 'பழுதுபார்ப்பாளர்', category: 'Appliances', base_rate: 400.00, daily_rate: 2100.00, icon: 'tool' },
  { id: '11111111-1111-1111-1111-111111111111', code: 'CONST_CREW', name_en: 'Construction Crew', name_hi: 'निर्माण श्रमिक दल', name_ta: 'கட்டுமானக் குழு', category: 'Group Labour', base_rate: 2500.00, daily_rate: 12000.00, icon: 'hard-hat' },
  { id: '11111111-1111-1111-1111-111111111112', code: 'AGRI_CREW', name_en: 'Agricultural Harvest Crew', name_hi: 'कृषि श्रमिक दल', name_ta: 'விவசாய அறுவடைக் குழு', category: 'Group Labour', base_rate: 2000.00, daily_rate: 10000.00, icon: 'wheat' },
];

const federations = [
  {
    id: 'f1111111-1111-1111-1111-111111111101',
    name: 'Coimbatore District Labour Cooperative Federation',
    code: 'CDLCF-01',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    contact_email: 'admin@coimbatorecoop.org.in',
    contact_phone: '+91 422 2304911'
  },
  {
    id: 'f1111111-1111-1111-1111-111111111102',
    name: 'Tirupur District Labour & Construction Cooperative Federation',
    code: 'TDLCCF-02',
    district: 'Tirupur',
    state: 'Tamil Nadu',
    contact_email: 'secretariat@tirupurcoop.org.in',
    contact_phone: '+91 421 2218702'
  }
];

const societies = [
  {
    id: 's1111111-1111-1111-1111-111111111101',
    federation_id: federations[0].id,
    name: 'Kongu Artisans & Electrical Labour Cooperative Society',
    registration_number: 'TN/CBE/CS-2018/441',
    address: '42 Crosscut Road, Gandhipuram, Coimbatore 641012',
    district: 'Coimbatore',
    contact_person: 'S. Ramanathan',
    phone: '+91 98422 11001'
  },
  {
    id: 's1111111-1111-1111-1111-111111111102',
    federation_id: federations[1].id,
    name: 'Noyyal Plumbers & Carpenters Guild Cooperative',
    registration_number: 'TN/TPR/CS-2020/812',
    address: '15 Avinashi Road, Kumar Nagar, Tirupur 641603',
    district: 'Tirupur',
    contact_person: 'M. Palanisamy',
    phone: '+91 98433 22002'
  },
  {
    id: 's1111111-1111-1111-1111-111111111103',
    federation_id: federations[0].id,
    name: 'Siruvani Rural Multi-Trades Cooperative Society',
    registration_number: 'TN/CBE/CS-2022/903',
    address: '8 Trichy Road, Sulur, Coimbatore 641402',
    district: 'Coimbatore',
    contact_person: 'K. Murugesan',
    phone: '+91 98425 33003'
  }
];

// 24 realistic workers spread across Coimbatore (11.0168, 76.9558) and Tirupur (11.1085, 77.3411)
// 6 keypad phone users (Pre-book only) and 18 smartphone users
const workerDefs = [
  // 1. Gandhipuram, Coimbatore - Electrician (Smartphone)
  { name: 'Karthik Subramanian', phone: '+91 9842100001', phone_type: 'smartphone', soc_idx: 0, lat: 11.0185, lon: 76.9634, rating: 4.88, exp: 9, jobs: 142, svc: 'ELEC', cert: 'Govt Wireman Licence Class-A', lang: ['ta', 'en'], online: true, night: true, emerg: true },
  // 2. RS Puram, Coimbatore - Plumber (Smartphone)
  { name: 'P. Velmurugan', phone: '+91 9842100002', phone_type: 'smartphone', soc_idx: 0, lat: 11.0092, lon: 76.9458, rating: 4.79, exp: 12, jobs: 215, svc: 'PLUMB', cert: 'National Skill Development Corp (NSDC) Level 4', lang: ['ta', 'hi'], online: true, night: false, emerg: true },
  // 3. Peelamedu, Coimbatore - Carpenter (Smartphone)
  { name: 'R. Selvaraj', phone: '+91 9842100003', phone_type: 'smartphone', soc_idx: 0, lat: 11.0267, lon: 77.0125, rating: 4.92, exp: 15, jobs: 310, svc: 'CARP', cert: 'ITI Modular Carpenter Certification', lang: ['ta'], online: true, night: false, emerg: false },
  // 4. Singanallur, Coimbatore - Keypad Phone 1 (Keypad, pre-book only)
  { name: 'Arumugam Natarajan', phone: '+91 9842100004', phone_type: 'keypad', soc_idx: 2, lat: 10.9998, lon: 77.0267, rating: 4.65, exp: 18, jobs: 180, svc: 'PAINT', cert: 'Cooperative Master Painter Badge', lang: ['ta'], online: false, night: false, emerg: false },
  // 5. Sulur, Coimbatore - Keypad Phone 2 (Keypad, pre-book only)
  { name: 'M. Chinnasamy', phone: '+91 9842100005', phone_type: 'keypad', soc_idx: 2, lat: 11.0289, lon: 77.1264, rating: 4.55, exp: 14, jobs: 135, svc: 'GARDENER', cert: 'Horticulture Society Certified', lang: ['ta'], online: false, night: false, emerg: false },
  // 6. Saravanampatti, Coimbatore - Appliance Tech (Smartphone)
  { name: 'S. Divya', phone: '+91 9842100006', phone_type: 'smartphone', soc_idx: 0, lat: 11.0782, lon: 76.9945, rating: 4.85, exp: 6, jobs: 98, svc: 'TECH', cert: 'Samsung & LG Certified Service Tech', lang: ['ta', 'en'], online: true, night: true, emerg: true },
  // 7. Saibaba Colony, Coimbatore - Domestic Helper (Smartphone)
  { name: 'K. Lakshmi', phone: '+91 9842100007', phone_type: 'smartphone', soc_idx: 0, lat: 11.0281, lon: 76.9423, rating: 4.70, exp: 7, jobs: 84, svc: 'DOMHELP', cert: 'Cooperative Care & Sanitation Badge', lang: ['ta'], online: true, night: false, emerg: false },
  // 8. Pollachi Road, Coimbatore - Driver (Smartphone)
  { name: 'J. Mariappan', phone: '+91 9842100008', phone_type: 'smartphone', soc_idx: 2, lat: 10.9521, lon: 76.9712, rating: 4.62, exp: 11, jobs: 160, svc: 'DRIVER', cert: 'Commercial Badge Heavy/Light PSV', lang: ['ta', 'en', 'ml'], online: true, night: true, emerg: true },
  // 9. Ganapathy, Coimbatore - Keypad Phone 3 (Keypad, pre-book only)
  { name: 'V. Senthilkumar', phone: '+91 9842100009', phone_type: 'keypad', soc_idx: 0, lat: 11.0425, lon: 76.9765, rating: 4.40, exp: 8, jobs: 72, svc: 'ELEC', cert: 'Tamil Nadu Electricity Board (TNEB) Apprentice', lang: ['ta'], online: false, night: false, emerg: false },
  // 10. Hopes College, Coimbatore - Deep Cleaner (Smartphone)
  { name: 'P. Kavitha', phone: '+91 9842100010', phone_type: 'smartphone', soc_idx: 2, lat: 11.0234, lon: 77.0189, rating: 4.75, exp: 5, jobs: 112, svc: 'CLEAN', cert: 'Industrial Hygiene Certified', lang: ['ta'], online: true, night: false, emerg: false },
  // 11. Thudiyalur, Coimbatore - Plumber (Smartphone)
  { name: 'D. Ganesan', phone: '+91 9842100011', phone_type: 'smartphone', soc_idx: 0, lat: 11.0799, lon: 76.9412, rating: 4.58, exp: 10, jobs: 130, svc: 'PLUMB', cert: 'CPVC & Hydrostatic Testing Certified', lang: ['ta'], online: true, night: true, emerg: true },
  // 12. Kovaipudur, Coimbatore - Caregiver (Smartphone)
  { name: 'Anitha Ramesh', phone: '+91 9842100012', phone_type: 'smartphone', soc_idx: 2, lat: 10.9324, lon: 76.9388, rating: 4.90, exp: 8, jobs: 65, svc: 'CAREGIVER', cert: 'St John Ambulance First Aid & Geriatric Care', lang: ['ta', 'en', 'ml'], online: true, night: true, emerg: true },
  
  // 13. Tirupur Old Bus Stand - Electrician (Smartphone)
  { name: 'M. Anand', phone: '+91 9843100013', phone_type: 'smartphone', soc_idx: 1, lat: 11.1075, lon: 77.3456, rating: 4.82, exp: 10, jobs: 175, svc: 'ELEC', cert: 'Industrial Panel & HT Wiring Certified', lang: ['ta', 'hi'], online: true, night: true, emerg: true },
  // 14. Kumaran Road, Tirupur - Keypad Phone 4 (Keypad, pre-book only)
  { name: 'G. Ponraj', phone: '+91 9843100014', phone_type: 'keypad', soc_idx: 1, lat: 11.1145, lon: 77.3512, rating: 4.45, exp: 16, jobs: 140, svc: 'CARP', cert: 'Timber Joinery Guild Certified', lang: ['ta'], online: false, night: false, emerg: false },
  // 15. Avinashi Road, Tirupur - Painter (Smartphone)
  { name: 'K. Sureshbabu', phone: '+91 9843100015', phone_type: 'smartphone', soc_idx: 1, lat: 11.1256, lon: 77.3298, rating: 4.89, exp: 13, jobs: 240, svc: 'PAINT', cert: 'Asian Paints Pro Master Applicator', lang: ['ta', 'hi', 'en'], online: true, night: false, emerg: false },
  // 16. Kangeyam Road, Tirupur - Keypad Phone 5 (Keypad, pre-book only)
  { name: 'S. Muthuvel', phone: '+91 9843100016', phone_type: 'keypad', soc_idx: 1, lat: 11.0850, lon: 77.3712, rating: 3.85, exp: 6, jobs: 45, svc: 'PLUMB', cert: 'Basic Plumbing Trade Certificate', lang: ['ta'], online: false, night: false, emerg: false },
  // 17. Palladam Road, Tirupur - Driver (Smartphone)
  { name: 'C. Thangaraj', phone: '+91 9843100017', phone_type: 'smartphone', soc_idx: 1, lat: 11.0721, lon: 77.3312, rating: 4.78, exp: 9, jobs: 195, svc: 'DRIVER', cert: 'Safe Commercial Driving Honours', lang: ['ta', 'en'], online: true, night: true, emerg: true },
  // 18. Perumanallur, Tirupur - Construction Crew Lead (Smartphone)
  { name: 'T. Boopathi', phone: '+91 9843100018', phone_type: 'smartphone', soc_idx: 1, lat: 11.1782, lon: 77.3489, rating: 4.86, exp: 17, jobs: 280, svc: 'CONST_CREW', cert: 'Govt Certified Mason Master Class', lang: ['ta'], online: true, night: false, emerg: false },
  // 19. Anupparpalayam, Tirupur - Keypad Phone 6 (Keypad, pre-book only)
  { name: 'N. Kandasamy', phone: '+91 9843100019', phone_type: 'keypad', soc_idx: 1, lat: 11.1412, lon: 77.3210, rating: 4.10, exp: 11, jobs: 60, svc: 'TECH', cert: 'Brass & Motor Machinery Welder', lang: ['ta'], online: false, night: false, emerg: false },
  // 20. Uthukuli, Tirupur - Agri Crew Lead (Smartphone)
  { name: 'R. Dharmalingam', phone: '+91 9843100020', phone_type: 'smartphone', soc_idx: 1, lat: 11.1610, lon: 77.4450, rating: 4.91, exp: 20, jobs: 350, svc: 'AGRI_CREW', cert: 'Agricultural Cooperative Farm Lead', lang: ['ta'], online: true, night: false, emerg: false },
  // 21. Mangalam, Tirupur - Plumber (Smartphone)
  { name: 'B. Manikandan', phone: '+91 9843100021', phone_type: 'smartphone', soc_idx: 1, lat: 11.0821, lon: 77.2654, rating: 4.68, exp: 7, jobs: 89, svc: 'PLUMB', cert: 'Sanitary Sewerage Specialist', lang: ['ta'], online: true, night: false, emerg: true },
  // 22. Avinashi Town - Electrician (Smartphone)
  { name: 'S. Prabhakaran', phone: '+91 9843100022', phone_type: 'smartphone', soc_idx: 1, lat: 11.1923, lon: 77.2690, rating: 4.74, exp: 8, jobs: 104, svc: 'ELEC', cert: 'Solar Rooftop & Inverter Certified', lang: ['ta', 'en'], online: true, night: true, emerg: true },
  // 23. Palladam Town - Carpenter (Smartphone)
  { name: 'K. Rajendran', phone: '+91 9843100023', phone_type: 'smartphone', soc_idx: 2, lat: 10.9982, lon: 77.2023, rating: 4.80, exp: 14, jobs: 165, svc: 'CARP', cert: 'Modular Kitchen & CNC Fabricator', lang: ['ta'], online: true, night: false, emerg: false },
  // 24. Chettipalayam, Coimbatore - Caregiver (Smartphone)
  { name: 'Meenakshi Sundaram', phone: '+91 9842100024', phone_type: 'smartphone', soc_idx: 2, lat: 10.9234, lon: 77.0421, rating: 4.95, exp: 12, jobs: 110, svc: 'CAREGIVER', cert: 'Red Cross Certified Home Health Aide', lang: ['ta', 'en'], online: true, night: true, emerg: true },
];

let sql = `-- TaskLink Comprehensive Seed Data
-- 2 Federations, 3 Cooperative Societies, 24 Verified Workers (6 Keypad, 18 Smartphone)
-- 4 Crews, Before/After Portfolios, 0% Platform Commission Guarantee

`;

// Insert Federations
for (const fed of federations) {
  sql += `INSERT INTO federations (id, name, code, district, state, contact_email, contact_phone)
VALUES ('${fed.id}', '${fed.name}', '${fed.code}', '${fed.district}', '${fed.state}', '${fed.contact_email}', '${fed.contact_phone}')
ON CONFLICT (id) DO NOTHING;\n`;
}
sql += '\n';

// Insert Societies
for (const soc of societies) {
  sql += `INSERT INTO societies (id, federation_id, name, registration_number, address, district, contact_person, phone)
VALUES ('${soc.id}', '${soc.federation_id}', '${soc.name}', '${soc.registration_number}', '${soc.address}', '${soc.district}', '${soc.contact_person}', '${soc.phone}')
ON CONFLICT (id) DO NOTHING;\n`;
}
sql += '\n';

// Insert Services
for (const svc of services) {
  sql += `INSERT INTO services (id, code, name_en, name_hi, name_ta, category, default_base_rate, default_daily_rate, icon_name)
VALUES ('${svc.id}', '${svc.code}', '${svc.name_en}', '${svc.name_hi}', '${svc.name_ta}', '${svc.category}', ${svc.base_rate}, ${svc.daily_rate}, '${svc.icon}')
ON CONFLICT (id) DO NOTHING;\n`;
}
sql += '\n';

// Insert Configuration Matching Weights (Default 25, 20, 20, 15, 10, 10)
for (const fed of federations) {
  sql += `INSERT INTO config_matching_weights (federation_id, weight_skill, weight_availability, weight_distance, weight_reliability, weight_workload, weight_customer_pref)
VALUES ('${fed.id}', 0.25, 0.20, 0.20, 0.15, 0.10, 0.10)
ON CONFLICT (federation_id) DO UPDATE SET weight_skill = EXCLUDED.weight_skill;\n`;

  sql += `INSERT INTO price_rules (federation_id, k_sensitivity, r0_baseline_ratio, surge_cap, refresh_interval_seconds, quote_lock_minutes)
VALUES ('${fed.id}', 0.50, 1.00, 1.50, 120, 10)
ON CONFLICT DO NOTHING;\n`;

  sql += `INSERT INTO premium_rules (federation_id, night_start_time, night_end_time, night_premium_rate, holiday_premium_rate, stacking_rule)
VALUES ('${fed.id}', '22:00:00', '06:00:00', 0.25, 0.50, 'additive')
ON CONFLICT DO NOTHING;\n`;
}
sql += '\n';

// Insert Workers and User accounts
const workerIds = [];
workerDefs.forEach((w, idx) => {
  const userId = `u2222222-2222-2222-2222-22222222${String(idx + 1).padStart(4, '0')}`;
  const workerId = `w3333333-3333-3333-3333-33333333${String(idx + 1).padStart(4, '0')}`;
  workerIds.push(workerId);

  const soc = societies[w.soc_idx];
  const fedId = soc.federation_id;
  const digipin = encodeDigipin(w.lat, w.lon);
  const upiId = `${w.name.toLowerCase().replace(/[^a-z]/g, '')}@upi`;
  const eShramNum = `UAN 2026 ${String(1000 + idx).padStart(4, '0')} ${String(4000 + idx).padStart(4, '0')}`;
  const isKeypad = w.phone_type === 'keypad';

  sql += `-- Worker ${idx + 1}: ${w.name} (${w.phone_type}, ${digipin})
INSERT INTO users (id, role, phone, full_name, language_code, phone_type, federation_id, society_id)
VALUES ('${userId}', 'worker', '${w.phone}', '${w.name}', '${w.lang[0]}', '${w.phone_type}', '${fedId}', '${soc.id}')
ON CONFLICT (id) DO NOTHING;\n`;

  sql += `INSERT INTO workers (
  id, user_id, society_id, federation_id, phone_type, verification_status, verified_at,
  years_experience, payout_upi_id, payout_account_verified, e_shram_number, e_shram_verified,
  pmsby_covered, pmjjby_covered, rating_average, rating_count, jobs_completed, on_time_rate, completion_rate,
  latitude, longitude, geom, digipin, is_online, available_nights, accepts_emergency, is_keypad_pre_book_only
) VALUES (
  '${workerId}', '${userId}', '${soc.id}', '${fedId}', '${w.phone_type}', 'verified', NOW(),
  ${w.exp}, '${upiId}', TRUE, '${eShramNum}', TRUE,
  TRUE, TRUE, ${w.rating}, ${Math.floor(w.jobs * 0.7)}, ${w.jobs}, 0.96, 0.99,
  ${w.lat}, ${w.lon}, ST_SetSRID(ST_MakePoint(${w.lon}, ${w.lat}), 4326),
  '${digipin}', ${w.online}, ${w.night}, ${w.emerg}, ${isKeypad}
) ON CONFLICT (id) DO NOTHING;\n`;

  // Attach Service Skill
  const matchedSvc = services.find(s => s.code === w.svc) || services[0];
  sql += `INSERT INTO worker_services (worker_id, service_id, experience_years, hourly_rate, daily_rate, is_certified, certificate_name)
VALUES ('${workerId}', '${matchedSvc.id}', ${w.exp}, ${matchedSvc.base_rate}, ${matchedSvc.daily_rate}, TRUE, '${w.cert}')
ON CONFLICT (worker_id, service_id) DO NOTHING;\n\n`;
});

// Create 4 Worker Crews
const crewDefs = [
  {
    id: 'c4444444-4444-4444-4444-444444440001',
    name: 'Tirupur Masonry & Reinforcement Crew',
    type: 'construction',
    leadIdx: 17, // T. Boopathi
    socIdx: 1,
    headcount: 4,
    dailyRate: 1800.00,
    rating: 4.88,
    members: [
      { workerIdx: 17, share: 30.0 }, // Lead
      { workerIdx: 13, share: 25.0 }, // Anand (Electrician)
      { workerIdx: 14, share: 25.0 }, // Ponraj (Carpenter)
      { workerIdx: 15, share: 20.0 }  // Sureshbabu (Painter)
    ]
  },
  {
    id: 'c4444444-4444-4444-4444-444444440002',
    name: 'Siruvani Organic Farm Harvest Crew',
    type: 'agriculture',
    leadIdx: 19, // R. Dharmalingam
    socIdx: 1,
    headcount: 3,
    dailyRate: 1500.00,
    rating: 4.92,
    members: [
      { workerIdx: 19, share: 40.0 }, // Lead
      { workerIdx: 4, share: 30.0 },  // Chinnasamy (Gardener)
      { workerIdx: 7, share: 30.0 }   // Mariappan (Driver)
    ]
  },
  {
    id: 'c4444444-4444-4444-4444-444444440003',
    name: 'Gandhipuram Deep Clean & Sanitise Team',
    type: 'cleaning',
    leadIdx: 9, // P. Kavitha
    socIdx: 2,
    headcount: 2,
    dailyRate: 1400.00,
    rating: 4.78,
    members: [
      { workerIdx: 9, share: 55.0 },
      { workerIdx: 6, share: 45.0 }
    ]
  },
  {
    id: 'c4444444-4444-4444-4444-444444440004',
    name: 'Kongu Home Renovation Finishing Crew',
    type: 'construction',
    leadIdx: 2, // R. Selvaraj (Carpenter)
    socIdx: 0,
    headcount: 3,
    dailyRate: 1900.00,
    rating: 4.90,
    members: [
      { workerIdx: 2, share: 40.0 },
      { workerIdx: 0, share: 30.0 },
      { workerIdx: 1, share: 30.0 }
    ]
  }
];

crewDefs.forEach(crew => {
  const leadWorkerId = workerIds[crew.leadIdx];
  const socId = societies[crew.socIdx].id;
  sql += `-- Crew: ${crew.name}
INSERT INTO groups (id, name, crew_type, lead_worker_id, society_id, headcount, daily_rate_per_person, rating_average, rating_count, active)
VALUES ('${crew.id}', '${crew.name}', '${crew.type}', '${leadWorkerId}', '${socId}', ${crew.headcount}, ${crew.dailyRate}, ${crew.rating}, 42, TRUE)
ON CONFLICT (id) DO NOTHING;\n`;

  crew.members.forEach(m => {
    const memWorkerId = workerIds[m.workerIdx];
    sql += `INSERT INTO group_members (group_id, worker_id, payout_share_percent, confirmed_attendance)
VALUES ('${crew.id}', '${memWorkerId}', ${m.share}, TRUE)
ON CONFLICT (group_id, worker_id) DO NOTHING;\n`;
  });
  sql += '\n';
});

// Portfolios (Before & After)
const portfolios = [
  {
    workerIdx: 0, // Karthik (Electrician)
    title: 'Complete Industrial Power Distribution Rewiring',
    desc: 'Upgraded vintage fuse board to RCCB/MCB distribution panel in Peelamedu workshop.',
    before: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&q=80',
    after: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80'
  },
  {
    workerIdx: 1, // Velmurugan (Plumber)
    title: 'High-Pressure Overhead Tank Booster & Leak Repair',
    desc: 'Replaced corroded galvanized iron risers with CPVC pipeline and automated level controller.',
    before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    after: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80'
  },
  {
    workerIdx: 2, // Selvaraj (Carpenter)
    title: 'Custom Teak Modular Wardrobe and Study Nook',
    desc: 'Designed and installed termite-resistant engineered hardwood wardrobe with soft-close hinges.',
    before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    after: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80'
  },
  {
    workerIdx: 14, // Sureshbabu (Painter)
    title: 'Monsoon-Proof Exterior Elastomeric Weathercoat',
    desc: 'High-pressure wash, crack filling and two-coat premium anti-fungal paint on 3-storey building.',
    before: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&q=80',
    after: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80'
  }
];

portfolios.forEach((p, idx) => {
  const pId = `p5555555-5555-5555-5555-55555555${String(idx + 1).padStart(4, '0')}`;
  const wId = workerIds[p.workerIdx];
  sql += `INSERT INTO portfolio_items (id, worker_id, title, description, before_image_url, after_image_url)
VALUES ('${pId}', '${wId}', '${p.title}', '${p.desc}', '${p.before}', '${p.after}')
ON CONFLICT (id) DO NOTHING;\n`;
});

// Subscriptions
sql += `\n-- Federation Subscriptions (Flat Fee - No Per Job Cuts)
INSERT INTO subscriptions (federation_id, billing_period_start, billing_period_end, amount, status, invoice_number)
VALUES
('${federations[0].id}', '2026-10-01', '2026-10-31', 25000.00, 'paid', 'INV-2026-CBE-10'),
('${federations[1].id}', '2026-10-01', '2026-10-31', 25000.00, 'paid', 'INV-2026-TPR-10')
ON CONFLICT (invoice_number) DO NOTHING;\n`;

fs.writeFileSync(path.join(__dirname, 'seeds', '001_demo_seed.sql'), sql, 'utf8');
console.log('Successfully generated db/seeds/001_demo_seed.sql with 24 workers, 4 crews, and DIGIPIN codes.');
