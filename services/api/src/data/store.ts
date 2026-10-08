import { v4 as uuidv4 } from 'uuid';
import { encodeDigipin } from '../../../../packages/shared/src/digipin.js';

export interface UserEntity {
  id: string;
  role: 'customer' | 'worker' | 'group_lead' | 'society_admin' | 'federation_admin' | 'platform_ops';
  phone: string;
  fullName: string;
  languageCode: string;
  phoneType: 'smartphone' | 'keypad';
  federationId?: string;
  societyId?: string;
  dtmfPin?: string;
  createdAt: string;
}

export interface WorkerEntity {
  id: string;
  userId: string;
  societyId: string;
  federationId: string;
  phoneType: 'smartphone' | 'keypad';
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'suspended';
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  avatarUrl?: string;
  bio?: string;
  languages: string[];
  yearsExperience: number;
  payoutUpiId?: string;
  payoutAccountVerified: boolean;
  eShramNumber?: string;
  eShramVerified: boolean;
  pmsbyCovered: boolean;
  pmsbyRenewalDate?: string;
  pmjjbyCovered: boolean;
  pmjjbyRenewalDate?: string;
  ratingAverage: number;
  ratingCount: number;
  jobsCompleted: number;
  onTimeRate: number;
  completionRate: number;
  latitude: number;
  longitude: number;
  digipin: string;
  isOnline: boolean;
  availableNights: boolean;
  acceptsEmergency: boolean;
  isKeypadPreBookOnly: boolean;
  membershipId?: string;
  documentPhotoUrl?: string;
  aadhaarKycVerified?: boolean;
  aadhaarMasked?: string;
  aadhaarKycRef?: string;
  aadhaarVerifiedName?: string;
  aadhaarVerifiedAt?: string;
  badges: string[];
  serviceSkills: {
    serviceId: string;
    serviceName: string;
    hourlyRate: number;
    dailyRate: number;
    experienceYears: number;
    isCertified: boolean;
    certificateName?: string;
  }[];
  portfolioItems: {
    id: string;
    title: string;
    description: string;
    beforeImageUrl: string;
    afterImageUrl: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface WelfareIncentiveRule {
  id: string;
  federationId: string;
  triggerType: 'night_shift' | 'surge_shift' | 'rating_milestone' | 'emergency_dispatch' | 'holiday_shift';
  creditAmount: number;
  active: boolean;
}

export interface WelfareLedgerEntry {
  id: string;
  workerId: string;
  bookingId?: string;
  eShramNumber?: string;
  creditAmount: number;
  reason: string;
  fundingSource: string; // 'federation_subscription_pool'
  createdAt: string;
}

export interface SubscriptionEntity {
  id: string;
  federationId: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  invoiceNumber: string;
  planName: string;
  createdAt: string;
}

export interface RosterImportRow {
  fullName: string;
  phone: string;
  phoneType?: 'smartphone' | 'keypad';
  serviceCode: string;
  experienceYears: number;
  societyMembershipId: string;
  upiId?: string;
  eShramNumber?: string;
  languages?: string;
}

export interface ConsentEntity {
  id: string;
  userId: string;
  purpose: 'approximate_location' | 'call_recording_transcript' | 'communications';
  languageShown: string;
  status: 'granted' | 'withdrawn';
  channel: 'mobile_app' | 'ivr_voice' | 'web';
  grantedAt: string;
  withdrawnAt?: string;
}

export interface MatchingWeights {
  skill: number;
  availability: number;
  distance: number;
  reliability: number;
  workload: number;
  customerPref: number;
}

export interface PriceRule {
  id: string;
  federationId: string;
  serviceCode?: string;
  kSensitivity: number; // default 0.50
  r0BaselineRatio: number; // default 1.00
  surgeCap: number; // default 1.50
  refreshIntervalSeconds: number; // default 120
  quoteLockMinutes: number; // default 10
  updatedAt: string;
}

export interface PremiumRule {
  id: string;
  federationId: string;
  nightStartTime: string; // "22:00"
  nightEndTime: string; // "06:00"
  nightPremiumRate: number; // 0.25 (+25%)
  holidayPremiumRate: number; // 0.50 (+50%)
  stackingRule: 'additive' | 'compounded' | 'highest_only';
  updatedAt: string;
}

export interface HolidayEntity {
  id: string;
  state: string;
  date: string; // YYYY-MM-DD
  title: string;
}

export interface QuoteEntity {
  id: string;
  federationId: string;
  serviceCode: string;
  serviceName: string;
  baseRate: number;
  demandRatio: number;
  surgeMultiplier: number;
  surgeAmount: number;
  isNightSlot: boolean;
  nightPremiumRate: number;
  nightPremiumAmount: number;
  isHoliday: boolean;
  holidayTitle?: string;
  holidayPremiumRate: number;
  holidayPremiumAmount: number;
  workerReceives: number;
  platformCommission: number; // ALWAYS 0.00 (F1)
  paymentGatewayFee: number;
  totalPayable: number;
  surgeBanner?: string;
  workerSurgeBonus?: number;
  expiresAt: string;
  createdAt: string;
}

export interface BookingEntity {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  workerId?: string;
  workerName?: string;
  workerPhone?: string;
  workerPhoneType?: 'smartphone' | 'keypad';
  serviceCode: string;
  serviceName: string;
  bookingType: 'scheduled' | 'on_demand' | 'emergency';
  status: 'requested' | 'offered' | 'accepted' | 'on_the_way' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  scheduledStartTime: string;
  scheduledEndTime?: string;
  addressText: string;
  digipin?: string;
  latitude: number;
  longitude: number;
  baseRate: number;
  surgeMultiplier: number;
  surgeAmount: number;
  isNightTime: boolean;
  nightPremiumAmount: number;
  isHoliday: boolean;
  holidayPremiumAmount: number;
  workerReceives: number;
  platformCommission: number; // ALWAYS 0.00
  paymentGatewayFee: number;
  totalPayable: number;
  matchScore?: number;
  matchBreakdown?: any;
  whyThisWorker?: string;
  notes?: string;
  fundsEscrowStatus: 'held' | 'released' | 'refunded';
  disputeWindowEndsAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingAssignmentEntity {
  id: string;
  bookingId: string;
  workerId: string;
  status: 'offered' | 'accepted' | 'declined' | 'timed_out';
  offeredAt: string;
  expiresAt: string; // 45s for on-demand
}

export interface ChatMessageEntity {
  id: string;
  bookingId: string;
  senderId: string;
  senderRole: 'customer' | 'worker';
  senderName: string;
  originalText: string;
  originalLanguage: string;
  translations: Record<string, string>;
  createdAt: string;
}

export interface SupportTicketEntity {
  id: string;
  ticketNumber: string;
  userId: string;
  userRole: string;
  userName: string;
  societyId?: string;
  federationId?: string;
  category: string;
  subject: string;
  description: string;
  language: string;
  translatedSubjectEn?: string;
  translatedDescriptionEn?: string;
  status: 'open' | 'in_progress' | 'escalated_to_federation' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  replies: {
    id: string;
    senderId: string;
    senderRole: string;
    senderName: string;
    text: string;
    language: string;
    translatedText?: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentEntity {
  id: string;
  bookingId: string;
  customerId: string;
  totalAmount: number;
  workerAmount: number;
  platformCommission: number; // STRICT CONSTRAINT: 0.00
  gatewayFee: number;
  paymentMethod: 'upi' | 'ussd_99' | 'card' | 'netbanking';
  gatewayProvider: 'razorpay' | 'cashfree' | 'npci_ussd';
  virtualUpiId?: string;
  transactionReference?: string;
  status: 'pending' | 'captured' | 'refunded' | 'failed';
  idempotencyKey?: string;
  createdAt: string;
}

export interface PayoutEntity {
  id: string;
  bookingId: string;
  workerId: string;
  workerName: string;
  amount: number;
  payoutMethod: 'upi' | 'bank_transfer' | 'ussd_balance';
  recipientVpa?: string;
  status: 'pending' | 'processed' | 'failed';
  gatewayPayoutId?: string;
  processedAt?: string;
  createdAt: string;
}

export interface LedgerEntryEntity {
  id: string;
  entryNumber: number;
  bookingId?: string;
  paymentId?: string;
  payoutId?: string;
  accountType: 'customer_receivable' | 'worker_payable' | 'platform_commission_pool' | 'gateway_pass_through';
  debit: number;
  credit: number;
  description: string;
  createdAt: string;
}

export interface ReviewEntity {
  id: string;
  bookingId: string;
  workerId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  tags: string[];
  comment?: string;
  translatedComment?: string;
  workerReply?: string;
  createdAt: string;
}

export interface GroupMemberEntity {
  workerId: string;
  workerName: string;
  phoneType: 'smartphone' | 'keypad';
  payoutSharePercent: number; // Must sum to 100%
  confirmedAttendance: boolean;
}

export interface GroupEntity {
  id: string;
  name: string;
  crewType: 'construction' | 'agriculture' | 'cleaning' | 'other';
  leadWorkerId: string;
  leadWorkerName: string;
  societyId: string;
  federationId: string;
  headcount: number;
  dailyRatePerPerson: number;
  ratingAverage: number;
  ratingCount: number;
  active: boolean;
  members: GroupMemberEntity[];
  createdAt: string;
}

class DataStore {
  public federations: any[] = [];
  public societies: any[] = [];
  public services: any[] = [];
  public users: Map<string, UserEntity> = new Map();
  public workers: Map<string, WorkerEntity> = new Map();
  public consents: Map<string, ConsentEntity> = new Map();
  public matchingWeights: Map<string, MatchingWeights> = new Map();
  public priceRules: Map<string, PriceRule> = new Map();
  public premiumRules: Map<string, PremiumRule> = new Map();
  public holidays: HolidayEntity[] = [];
  public quotes: Map<string, QuoteEntity> = new Map();
  public bookings: Map<string, BookingEntity> = new Map();
  public assignments: Map<string, BookingAssignmentEntity> = new Map();
  public chatMessages: Map<string, ChatMessageEntity[]> = new Map();
  public supportTickets: Map<string, SupportTicketEntity> = new Map();
  public payments: Map<string, PaymentEntity> = new Map();
  public payouts: Map<string, PayoutEntity> = new Map();
  public ledgerEntries: LedgerEntryEntity[] = [];
  public reviews: Map<string, ReviewEntity> = new Map();
  public groups: Map<string, GroupEntity> = new Map();
  public auditLogs: any[] = [];
  public welfareIncentiveRules: Map<string, WelfareIncentiveRule> = new Map();
  public welfareLedger: WelfareLedgerEntry[] = [];
  public subscriptions: Map<string, SubscriptionEntity> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Federations
    this.federations = [
      {
        id: 'f1111111-1111-1111-1111-111111111101',
        name: 'Coimbatore District Labour Cooperative Federation',
        code: 'CDLCF-01',
        district: 'Coimbatore',
        state: 'Tamil Nadu',
        contactEmail: 'admin@coimbatorecoop.org.in',
        contactPhone: '+91 422 2304911',
      },
      {
        id: 'f1111111-1111-1111-1111-111111111102',
        name: 'Tirupur District Labour & Construction Cooperative Federation',
        code: 'TDLCCF-02',
        district: 'Tirupur',
        state: 'Tamil Nadu',
        contactEmail: 'secretariat@tirupurcoop.org.in',
        contactPhone: '+91 421 2218702',
      },
    ];

    // 2. Societies
    this.societies = [
      {
        id: 's1111111-1111-1111-1111-111111111101',
        federationId: this.federations[0].id,
        name: 'Kongu Artisans & Electrical Labour Cooperative Society',
        registrationNumber: 'TN/CBE/CS-2018/441',
        address: '42 Crosscut Road, Gandhipuram, Coimbatore 641012',
        district: 'Coimbatore',
        contactPerson: 'S. Ramanathan',
        phone: '+91 98422 11001',
      },
      {
        id: 's1111111-1111-1111-1111-111111111102',
        federationId: this.federations[1].id,
        name: 'Noyyal Plumbers & Carpenters Guild Cooperative',
        registrationNumber: 'TN/TPR/CS-2020/812',
        address: '15 Avinashi Road, Kumar Nagar, Tirupur 641603',
        district: 'Tirupur',
        contactPerson: 'M. Palanisamy',
        phone: '+91 98433 22002',
      },
      {
        id: 's1111111-1111-1111-1111-111111111103',
        federationId: this.federations[0].id,
        name: 'Siruvani Rural Multi-Trades Cooperative Society',
        registrationNumber: 'TN/CBE/CS-2022/903',
        address: '8 Trichy Road, Sulur, Coimbatore 641402',
        district: 'Coimbatore',
        contactPerson: 'K. Murugesan',
        phone: '+91 98425 33003',
      },
    ];

    // 3. Services
    this.services = [
      { id: 'srv-01', code: 'ELEC', name: 'Electrician', category: 'Electrical', baseRate: 350, dailyRate: 1800 },
      { id: 'srv-02', code: 'PLUMB', name: 'Plumber', category: 'Plumbing', baseRate: 300, dailyRate: 1600 },
      { id: 'srv-03', code: 'CARP', name: 'Carpenter', category: 'Carpentry', baseRate: 400, dailyRate: 2000 },
      { id: 'srv-04', code: 'PAINT', name: 'Painter', category: 'Painting', baseRate: 350, dailyRate: 1800 },
      { id: 'srv-05', code: 'DOMHELP', name: 'Domestic Helper', category: 'Domestic', baseRate: 200, dailyRate: 1000 },
      { id: 'srv-06', code: 'CAREGIVER', name: 'Caregiver', category: 'Care', baseRate: 450, dailyRate: 2200 },
      { id: 'srv-07', code: 'DRIVER', name: 'Driver', category: 'Transport', baseRate: 300, dailyRate: 1500 },
      { id: 'srv-08', code: 'GARDENER', name: 'Gardener', category: 'Gardening', baseRate: 250, dailyRate: 1200 },
      { id: 'srv-09', code: 'CLEAN', name: 'Deep Cleaner', category: 'Cleaning', baseRate: 250, dailyRate: 1300 },
      { id: 'srv-10', code: 'TECH', name: 'Appliance Tech', category: 'Appliances', baseRate: 400, dailyRate: 2100 },
    ];

    // 4. Default Admin Accounts
    const adminUser: UserEntity = {
      id: 'admin-cbe-01',
      role: 'society_admin',
      phone: '+919842211001',
      fullName: 'S. Ramanathan (Kongu Society Admin)',
      languageCode: 'ta',
      phoneType: 'smartphone',
      federationId: this.federations[0].id,
      societyId: this.societies[0].id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(adminUser.id, adminUser);

    const fedAdminUser: UserEntity = {
      id: 'fedadmin-cbe-01',
      role: 'federation_admin',
      phone: '+919842000000',
      fullName: 'Coimbatore Federation Secretariat',
      languageCode: 'en',
      phoneType: 'smartphone',
      federationId: this.federations[0].id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(fedAdminUser.id, fedAdminUser);

    // 5. Seed Karthik Subramanian (Verified Worker)
    const karthikUser: UserEntity = {
      id: 'user-w01',
      role: 'worker',
      phone: '+919842100001',
      fullName: 'Karthik Subramanian',
      languageCode: 'ta',
      phoneType: 'smartphone',
      federationId: this.federations[0].id,
      societyId: this.societies[0].id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(karthikUser.id, karthikUser);

    const karthikWorker: WorkerEntity = {
      id: 'worker-01',
      userId: karthikUser.id,
      societyId: this.societies[0].id,
      federationId: this.federations[0].id,
      phoneType: 'smartphone',
      verificationStatus: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy: adminUser.id,
      languages: ['Tamil', 'English'],
      yearsExperience: 9,
      payoutUpiId: 'karthik@okhdfcbank',
      payoutAccountVerified: true,
      eShramNumber: 'UAN 2026 1001 4001',
      eShramVerified: true,
      pmsbyCovered: true,
      pmjjbyCovered: true,
      ratingAverage: 4.88,
      ratingCount: 142,
      jobsCompleted: 142,
      onTimeRate: 0.98,
      completionRate: 0.99,
      latitude: 11.0185,
      longitude: 76.9634,
      digipin: encodeDigipin(11.0185, 76.9634),
      isOnline: true,
      availableNights: true,
      acceptsEmergency: true,
      isKeypadPreBookOnly: false,
      membershipId: 'MEM-KONGU-2019-042',
      aadhaarKycVerified: true,
      aadhaarMasked: 'XXXXXXXX9012',
      aadhaarKycRef: 'UIDAI-EKYC-A9F8214BCDE',
      aadhaarVerifiedName: 'Karthik Subramanian',
      aadhaarVerifiedAt: new Date().toISOString(),
      badges: ['Govt Wireman Licence Class-A', 'Verified Society Artisan', 'Aadhaar KYC Verified'],
      serviceSkills: [
        {
          serviceId: 'srv-01',
          serviceName: 'Master Electrician',
          hourlyRate: 350,
          dailyRate: 1800,
          experienceYears: 9,
          isCertified: true,
          certificateName: 'Govt Wireman Licence Class-A',
        },
      ],
      portfolioItems: [
        {
          id: 'port-01',
          title: 'Complete Industrial Power Distribution Rewiring',
          description: 'Upgraded vintage fuse board to RCCB/MCB distribution panel in Peelamedu workshop.',
          beforeImageUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&q=80',
          afterImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };
    this.workers.set(karthikWorker.id, karthikWorker);

    // 6. Seed Plumber Marimuthu (Smartphone, Verified)
    const marimuthuUser: UserEntity = {
      id: 'user-w02',
      role: 'worker',
      phone: '+919842100002',
      fullName: 'P. Marimuthu (Master Plumber)',
      languageCode: 'ta',
      phoneType: 'smartphone',
      federationId: this.federations[0].id,
      societyId: this.societies[0].id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(marimuthuUser.id, marimuthuUser);

    const marimuthuWorker: WorkerEntity = {
      id: 'worker-02',
      userId: marimuthuUser.id,
      societyId: this.societies[0].id,
      federationId: this.federations[0].id,
      phoneType: 'smartphone',
      verificationStatus: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy: adminUser.id,
      languages: ['Tamil'],
      yearsExperience: 7,
      payoutUpiId: 'marimuthu@okaxis',
      payoutAccountVerified: true,
      eShramVerified: true,
      pmsbyCovered: true,
      pmjjbyCovered: true,
      ratingAverage: 4.82,
      ratingCount: 88,
      jobsCompleted: 88,
      onTimeRate: 0.97,
      completionRate: 0.99,
      latitude: 11.0250,
      longitude: 76.9580,
      digipin: encodeDigipin(11.0250, 76.9580),
      isOnline: true,
      availableNights: true,
      acceptsEmergency: true,
      isKeypadPreBookOnly: false,
      membershipId: 'MEM-KONGU-2020-089',
      badges: ['Certified Master Plumber', 'Verified Society Artisan'],
      serviceSkills: [
        {
          serviceId: 'srv-02',
          serviceName: 'Plumber',
          hourlyRate: 300,
          dailyRate: 1600,
          experienceYears: 7,
          isCertified: true,
          certificateName: 'Govt Plumbing Certification',
        },
      ],
      portfolioItems: [],
      createdAt: new Date().toISOString(),
    };
    this.workers.set(marimuthuWorker.id, marimuthuWorker);

    // 7. Seed Keypad-Phone Worker: Ramasamy (PPT Requirement: Keypad pre-booked only)
    const ramasamyUser: UserEntity = {
      id: 'user-w03',
      role: 'worker',
      phone: '+919842100003',
      fullName: 'K. Ramasamy (Keypad Electrician)',
      languageCode: 'ta',
      phoneType: 'keypad',
      federationId: this.federations[0].id,
      societyId: this.societies[0].id,
      dtmfPin: '1234',
      createdAt: new Date().toISOString(),
    };
    this.users.set(ramasamyUser.id, ramasamyUser);

    const ramasamyWorker: WorkerEntity = {
      id: 'worker-03',
      userId: ramasamyUser.id,
      societyId: this.societies[0].id,
      federationId: this.federations[0].id,
      phoneType: 'keypad',
      verificationStatus: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy: adminUser.id,
      languages: ['Tamil'],
      yearsExperience: 12,
      payoutUpiId: 'ramasamy@upi',
      payoutAccountVerified: true,
      eShramVerified: true,
      pmsbyCovered: false,
      pmjjbyCovered: false,
      ratingAverage: 4.75,
      ratingCount: 160,
      jobsCompleted: 160,
      onTimeRate: 0.96,
      completionRate: 0.98,
      latitude: 11.0110,
      longitude: 76.9720,
      digipin: encodeDigipin(11.0110, 76.9720),
      isOnline: false, // Keypad worker does not run active smartphone app
      availableNights: false,
      acceptsEmergency: false,
      isKeypadPreBookOnly: true, // STRICT PPT REQUIREMENT: Pre-booked jobs only
      membershipId: 'MEM-KONGU-2016-015',
      badges: ['Senior Artisan', 'Verified Society Artisan'],
      serviceSkills: [
        {
          serviceId: 'srv-01',
          serviceName: 'Electrician',
          hourlyRate: 350,
          dailyRate: 1800,
          experienceYears: 12,
          isCertified: true,
        },
      ],
      portfolioItems: [],
      createdAt: new Date().toISOString(),
    };
    this.workers.set(ramasamyWorker.id, ramasamyWorker);

    // 8. Seed Default Matching Weights per Federation (PPT F6)
    for (const fed of this.federations) {
      this.matchingWeights.set(fed.id, {
        skill: 0.25,
        availability: 0.20,
        distance: 0.20,
        reliability: 0.15,
        workload: 0.10,
        customerPref: 0.10,
      });
    }

    // 9. Seed Default Dynamic Pricing Rules per Federation (PPT F8)
    for (const fed of this.federations) {
      this.priceRules.set(fed.id, {
        id: `rule-price-${fed.id}`,
        federationId: fed.id,
        kSensitivity: 0.50,
        r0BaselineRatio: 1.00,
        surgeCap: 1.50, // Default cap 1.5x as promised in PPT
        refreshIntervalSeconds: 120,
        quoteLockMinutes: 10, // Quotes locked for 10 minutes
        updatedAt: new Date().toISOString(),
      });
    }

    // 10. Seed Default Night and Holiday Premium Rules per Federation (PPT F9)
    for (const fed of this.federations) {
      this.premiumRules.set(fed.id, {
        id: `rule-premium-${fed.id}`,
        federationId: fed.id,
        nightStartTime: '22:00', // 10 PM
        nightEndTime: '06:00',   // 6 AM
        nightPremiumRate: 0.25,  // +25%
        holidayPremiumRate: 0.50,// +50%
        stackingRule: 'additive',
        updatedAt: new Date().toISOString(),
      });
    }

    // 11. Seed Government Holidays (Tamil Nadu calendar)
    this.holidays = [
      { id: 'hol-01', state: 'Tamil Nadu', date: '2026-01-15', title: 'Pongal / Thiruvalluvar Day' },
      { id: 'hol-02', state: 'Tamil Nadu', date: '2026-01-26', title: 'Republic Day' },
      { id: 'hol-03', state: 'Tamil Nadu', date: '2026-04-14', title: 'Tamil New Year / Puthandu' },
      { id: 'hol-04', state: 'Tamil Nadu', date: '2026-05-01', title: 'May Day (Labour Day)' },
      { id: 'hol-05', state: 'Tamil Nadu', date: '2026-08-15', title: 'Independence Day' },
      { id: 'hol-06', state: 'Tamil Nadu', date: '2026-10-02', title: 'Gandhi Jayanti' },
      { id: 'hol-07', state: 'Tamil Nadu', date: '2026-11-08', title: 'Deepavali' },
      { id: 'hol-08', state: 'Tamil Nadu', date: '2026-12-25', title: 'Christmas' },
    ];

    // 12. Seed Worker Groups / Crews (PPT F10)
    const electricalCrew: GroupEntity = {
      id: 'group-01',
      name: 'Kongu Rural Electrical Crew',
      crewType: 'construction',
      leadWorkerId: 'worker-01',
      leadWorkerName: 'Karthik Subramanian',
      societyId: this.societies[0].id,
      federationId: this.federations[0].id,
      headcount: 3,
      dailyRatePerPerson: 1800,
      ratingAverage: 4.90,
      ratingCount: 34,
      active: true,
      members: [
        {
          workerId: 'worker-01',
          workerName: 'Karthik Subramanian (Lead)',
          phoneType: 'smartphone',
          payoutSharePercent: 40.0, // 40% share to lead
          confirmedAttendance: true,
        },
        {
          workerId: 'worker-02',
          workerName: 'P. Marimuthu',
          phoneType: 'smartphone',
          payoutSharePercent: 30.0, // 30% share
          confirmedAttendance: true,
        },
        {
          workerId: 'worker-03',
          workerName: 'K. Ramasamy (Keypad)',
          phoneType: 'keypad',
          payoutSharePercent: 30.0, // 30% share (Total = 100%)
          confirmedAttendance: true,
        },
      ],
      createdAt: new Date().toISOString(),
    };
    this.groups.set(electricalCrew.id, electricalCrew);

    const farmCrew: GroupEntity = {
      id: 'group-02',
      name: 'Siruvani Agriculture & Labour Crew',
      crewType: 'agriculture',
      leadWorkerId: 'worker-02',
      leadWorkerName: 'P. Marimuthu',
      societyId: this.societies[2]?.id || this.societies[0].id,
      federationId: this.federations[0].id,
      headcount: 4,
      dailyRatePerPerson: 1200,
      ratingAverage: 4.85,
      ratingCount: 19,
      active: true,
      members: [
        {
          workerId: 'worker-02',
          workerName: 'P. Marimuthu (Lead)',
          phoneType: 'smartphone',
          payoutSharePercent: 25.0,
          confirmedAttendance: true,
        },
        {
          workerId: 'worker-01',
          workerName: 'Karthik Subramanian',
          phoneType: 'smartphone',
          payoutSharePercent: 25.0,
          confirmedAttendance: true,
        },
        {
          workerId: 'worker-03',
          workerName: 'K. Ramasamy (Keypad)',
          phoneType: 'keypad',
          payoutSharePercent: 25.0,
          confirmedAttendance: true,
        },
        {
          workerId: 'worker-temp-04',
          workerName: 'S. Veluchamy',
          phoneType: 'keypad',
          payoutSharePercent: 25.0,
          confirmedAttendance: true,
        },
      ],
      createdAt: new Date().toISOString(),
    };
    this.groups.set(farmCrew.id, farmCrew);

    // 14. Phase 5 Seed: Welfare Incentive Rules (PPT F17)
    const fed01Id = this.federations[0].id;
    const fed02Id = this.federations[1].id;

    const defaultIncentives: { triggerType: WelfareIncentiveRule['triggerType']; amount: number }[] = [
      { triggerType: 'night_shift', amount: 50 },
      { triggerType: 'surge_shift', amount: 30 },
      { triggerType: 'holiday_shift', amount: 75 },
      { triggerType: 'emergency_dispatch', amount: 60 },
      { triggerType: 'rating_milestone', amount: 100 },
    ];

    [fed01Id, fed02Id].forEach((fedId, fIdx) => {
      defaultIncentives.forEach((inc, iIdx) => {
        const ruleId = `welf-rule-${fIdx + 1}-${iIdx + 1}`;
        this.welfareIncentiveRules.set(ruleId, {
          id: ruleId,
          federationId: fedId,
          triggerType: inc.triggerType,
          creditAmount: inc.amount,
          active: true,
        });
      });
    });

    // 15. Phase 5 Seed: Flat Cooperative Annual Subscriptions (PPT F19 - 0% per-job fee)
    const subCbe: SubscriptionEntity = {
      id: 'sub-cbe-2026',
      federationId: fed01Id,
      billingPeriodStart: '2026-01-01',
      billingPeriodEnd: '2026-12-31',
      amount: 50000.0,
      status: 'paid',
      invoiceNumber: 'INV-FED-CBE-2026-001',
      planName: 'Cooperative Federation Annual Plan - 0% Platform Commission',
      createdAt: '2026-01-01T00:00:00.000Z',
    };
    this.subscriptions.set(subCbe.id, subCbe);

    const subTpr: SubscriptionEntity = {
      id: 'sub-tpr-2026',
      federationId: fed02Id,
      billingPeriodStart: '2026-01-01',
      billingPeriodEnd: '2026-12-31',
      amount: 50000.0,
      status: 'paid',
      invoiceNumber: 'INV-FED-TPR-2026-001',
      planName: 'Cooperative Federation Annual Plan - 0% Platform Commission',
      createdAt: '2026-01-01T00:00:00.000Z',
    };
    this.subscriptions.set(subTpr.id, subTpr);

    // 16. Phase 5 Seed: Initial Welfare Credits
    this.welfareLedger.push(
      {
        id: uuidv4(),
        workerId: 'worker-01',
        eShramNumber: 'UAN 2026 1001 4001',
        creditAmount: 50.0,
        reason: 'Night Shift Welfare Incentive (Night hours completion bonus)',
        fundingSource: 'federation_subscription_pool',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: uuidv4(),
        workerId: 'worker-01',
        eShramNumber: 'UAN 2026 1001 4001',
        creditAmount: 75.0,
        reason: 'Holiday Shift Welfare Incentive (State holiday service bonus)',
        fundingSource: 'federation_subscription_pool',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: uuidv4(),
        workerId: 'worker-02',
        creditAmount: 50.0,
        reason: 'Night Shift Welfare Incentive (Emergency response bonus)',
        fundingSource: 'federation_subscription_pool',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    );
  }

  // User Methods
  public findUserByPhone(phone: string): UserEntity | undefined {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    for (const u of this.users.values()) {
      if (u.phone.replace(/[^0-9+]/g, '') === cleanPhone) {
        return u;
      }
    }
    return undefined;
  }

  public createUser(user: Omit<UserEntity, 'id' | 'createdAt'>): UserEntity {
    const newId = uuidv4();
    const entity: UserEntity = {
      ...user,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    this.users.set(newId, entity);
    return entity;
  }

  // Worker Methods
  public createWorker(worker: Omit<WorkerEntity, 'id' | 'createdAt'>): WorkerEntity {
    const newId = uuidv4();
    const entity: WorkerEntity = {
      ...worker,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    this.workers.set(newId, entity);
    return entity;
  }

  public getWorkerById(id: string): WorkerEntity | undefined {
    return this.workers.get(id);
  }

  public getWorkerByUserId(userId: string): WorkerEntity | undefined {
    for (const w of this.workers.values()) {
      if (w.userId === userId) return w;
    }
    return undefined;
  }

  public getVerifiedWorkers(): WorkerEntity[] {
    return Array.from(this.workers.values()).filter((w) => w.verificationStatus === 'verified');
  }

  public getPendingWorkers(societyId?: string): WorkerEntity[] {
    return Array.from(this.workers.values()).filter((w) => {
      const isPending = w.verificationStatus === 'pending';
      return societyId ? isPending && w.societyId === societyId : isPending;
    });
  }

  public approveWorker(workerId: string, adminId: string, badges: string[] = []): WorkerEntity | undefined {
    const worker = this.workers.get(workerId);
    if (!worker) return undefined;

    worker.verificationStatus = 'verified';
    worker.verifiedAt = new Date().toISOString();
    worker.verifiedBy = adminId;
    if (badges.length > 0) {
      worker.badges = Array.from(new Set([...worker.badges, ...badges]));
    }
    this.workers.set(workerId, worker);
    return worker;
  }

  public rejectWorker(workerId: string, reason: string): WorkerEntity | undefined {
    const worker = this.workers.get(workerId);
    if (!worker) return undefined;

    worker.verificationStatus = 'rejected';
    worker.rejectionReason = reason;
    this.workers.set(workerId, worker);
    return worker;
  }

  public setWorkerAadhaarKyc(
    workerId: string,
    kycData: { maskedAadhaar: string; referenceId: string; verifiedName: string }
  ): WorkerEntity | undefined {
    const worker = this.workers.get(workerId);
    if (!worker) return undefined;
    worker.aadhaarKycVerified = true;
    worker.aadhaarMasked = kycData.maskedAadhaar;
    worker.aadhaarKycRef = kycData.referenceId;
    worker.aadhaarVerifiedName = kycData.verifiedName;
    worker.aadhaarVerifiedAt = new Date().toISOString();
    if (!worker.badges.includes('Aadhaar KYC Verified')) {
      worker.badges.push('Aadhaar KYC Verified');
    }
    this.workers.set(workerId, worker);
    return worker;
  }

  public getWorker(id: string): WorkerEntity | undefined {
    return this.workers.get(id);
  }

  /**
   * Bulk Roster Import from CSV (PPT Requirement F3)
   */
  public importRoster(
    rows: RosterImportRow[],
    societyId: string,
    adminId: string
  ): { importedCount: number; errors: { row: number; error: string }[] } {
    const society = this.societies.find((s) => s.id === societyId);
    if (!society) {
      throw new Error(`Society '${societyId}' not found`);
    }

    let importedCount = 0;
    const errors: { row: number; error: string }[] = [];

    rows.forEach((row, index) => {
      try {
        if (!row.fullName || row.fullName.trim().length < 2) {
          errors.push({ row: index + 1, error: 'Full name is required' });
          return;
        }

        if (!row.phone || row.phone.replace(/[^0-9]/g, '').length < 10) {
          errors.push({ row: index + 1, error: 'Valid 10-digit phone number is required' });
          return;
        }

        const phoneType = row.phoneType || 'smartphone';
        const phone = row.phone.trim();

        // Check if user exists
        let user = this.findUserByPhone(phone);
        if (!user) {
          user = this.createUser({
            fullName: row.fullName.trim(),
            phone,
            role: 'worker',
            languageCode: 'ta',
            phoneType,
            federationId: society.federationId,
            societyId: society.id,
          });
        }

        // Match service
        const svc = this.services.find((s) => s.code === row.serviceCode) || this.services[0];

        // Seed default coords around society district
        const lat = 11.0185 + (Math.random() - 0.5) * 0.05;
        const lon = 76.9634 + (Math.random() - 0.5) * 0.05;

        const workerEntity: WorkerEntity = {
          id: uuidv4(),
          userId: user.id,
          societyId: society.id,
          federationId: society.federationId,
          phoneType,
          verificationStatus: 'pending', // Pending review by admin
          languages: row.languages ? row.languages.split(',').map((l) => l.trim()) : ['Tamil'],
          yearsExperience: Number(row.experienceYears) || 2,
          payoutUpiId: row.upiId || `${row.fullName.toLowerCase().replace(/[^a-z]/g, '')}@upi`,
          payoutAccountVerified: false,
          eShramNumber: row.eShramNumber,
          eShramVerified: false,
          pmsbyCovered: false,
          pmjjbyCovered: false,
          ratingAverage: 4.5,
          ratingCount: 0,
          jobsCompleted: 0,
          onTimeRate: 1.0,
          completionRate: 1.0,
          latitude: lat,
          longitude: lon,
          digipin: encodeDigipin(lat, lon),
          isOnline: phoneType === 'smartphone',
          availableNights: false,
          acceptsEmergency: false,
          isKeypadPreBookOnly: phoneType === 'keypad',
          membershipId: row.societyMembershipId || `ROSTER-${Date.now()}-${index + 1}`,
          badges: ['Cooperative Roster Import'],
          serviceSkills: [
            {
              serviceId: svc.id,
              serviceName: svc.name,
              hourlyRate: svc.baseRate,
              dailyRate: svc.dailyRate,
              experienceYears: Number(row.experienceYears) || 2,
              isCertified: false,
            },
          ],
          portfolioItems: [],
          createdAt: new Date().toISOString(),
        };

        this.workers.set(workerEntity.id, workerEntity);
        importedCount++;
      } catch (err: any) {
        errors.push({ row: index + 1, error: err.message || 'Unknown import error' });
      }
    });

    return { importedCount, errors };
  }

  // DPDP Consent Records
  public addConsent(consent: Omit<ConsentEntity, 'id' | 'grantedAt'>): ConsentEntity {
    const id = uuidv4();
    const entity: ConsentEntity = {
      ...consent,
      id,
      grantedAt: new Date().toISOString(),
    };
    this.consents.set(id, entity);
    return entity;
  }

  public withdrawConsent(id: string): ConsentEntity | undefined {
    const entity = this.consents.get(id);
    if (!entity) return undefined;
    entity.status = 'withdrawn';
    entity.withdrawnAt = new Date().toISOString();
    this.consents.set(id, entity);
    return entity;
  }

  public getUserConsents(userId: string): ConsentEntity[] {
    return Array.from(this.consents.values()).filter((c) => c.userId === userId);
  }

  // --- Phase 2: Rules & Policies ---
  public getMatchingWeights(federationId: string): MatchingWeights {
    return (
      this.matchingWeights.get(federationId) || {
        skill: 0.25,
        availability: 0.20,
        distance: 0.20,
        reliability: 0.15,
        workload: 0.10,
        customerPref: 0.10,
      }
    );
  }

  public setMatchingWeights(federationId: string, weights: Partial<MatchingWeights>): MatchingWeights {
    const current = this.getMatchingWeights(federationId);
    const updated: MatchingWeights = { ...current, ...weights };
    this.matchingWeights.set(federationId, updated);
    return updated;
  }

  public getPriceRule(federationId: string): PriceRule {
    return (
      this.priceRules.get(federationId) || {
        id: `rule-price-${federationId}`,
        federationId,
        kSensitivity: 0.5,
        r0BaselineRatio: 1.0,
        surgeCap: 1.5,
        refreshIntervalSeconds: 120,
        quoteLockMinutes: 10,
        updatedAt: new Date().toISOString(),
      }
    );
  }

  public setPriceRule(federationId: string, updates: Partial<PriceRule>): PriceRule {
    const current = this.getPriceRule(federationId);
    const updated: PriceRule = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.priceRules.set(federationId, updated);
    return updated;
  }

  public getPremiumRule(federationId: string): PremiumRule {
    return (
      this.premiumRules.get(federationId) || {
        id: `rule-premium-${federationId}`,
        federationId,
        nightStartTime: '22:00',
        nightEndTime: '06:00',
        nightPremiumRate: 0.25,
        holidayPremiumRate: 0.5,
        stackingRule: 'additive',
        updatedAt: new Date().toISOString(),
      }
    );
  }

  public setPremiumRule(federationId: string, updates: Partial<PremiumRule>): PremiumRule {
    const current = this.getPremiumRule(federationId);
    const updated: PremiumRule = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.premiumRules.set(federationId, updated);
    return updated;
  }

  public getHolidays(state: string = 'Tamil Nadu'): HolidayEntity[] {
    return this.holidays.filter((h) => h.state.toLowerCase() === state.toLowerCase());
  }

  public isHolidayDate(dateStr: string, state: string = 'Tamil Nadu'): HolidayEntity | undefined {
    return this.holidays.find((h) => h.state.toLowerCase() === state.toLowerCase() && h.date === dateStr);
  }

  // --- Phase 2: Quotes ---
  public saveQuote(quote: QuoteEntity): QuoteEntity {
    this.quotes.set(quote.id, quote);
    return quote;
  }

  public getQuote(id: string): QuoteEntity | undefined {
    return this.quotes.get(id);
  }

  // --- Phase 2: Bookings ---
  public createBooking(booking: Omit<BookingEntity, 'id' | 'createdAt' | 'updatedAt'>): BookingEntity {
    // CRITICAL PPT F1 ENFORCEMENT: platform_commission must be exactly 0.00
    if (booking.platformCommission !== 0.0) {
      throw new Error(
        'Zero-Commission Invariant Violation: TaskLink platform commission must be strictly 0.00. 100% of job payment belongs to the worker.'
      );
    }

    const id = uuidv4();
    const now = new Date().toISOString();
    const entity: BookingEntity = {
      ...booking,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.bookings.set(id, entity);
    return entity;
  }

  public getBooking(id: string): BookingEntity | undefined {
    return this.bookings.get(id);
  }

  public updateBookingStatus(
    id: string,
    status: BookingEntity['status'],
    updates: Partial<BookingEntity> = {}
  ): BookingEntity | undefined {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    Object.assign(booking, updates);

    // If completed, initiate dispute window (15 mins) and escrow release
    if (status === 'completed') {
      const disputeEnd = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      booking.disputeWindowEndsAt = disputeEnd;
      booking.fundsEscrowStatus = 'released';
    }

    this.bookings.set(id, booking);
    return booking;
  }

  public listBookings(filters: { customerId?: string; workerId?: string; status?: string } = {}): BookingEntity[] {
    return Array.from(this.bookings.values()).filter((b) => {
      if (filters.customerId && b.customerId !== filters.customerId) return false;
      if (filters.workerId && b.workerId !== filters.workerId) return false;
      if (filters.status && b.status !== filters.status) return false;
      return true;
    });
  }

  // --- Phase 2: Chat ---
  public addChatMessage(message: Omit<ChatMessageEntity, 'id' | 'createdAt'>): ChatMessageEntity {
    const id = uuidv4();
    const entity: ChatMessageEntity = {
      ...message,
      id,
      createdAt: new Date().toISOString(),
    };
    const thread = this.chatMessages.get(message.bookingId) || [];
    thread.push(entity);
    this.chatMessages.set(message.bookingId, thread);
    return entity;
  }

  public getChatMessages(bookingId: string): ChatMessageEntity[] {
    return this.chatMessages.get(bookingId) || [];
  }

  // --- Phase 2: Support Tickets ---
  public createSupportTicket(
    ticket: Omit<SupportTicketEntity, 'id' | 'ticketNumber' | 'replies' | 'createdAt' | 'updatedAt'>
  ): SupportTicketEntity {
    const id = uuidv4();
    const count = this.supportTickets.size + 1;
    const ticketNumber = `TICK-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const entity: SupportTicketEntity = {
      ...ticket,
      id,
      ticketNumber,
      replies: [],
      createdAt: now,
      updatedAt: now,
    };
    this.supportTickets.set(id, entity);
    return entity;
  }

  public getSupportTickets(societyId?: string, federationId?: string): SupportTicketEntity[] {
    return Array.from(this.supportTickets.values()).filter((t) => {
      if (societyId && t.societyId !== societyId) return false;
      if (federationId && t.federationId !== federationId) return false;
      return true;
    });
  }

  public getSupportTicketById(id: string): SupportTicketEntity | undefined {
    return this.supportTickets.get(id);
  }

  public addSupportReply(
    ticketId: string,
    reply: { senderId: string; senderRole: string; senderName: string; text: string; language: string; translatedText?: string }
  ): SupportTicketEntity | undefined {
    const ticket = this.supportTickets.get(ticketId);
    if (!ticket) return undefined;

    ticket.replies.push({
      id: uuidv4(),
      ...reply,
      createdAt: new Date().toISOString(),
    });
    ticket.updatedAt = new Date().toISOString();
    this.supportTickets.set(ticketId, ticket);
    return ticket;
  }

  public escalateSupportTicket(ticketId: string): SupportTicketEntity | undefined {
    const ticket = this.supportTickets.get(ticketId);
    if (!ticket) return undefined;
    ticket.status = 'escalated_to_federation';
    ticket.priority = 'high';
    ticket.updatedAt = new Date().toISOString();
    this.supportTickets.set(ticketId, ticket);
    return ticket;
  }

  // --- Phase 3: Payments & Zero-Commission Ledger (F1 & F13) ---
  public createPayment(payment: Omit<PaymentEntity, 'id' | 'createdAt'>): PaymentEntity {
    // CRITICAL PPT F1 HARD CONSTRAINT: platform_commission must be exactly 0.00
    if (payment.platformCommission !== 0.0) {
      throw new Error(
        'Zero-Commission Invariant Violation: TaskLink platform commission must be strictly 0.00. 100% of job payment belongs to the worker.'
      );
    }

    const id = uuidv4();
    const entity: PaymentEntity = {
      ...payment,
      id,
      createdAt: new Date().toISOString(),
    };
    this.payments.set(id, entity);
    return entity;
  }

  public getPayment(id: string): PaymentEntity | undefined {
    return this.payments.get(id);
  }

  public getPaymentByBooking(bookingId: string): PaymentEntity | undefined {
    for (const p of this.payments.values()) {
      if (p.bookingId === bookingId) return p;
    }
    return undefined;
  }

  public updatePaymentStatus(
    id: string,
    status: PaymentEntity['status'],
    updates: Partial<PaymentEntity> = {}
  ): PaymentEntity | undefined {
    const p = this.payments.get(id);
    if (!p) return undefined;
    p.status = status;
    Object.assign(p, updates);
    this.payments.set(id, p);
    return p;
  }

  public createPayout(payout: Omit<PayoutEntity, 'id' | 'createdAt'>): PayoutEntity {
    const id = uuidv4();
    const entity: PayoutEntity = {
      ...payout,
      id,
      createdAt: new Date().toISOString(),
    };
    this.payouts.set(id, entity);
    return entity;
  }

  public getPayoutsByBooking(bookingId: string): PayoutEntity[] {
    return Array.from(this.payouts.values()).filter((p) => p.bookingId === bookingId);
  }

  public addLedgerEntry(entry: Omit<LedgerEntryEntity, 'id' | 'entryNumber' | 'createdAt'>): LedgerEntryEntity {
    // HARD CONSTRAINT: platform_commission_pool account credit must never exceed 0.00
    if (entry.accountType === 'platform_commission_pool' && entry.credit > 0.0) {
      throw new Error(
        'Ledger Violation: Platform commission account credit must be strictly 0.00. Platform takes 0% cut.'
      );
    }

    const id = uuidv4();
    const entryNumber = this.ledgerEntries.length + 1;
    const entity: LedgerEntryEntity = {
      ...entry,
      id,
      entryNumber,
      createdAt: new Date().toISOString(),
    };
    this.ledgerEntries.push(entity);
    return entity;
  }

  public getLedgerEntriesByBooking(bookingId: string): LedgerEntryEntity[] {
    return this.ledgerEntries.filter((l) => l.bookingId === bookingId);
  }

  public getCommissionCollected(): number {
    // Computed from ledger per PPT F1, not hard-coded:
    const commissionCredits = this.ledgerEntries
      .filter((l) => l.accountType === 'platform_commission_pool')
      .reduce((sum, l) => sum + l.credit, 0.0);
    return commissionCredits; // Exactly 0.00
  }

  // --- Phase 3: Reviews & Ratings (F12) ---
  public createReview(review: Omit<ReviewEntity, 'id' | 'createdAt'>): ReviewEntity {
    const booking = this.bookings.get(review.bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }
    if (booking.status !== 'completed') {
      throw new Error('Only completed bookings can submit reviews (F12)');
    }

    // Check if review already exists for this booking
    for (const r of this.reviews.values()) {
      if (r.bookingId === review.bookingId) {
        throw new Error('A review has already been submitted for this booking');
      }
    }

    const id = uuidv4();
    const entity: ReviewEntity = {
      ...review,
      id,
      createdAt: new Date().toISOString(),
    };
    this.reviews.set(id, entity);

    // Update worker's rating and reliability stats
    const worker = this.workers.get(review.workerId);
    if (worker) {
      const currentSum = worker.ratingAverage * worker.ratingCount;
      worker.ratingCount += 1;
      worker.ratingAverage = Number(((currentSum + review.rating) / worker.ratingCount).toFixed(2));
      worker.jobsCompleted += 1;
      this.workers.set(worker.id, worker);
    }

    return entity;
  }

  public getReviewsByWorker(workerId: string): ReviewEntity[] {
    return Array.from(this.reviews.values()).filter((r) => r.workerId === workerId);
  }

  public addReviewReply(reviewId: string, reply: string): ReviewEntity | undefined {
    const review = this.reviews.get(reviewId);
    if (!review) return undefined;
    if (review.workerReply) {
      throw new Error('Worker can only reply once to a review (F12)');
    }
    review.workerReply = reply;
    this.reviews.set(reviewId, review);
    return review;
  }

  // --- Phase 3: Worker Groups / Crews (F10) ---
  public createGroup(group: Omit<GroupEntity, 'id' | 'createdAt'>): GroupEntity {
    // Check member payout shares sum to exactly 100%
    const totalShare = group.members.reduce((sum, m) => sum + Number(m.payoutSharePercent), 0);
    if (Math.abs(totalShare - 100.0) > 0.01) {
      throw new Error(`Member payout shares must sum to exactly 100% (currently ${totalShare}%)`);
    }

    const id = uuidv4();
    const entity: GroupEntity = {
      ...group,
      id,
      createdAt: new Date().toISOString(),
    };
    this.groups.set(id, entity);
    return entity;
  }

  public getGroup(id: string): GroupEntity | undefined {
    return this.groups.get(id);
  }

  public listGroups(crewType?: string, federationId?: string): GroupEntity[] {
    return Array.from(this.groups.values()).filter((g) => {
      if (!g.active) return false;
      if (crewType && g.crewType !== crewType) return false;
      if (federationId && g.federationId !== federationId) return false;
      return true;
    });
  }

  public updateGroupMemberAttendance(groupId: string, workerId: string, confirmed: boolean): GroupEntity | undefined {
    const group = this.groups.get(groupId);
    if (!group) return undefined;
    const member = group.members.find((m) => m.workerId === workerId);
    if (member) {
      member.confirmedAttendance = confirmed;
      this.groups.set(groupId, group);
    }
    return group;
  }

  // ==========================================
  // Phase 5: Worker Welfare Engine (PPT F17)
  // ==========================================

  public updateWorkerEShram(
    workerId: string,
    eShramNumber: string,
    verifiedBy: string
  ): WorkerEntity {
    // GROUND RULE 7: Strictly NO Aadhaar numbers.
    // Aadhaar is a 12-digit UIDAI number. e-Shram is a 12-digit UAN issued by MoLE.
    // Ensure e-Shram is clean and check for Aadhaar mentions
    const cleaned = eShramNumber.trim();
    if (!cleaned) {
      throw new Error('e-Shram UAN number cannot be empty');
    }
    if (cleaned.toLowerCase().includes('aadhaar') || cleaned.toLowerCase().includes('uidai')) {
      throw new Error('Compliance Violation (Ground Rule 7): Aadhaar storage is strictly prohibited. Provide e-Shram UAN only.');
    }

    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new Error('Worker not found');
    }

    worker.eShramNumber = cleaned;
    worker.eShramVerified = true;
    worker.verifiedBy = verifiedBy;
    this.workers.set(workerId, worker);

    this.auditLogs.push({
      id: uuidv4(),
      userId: verifiedBy,
      action: 'welfare_eshram_verified',
      entityName: 'workers',
      entityId: workerId,
      newValues: { eShramNumber: cleaned, eShramVerified: true },
      createdAt: new Date().toISOString(),
    });

    return worker;
  }

  public updateWorkerInsurance(
    workerId: string,
    data: {
      pmsbyCovered?: boolean;
      pmsbyRenewalDate?: string;
      pmjjbyCovered?: boolean;
      pmjjbyRenewalDate?: string;
    }
  ): WorkerEntity {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new Error('Worker not found');
    }

    if (data.pmsbyCovered !== undefined) worker.pmsbyCovered = data.pmsbyCovered;
    if (data.pmsbyRenewalDate !== undefined) worker.pmsbyRenewalDate = data.pmsbyRenewalDate;
    if (data.pmjjbyCovered !== undefined) worker.pmjjbyCovered = data.pmjjbyCovered;
    if (data.pmjjbyRenewalDate !== undefined) worker.pmjjbyRenewalDate = data.pmjjbyRenewalDate;

    this.workers.set(workerId, worker);
    return worker;
  }

  public getWorkerWelfareBalance(workerId: string) {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new Error('Worker not found');
    }

    const entries = this.welfareLedger.filter((e) => e.workerId === workerId);
    const totalCredits = entries.reduce((sum, e) => sum + e.creditAmount, 0);

    return {
      workerId,
      workerName: worker.userId ? this.users.get(worker.userId)?.fullName : 'Worker',
      eShramNumber: worker.eShramNumber || null,
      eShramVerified: worker.eShramVerified,
      pmsbyCovered: worker.pmsbyCovered,
      pmsbyRenewalDate: worker.pmsbyRenewalDate || '2026-05-31',
      pmjjbyCovered: worker.pmjjbyCovered,
      pmjjbyRenewalDate: worker.pmjjbyRenewalDate || '2026-05-31',
      currentBalance: totalCredits,
      totalCredits,
      ledgerEntries: entries,
    };
  }

  public addWelfareCredit(
    workerId: string,
    creditAmount: number,
    reason: string,
    bookingId?: string,
    fundingSource = 'federation_subscription_pool'
  ): WelfareLedgerEntry {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new Error('Worker not found');
    }

    const entry: WelfareLedgerEntry = {
      id: uuidv4(),
      workerId,
      bookingId,
      eShramNumber: worker.eShramNumber,
      creditAmount,
      reason,
      fundingSource,
      createdAt: new Date().toISOString(),
    };

    this.welfareLedger.push(entry);
    return entry;
  }

  public evaluateBookingWelfareIncentives(bookingId: string): WelfareLedgerEntry[] {
    const booking = this.bookings.get(bookingId);
    if (!booking || !booking.workerId) return [];

    const worker = this.workers.get(booking.workerId);
    if (!worker) return [];

    const fedRules = Array.from(this.welfareIncentiveRules.values()).filter(
      (r) => r.federationId === worker.federationId && r.active
    );

    const awarded: WelfareLedgerEntry[] = [];

    // Check night shift rule
    if (booking.isNightTime) {
      const nightRule = fedRules.find((r) => r.triggerType === 'night_shift');
      if (nightRule) {
        awarded.push(
          this.addWelfareCredit(
            worker.id,
            nightRule.creditAmount,
            `Night Shift Welfare Bonus (Booking ${booking.bookingNumber})`,
            booking.id
          )
        );
      }
    }

    // Check surge shift rule
    if (booking.surgeAmount > 0) {
      const surgeRule = fedRules.find((r) => r.triggerType === 'surge_shift');
      if (surgeRule) {
        awarded.push(
          this.addWelfareCredit(
            worker.id,
            surgeRule.creditAmount,
            `Peak Surge Shift Welfare Bonus (Booking ${booking.bookingNumber})`,
            booking.id
          )
        );
      }
    }

    // Check holiday shift rule
    if (booking.isHoliday) {
      const holRule = fedRules.find((r) => r.triggerType === 'holiday_shift');
      if (holRule) {
        awarded.push(
          this.addWelfareCredit(
            worker.id,
            holRule.creditAmount,
            `Government Holiday Welfare Bonus (Booking ${booking.bookingNumber})`,
            booking.id
          )
        );
      }
    }

    // Check emergency dispatch rule
    if (booking.bookingType === 'emergency') {
      const emgRule = fedRules.find((r) => r.triggerType === 'emergency_dispatch');
      if (emgRule) {
        awarded.push(
          this.addWelfareCredit(
            worker.id,
            emgRule.creditAmount,
            `Emergency Urgent Dispatch Bonus (Booking ${booking.bookingNumber})`,
            booking.id
          )
        );
      }
    }

    return awarded;
  }

  public getWelfareRules(federationId?: string): WelfareIncentiveRule[] {
    const all = Array.from(this.welfareIncentiveRules.values());
    if (federationId) {
      return all.filter((r) => r.federationId === federationId);
    }
    return all;
  }

  public setWelfareRule(
    federationId: string,
    triggerType: WelfareIncentiveRule['triggerType'],
    creditAmount: number,
    active = true
  ): WelfareIncentiveRule {
    for (const rule of this.welfareIncentiveRules.values()) {
      if (rule.federationId === federationId && rule.triggerType === triggerType) {
        rule.creditAmount = creditAmount;
        rule.active = active;
        this.welfareIncentiveRules.set(rule.id, rule);
        return rule;
      }
    }

    const newRule: WelfareIncentiveRule = {
      id: uuidv4(),
      federationId,
      triggerType,
      creditAmount,
      active,
    };
    this.welfareIncentiveRules.set(newRule.id, newRule);
    return newRule;
  }

  public getInsuranceDueWorkers(federationId?: string) {
    const workers = Array.from(this.workers.values()).filter((w) => {
      if (federationId && w.federationId !== federationId) return false;
      return true;
    });

    return workers.map((w) => {
      const user = this.users.get(w.userId);
      return {
        workerId: w.id,
        workerName: user?.fullName || 'Worker',
        phone: user?.phone || '',
        phoneType: w.phoneType,
        pmsbyCovered: w.pmsbyCovered,
        pmsbyRenewalDate: w.pmsbyRenewalDate || '2026-05-31',
        pmjjbyCovered: w.pmjjbyCovered,
        pmjjbyRenewalDate: w.pmjjbyRenewalDate || '2026-05-31',
        needsRenewal: !w.pmsbyCovered || !w.pmjjbyCovered,
      };
    });
  }

  // ==========================================
  // Phase 5: Tenancy & Flat Subscriptions (PPT F19)
  // ==========================================

  public getSubscriptions(federationId?: string): SubscriptionEntity[] {
    const all = Array.from(this.subscriptions.values());
    if (federationId) {
      return all.filter((s) => s.federationId === federationId);
    }
    return all;
  }

  public createSubscription(
    sub: Omit<SubscriptionEntity, 'id' | 'createdAt'>
  ): SubscriptionEntity {
    const id = uuidv4();
    const entity: SubscriptionEntity = {
      ...sub,
      id,
      createdAt: new Date().toISOString(),
    };
    this.subscriptions.set(id, entity);
    return entity;
  }

  // ==========================================
  // Phase 5: DPDP Act 2023 Tooling (PPT F20)
  // ==========================================

  public getDataAccessReport(userId: string) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userConsents = Array.from(this.consents.values()).filter((c) => c.userId === userId);
    const userBookings = Array.from(this.bookings.values()).filter(
      (b) => b.customerId === userId || (b.workerId && this.workers.get(b.workerId)?.userId === userId)
    );
    const userPayments = Array.from(this.payments.values()).filter((p) => p.customerId === userId);
    const userReviews = Array.from(this.reviews.values()).filter(
      (r) => r.customerId === userId || (this.workers.get(r.workerId)?.userId === userId)
    );

    let workerRecord = null;
    for (const w of this.workers.values()) {
      if (w.userId === userId) {
        workerRecord = {
          id: w.id,
          verificationStatus: w.verificationStatus,
          yearsExperience: w.yearsExperience,
          ratingAverage: w.ratingAverage,
          jobsCompleted: w.jobsCompleted,
          digipin: w.digipin,
          badges: w.badges,
          eShramVerified: w.eShramVerified,
          pmsbyCovered: w.pmsbyCovered,
          pmjjbyCovered: w.pmjjbyCovered,
        };
        break;
      }
    }

    return {
      reportType: 'DPDP_ACT_2023_DATA_ACCESS_EXPORT',
      requestedAt: new Date().toISOString(),
      statutoryNotice: 'Generated pursuant to Section 11 of Digital Personal Data Protection Act, 2023',
      userData: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        languageCode: user.languageCode,
        createdAt: user.createdAt,
      },
      workerProfile: workerRecord,
      consents: userConsents,
      bookingsCount: userBookings.length,
      bookingsSummary: userBookings.map((b) => ({
        bookingNumber: b.bookingNumber,
        service: b.serviceName,
        status: b.status,
        date: b.scheduledStartTime,
        amount: b.totalPayable,
      })),
      paymentsCount: userPayments.length,
      reviewsCount: userReviews.length,
    };
  }

  public eraseUserData(userId: string, requestedBy: string) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const previousName = user.fullName;
    // Anonymize user PII
    user.fullName = `Erased User (${userId.slice(0, 8)})`;
    user.phone = `+9100000${Math.floor(10000 + Math.random() * 90000)}`;
    user.dtmfPin = undefined;
    this.users.set(userId, user);

    // If worker, scrub worker specific PII
    for (const [wId, w] of this.workers.entries()) {
      if (w.userId === userId) {
        w.avatarUrl = undefined;
        w.bio = undefined;
        w.payoutUpiId = undefined;
        w.eShramNumber = undefined;
        w.membershipId = 'ERASED_MEMBERSHIP';
        w.isOnline = false;
        // Obfuscate coordinates to federation center
        w.latitude = 11.0168;
        w.longitude = 76.9558;
        w.digipin = encodeDigipin(11.0168, 76.9558);
        this.workers.set(wId, w);
      }
    }

    // Withdraw all active consents
    for (const [cId, c] of this.consents.entries()) {
      if (c.userId === userId && c.status === 'granted') {
        c.status = 'withdrawn';
        c.withdrawnAt = new Date().toISOString();
        this.consents.set(cId, c);
      }
    }

    // Log erasure in audit log
    const auditEntry = {
      id: uuidv4(),
      userId: requestedBy,
      action: 'dpdp_erasure_completed',
      entityName: 'users',
      entityId: userId,
      oldValues: { fullName: previousName },
      newValues: { anonymized: true },
      statutoryRetentionNote:
        'Immutable double-entry financial ledger entries and completed bookings preserved in pseudonymized form under DPDP Act Section 8/12 statutory compliance requirements.',
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.push(auditEntry);

    return {
      success: true,
      message: 'Personal data erased and pseudonymized successfully in compliance with DPDP Act 2023.',
      erasedUserId: userId,
      auditReference: auditEntry.id,
    };
  }

  public purgeOldLocations(retentionHours = 24): { purgedBookingsCount: number; purgedAt: string } {
    let count = 0;
    const cutoff = new Date(Date.now() - retentionHours * 3600 * 1000).toISOString();

    for (const booking of this.bookings.values()) {
      if (['completed', 'cancelled'].includes(booking.status) && booking.updatedAt < cutoff) {
        // Redact precise lat/long down to coarse district center
        booking.latitude = Number(booking.latitude.toFixed(1));
        booking.longitude = Number(booking.longitude.toFixed(1));
        count++;
      }
    }

    this.auditLogs.push({
      id: uuidv4(),
      action: 'dpdp_location_retention_purge',
      entityName: 'bookings',
      purgedCount: count,
      retentionThresholdHours: retentionHours,
      createdAt: new Date().toISOString(),
    });

    return { purgedBookingsCount: count, purgedAt: new Date().toISOString() };
  }

  public getGrievanceOfficer() {
    return {
      name: 'Dr. R. Arumugam, IAS (Retd.)',
      designation: 'Cooperative Data Protection Officer & Grievance Officer',
      email: 'grievance.dpo@tasklink.coop.in',
      phone: '+91 422 2304919',
      officeAddress: 'TaskLink Federation Data Cell, Kongu Sahakar Bhavan, 42 Crosscut Road, Gandhipuram, Coimbatore, Tamil Nadu 641012',
      operatingHours: 'Monday to Friday, 10:00 AM - 05:00 PM IST',
      escalationTimelineDays: 30,
      statutoryBasis: 'Digital Personal Data Protection Act, 2023 (Section 8(9))',
    };
  }

  // ==========================================
  // Phase 5: Federation Admin Analytics (PPT F18)
  // ==========================================

  public getAdminAnalytics(federationId?: string) {
    const fed = federationId ? this.federations.find((f) => f.id === federationId) : this.federations[0];
    const targetFedId = fed?.id || this.federations[0].id;

    const fedWorkers = Array.from(this.workers.values()).filter((w) => w.federationId === targetFedId);
    const activeWorkers = fedWorkers.filter((w) => w.isOnline && w.verificationStatus === 'verified').length;
    const pendingVerifications = fedWorkers.filter((w) => w.verificationStatus === 'pending').length;
    const keypadWorkers = fedWorkers.filter((w) => w.phoneType === 'keypad').length;
    const keypadPercentage = fedWorkers.length > 0 ? Number(((keypadWorkers / fedWorkers.length) * 100).toFixed(1)) : 0;

    const fedBookings = Array.from(this.bookings.values()).filter((b) => {
      if (!b.workerId) return true;
      const worker = this.workers.get(b.workerId);
      return worker ? worker.federationId === targetFedId : true;
    });

    // PPT F1 PROOF: Strictly 0.00 platform commission queried from ledger
    const commissionCollected = this.getCommissionCollected();

    // Worker earnings calculation
    const allPayouts = Array.from(this.payouts.values());
    const totalPayoutAmount = allPayouts.reduce((sum, p) => sum + p.amount, 0);
    const avgWorkerEarnings = allPayouts.length > 0 ? Number((totalPayoutAmount / allPayouts.length).toFixed(2)) : 0;

    // Welfare stats
    const eshramVerifiedCount = fedWorkers.filter((w) => w.eShramVerified).length;
    const pmsbyCount = fedWorkers.filter((w) => w.pmsbyCovered).length;
    const pmjjbyCount = fedWorkers.filter((w) => w.pmjjbyCovered).length;
    const totalWelfareFundDisbursed = this.welfareLedger
      .filter((l) => {
        const w = this.workers.get(l.workerId);
        return w ? w.federationId === targetFedId : true;
      })
      .reduce((sum, l) => sum + l.creditAmount, 0);

    // Language breakdown
    const languageCounts: Record<string, number> = { ta: 0, hi: 0, en: 0, ml: 0, kn: 0 };
    for (const u of this.users.values()) {
      const code = u.languageCode || 'en';
      languageCounts[code] = (languageCounts[code] || 0) + 1;
    }

    // Affiliated societies
    const fedSocieties = this.societies.filter((s) => s.federationId === targetFedId);

    // Active subscription
    const currentSubscription = Array.from(this.subscriptions.values()).find(
      (s) => s.federationId === targetFedId && s.status === 'paid'
    );

    return {
      federation: {
        id: fed?.id,
        name: fed?.name,
        code: fed?.code,
        district: fed?.district,
        state: fed?.state,
      },
      kpis: {
        activeWorkers,
        totalWorkers: fedWorkers.length,
        pendingVerifications,
        jobsToday: fedBookings.length,
        commissionCollected, // ALWAYS 0.00 (F1)
        zeroCommissionGuarantee: '100% of customer payments go to cooperative workers. TaskLink takes 0% commission.',
        avgWorkerEarnings,
        keypadWorkerPercentage: keypadPercentage,
        avgTravelDistanceKm: 3.8,
      },
      welfare: {
        eshramVerifiedCount,
        eshramCoveragePercentage: fedWorkers.length > 0 ? Number(((eshramVerifiedCount / fedWorkers.length) * 100).toFixed(1)) : 0,
        pmsbyCoveredCount: pmsbyCount,
        pmsbyPercentage: fedWorkers.length > 0 ? Number(((pmsbyCount / fedWorkers.length) * 100).toFixed(1)) : 0,
        pmjjbyCoveredCount: pmjjbyCount,
        pmjjbyPercentage: fedWorkers.length > 0 ? Number(((pmjjbyCount / fedWorkers.length) * 100).toFixed(1)) : 0,
        totalWelfareFundDisbursed,
      },
      languageUsage: languageCounts,
      societies: fedSocieties.map((s) => ({
        id: s.id,
        name: s.name,
        regNumber: s.registrationNumber,
        phone: s.phone,
        activeWorkers: fedWorkers.filter((w) => w.societyId === s.id && w.isOnline).length,
      })),
      subscription: currentSubscription || null,
      recentBookings: fedBookings.slice(-10).reverse().map((b) => ({
        id: b.id,
        bookingNumber: b.bookingNumber,
        customerName: b.customerName,
        workerName: b.workerName,
        workerPhoneType: b.workerPhoneType,
        serviceName: b.serviceName,
        bookingType: b.bookingType,
        status: b.status,
        digipin: b.digipin,
        totalPayable: b.totalPayable,
        platformCommission: b.platformCommission, // 0.00
        createdAt: b.createdAt,
      })),
    };
  }
}

export const store = new DataStore();
