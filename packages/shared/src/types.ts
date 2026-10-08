export type UserRole =
  | 'customer'
  | 'worker'
  | 'group_lead'
  | 'society_admin'
  | 'federation_admin'
  | 'platform_ops';

export type PhoneType = 'smartphone' | 'keypad';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export type BookingType = 'scheduled' | 'on_demand' | 'emergency';

export type BookingStatus =
  | 'requested'
  | 'offered'
  | 'accepted'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface Federation {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Society {
  id: string;
  federationId: string;
  name: string;
  registrationNumber: string;
  address: string;
  contactPerson: string;
  phone: string;
  active: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  role: UserRole;
  phone: string;
  fullName: string;
  languageCode: string;
  preferredLanguage: string;
  phoneType: PhoneType;
  federationId?: string;
  societyId?: string;
  createdAt: string;
}

export interface WorkerServiceSkill {
  serviceId: string;
  serviceName: string;
  category: string;
  experienceYears: number;
  hourlyRate: number;
  dailyRate: number;
  isCertified: boolean;
  certificateName?: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  societyId: string;
  societyName: string;
  federationId: string;
  fullName: string;
  phone: string;
  phoneType: PhoneType;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  avatarUrl?: string;
  bio?: string;
  languages: string[];
  skills: WorkerServiceSkill[];
  yearsExperience: number;
  payoutUpiId?: string;
  payoutAccountVerified: boolean;
  aadhaarKycVerified?: boolean;
  aadhaarMasked?: string;
  aadhaarKycRef?: string;
  aadhaarVerifiedName?: string;
  aadhaarVerifiedAt?: string;
  eShramNumber?: string;
  eShramVerified: boolean;
  pmsbyCovered: boolean;
  pmjjbyCovered: boolean;
  ratingAverage: number;
  ratingCount: number;
  jobsCompleted: number;
  onTimeRate: number;
  completionRate: number;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  digipin?: string;
  isOnline: boolean;
  availableNights: boolean;
  acceptsEmergency: boolean;
  isKeypadPreBookOnly: boolean;
  createdAt: string;
}

export interface SixFactorScoreBreakdown {
  skillScore: number;          // 0-1 (weight e.g. 25%)
  availabilityScore: number;   // 0-1 (weight e.g. 20%)
  distanceScore: number;       // 0-1 (weight e.g. 20%)
  reliabilityScore: number;    // 0-1 (weight e.g. 15%)
  workloadScore: number;       // 0-1 (weight e.g. 10%)
  customerPrefScore: number;   // 0-1 (weight e.g. 10%)
  totalWeightedScore: number;  // 0-1
  distanceMeters: number;
  estimatedTravelMinutes: number;
}

export interface MatchingWeights {
  skill: number;          // default 0.25
  availability: number;   // default 0.20
  distance: number;       // default 0.20
  reliability: number;    // default 0.15
  workload: number;       // default 0.10
  customerPref: number;   // default 0.10
}

export interface PriceBreakdown {
  baseAmount: number;
  durationHours?: number;
  surgeMultiplier: number;
  surgeAmount: number;
  isNightTime: boolean;
  nightPremiumAmount: number;
  isHoliday: boolean;
  holidayPremiumAmount: number;
  subtotal: number;
  platformCommission: 0;      // Strictly ₹0 - enforced in DB and types
  workerReceives: number;     // Exactly 100% of the service total
  paymentGatewayFee: number;  // Pass-through for non-UPI if applicable
  totalPayable: number;
  currency: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  workerId?: string;
  workerName?: string;
  serviceId: string;
  serviceName: string;
  bookingType: BookingType;
  status: BookingStatus;
  scheduledStartTime: string;
  scheduledEndTime?: string;
  addressText: string;
  digipin?: string;
  latitude: number;
  longitude: number;
  pricing: PriceBreakdown;
  crewGroupId?: string;
  notes?: string;
  matchScore?: number;
  matchBreakdown?: SixFactorScoreBreakdown;
  createdAt: string;
  updatedAt: string;
}

export interface CrewMember {
  workerId: string;
  workerName: string;
  phone: string;
  phoneType: PhoneType;
  payoutSharePercent: number; // Sums to 100%
  skills: string[];
  confirmedAttendance: boolean;
}

export interface CrewGroup {
  id: string;
  name: string;
  crewType: 'construction' | 'agriculture' | 'cleaning' | 'other';
  leadWorkerId: string;
  leadWorkerName: string;
  societyId: string;
  headcount: number;
  dailyRatePerPerson: number;
  ratingAverage: number;
  ratingCount: number;
  members: CrewMember[];
  active: boolean;
}

export interface PortfolioItem {
  id: string;
  workerId: string;
  serviceId: string;
  title: string;
  description: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  workerId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  tags: string[];
  comment: string;
  translatedComment?: string;
  workerReply?: string;
  createdAt: string;
}

export interface DpdpConsentRecord {
  id: string;
  userId: string;
  bookingId?: string;
  purpose: 'approximate_location' | 'call_recording_transcript' | 'communications';
  languageShown: string;
  status: 'granted' | 'withdrawn';
  grantedAt: string;
  withdrawnAt?: string;
  ipAddress?: string;
  channel: 'mobile_app' | 'ivr_voice' | 'web';
}

export interface WelfareLedgerEntry {
  id: string;
  workerId: string;
  bookingId?: string;
  creditPoints: number;
  reason: 'night_shift_bonus' | 'surge_shift_bonus' | 'high_rating_incentive' | 'cooperative_grant';
  fundingSource: 'federation_subscription_pool';
  createdAt: string;
}
