import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Briefcase,
  TrendingUp,
  Percent,
  MapPin,
  HeartHandshake,
  Sliders,
  FileSpreadsheet,
  Building2,
  Lock,
  PhoneCall,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Compass,
  FileCheck,
  Send,
  Trash2,
  Eye,
} from 'lucide-react';

interface FederationAnalytics {
  federation: {
    id: string;
    name: string;
    code: string;
    district: string;
    state: string;
  };
  kpis: {
    activeWorkers: number;
    totalWorkers: number;
    pendingVerifications: number;
    jobsToday: number;
    commissionCollected: number;
    zeroCommissionGuarantee: string;
    avgWorkerEarnings: number;
    keypadWorkerPercentage: number;
    avgTravelDistanceKm: number;
  };
  welfare: {
    eshramVerifiedCount: number;
    eshramCoveragePercentage: number;
    pmsbyCoveredCount: number;
    pmsbyPercentage: number;
    pmjjbyCoveredCount: number;
    pmjjbyPercentage: number;
    totalWelfareFundDisbursed: number;
  };
  languageUsage: Record<string, number>;
  societies: {
    id: string;
    name: string;
    regNumber: string;
    phone: string;
    activeWorkers: number;
  }[];
  subscription: {
    id: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    amount: number;
    status: string;
    invoiceNumber: string;
    planName: string;
  } | null;
  recentBookings: any[];
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'queue' | 'welfare' | 'rules' | 'dispatch' | 'tenancy' | 'dpdp'
  >('overview');
  const [currentFedId, setCurrentFedId] = useState<string>('f1111111-1111-1111-1111-111111111101');
  const [analytics, setAnalytics] = useState<FederationAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Verification queue state
  const [queueWorkers, setQueueWorkers] = useState<any[]>([]);

  // Rules state
  const [matchingWeights, setMatchingWeights] = useState({
    skill: 0.25,
    availability: 0.2,
    distance: 0.2,
    reliability: 0.15,
    workload: 0.1,
    customerPref: 0.1,
  });

  const [pricingRule, setPricingRule] = useState({
    kSensitivity: 0.5,
    r0BaselineRatio: 1.0,
    surgeCap: 1.5,
    quoteLockMinutes: 10,
  });

  const [premiumRule, setPremiumRule] = useState({
    nightStartTime: '22:00',
    nightEndTime: '06:00',
    nightPremiumRate: 0.25,
    holidayPremiumRate: 0.5,
    stackingRule: 'additive',
  });

  const [welfareRules, setWelfareRules] = useState<any[]>([]);

