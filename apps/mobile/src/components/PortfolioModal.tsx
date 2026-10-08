import React, { useState } from 'react';
import { X, SlidersHorizontal, ArrowLeftRight } from 'lucide-react';

interface PortfolioModalProps {
  portfolio: {
    title: string;
    description: string;
    beforeImageUrl: string;
    afterImageUrl: string;
  };
  workerName: string;
  onClose: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ portfolio, workerName, onClose }) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="portfolio-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="portfolio-header">
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>
              Verified Portfolio • {workerName}
            </div>
            <div className="portfolio-title">{portfolio.title}</div>
          </div>
          <button className="close-card-btn" onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            <X size={18} />
          </button>
        </div>

        {/* Interactive Comparison Slider */}
        <div
          className="slider-container-box"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* After image (background) */}
          <img
            src={portfolio.afterImageUrl}
            alt="After completion"
            className="slider-img"
          />
          <div className="after-label">AFTER (Completed)</div>

          {/* Before image (clipped) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${sliderPos}%`,
              overflow: 'hidden',
            }}
          >
            <img
              src={portfolio.beforeImageUrl}
              alt="Before starting work"
              className="slider-img"
              style={{ width: '380px', maxWidth: 'none' }}
            />
            <div className="before-label">BEFORE</div>
          </div>

          {/* Draggable Divider */}
          <div className="slider-divider" style={{ left: `${sliderPos}%` }}>
            <div className="slider-handle">
              <ArrowLeftRight size={16} />
            </div>
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
            {portfolio.description}
          </p>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#0070C0', fontWeight: 700 }}>
              ✓ Inspected & Verified by Cooperative Admin
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Drag slider to compare
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
