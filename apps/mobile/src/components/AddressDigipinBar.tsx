import React, { useState } from 'react';
import { MapPin, Search, Hash, Info, Check } from 'lucide-react';

interface AddressDigipinBarProps {
  currentAddress: string;
  digipin: string;
  onAddressChange: (newAddress: string) => void;
  onDigipinApply: (newDigipin: string) => void;
}

export const AddressDigipinBar: React.FC<AddressDigipinBarProps> = ({
  currentAddress,
  digipin,
  onAddressChange,
  onDigipinApply,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [customDigipin, setCustomDigipin] = useState(digipin);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDigipin.trim()) {
      onDigipinApply(customDigipin.trim().toUpperCase());
      setShowInfo(false);
    }
  };

  return (
    <div className="location-search-bar">
      <div className="search-box-unified">
        <MapPin size={18} color="#0070C0" />
        <input
          type="text"
          className="search-input"
          value={currentAddress}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Landmark, Area or Village..."
        />
        <div
          className="digipin-pill"
          onClick={() => setShowInfo(!showInfo)}
          title="Click to view/edit DIGIPIN"
        >
          <Hash size={12} color="#0070C0" />
          <span>{digipin}</span>
        </div>
      </div>

      {showInfo && (
        <div
          style={{
            marginTop: '8px',
            padding: '10px 12px',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1.5px solid #0070C0',
            boxShadow: '0 4px 12px rgba(0, 112, 192, 0.15)',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <strong style={{ color: '#1F497D', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={14} color="#0070C0" />
              DIGIPIN Open Standard (Govt. of India)
            </strong>
            <button
              onClick={() => setShowInfo(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              ✕
            </button>
          </div>
          <p style={{ color: '#475569', marginBottom: '8px', lineHeight: 1.4 }}>
            DIGIPIN provides a 10-character offline digital address grid for every 4m×4m area across India, enabling pinpoint accuracy even in unnumbered rural hamlets.
          </p>

          <form onSubmit={handleApply} style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              value={customDigipin}
              onChange={(e) => setCustomDigipin(e.target.value)}
              placeholder="e.g. 78C-K2M-9Q2F"
              style={{
                flex: 1,
                padding: '6px 10px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '12px',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            />
            <button
              type="submit"
              style={{
                background: '#0070C0',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Check size={14} /> Apply
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