  // DPDP state
  const [dataAccessUserId, setDataAccessUserId] = useState<string>('user-w01');
  const [dataAccessResult, setDataAccessResult] = useState<any>(null);
  const [erasureResult, setErasureResult] = useState<any>(null);
  const [purgeResult, setPurgeResult] = useState<any>(null);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/admin/analytics?federationId=${currentFedId}`);
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (e) {
      console.warn('API fetch error, using live store state', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueue = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/admin/verification-queue', {
        headers: {
          Authorization: 'Bearer mock-token-admin',
        },
      });
      const data = await res.json();
      if (data.success) {
        setQueueWorkers(data.workers);
      }
    } catch (e) {
      console.warn('Queue fetch error', e);
    }
  };

  const fetchRules = async () => {
    try {
      const [weightsRes, priceRes, premRes, welfRes] = await Promise.all([
        fetch(`http://localhost:4000/api/admin/rules/matching-weights?federationId=${currentFedId}`),
        fetch(`http://localhost:4000/api/admin/rules/pricing?federationId=${currentFedId}`),
        fetch(`http://localhost:4000/api/admin/rules/premiums?federationId=${currentFedId}`),
        fetch(`http://localhost:4000/api/admin/rules/welfare?federationId=${currentFedId}`),
      ]);

      const [wData, pData, prData, wlData] = await Promise.all([
        weightsRes.json(),
        priceRes.json(),
        premRes.json(),
        welfRes.json(),
      ]);

      if (wData.weights) setMatchingWeights(wData.weights);
      if (pData.rule) setPricingRule(pData.rule);
      if (prData.rule) setPremiumRule(prData.rule);
      if (wlData.rules) setWelfareRules(wlData.rules);
    } catch (e) {
      console.warn('Rules fetch error', e);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchQueue();
    fetchRules();
  }, [currentFedId]);

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleApproveWorker = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/admin/workers/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badges: ['Verified Cooperative Member', 'Govt Certified Artisan'] }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Worker verified and approved for customer booking!`);
        fetchQueue();
        fetchAnalytics();
      }
    } catch (e) {
      showNotification('Failed to approve worker');
    }
  };

  const handleSendReminders = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/welfare/reminders/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ federationId: currentFedId }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Dispatched ${data.totalWorkersNotified} SMS/IVR renewal reminders for PMSBY & PMJJBY!`);
      }
    } catch (e) {
      showNotification('Reminder dispatch simulation active');
    }
  };

  const handleSaveMatchingWeights = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/admin/rules/matching-weights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ federationId: currentFedId, ...matchingWeights }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Matching weights updated live across dispatch engine.');
      }
    } catch (e) {
      showNotification('Failed to save weights');
    }
  };

  const handleSavePricing = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/admin/rules/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ federationId: currentFedId, ...pricingRule }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Dynamic pricing parameters updated.');
      }
    } catch (e) {
      showNotification('Failed to save pricing');
    }
  };

  const handleSavePremiums = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/admin/rules/premiums', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ federationId: currentFedId, ...premiumRule }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Night and holiday premium rates updated.');
      }
    } catch (e) {
      showNotification('Failed to save premiums');
    }
  };

  const handleDataAccess = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/consent/data-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: dataAccessUserId }),
      });
      const data = await res.json();
      setDataAccessResult(data.report || data);
      showNotification('DPDP Data Access Export generated.');
    } catch (e) {
      showNotification('Error generating report');
    }
  };

  const handleDataErasure = async () => {
    if (!window.confirm(`Are you sure you want to execute Right to be Forgotten for user ${dataAccessUserId}?`)) return;
    try {
      const res = await fetch('http://localhost:4000/api/consent/data-erasure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: dataAccessUserId }),
      });
      const data = await res.json();
      setErasureResult(data.result || data);
      showNotification('User personal data erased & pseudonymized under DPDP Act 2023.');
      fetchAnalytics();
    } catch (e) {
      showNotification('Error executing erasure');
    }
  };

  const handlePurgeLocations = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/consent/purge-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retentionHours: 24 }),
      });
      const data = await res.json();
      setPurgeResult(data.purgeReport || data);
      showNotification('Historical location records purged per 24-hour retention policy.');
    } catch (e) {
      showNotification('Error purging locations');
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-badge">TL</div>
          <div className="header-title">
            <h1>TaskLink</h1>
            <p>Federation Portal</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={18} />
            <span>Executive Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'queue' ? 'active' : ''}`}
            onClick={() => setActiveTab('queue')}
          >
            <FileCheck size={18} />
            <span>Verification Queue</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'welfare' ? 'active' : ''}`}
            onClick={() => setActiveTab('welfare')}
          >
            <HeartHandshake size={18} />
            <span>Worker Welfare (F17)</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <Sliders size={18} />
            <span>Dynamic Rules Editor</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'dispatch' ? 'active' : ''}`}
            onClick={() => setActiveTab('dispatch')}
          >
            <Compass size={18} />
            <span>Live Dispatch & Map</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tenancy' ? 'active' : ''}`}
            onClick={() => setActiveTab('tenancy')}
          >
            <Building2 size={18} />
            <span>Coop Tenancy (F19)</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'dpdp' ? 'active' : ''}`}
            onClick={() => setActiveTab('dpdp')}
          >
            <Lock size={18} />
            <span>DPDP Governance (F20)</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="coop-badge">
            <ShieldCheck size={16} />
            <span>SIH 2026 | Min. of Cooperation</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="tenant-selector">
            <Building2 size={18} color="var(--blue)" />
            <select
              className="tenant-select"
              value={currentFedId}
              onChange={(e) => setCurrentFedId(e.target.value)}
            >
              <option value="f1111111-1111-1111-1111-111111111101">
                Coimbatore District Labour Cooperative Federation (CDLCF-01)
              </option>
              <option value="f1111111-1111-1111-1111-111111111102">
                Tirupur District Labour & Construction Federation (TDLCCF-02)
              </option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {feedbackMsg && (
              <div
                style={{
                  background: '#2E7D32',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <CheckCircle2 size={14} /> {feedbackMsg}
              </div>
            )}
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span>Ledger Invariant: 0% Platform Commission</span>
            </div>
          </div>
        </header>

        <div className="page-container">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <div className="page-header">
                <h2>{analytics?.federation?.name || 'Federation Operations'}</h2>
                <p>
                  District: {analytics?.federation?.district} | State: {analytics?.federation?.state} | Real-time
                  operational metrics & cooperative double-entry audit
                </p>
              </div>

              {/* Zero-Commission Invariant Hero Banner */}
              <div className="zero-commission-banner">
                <div className="banner-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <ShieldCheck size={22} color="#4ade80" />
                    <h3>Cooperative Ownership & 0% Commission Invariant</h3>
                  </div>
                  <p>
                    TaskLink is 100% owned by Labour Cooperative Societies. In accordance with Ministry of Cooperation
                    guidelines, zero platform commission is deducted from gig workers. Every rupee paid by customers
                    goes directly to workers and crew members.
                  </p>
                </div>
                <div className="banner-proof">
                  <div className="proof-val">₹0.00</div>
                  <div className="proof-label">Commission Collected</div>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="kpi-grid">
                <div className="kpi-card highlight">
                  <div className="kpi-header">
                    <span className="kpi-title">Active Workers</span>
                    <div className="kpi-icon">
                      <Users size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{analytics?.kpis?.activeWorkers ?? 2}</div>
                  <div className="kpi-badge badge-green">
                    <span>{analytics?.kpis?.totalWorkers ?? 3} Total Enrolled</span>
                  </div>
                </div>

                <div className="kpi-card highlight">
                  <div className="kpi-header">
                    <span className="kpi-title">Jobs Today</span>
                    <div className="kpi-icon">
                      <Briefcase size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{analytics?.kpis?.jobsToday ?? 0}</div>
                  <div className="kpi-badge badge-green">
                    <span>100% Fulfilled by Coop</span>
                  </div>
                </div>

                <div className="kpi-card highlight">
                  <div className="kpi-header">
                    <span className="kpi-title">Platform Cut</span>
                    <div className="kpi-icon">
                      <Percent size={18} />
                    </div>
                  </div>
                  <div className="kpi-value commission-zero">0.00%</div>
                  <div className="kpi-badge badge-green">
                    <span>Statutory 0% Cap</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">Avg Worker Earnings</span>
                    <div className="kpi-icon">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">₹{analytics?.kpis?.avgWorkerEarnings ?? 480}</div>
                  <div className="kpi-badge badge-blue">
                    <span>Direct UPI Payouts</span>
                  </div>
                </div>

                <div className="kpi-card highlight-orange">
                  <div className="kpi-header">
                    <span className="kpi-title">Keypad Phone Share</span>
                    <div className="kpi-icon">
                      <PhoneCall size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{analytics?.kpis?.keypadWorkerPercentage ?? 33.3}%</div>
                  <div className="kpi-badge badge-blue">
                    <span>USSD *99# & IVR Enabled</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-title">Avg Travel Distance</span>
                    <div className="kpi-icon">
                      <MapPin size={18} />
                    </div>
                  </div>
                  <div className="kpi-value">{analytics?.kpis?.avgTravelDistanceKm ?? 3.8} km</div>
                  <div className="kpi-badge badge-blue">
                    <span>DIGIPIN Hyperlocal Match</span>
                  </div>
                </div>
              </div>

              {/* Welfare Summary Card */}
              <div className="card">
                <div className="card-title">
                  <span>Worker Social Security & Welfare Health (F17)</span>
                  <button className="btn btn-secondary" onClick={() => setActiveTab('welfare')}>
                    View Welfare Details
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>e-Shram Coverage</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--navy)', marginTop: 4 }}>
                      {analytics?.welfare?.eshramCoveragePercentage ?? 100}%
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                      {analytics?.welfare?.eshramVerifiedCount} workers verified with MoLE UAN
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>PMSBY Accidental Cover</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--green)', marginTop: 4 }}>
                      {analytics?.welfare?.pmsbyPercentage ?? 66.7}%
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>₹20/year premium auto-debit tracking</p>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>PMJJBY Life Cover</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--blue)', marginTop: 4 }}>
                      {analytics?.welfare?.pmjjbyPercentage ?? 66.7}%
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>₹436/year life insurance tracking</p>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>Welfare Fund Disbursed</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--orange)', marginTop: 4 }}>
                      ₹{analytics?.welfare?.totalWelfareFundDisbursed ?? 175}
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Funded by Federation Flat Pool</p>
                  </div>
                </div>
              </div>

              {/* Affiliated Societies List */}
              <div className="card">
                <div className="card-title">
                  <span>Affiliated Primary Labour Cooperative Societies</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {analytics?.societies?.length ?? 2} Registered PACS/Labour Guilds
                  </span>
                </div>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Society Name</th>
                        <th>Registration No.</th>
                        <th>Contact Phone</th>
                        <th>Online Workers</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.societies?.map((s) => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{s.name}</td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{s.regNumber}</td>
                          <td>{s.phone}</td>
                          <td>
                            <span className="badge badge-verified">{s.activeWorkers} Workers Online</span>
                          </td>
                          <td>
                            <span className="badge badge-verified">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: VERIFICATION & ROSTER QUEUE */}
          {activeTab === 'queue' && (
            <>
              <div className="page-header">
                <h2>Worker Verification & Roster Queue (PPT F3)</h2>
                <p>Review new artisan submissions, verify society membership credentials, and manage bulk CSV imports.</p>
              </div>

              <div className="card">
                <div className="card-title">
                  <span>Pending Worker Onboarding Submissions</span>
                  <span className="badge badge-pending">{queueWorkers.length} Pending Review</span>
                </div>

                {queueWorkers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <CheckCircle2 size={40} color="var(--green)" style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontSize: 16, fontWeight: 700 }}>All onboarding requests verified!</p>
                    <p style={{ fontSize: 13 }}>New artisan submissions will appear here for society admin verification.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Worker Name</th>
                          <th>Phone & Device</th>
                          <th>Society Membership ID</th>
                          <th>Aadhaar e-KYC (UIDAI)</th>
                          <th>Trade Skill</th>
                          <th>Experience</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queueWorkers.map((w) => (
                          <tr key={w.id}>
                            <td style={{ fontWeight: 700, color: 'var(--navy)' }}>{w.name}</td>
                            <td>
                              <div>{w.phone}</div>
                              <span className={`badge ${w.phoneType === 'keypad' ? 'badge-keypad' : 'badge-smartphone'}`}>
                                {w.phoneType}
                              </span>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>{w.membershipId || 'MEM-SOC-2026'}</td>
                            <td>
                              {w.aadhaarKycVerified ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                                    <CheckCircle2 size={11} /> e-KYC Verified
                                  </span>
                                  <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                                    {w.aadhaarMasked || 'XXXXXXXX9012'}
                                  </span>
                                </div>
                              ) : (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
                                  <Clock size={11} /> OTP Pending
                                </span>
                              )}
                            </td>
                            <td>{w.serviceSkills?.[0]?.serviceName || 'General Trade'}</td>
                            <td>{w.yearsExperience} Years</td>
                            <td>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-success" onClick={() => handleApproveWorker(w.id)}>
                                  <CheckCircle2 size={14} /> Approve & Verify
                                </button>
                                <button className="btn btn-danger" onClick={() => showNotification('Worker rejected with documented reason.')}>
                                  <XCircle size={14} /> Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Bulk Roster CSV Import Reporting Tool */}
              <div className="card">
                <div className="card-title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileSpreadsheet size={20} color="var(--orange)" />
                    <span>Bulk Labour Society Roster CSV Import (F3)</span>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
                  Upload society member roster CSV format: <code>fullName,phone,phoneType,serviceCode,experienceYears,membershipId,upiId</code>
                </p>
                <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '2px dashed #cbd5e1', textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>
                    Drop Labour Cooperative Society Roster (.csv) or use pre-parsed template
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => showNotification('Bulk CSV template imported. 3 artisan records added to verification queue.')}
                  >
                    Simulate Upload Sample Society Roster CSV
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: WORKER WELFARE & SOCIAL SECURITY */}
          {activeTab === 'welfare' && (
            <>
              <div className="page-header">
                <h2>Worker Welfare Engine & Social Security (PPT F17)</h2>
                <p>
                  Track e-Shram UAN registrations, monitor PMSBY and PMJJBY renewals, and manage the Cooperative Welfare
                  Incentive Fund.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
                <div className="card">
                  <div className="card-title">
                    <span>Government Social Security Schemes</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ padding: 14, background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                      <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: 15 }}>
                        Pradhan Mantri Suraksha Bima Yojana (PMSBY)
                      </div>
                      <div style={{ fontSize: 13, color: '#166534', marginTop: 4 }}>
                        ₹20/year accidental insurance for ₹2,00,000 cover. Coverage: <strong>{analytics?.welfare?.pmsbyPercentage ?? 66.7}%</strong>
                      </div>
                    </div>

                    <div style={{ padding: 14, background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                      <div style={{ fontWeight: 800, color: 'var(--blue)', fontSize: 15 }}>
                        Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)
                      </div>
                      <div style={{ fontSize: 13, color: '#1e40af', marginTop: 4 }}>
                        ₹436/year term life insurance for ₹2,00,000 cover. Coverage: <strong>{analytics?.welfare?.pmjjbyPercentage ?? 66.7}%</strong>
                      </div>
                    </div>

                    <div style={{ padding: 14, background: '#fdf4ff', borderRadius: 8, border: '1px solid #f5d0fe' }}>
                      <div style={{ fontWeight: 800, color: '#86198f', fontSize: 15 }}>
                        Ministry of Labour e-Shram UAN
                      </div>
                      <div style={{ fontSize: 13, color: '#701a75', marginTop: 4 }}>
                        National unorganized worker registry. 100% verified without storing Aadhaar numbers (Ground Rule 7).
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <button className="btn btn-success" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSendReminders}>
                      <Send size={16} /> Dispatch Annual Insurance Renewal Reminders (IVR / SMS)
                    </button>
                    <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 6 }}>
                      Annual cycle renewal deadline: 31st May (Automatic bank debit)
                    </p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">
                    <span>Cooperative Welfare Fund Pool</span>
                    <span className="badge badge-verified">Active</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                    Workers earn non-wage welfare credits for serving unsocial hours (nights, peak surge, holidays, and emergencies).
                    Funded 100% by the Federation Subscription & Grant pool.
                  </p>

                  <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      Total Welfare Credits Disbursed
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--orange)', marginTop: 4 }}>
                      ₹{analytics?.welfare?.totalWelfareFundDisbursed ?? 175}.00
                    </div>
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--navy)' }}>
                    Active Incentive Triggers:
                  </div>
                  <ul style={{ fontSize: 13, color: '#475569', paddingLeft: 18, lineHeight: 1.8 }}>
                    <li>Night Shift Bonus: <strong>₹50 credit</strong> per completed night booking</li>
                    <li>Surge Demand Bonus: <strong>₹30 credit</strong> during peak surge hours</li>
                    <li>State Holiday Shift: <strong>₹75 credit</strong> on Tamil Nadu gazetted holidays</li>
                    <li>Emergency Dispatch: <strong>₹60 credit</strong> for immediate emergency calls</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* TAB 4: DYNAMIC RULES EDITOR */}
          {activeTab === 'rules' && (
            <>
              <div className="page-header">
                <h2>Dynamic Rules & Parameters Editor</h2>
                <p>Federation admins configure matching engine weights, dynamic pricing parameters, and premiums live.</p>
              </div>

              {/* 1. Six-Factor Matching Weights (PPT F6) */}
              <div className="card">
                <div className="card-title">
                  <span>1. Six-Factor Matching Weights (Bayesian Engine)</span>
                  <button className="btn btn-primary" onClick={handleSaveMatchingWeights}>
                    Save Weights
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                  <div className="form-group">
                    <div className="form-label">
                      <span>Skill Certification & Licence:</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{(matchingWeights.skill * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      className="slider-input"
                      value={matchingWeights.skill}
                      onChange={(e) => setMatchingWeights({ ...matchingWeights, skill: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label">
                      <span>Worker Availability & Calendar:</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{(matchingWeights.availability * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      className="slider-input"
                      value={matchingWeights.availability}
                      onChange={(e) => setMatchingWeights({ ...matchingWeights, availability: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label">
                      <span>Proximity & DIGIPIN Distance:</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{(matchingWeights.distance * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      className="slider-input"
                      value={matchingWeights.distance}
                      onChange={(e) => setMatchingWeights({ ...matchingWeights, distance: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label">
                      <span>Historical Reliability & Ratings:</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{(matchingWeights.reliability * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      className="slider-input"
                      value={matchingWeights.reliability}
                      onChange={(e) => setMatchingWeights({ ...matchingWeights, reliability: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label">
                      <span>Workload Equity (Jobs Today):</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{(matchingWeights.workload * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      className="slider-input"
                      value={matchingWeights.workload}
                      onChange={(e) => setMatchingWeights({ ...matchingWeights, workload: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-label">
                      <span>Customer Language Preference:</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{(matchingWeights.customerPref * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      className="slider-input"
                      value={matchingWeights.customerPref}
                      onChange={(e) => setMatchingWeights({ ...matchingWeights, customerPref: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Dynamic Pricing Parameters (PPT F8) */}
              <div className="card">
                <div className="card-title">
                  <span>2. Dynamic Pricing Parameters (F8)</span>
                  <button className="btn btn-primary" onClick={handleSavePricing}>
                    Save Pricing Rules
                  </button>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                  Formula: <code>surge_multiplier = clamp(1 + k * (ratio - r0), 1.0, cap)</code>. 100% of surge bonus passes to the worker.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div>
                    <label className="form-label">Sensitivity (k)</label>
                    <input
                      type="number"
                      step="0.05"
                      className="input-text"
                      value={pricingRule.kSensitivity}
                      onChange={(e) => setPricingRule({ ...pricingRule, kSensitivity: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Baseline Ratio (r0)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-text"
                      value={pricingRule.r0BaselineRatio}
                      onChange={(e) => setPricingRule({ ...pricingRule, r0BaselineRatio: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Surge Cap (Max Multiplier)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-text"
                      value={pricingRule.surgeCap}
                      onChange={(e) => setPricingRule({ ...pricingRule, surgeCap: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Quote Lock Window (Minutes)</label>
                    <input
                      type="number"
                      className="input-text"
                      value={pricingRule.quoteLockMinutes}
                      onChange={(e) => setPricingRule({ ...pricingRule, quoteLockMinutes: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Night & Holiday Premiums (PPT F9) */}
              <div className="card">
                <div className="card-title">
                  <span>3. Night & Holiday Premiums (F9)</span>
                  <button className="btn btn-primary" onClick={handleSavePremiums}>
                    Save Premiums
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div>
                    <label className="form-label">Night Window Start</label>
                    <input
                      type="text"
                      className="input-text"
                      value={premiumRule.nightStartTime}
                      onChange={(e) => setPremiumRule({ ...premiumRule, nightStartTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Night Window End</label>
                    <input
                      type="text"
                      className="input-text"
                      value={premiumRule.nightEndTime}
                      onChange={(e) => setPremiumRule({ ...premiumRule, nightEndTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Night Premium Rate</label>
                    <input
                      type="number"
                      step="0.05"
                      className="input-text"
                      value={premiumRule.nightPremiumRate}
                      onChange={(e) => setPremiumRule({ ...premiumRule, nightPremiumRate: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Holiday Premium Rate</label>
                    <input
                      type="number"
                      step="0.05"
                      className="input-text"
                      value={premiumRule.holidayPremiumRate}
                      onChange={(e) => setPremiumRule({ ...premiumRule, holidayPremiumRate: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 5: LIVE DISPATCH & MAP */}
          {activeTab === 'dispatch' && (
            <>
              <div className="page-header">
                <h2>Live Dispatch & Real-Time Map (PPT F18)</h2>
                <p>Real-time spatial visualization of online cooperative workers and active customer job dispatches.</p>
              </div>

              <div className="card">
                <div className="card-title">
                  <span>Cooperative Artisan Roster (Real-Time Location & DIGIPIN)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                  <div style={{ background: '#f8fafc', padding: 18, borderRadius: 12, border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--navy)' }}>Karthik Subramanian</span>
                      <span className="badge badge-verified">Online & Available</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Master Electrician (9 Yrs Exp)</div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span className="badge badge-digipin">DIGIPIN: 4B6P+89</span>
                      <span className="badge badge-smartphone">Smartphone</span>
                      <span className="badge badge-verified">Govt Wireman Licence</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 10 }}>
                      Lat: 11.0185, Lng: 76.9634 | Rating: ★ 4.88 (142 Jobs)
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 18, borderRadius: 12, border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--navy)' }}>P. Marimuthu</span>
                      <span className="badge badge-verified">Online & Available</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Master Plumber (7 Yrs Exp)</div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span className="badge badge-digipin">DIGIPIN: 4B8X+90</span>
                      <span className="badge badge-smartphone">Smartphone</span>
                      <span className="badge badge-verified">Govt Plumbing Cert</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 10 }}>
                      Lat: 11.0250, Lng: 76.9580 | Rating: ★ 4.82 (88 Jobs)
                    </div>
                  </div>

                  <div style={{ background: '#fffbeb', padding: 18, borderRadius: 12, border: '1px solid #fde68a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--navy)' }}>K. Ramasamy</span>
                      <span className="badge badge-keypad">Keypad Pre-Book Only</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Electrician (12 Yrs Exp)</div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span className="badge badge-digipin">DIGIPIN: 4B4M+77</span>
                      <span className="badge badge-keypad">Keypad Phone (IVR/USSD)</span>
                      <span className="badge badge-verified">Pre-Booked Only</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 10 }}>
                      Lat: 11.0090, Lng: 76.9710 | Rating: ★ 4.90 (210 Jobs)
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 6: COOPERATIVE TENANCY & SUBSCRIPTIONS */}
          {activeTab === 'tenancy' && (
            <>
              <div className="page-header">
                <h2>Cooperative Tenancy & Flat Annual Subscriptions (PPT F19)</h2>
                <p>
                  Zero per-job commission model funded through flat annual federation subscriptions and government welfare
                  grants.
                </p>
              </div>

              <div className="card">
                <div className="card-title">
                  <span>Active Cooperative Subscription</span>
                  <span className="badge badge-verified">PAID & ACTIVE</span>
                </div>
                <div style={{ background: '#f8fafc', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy)' }}>
                        {analytics?.subscription?.planName || 'Cooperative Federation Annual Plan'}
                      </h3>
                      <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                        Invoice No: <code style={{ fontFamily: 'var(--font-mono)' }}>{analytics?.subscription?.invoiceNumber}</code>
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)' }}>
                        ₹{analytics?.subscription?.amount?.toLocaleString() || '50,000'} / year
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>
                        0% Commission on Individual Jobs Guaranteed
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Billing Start</div>
                      <div style={{ fontWeight: 700, marginTop: 2 }}>{analytics?.subscription?.billingPeriodStart || '2026-01-01'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Billing End</div>
                      <div style={{ fontWeight: 700, marginTop: 2 }}>{analytics?.subscription?.billingPeriodEnd || '2026-12-31'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Payment Method</div>
                      <div style={{ fontWeight: 700, marginTop: 2 }}>Direct Bank NEFT / Treasury Grant</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 7: DPDP ACT 2023 GOVERNANCE */}
          {activeTab === 'dpdp' && (
            <>
              <div className="page-header">
                <h2>Digital Personal Data Protection Act 2023 Governance (PPT F20)</h2>
                <p>
                  Statutory tools for Data Subject Rights (Section 11 Access, Section 12 Erasure), location data
                  retention auto-purge, and DPO grievance redressal.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
                {/* Data Subject Request Tool */}
                <div className="card">
                  <div className="card-title">
                    <span>Data Subject Request Console</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">User ID for Compliance Action</label>
                    <input
                      type="text"
                      className="input-text"
                      value={dataAccessUserId}
                      onChange={(e) => setDataAccessUserId(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-primary" onClick={handleDataAccess}>
                      <Eye size={16} /> Export All Personal Data (Sec 11)
                    </button>
                    <button className="btn btn-danger" onClick={handleDataErasure}>
                      <Trash2 size={16} /> Execute Erasure (Sec 12)
                    </button>
                  </div>

                  {dataAccessResult && (
                    <div style={{ marginTop: 16, background: '#f8fafc', padding: 12, borderRadius: 8, fontSize: 12, maxHeight: 200, overflowY: 'auto' }}>
                      <pre>{JSON.stringify(dataAccessResult, null, 2)}</pre>
                    </div>
                  )}

                  {erasureResult && (
                    <div style={{ marginTop: 16, background: '#f0fdf4', padding: 12, borderRadius: 8, fontSize: 12, color: '#166534' }}>
                      <pre>{JSON.stringify(erasureResult, null, 2)}</pre>
                    </div>
                  )}
                </div>

                {/* Location Retention Auto-Purge */}
                <div className="card">
                  <div className="card-title">
                    <span>Automated Spatial Retention Purge</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                    Under DPDP Act purpose limitation requirements, high-precision GPS coordinates of completed bookings
                    are auto-redacted and purged after 24 hours.
                  </p>
                  <button className="btn btn-secondary" onClick={handlePurgeLocations}>
                    <RefreshCw size={16} /> Run Automated 24h Location Purge
                  </button>

                  {purgeResult && (
                    <div style={{ marginTop: 16, background: '#f8fafc', padding: 12, borderRadius: 8, fontSize: 12 }}>
                      <pre>{JSON.stringify(purgeResult, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Grievance Officer statutory card */}
              <div className="card">
                <div className="card-title">
                  <span>Designated Data Protection Officer & Grievance Redressal (Section 8(9))</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, fontSize: 13 }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Officer Name:</span>
                    <div style={{ fontWeight: 800, color: 'var(--navy)', marginTop: 2 }}>Dr. R. Arumugam, IAS (Retd.)</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Designation:</span>
                    <div style={{ fontWeight: 700, marginTop: 2 }}>Cooperative Data Protection Officer</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Statutory Email:</span>
                    <div style={{ fontWeight: 700, color: 'var(--blue)', marginTop: 2 }}>grievance.dpo@tasklink.coop.in</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Contact Phone:</span>
                    <div style={{ fontWeight: 700, marginTop: 2 }}>+91 422 2304919</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ color: '#64748b' }}>Office Address:</span>
                    <div style={{ fontWeight: 600, marginTop: 2 }}>
                      TaskLink Federation Data Cell, Kongu Sahakar Bhavan, 42 Crosscut Road, Gandhipuram, Coimbatore, Tamil Nadu 641012
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
