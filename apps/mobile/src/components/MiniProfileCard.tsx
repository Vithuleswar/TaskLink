import React from 'react';
import { Star, ShieldCheck, Phone, CheckCircle2, Images, CalendarCheck, MapPin, Zap } from 'lucide-react';
import { SeedWorker, SeedCrew } from '../data/mockSeed';

interface MiniProfileCardProps {
  item: SeedWorker | SeedCrew;
  isCrew?: boolean;
  onClose: () => void;
  onViewPortfolio?: () => void;
  onBook: () => void;
}

export const MiniProfileCard: React.FC<MiniProfileCardProps> = ({
  item,
  isCrew = false,
  onClose,
  onViewPortfolio,
  onBook,
}) => {
  if (isCrew) {
    const crew = item as SeedCrew;
    return (
      <div className="mini-profile-card">
        <div className="card-top-row">
          <div
            style={{
              width: '62px',
              height: '62px',
              borderRadius: '16px',
              background: '#2E7D32',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}
          >
            <span style={{ fontSize: '20px' }}>{crew.headcount}</span>
            <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>Crew</span>
          </div>

          <div className="worker-info-meta">
            <div className="worker-name-line">
              <span className="worker-name">{crew.name}</span>
              <button className="close-card-btn" onClick={onClose}>✕</button>
            </div>
            <div className="society-badge">
              <ShieldCheck size={13} />
              <span>{crew.societyName}</span>
            </div>
            <div className="skill-tag-line">
              Lead: {crew.leadName} • {crew.crewType.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-badges-row">
          <div className="stat-item">
            <span className="stat-val">
              <Star size={14} className="star-gold" fill="#f59e0b" />
              {crew.ratingAverage}
            </span>
            <span className="stat-label">{crew.ratingCount} Jobs</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">₹{crew.dailyRatePerPerson}</span>
            <span className="stat-label">Per person/day</span>
          </div>
          <div className="stat-item">
            <span className="stat-val" style={{ color: '#0070C0' }}>{crew.headcount} Artisans</span>
            <span className="stat-label">Verified Group</span>
          </div>
        </div>

        {/* Payout Transparency */}
        <div className="zero-comm-highlight-box">
          <div className="zero-comm-text">
            <CheckCircle2 size={16} />
            <span>0% Platform Commission • 100% split to workers</span>
          </div>
          <span className="zero-comm-pill">Cooperative</span>
        </div>

        <div style={{ marginBottom: '12px', fontSize: '12px', color: '#475569' }}>
          <strong>Members:</strong> {crew.memberNames.join(', ')}
        </div>

        <div className="action-buttons-group">
          <button className="btn-book-primary" style={{ flex: 1 }} onClick={onBook}>
            <CalendarCheck size={18} />
            <span>Book Cooperative Crew</span>
          </button>
        </div>
      </div>
    );
  }

  const worker = item as SeedWorker;

  return (
    <div className="mini-profile-card">
      <div className="card-top-row">
        <img src={worker.avatarUrl} alt={worker.name} className="worker-avatar-large" />

        <div className="worker-info-meta">
          <div className="worker-name-line">
            <span className="worker-name">{worker.name}</span>
            <button className="close-card-btn" onClick={onClose}>✕</button>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', margin: '3px 0' }}>
            <div className="society-badge">
              <ShieldCheck size={13} />
              <span>{worker.societyName}</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
              <CheckCircle2 size={12} color="#059669" />
              <span>Aadhaar e-KYC</span>
            </div>
          </div>

          <div className="skill-tag-line">
            {worker.serviceName} • {worker.experienceYears} yrs exp
            {worker.isKeypadPreBookOnly && (
              <span className="keypad-pill-tag">
                <Phone size={10} /> Pre-book Only
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-badges-row">
        <div className="stat-item">
          <span className="stat-val">
            <Star size={14} className="star-gold" fill="#f59e0b" />
            {worker.ratingAverage}
          </span>
          <span className="stat-label">{worker.jobsCompleted} Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">₹{worker.hourlyRate}/hr</span>
          <span className="stat-label">₹{worker.dailyRate}/day</span>
        </div>
        <div className="stat-item">
          <span className="stat-val" style={{ fontSize: '12px', color: '#1F497D' }}>
            <MapPin size={12} /> {worker.digipin}
          </span>
          <span className="stat-label">DIGIPIN Location</span>
        </div>
      </div>

      {/* Zero Commission Price Transparency Box */}
      <div className="zero-comm-highlight-box">
        <div className="zero-comm-text">
          <CheckCircle2 size={16} />
          <span>0% Platform Commission • ₹{worker.hourlyRate} goes 100% to worker</span>
        </div>
        <span className="zero-comm-pill">0% Fee</span>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-group">
        {worker.portfolio ? (
          <button className="btn-portfolio" onClick={onViewPortfolio}>
            <Images size={16} />
            <span>Before / After</span>
          </button>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
            <Zap size={14} color="#0070C0" style={{ marginRight: '4px' }} />
            {worker.certificateName}
          </div>
        )}

        <button className="btn-book-primary" onClick={onBook}>
          <CalendarCheck size={18} />
          <span>{worker.isKeypadPreBookOnly ? 'Pre-Book Job' : 'Book Worker'}</span>
        </button>
      </div>
    </div>
  );
};
