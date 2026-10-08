import React, { useState, useMemo } from 'react';
import {
  Compass, CalendarCheck2, HeartHandshake, User, ShieldCheck, CheckCircle2,
  Map, List, Languages, IndianRupee, Briefcase, Star, Bell, TrendingUp,
  Wallet, Clock, Phone, Zap, ArrowRight, ChevronRight, Building2,
  Users, Settings, ToggleLeft, ToggleRight, FileText, AlertTriangle,
  MessageSquare, Award, LogOut, Home, Search, Activity, Menu, X,
  MapPin, Images, PhoneCall, CheckSquare, XCircle, RefreshCw,
  ChevronDown, Gift, Smartphone, Package
} from 'lucide-react';
import { SEEDED_WORKERS, SEEDED_CREWS, SeedWorker, SeedCrew } from './data/mockSeed';
import { MapDiscoveryView } from './components/MapDiscoveryView';
import { MiniProfileCard } from './components/MiniProfileCard';
import { PortfolioModal } from './components/PortfolioModal';
import { FilterBar } from './components/FilterBar';
import { AddressDigipinBar } from './components/AddressDigipinBar';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type RoleType = 'select' | 'customer' | 'worker' | 'admin';
type CustomerTab = 'explore' | 'bookings' | 'welfare' | 'profile';
type WorkerTab = 'jobs' | 'earnings' | 'welfare' | 'profile';
type AdminTab = 'overview' | 'queue' | 'rules' | 'welfare' | 'dpdp';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_WORKER_JOBS = [
  { id: 'j-01', customer: 'Priya Rajan', service: 'Electrical', date: '2026-10-12', time: '10:00 AM', location: 'Gandhipuram, Coimbatore', pay: 350, status: 'pending', type: 'on_demand' },
  { id: 'j-02', customer: 'Arun Kumar', service: 'Electrical', date: '2026-10-14', time: '09:00 AM', location: 'Peelamedu, Coimbatore', pay: 700, status: 'pending', type: 'scheduled' },
  { id: 'j-03', customer: 'Meena Selvam', service: 'Electrical', date: '2026-10-08', time: '02:00 PM', location: 'RS Puram, Coimbatore', pay: 437, status: 'completed', type: 'scheduled' },
  { id: 'j-04', customer: 'Kavitha M', service: 'Electrical', date: '2026-10-06', time: '11:00 AM', location: 'Saibaba Colony', pay: 350, status: 'completed', type: 'on_demand' },
  { id: 'j-05', customer: 'Ramesh T', service: 'Electrical', date: '2026-10-03', time: '03:00 PM', location: 'Singanallur', pay: 525, status: 'completed', type: 'scheduled' },
];

const MOCK_QUEUE = [
  { id: 'wq-01', name: 'Durai Murugan', phone: '+91 98421 00099', society: 'Kongu Artisans & Electrical Labour Coop', trade: 'Electrician', experience: 5, membershipId: 'MEM-KONGU-2026-99', submittedAt: '2026-10-07T10:30:00Z' },
  { id: 'wq-02', name: 'S. Krishnasamy', phone: '+91 98431 00088', society: 'Noyyal Plumbers & Carpenters Guild', trade: 'Senior Plumber', experience: 8, membershipId: 'MEM-NOYYAL-2026-88', submittedAt: '2026-10-08T08:45:00Z' },
  { id: 'wq-03', name: 'P. Thilagam', phone: '+91 98421 00077', society: 'Siruvani Rural Multi-Trades Coop', trade: 'Domestic Helper & Caregiver', experience: 3, membershipId: 'MEM-SIRU-2026-77', submittedAt: '2026-10-08T11:00:00Z' },
];

