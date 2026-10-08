import React from 'react';
import {
  Zap,
  Droplet,
  Hammer,
  Paintbrush,
  Home,
  Heart,
  Truck,
  Sparkles,
  Users,
  CheckCircle,
  Star,
  Clock,
} from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  availableNow: boolean;
  onToggleAvailableNow: () => void;
  minRating: number;
  onSetMinRating: (rating: number) => void;
  crewsOnly: boolean;
  onToggleCrewsOnly: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Services', icon: null },
  { id: 'crews', label: 'Crews / Groups', icon: Users, highlight: true },
  { id: 'Electrical', label: 'Electrician', icon: Zap },
  { id: 'Plumbing', label: 'Plumber', icon: Droplet },
  { id: 'Carpentry', label: 'Carpenter', icon: Hammer },
  { id: 'Painting', label: 'Painter', icon: Paintbrush },
  { id: 'Domestic', label: 'Domestic Helper', icon: Home },
  { id: 'Care', label: 'Caregiver', icon: Heart },
  { id: 'Transport', label: 'Driver', icon: Truck },
  { id: 'Cleaning', label: 'Deep Cleaner', icon: Sparkles },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  availableNow,
  onToggleAvailableNow,
  minRating,
  onSetMinRating,
  crewsOnly,
  onToggleCrewsOnly,
}) => {
  return (
    <div className="filters-strip">
      {/* Available Now Toggle */}
      <button
        className={`filter-chip ${availableNow ? 'active' : ''}`}
        onClick={onToggleAvailableNow}
      >
        <Clock size={14} />
        <span>Available Now</span>
      </button>

      {/* 4.8+ Rating Pill */}
      <button
        className={`filter-chip ${minRating >= 4.8 ? 'active' : ''}`}
        onClick={() => onSetMinRating(minRating >= 4.8 ? 0 : 4.8)}
      >
        <Star size={14} fill={minRating >= 4.8 ? '#ffffff' : '#f59e0b'} color="#f59e0b" />
        <span>4.8+ Rating</span>
      </button>

      {/* Crews Only */}
      <button
        className={`filter-chip highlight ${crewsOnly ? 'active' : ''}`}
        onClick={onToggleCrewsOnly}
      >
        <Users size={14} />
        <span>Crews Only</span>
      </button>

      {/* Categories */}
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            className={`filter-chip ${cat.highlight ? 'highlight' : ''} ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {Icon && <Icon size={14} />}
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