const MOCK_BOOKINGS_CUSTOMER = [
  { id: 'TL-2026-00011', worker: 'Karthik Subramanian', service: 'Master Electrician', date: '2026-10-12', time: '10:00 AM', status: 'confirmed', pay: 437, commission: 0 },
  { id: 'TL-2026-00007', worker: 'P. Velmurugan', service: 'Senior Plumber', date: '2026-10-05', time: '09:00 AM', status: 'completed', pay: 300, commission: 0 },
  { id: 'TL-2026-00003', worker: 'S. Divya', service: 'AC Technician', date: '2026-09-28', time: '02:00 PM', status: 'completed', pay: 400, commission: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// ROLE SELECTOR SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const RoleSelector: React.FC<{ onSelect: (r: RoleType) => void }> = ({ onSelect }) => (
  <div className="device-wrapper">
    <div className="device-frame" style={{ height: 'auto', minHeight: '820px', borderRadius: '44px' }}>
      <div className="phone-notch"><div className="notch-camera" /></div>
      <div className="status-bar"><span>09:41</span><div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span>5G</span><span>100%</span></div></div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, #0b2a4a 0%, #1F497D 60%, #0070C0 100%)', padding: '36px 24px 28px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.3)' }}>
            <ShieldCheck size={34} color="#fff" />
          </div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>TaskLink</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>Labour Cooperative Society Network</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#E0761C', color: '#fff', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 800, marginTop: 12 }}>
          <CheckCircle2 size={14} /> 0% Platform Commission
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>SIH 2026 • Ministry of Cooperation, GoI</div>
      </div>

      {/* Role Cards */}
      <div style={{ padding: '24px 20px 32px', background: '#f4f9fd', flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', textAlign: 'center', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Choose Your Role</div>

        {/* Customer */}
        <button onClick={() => onSelect('customer')} style={{ width: '100%', background: '#fff', border: '2px solid #E9F2FB', borderRadius: 20, padding: '18px 20px', marginBottom: 14, textAlign: 'left', cursor: 'pointer', boxShadow: '0 4px 14px rgba(31,73,125,0.10)', transition: 'all 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.borderColor = '#0070C0')} onMouseOut={e => (e.currentTarget.style.borderColor = '#E9F2FB')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #0070C0, #3895e0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Home size={26} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#1F497D' }}>Customer</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Find & book verified cooperative workers near you</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {['Map Discovery', 'Book Workers', 'UPI Payments'].map(t => (
                  <span key={t} style={{ fontSize: 10, background: '#E9F2FB', color: '#0070C0', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
            <ArrowRight size={18} color="#0070C0" />
          </div>
        </button>

        {/* Worker */}
        <button onClick={() => onSelect('worker')} style={{ width: '100%', background: '#fff', border: '2px solid #E9F2FB', borderRadius: 20, padding: '18px 20px', marginBottom: 14, textAlign: 'left', cursor: 'pointer', boxShadow: '0 4px 14px rgba(31,73,125,0.10)', transition: 'all 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.borderColor = '#2E7D32')} onMouseOut={e => (e.currentTarget.style.borderColor = '#E9F2FB')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #2E7D32, #4caf50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Briefcase size={26} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#1F497D' }}>Worker / Artisan</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Manage jobs, view earnings & cooperative benefits</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {['Job Inbox', '100% Earnings', 'e-Shram'].map(t => (
                  <span key={t} style={{ fontSize: 10, background: '#f0fdf4', color: '#2E7D32', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
            <ArrowRight size={18} color="#2E7D32" />
          </div>
        </button>

        {/* Cooperative Admin */}
        <button onClick={() => onSelect('admin')} style={{ width: '100%', background: '#fff', border: '2px solid #E9F2FB', borderRadius: 20, padding: '18px 20px', marginBottom: 0, textAlign: 'left', cursor: 'pointer', boxShadow: '0 4px 14px rgba(31,73,125,0.10)', transition: 'all 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.borderColor = '#E0761C')} onMouseOut={e => (e.currentTarget.style.borderColor = '#E9F2FB')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #E0761C, #ff9138)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={26} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#1F497D' }}>Society / Federation Admin</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Verify workers, manage rules & cooperative governance</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {['Verification', 'Live Rules', 'DPDP'].map(t => (
                  <span key={t} style={{ fontSize: 10, background: '#fff7ed', color: '#E0761C', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
            <ArrowRight size={18} color="#E0761C" />
          </div>
        </button>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#94a3b8' }}>
          Powered by Bhashini • PostGIS • DIGIPIN • UPI
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER PLATFORM
// ─────────────────────────────────────────────────────────────────────────────
const CustomerPlatform: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<CustomerTab>('explore');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [currentLang, setCurrentLang] = useState<'en' | 'ta' | 'hi'>('en');
  const [searchAddress, setSearchAddress] = useState('Gandhipuram Crosscut Rd, Coimbatore');
  const [digipin, setDigipin] = useState('78C-K2M-9Q2F');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availableNow, setAvailableNow] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [crewsOnly, setCrewsOnly] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<SeedWorker | null>(SEEDED_WORKERS[0]);
  const [selectedCrew, setSelectedCrew] = useState<SeedCrew | null>(null);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredWorkers = useMemo(() => {
    if (crewsOnly) return [];
    return SEEDED_WORKERS.filter(w => {
      if (selectedCategory !== 'all' && w.serviceCategory !== selectedCategory) return false;
      if (availableNow && (!w.isOnline || w.isKeypadPreBookOnly)) return false;
      if (minRating > 0 && w.ratingAverage < minRating) return false;
      return true;
    });
  }, [selectedCategory, availableNow, minRating, crewsOnly]);

  const filteredCrews = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'crews' && selectedCategory !== 'Group Labour') return [];
    return SEEDED_CREWS;
  }, [selectedCategory]);

  const confirmBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => { setShowBookingModal(false); setBookingSuccess(false); }, 2500);
  };

  const renderBookings = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f4f9fd' }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#1F497D', marginBottom: 14 }}>My Bookings</div>
      {MOCK_BOOKINGS_CUSTOMER.map(b => (
        <div key={b.id} style={{ background: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, boxShadow: '0 2px 8px rgba(31,73,125,0.08)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1F497D' }}>{b.worker}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: b.status === 'completed' ? '#ecfdf5' : '#eff6ff', color: b.status === 'completed' ? '#059669' : '#2563eb' }}>
              {b.status.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{b.service}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{b.date} • {b.time}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#2E7D32' }}>₹{b.pay} paid</span>
            <span style={{ fontSize: 11, color: '#E0761C', fontWeight: 700 }}>Commission: ₹{b.commission} (0%)</span>
          </div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>Booking #{b.id}</div>
        </div>
      ))}
    </div>
  );

  const renderWelfare = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f4f9fd' }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#1F497D', marginBottom: 14 }}>Worker Welfare Info</div>
      <div style={{ background: 'linear-gradient(135deg, #2E7D32, #388e3c)', borderRadius: 18, padding: 18, marginBottom: 14, color: '#fff' }}>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Cooperative Mission</div>
        <div style={{ fontSize: 20, fontWeight: 900, marginTop: 4 }}>100% Earnings to Workers</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 8, lineHeight: 1.5 }}>
          Every worker you book through TaskLink keeps 100% of their earnings. No platform cuts. No hidden fees. Operations funded by flat annual cooperative subscriptions only.
        </div>
      </div>
      {[
        { icon: '🛡️', title: 'PMSBY Coverage', desc: 'Accidental insurance ₹20/year for all registered cooperative workers', color: '#E9F2FB' },
        { icon: '❤️', title: 'PMJJBY Life Cover', desc: 'Life insurance ₹436/year for all e-Shram registered artisans', color: '#fff7ed' },
        { icon: '📋', title: 'e-Shram Registration', desc: 'All verified workers have UAN from Ministry of Labour & Employment', color: '#f0fdf4' },
        { icon: '⚖️', title: 'DPDP Act 2023', desc: 'Your location data is purged 24hr after job completion per law', color: '#faf5ff' },
      ].map(item => (
        <div key={item.title} style={{ background: item.color, borderRadius: 14, padding: 14, marginBottom: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 24 }}>{item.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1F497D' }}>{item.title}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 3, lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProfile = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f4f9fd' }}>
      <div style={{ background: 'linear-gradient(135deg, #1F497D, #0070C0)', borderRadius: 18, padding: 20, marginBottom: 14, color: '#fff', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👤</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Priya Rajan</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>+91 98421 56789 • Customer</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Coimbatore District</div>
        </div>
      </div>
      {[
        { label: 'Language Preference', value: 'Tamil (தமிழ்)', icon: '🌐' },
        { label: 'Default Location', value: 'Gandhipuram, Coimbatore', icon: '📍' },
        { label: 'Bookings Made', value: '3 bookings', icon: '📅' },
        { label: 'Total Saved (vs market)', value: '~₹900 in commission', icon: '💰' },
        { label: 'DPDP Consents', value: 'Location: Active', icon: '🔒' },
      ].map(item => (
        <div key={item.label} style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(31,73,125,0.06)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 13, color: '#475569' }}>{item.label}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1F497D' }}>{item.value}</span>
        </div>
      ))}
      <button onClick={onBack} style={{ width: '100%', marginTop: 8, background: 'none', border: '2px solid #e2e8f0', borderRadius: 12, padding: '12px', color: '#475569', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}>
        <LogOut size={16} /> Switch Role
      </button>
    </div>
  );

  return (
    <div className="device-wrapper">
      <div className="device-frame">
        <div className="phone-notch"><div className="notch-camera" /></div>
        <div className="status-bar"><span>09:41</span><div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span>5G</span><span>100%</span></div></div>

        <header className="app-header">
          <div className="header-top">
            <div className="brand-row">
              <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginRight: 4 }}>
                <ArrowRight size={18} color="#1F497D" style={{ transform: 'rotate(180deg)' }} />
              </button>
              <div className="coop-emblem"><ShieldCheck size={24} color="#1F497D" /></div>
              <div>
                <div className="app-title">TaskLink</div>
                <div className="app-subtitle">Customer Platform</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="zero-comm-badge">0% Commission</span>
              <button className="lang-selector" onClick={() => { const c: any = { en: 'ta', ta: 'hi', hi: 'en' }; setCurrentLang(c[currentLang]); }}>
                <Languages size={13} />
                <span>{currentLang === 'en' ? 'ENG' : currentLang === 'ta' ? 'தமிழ்' : 'हिन्दी'}</span>
              </button>
            </div>
          </div>
        </header>

        {activeTab === 'explore' ? (
          <>
            <AddressDigipinBar currentAddress={searchAddress} digipin={digipin} onAddressChange={setSearchAddress}
              onDigipinApply={d => { setDigipin(d); setSearchAddress(`DIGIPIN Zone [${d}]`); }} />
            <FilterBar selectedCategory={selectedCategory}
              onSelectCategory={c => { setSelectedCategory(c); setCrewsOnly(c === 'crews'); }}
              availableNow={availableNow} onToggleAvailableNow={() => setAvailableNow(!availableNow)}
              minRating={minRating} onSetMinRating={setMinRating}
              crewsOnly={crewsOnly} onToggleCrewsOnly={() => setCrewsOnly(!crewsOnly)} />

            {viewMode === 'map' ? (
              <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div className="view-mode-toggle">
                  <button className={`toggle-opt-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}><Map size={13} /> Map</button>
                  <button className={`toggle-opt-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={13} /> List ({filteredWorkers.length + filteredCrews.length})</button>
                </div>
                <MapDiscoveryView workers={filteredWorkers} crews={filteredCrews}
                  selectedId={selectedWorker?.id || selectedCrew?.id || null}
                  onSelectWorker={w => { setSelectedCrew(null); setSelectedWorker(w); }}
                  onSelectCrew={c => { setSelectedWorker(null); setSelectedCrew(c); }}
                  userCoords={[11.0185, 76.9634]} />
                {(selectedWorker || selectedCrew) && (
                  <MiniProfileCard item={selectedWorker || selectedCrew!} isCrew={!!selectedCrew}
                    onClose={() => { setSelectedWorker(null); setSelectedCrew(null); }}
                    onViewPortfolio={() => setShowPortfolio(true)}
                    onBook={() => { setShowBookingModal(true); setBookingSuccess(false); }} />
                )}
              </div>
            ) : (
              <div className="list-view-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1F497D' }}>Verified Workers & Crews ({filteredWorkers.length + filteredCrews.length})</span>
                  <button style={{ background: 'none', border: 'none', color: '#0070C0', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => setViewMode('map')}><Map size={14} /> Map</button>
                </div>
                {filteredWorkers.map(w => (
                  <div key={w.id} className="worker-card-list" onClick={() => { setSelectedWorker(w); setSelectedCrew(null); setViewMode('map'); }}>
                    <img src={w.avatarUrl} alt={w.name} style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: 15, color: '#1F497D' }}>{w.name}</strong>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#b45309' }}>★ {w.ratingAverage}</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{w.serviceName} • {w.experienceYears} yrs</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
                        <span style={{ color: '#2E7D32', fontWeight: 700 }}>₹{w.hourlyRate}/hr</span>
                        <span style={{ color: '#0070C0', fontWeight: 600 }}>{w.digipin}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'bookings' ? renderBookings()
          : activeTab === 'welfare' ? renderWelfare()
            : renderProfile()}

        <nav className="bottom-nav-bar">
          <button className={`nav-tab-item ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')}><Compass size={22} /><span>Find Workers</span></button>
          <button className={`nav-tab-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}><CalendarCheck2 size={22} /><span>My Bookings</span></button>
          <button className={`nav-tab-item ${activeTab === 'welfare' ? 'active' : ''}`} onClick={() => setActiveTab('welfare')}><HeartHandshake size={22} /><span>Worker Welfare</span></button>
          <button className={`nav-tab-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><User size={22} /><span>Profile</span></button>
        </nav>

        {showPortfolio && selectedWorker?.portfolio && (
          <PortfolioModal portfolio={selectedWorker.portfolio} workerName={selectedWorker.name} onClose={() => setShowPortfolio(false)} />
        )}
        {showBookingModal && (
          <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
            <div className="portfolio-modal-box" onClick={e => e.stopPropagation()}>
              <div className="portfolio-header">
                <div><div style={{ fontSize: 11, textTransform: 'uppercase', opacity: 0.8 }}>Cooperative Booking</div>
                  <div className="portfolio-title">{selectedWorker ? selectedWorker.name : selectedCrew?.name}</div></div>
                <button className="close-card-btn" onClick={() => setShowBookingModal(false)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>✕</button>
              </div>
              <div style={{ padding: 20 }}>
                {bookingSuccess ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <CheckCircle2 size={56} color="#2E7D32" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ color: '#1F497D', marginBottom: 8 }}>Booking Confirmed!</h3>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>100% payout guaranteed to the cooperative worker.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ background: '#f8fafc', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                      {[['Service Base Rate', `₹${selectedWorker ? selectedWorker.hourlyRate : selectedCrew?.dailyRatePerPerson}`],
                        ['Night / Holiday Premium', '₹0.00 (Standard Window)'],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}><span>{k}</span><strong>{v}</strong></div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#E0761C', fontWeight: 800 }}>
                        <span>Platform Commission (TaskLink):</span><span>₹0.00 (0%)</span>
                      </div>
                      <div style={{ height: 1, background: '#cbd5e1', margin: '8px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: '#2E7D32' }}>
                        <span>Worker Receives:</span><span>100% (₹{selectedWorker ? selectedWorker.hourlyRate : selectedCrew?.dailyRatePerPerson})</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 16, lineHeight: 1.4 }}>
                      <ShieldCheck size={14} color="#0070C0" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                      Protected by Tamil Nadu Cooperative Societies Act. Payment held in cooperative escrow until job satisfaction.
                    </div>
                    <button className="btn-book-primary" style={{ width: '100%' }} onClick={confirmBooking}>
                      <IndianRupee size={18} /><span>Confirm & Pay via UPI (₹{selectedWorker ? selectedWorker.hourlyRate : selectedCrew?.dailyRatePerPerson})</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// WORKER PLATFORM
// ─────────────────────────────────────────────────────────────────────────────
const WorkerPlatform: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<WorkerTab>('jobs');
  const [isOnline, setIsOnline] = useState(true);
  const [jobFilter, setJobFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [acceptedJobs, setAcceptedJobs] = useState<string[]>([]);
  const [declinedJobs, setDeclinedJobs] = useState<string[]>([]);
  const worker = SEEDED_WORKERS[0]; // Karthik Subramanian

  const totalEarnings = MOCK_WORKER_JOBS.filter(j => j.status === 'completed').reduce((s, j) => s + j.pay, 0);
  const pendingJobs = MOCK_WORKER_JOBS.filter(j => j.status === 'pending');
  const filteredJobs = MOCK_WORKER_JOBS.filter(j => jobFilter === 'all' || j.status === jobFilter);

  const renderJobs = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f4f9fd' }}>
      {/* Availability Toggle */}
      <div style={{ background: isOnline ? 'linear-gradient(135deg, #2E7D32, #388e3c)' : 'linear-gradient(135deg, #475569, #64748b)', borderRadius: 16, padding: 14, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
        <div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Availability Status</div>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{isOnline ? '🟢 Online & Available' : '⚫ Offline / Resting'}</div>
          <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>{isOnline ? 'Customers can find and book you' : 'Set yourself online to receive bookings'}</div>
        </div>
        <button onClick={() => setIsOnline(!isOnline)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 24, padding: '10px 18px', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[
          { label: 'Pending', value: pendingJobs.length, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Completed', value: worker.jobsCompleted, color: '#059669', bg: '#ecfdf5' },
          { label: 'Rating', value: worker.ratingAverage, color: '#b45309', bg: '#fffbeb' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {(['all', 'pending', 'completed'] as const).map(f => (
          <button key={f} onClick={() => setJobFilter(f)} style={{ flex: 1, padding: '7px', borderRadius: 10, border: 'none', background: jobFilter === f ? '#1F497D' : '#fff', color: jobFilter === f ? '#fff' : '#475569', fontWeight: 700, fontSize: 11, cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {/* Job cards */}
      {filteredJobs.map(job => {
        const accepted = acceptedJobs.includes(job.id);
        const declined = declinedJobs.includes(job.id);
        return (
          <div key={job.id} style={{ background: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, boxShadow: '0 2px 8px rgba(31,73,125,0.08)', border: `1px solid ${job.status === 'pending' && !accepted && !declined ? '#bfdbfe' : '#e2e8f0'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1F497D' }}>{job.customer}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{job.service} • {job.type.replace('_', '-')}</div>
              </div>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#2E7D32' }}>₹{job.pay}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} /> {job.date} {job.time}</span>
              <span style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={11} /> {job.location}</span>
            </div>
            <div style={{ fontSize: 11, color: '#E0761C', fontWeight: 700, marginBottom: 8 }}>100% payout to you • ₹0 platform commission</div>
            {job.status === 'pending' && !accepted && !declined && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setAcceptedJobs(p => [...p, job.id])} style={{ flex: 1, background: '#2E7D32', border: 'none', borderRadius: 10, padding: 10, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <CheckCircle2 size={14} /> Accept
                </button>
                <button onClick={() => setDeclinedJobs(p => [...p, job.id])} style={{ flex: 1, background: '#f1f5f9', border: 'none', borderRadius: 10, padding: 10, color: '#475569', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <XCircle size={14} /> Decline
                </button>
              </div>
            )}
            {(accepted || declined || job.status === 'completed') && (
              <div style={{ padding: '8px 12px', borderRadius: 10, background: accepted || job.status === 'completed' ? '#ecfdf5' : '#fef2f2', color: accepted || job.status === 'completed' ? '#059669' : '#dc2626', fontWeight: 700, fontSize: 12, textAlign: 'center' }}>
                {job.status === 'completed' ? '✓ Completed — Paid' : accepted ? '✓ Accepted — Dispatch confirmed' : '✗ Declined — No penalty'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderEarnings = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f4f9fd' }}>
      <div style={{ background: 'linear-gradient(135deg, #1F497D, #0070C0)', borderRadius: 18, padding: 20, marginBottom: 14, color: '#fff' }}>
        <div style={{ fontSize: 12, opacity: 0.8 }}>October 2026 Earnings</div>
        <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4 }}>₹{totalEarnings.toLocaleString()}</div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Platform Commission Deducted: ₹0.00 (0%)</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>3</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Jobs This Month</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>₹437</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Best Payout</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px', flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>4.88★</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Avg Rating</div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: '#1F497D', marginBottom: 10 }}>Transaction History</div>
      {MOCK_WORKER_JOBS.filter(j => j.status === 'completed').map(j => (
        <div key={j.id} style={{ background: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(31,73,125,0.06)' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1F497D' }}>{j.customer}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{j.date} • {j.location}</div>
            <div style={{ fontSize: 10, color: '#E0761C', fontWeight: 600, marginTop: 2 }}>Commission ₹0 (Cooperative model)</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#2E7D32' }}>+₹{j.pay}</div>
            <div style={{ fontSize: 10, color: '#059669' }}>UPI • Settled</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWorkerWelfare = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f4f9fd' }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#1F497D', marginBottom: 14 }}>My Welfare Benefits</div>
      <div style={{ background: 'linear-gradient(135deg, #2E7D32, #388e3c)', borderRadius: 16, padding: 16, marginBottom: 14, color: '#fff' }}>
        <div style={{ fontSize: 12, opacity: 0.8 }}>Cooperative Welfare Fund Balance</div>
        <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}>₹1,250</div>
        <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>Funded by flat annual federation subscription — not from your earnings</div>
      </div>
      {[
        { icon: '📋', title: 'e-Shram UAN', value: 'UAN-TN-9283-4561', status: 'Verified ✓', statusColor: '#059669', bg: '#f0fdf4' },
        { icon: '🛡️', title: 'PMSBY (Accidental)', value: '₹2 Lakh Coverage', status: 'Active • ₹20/yr', statusColor: '#059669', bg: '#f0fdf4' },
        { icon: '❤️', title: 'PMJJBY (Life Cover)', value: '₹2 Lakh Coverage', status: 'Active • ₹436/yr', statusColor: '#059669', bg: '#f0fdf4' },
        { icon: '🏛️', title: 'Society Membership', value: 'Kongu Artisans & Electrical Labour Coop', status: 'Active Member', statusColor: '#2563eb', bg: '#eff6ff' },
        { icon: '⭐', title: 'Welfare Incentive Credits', value: 'Night-shift bonus: ₹150 credited', status: 'This month', statusColor: '#b45309', bg: '#fffbeb' },
      ].map(item => (
        <div key={item.title} style={{ background: item.bg, borderRadius: 14, padding: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1F497D' }}>{item.title}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{item.value}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: item.statusColor }}>{item.status}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWorkerProfile = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f4f9fd' }}>
      <div style={{ background: 'linear-gradient(135deg, #1F497D, #0070C0)', borderRadius: 18, padding: 20, marginBottom: 14, color: '#fff', display: 'flex', gap: 14, alignItems: 'center' }}>
        <img src={worker.avatarUrl} alt={worker.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.4)' }} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{worker.name}</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{worker.serviceName}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '2px 8px' }}>★ {worker.ratingAverage}</span>
            <span style={{ fontSize: 10, background: '#ecfdf5', color: '#059669', borderRadius: 10, padding: '2px 8px', fontWeight: 700 }}>Aadhaar e-KYC ✓</span>
          </div>
        </div>
      </div>
      {[
        { label: 'Certificate', value: worker.certificateName, icon: '🏆' },
        { label: 'Experience', value: `${worker.experienceYears} years`, icon: '📅' },
        { label: 'Society', value: worker.societyName, icon: '🏛️' },
        { label: 'DIGIPIN Location', value: worker.digipin, icon: '📍' },
        { label: 'Phone Type', value: worker.phoneType === 'smartphone' ? 'Smartphone' : 'Keypad (Pre-book only)', icon: '📱' },
        { label: 'Languages', value: worker.languages.join(', '), icon: '🌐' },
        { label: 'Night Availability', value: worker.availableNights ? 'Yes (+25% premium)' : 'No', icon: '🌙' },
        { label: 'Emergency Jobs', value: worker.acceptsEmergency ? 'Accepted' : 'No', icon: '⚡' },
      ].map(item => (
        <div key={item.label} style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(31,73,125,0.06)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 12, color: '#475569' }}>{item.label}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1F497D', maxWidth: '55%', textAlign: 'right' }}>{item.value}</span>
        </div>
      ))}
      <button onClick={onBack} style={{ width: '100%', marginTop: 8, background: 'none', border: '2px solid #e2e8f0', borderRadius: 12, padding: 12, color: '#475569', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}>
        <LogOut size={16} /> Switch Role
      </button>
    </div>
  );

  return (
    <div className="device-wrapper">
      <div className="device-frame">
        <div className="phone-notch"><div className="notch-camera" /></div>
        <div className="status-bar"><span>09:41</span><div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span>5G</span><span>100%</span></div></div>

        <header className="app-header">
          <div className="header-top">
            <div className="brand-row">
              <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginRight: 4 }}>
                <ArrowRight size={18} color="#1F497D" style={{ transform: 'rotate(180deg)' }} />
              </button>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #2E7D32, #4caf50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={20} color="#fff" />
              </div>
              <div style={{ marginLeft: 8 }}>
                <div className="app-title" style={{ fontSize: 16 }}>TaskLink Worker</div>
                <div className="app-subtitle">Karthik Subramanian</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: isOnline ? '#4caf50' : '#94a3b8', boxShadow: isOnline ? '0 0 6px #4caf50' : 'none' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: isOnline ? '#2E7D32' : '#64748b' }}>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </header>

        {activeTab === 'jobs' ? renderJobs()
          : activeTab === 'earnings' ? renderEarnings()
            : activeTab === 'welfare' ? renderWorkerWelfare()
              : renderWorkerProfile()}

        <nav className="bottom-nav-bar">
          <button className={`nav-tab-item ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}><Briefcase size={22} /><span>Job Inbox</span></button>
          <button className={`nav-tab-item ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => setActiveTab('earnings')}><Wallet size={22} /><span>Earnings</span></button>
          <button className={`nav-tab-item ${activeTab === 'welfare' ? 'active' : ''}`} onClick={() => setActiveTab('welfare')}><HeartHandshake size={22} /><span>Welfare</span></button>
          <button className={`nav-tab-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><User size={22} /><span>Profile</span></button>
        </nav>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN / COOPERATIVE PLATFORM
// ─────────────────────────────────────────────────────────────────────────────
const AdminPlatform: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [queueWorkers, setQueueWorkers] = useState(MOCK_QUEUE);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [matchingWeights, setMatchingWeights] = useState({ skill: 0.25, availability: 0.20, distance: 0.20, reliability: 0.15, workload: 0.10, customerPref: 0.10 });
  const [surgeCap, setSurgeCap] = useState(1.5);
  const [nightPremium, setNightPremium] = useState(25);
  const [holidayPremium, setHolidayPremium] = useState(50);
  const [savedWeights, setSavedWeights] = useState(false);
  const [selectedFed, setSelectedFed] = useState<'coimbatore' | 'tirupur'>('coimbatore');

  const kpis = {
    coimbatore: { activeWorkers: 18, totalWorkers: 24, pendingVerifications: 3, jobsToday: 12, commissionCollected: 0, avgEarnings: 412, keypadPct: 33, eshramPct: 87 },
    tirupur: { activeWorkers: 11, totalWorkers: 14, pendingVerifications: 1, jobsToday: 7, commissionCollected: 0, avgEarnings: 390, keypadPct: 29, eshramPct: 79 },
  }[selectedFed];

  const renderOverview = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f4f9fd' }}>
      {/* Federation Switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {(['coimbatore', 'tirupur'] as const).map(f => (
          <button key={f} onClick={() => setSelectedFed(f)} style={{ flex: 1, padding: 10, borderRadius: 12, border: 'none', background: selectedFed === f ? '#1F497D' : '#fff', color: selectedFed === f ? '#fff' : '#475569', fontWeight: 700, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize', boxShadow: '0 1px 4px rgba(31,73,125,0.08)' }}>
            {f === 'coimbatore' ? '🏛️ Coimbatore' : '🏭 Tirupur'}
          </button>
        ))}
      </div>

      {/* Commission proof */}
      <div style={{ background: 'linear-gradient(135deg, #0b2a4a, #1F497D)', borderRadius: 16, padding: 16, marginBottom: 14, color: '#fff' }}>
        <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>Zero Commission Proof — Cooperative Ledger</div>
        <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4, color: '#4ade80' }}>₹0.00</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>Platform commission collected from all {kpis.totalWorkers} workers to date</div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>Verified by immutable double-entry cooperative ledger</div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Active Workers', value: kpis.activeWorkers, icon: '👷', color: '#2563eb', bg: '#eff6ff' },
          { label: 'Jobs Today', value: kpis.jobsToday, icon: '📋', color: '#2E7D32', bg: '#f0fdf4' },
          { label: 'Pending Verification', value: kpis.pendingVerifications, icon: '⏳', color: '#b45309', bg: '#fffbeb' },
          { label: 'Avg Worker Earnings', value: `₹${kpis.avgEarnings}`, icon: '💰', color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Keypad Workers', value: `${kpis.keypadPct}%`, icon: '📟', color: '#0369a1', bg: '#f0f9ff' },
          { label: 'e-Shram Coverage', value: `${kpis.eshramPct}%`, icon: '📋', color: '#059669', bg: '#ecfdf5' },
        ].map(k => (
          <div key={k.label} style={{ background: k.bg, borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 22 }}>{k.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: k.color, marginTop: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: '#475569' }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Subscription */}
      <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 14, padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#E0761C', marginBottom: 4 }}>
          🏛️ {selectedFed === 'coimbatore' ? 'Coimbatore' : 'Tirupur'} Federation Subscription
        </div>
        <div style={{ fontSize: 12, color: '#475569' }}>Flat Annual Fee: ₹50,000/year</div>
        <div style={{ fontSize: 12, color: '#059669', fontWeight: 700, marginTop: 4 }}>Status: Paid ✓ • Per-job platform fee: ₹0</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Valid: Apr 2026 – Mar 2027</div>
      </div>
    </div>
  );

  const renderQueue = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f4f9fd' }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#1F497D', marginBottom: 6 }}>Verification Queue</div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>Review and approve new cooperative worker registrations</div>
      {queueWorkers.map(w => {
        const approved = approvedIds.includes(w.id);
        const rejected = rejectedIds.includes(w.id);
        return (
          <div key={w.id} style={{ background: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, boxShadow: '0 2px 8px rgba(31,73,125,0.08)', border: `1px solid ${approved ? '#bbf7d0' : rejected ? '#fecaca' : '#e2e8f0'}` }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #E9F2FB, #bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👷</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1F497D' }}>{w.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{w.trade} • {w.experience} yrs exp</div>
                <div style={{ fontSize: 11, color: '#0070C0', marginTop: 2 }}>{w.society}</div>
              </div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 11, color: '#475569' }}>
              <div>📱 {w.phone}</div>
              <div>🆔 Membership: {w.membershipId}</div>
              <div>📅 Submitted: {new Date(w.submittedAt).toLocaleDateString('en-IN')}</div>
            </div>
            {!approved && !rejected ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setApprovedIds(p => [...p, w.id])} style={{ flex: 1, background: '#2E7D32', border: 'none', borderRadius: 10, padding: 10, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <CheckCircle2 size={14} /> Approve & Badge
                </button>
                <button onClick={() => setRejectedIds(p => [...p, w.id])} style={{ flex: 1, background: '#f1f5f9', border: 'none', borderRadius: 10, padding: 10, color: '#dc2626', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <XCircle size={14} /> Reject
                </button>
              </div>
            ) : (
              <div style={{ padding: '8px 12px', borderRadius: 10, background: approved ? '#ecfdf5' : '#fef2f2', color: approved ? '#059669' : '#dc2626', fontWeight: 700, fontSize: 12, textAlign: 'center' }}>
                {approved ? '✓ Approved — Cooperative Member Badge Assigned' : '✗ Rejected — Applicant notified'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderRules = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f4f9fd' }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#1F497D', marginBottom: 14 }}>Live Rules Editor</div>

      {/* Matching weights */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 8px rgba(31,73,125,0.08)' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#1F497D', marginBottom: 12 }}>⚖️ Six-Factor Matching Weights</div>
        {Object.entries(matchingWeights).map(([key, val]) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color: '#475569', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
              <span style={{ fontWeight: 800, color: '#1F497D' }}>{(val * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min={0} max={50} step={5} value={val * 100}
              onChange={e => setMatchingWeights(p => ({ ...p, [key]: Number(e.target.value) / 100 }))}
              style={{ width: '100%', accentColor: '#0070C0' }} />
          </div>
        ))}
        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 12 }}>
          Total: {(Object.values(matchingWeights).reduce((a, b) => a + b, 0) * 100).toFixed(0)}% (must equal 100%)
        </div>
        <button onClick={() => { setSavedWeights(true); setTimeout(() => setSavedWeights(false), 2500); }}
          style={{ width: '100%', background: '#1F497D', border: 'none', borderRadius: 10, padding: 12, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          {savedWeights ? '✓ Weights Saved & Live Applied!' : 'Save & Apply Live'}
        </button>
      </div>

      {/* Pricing rules */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: '0 2px 8px rgba(31,73,125,0.08)' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#1F497D', marginBottom: 12 }}>📈 Surge & Premium Rules</div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ fontWeight: 600, color: '#475569' }}>Surge Cap Multiplier</span>
            <span style={{ fontWeight: 800, color: '#E0761C' }}>{surgeCap}x</span>
          </div>
          <input type="range" min={1.0} max={2.0} step={0.1} value={surgeCap} onChange={e => setSurgeCap(Number(e.target.value))} style={{ width: '100%', accentColor: '#E0761C' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ fontWeight: 600, color: '#475569' }}>Night Premium (10PM–6AM)</span>
            <span style={{ fontWeight: 800, color: '#7c3aed' }}>+{nightPremium}%</span>
          </div>
          <input type="range" min={10} max={50} step={5} value={nightPremium} onChange={e => setNightPremium(Number(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed' }} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span style={{ fontWeight: 600, color: '#475569' }}>Holiday Premium</span>
            <span style={{ fontWeight: 800, color: '#2E7D32' }}>+{holidayPremium}%</span>
          </div>
          <input type="range" min={25} max={100} step={5} value={holidayPremium} onChange={e => setHolidayPremium(Number(e.target.value))} style={{ width: '100%', accentColor: '#2E7D32' }} />
        </div>
      </div>
    </div>
  );

  const renderDPDP = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f4f9fd' }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#1F497D', marginBottom: 14 }}>DPDP Act 2023 Compliance</div>
      {[
        { icon: '📊', title: 'Section 11 — Data Access Export', desc: 'Generate statutory data export for any user on request within 72 hours', action: 'Generate Export', color: '#2563eb', bg: '#eff6ff' },
        { icon: '🗑️', title: 'Section 12 — Right to be Forgotten', desc: 'Pseudonymize and erase personal data. Irreversible — creates audit log', action: 'Execute Erasure', color: '#dc2626', bg: '#fef2f2' },
        { icon: '📍', title: 'Location Auto-Purge', desc: 'Purge location history 24h after job completion per DPDP Section 8(9)', action: 'Run Purge', color: '#059669', bg: '#f0fdf4' },
        { icon: '⚖️', title: 'Statutory DPO Contact', desc: 'Dr. R. Arumugam IAS (Retd.) — Data Protection Officer', action: 'View Details', color: '#7c3aed', bg: '#f5f3ff' },
      ].map(item => (
        <div key={item.title} style={{ background: item.bg, borderRadius: 16, padding: 14, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1F497D' }}>{item.title}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          </div>
          <button style={{ width: '100%', background: item.color, border: 'none', borderRadius: 10, padding: 10, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }} onClick={() => alert(`${item.action} executed. In production this calls the live API endpoint.\n\nAll DPDP operations are logged immutably in the cooperative audit trail.`)}>
            {item.action}
          </button>
        </div>
      ))}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14, padding: 14, fontSize: 11, color: '#92400e', lineHeight: 1.5 }}>
        ⚠️ All DPDP operations are irreversible and create immutable audit log entries under the Tamil Nadu Cooperative Societies Act. Only authorized Federation Admin may execute erasure.
      </div>
    </div>
  );

  const renderAdminWelfare = () => (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', background: '#f4f9fd' }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#1F497D', marginBottom: 14 }}>Worker Welfare Management</div>
      <div style={{ background: 'linear-gradient(135deg, #2E7D32, #388e3c)', borderRadius: 16, padding: 16, marginBottom: 14, color: '#fff' }}>
        <div style={{ fontSize: 12, opacity: 0.8 }}>Total Welfare Fund Disbursed (This Year)</div>
        <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4 }}>₹48,500</div>
        <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>Funded by flat annual cooperative subscription — zero per-job deduction</div>
      </div>
      {[
        { label: 'e-Shram Verified Workers', value: `${kpis.eshramPct}%`, icon: '📋', color: '#059669', bg: '#f0fdf4' },
        { label: 'PMSBY Covered Workers', value: '89%', icon: '🛡️', color: '#2563eb', bg: '#eff6ff' },
        { label: 'PMJJBY Covered Workers', value: '74%', icon: '❤️', color: '#dc2626', bg: '#fef2f2' },
        { label: 'Welfare Fund Balance', value: '₹1,25,000', icon: '💰', color: '#7c3aed', bg: '#f5f3ff' },
      ].map(k => (
        <div key={k.label} style={{ background: k.bg, borderRadius: 12, padding: 14, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 20 }}>{k.icon}</span>
            <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>{k.label}</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 900, color: k.color }}>{k.value}</span>
        </div>
      ))}
      <button style={{ width: '100%', background: '#1F497D', border: 'none', borderRadius: 12, padding: 14, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={() => alert('PMSBY & PMJJBY renewal SMS/IVR reminders dispatched to 6 workers due for renewal this month.')}>
        <Bell size={16} /> Send Insurance Renewal Reminders
      </button>
    </div>
  );

  return (
    <div className="device-wrapper">
      <div className="device-frame">
        <div className="phone-notch"><div className="notch-camera" /></div>
        <div className="status-bar"><span>09:41</span><div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span>5G</span><span>100%</span></div></div>

        <header className="app-header">
          <div className="header-top">
            <div className="brand-row">
              <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginRight: 4 }}>
                <ArrowRight size={18} color="#1F497D" style={{ transform: 'rotate(180deg)' }} />
              </button>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #E0761C, #ff9138)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={20} color="#fff" />
              </div>
              <div style={{ marginLeft: 8 }}>
                <div className="app-title" style={{ fontSize: 16 }}>Cooperative Admin</div>
                <div className="app-subtitle">S. Ramanathan • Society Admin</div>
              </div>
            </div>
            <span style={{ fontSize: 10, background: '#fff7ed', color: '#E0761C', padding: '4px 10px', borderRadius: 20, fontWeight: 700, border: '1px solid #fed7aa' }}>
              {selectedFed === 'coimbatore' ? 'CBE' : 'TPR'}
            </span>
          </div>
        </header>

        {activeTab === 'overview' ? renderOverview()
          : activeTab === 'queue' ? renderQueue()
            : activeTab === 'rules' ? renderRules()
              : activeTab === 'welfare' ? renderAdminWelfare()
                : renderDPDP()}

        <nav className="bottom-nav-bar">
          <button className={`nav-tab-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><Activity size={22} /><span>Overview</span></button>
          <button className={`nav-tab-item ${activeTab === 'queue' ? 'active' : ''}`} onClick={() => setActiveTab('queue')} style={{ position: 'relative' }}>
            <Users size={22} /><span>Verify</span>
            {queueWorkers.filter(w => !approvedIds.includes(w.id) && !rejectedIds.includes(w.id)).length > 0 && (
              <span style={{ position: 'absolute', top: 4, right: 8, background: '#ef4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {queueWorkers.filter(w => !approvedIds.includes(w.id) && !rejectedIds.includes(w.id)).length}
              </span>
            )}
          </button>
          <button className={`nav-tab-item ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}><Settings size={22} /><span>Rules</span></button>
          <button className={`nav-tab-item ${activeTab === 'welfare' ? 'active' : ''}`} onClick={() => setActiveTab('welfare')}><HeartHandshake size={22} /><span>Welfare</span></button>
          <button className={`nav-tab-item ${activeTab === 'dpdp' ? 'active' : ''}`} onClick={() => setActiveTab('dpdp')}><FileText size={22} /><span>DPDP</span></button>
        </nav>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP — ROLE ROUTER
// ─────────────────────────────────────────────────────────────────────────────
export const App: React.FC = () => {
  const [role, setRole] = useState<RoleType>('select');

  if (role === 'customer') return <CustomerPlatform onBack={() => setRole('select')} />;
  if (role === 'worker') return <WorkerPlatform onBack={() => setRole('select')} />;
  if (role === 'admin') return <AdminPlatform onBack={() => setRole('select')} />;
  return <RoleSelector onSelect={setRole} />;
};
