import { v4 as uuidv4 } from 'uuid';
import { store, QuoteEntity } from '../data/store.js';

export interface PriceQuoteRequest {
  federationId?: string;
  serviceCode: string;
  slotDate?: string; // YYYY-MM-DD
  slotTime?: string; // HH:mm (e.g. "23:00")
  customerLat?: number;
  customerLon?: number;
  state?: string;
  paymentMethod?: 'upi' | 'card' | 'netbanking';
  /** R26 — Emergency booking flag: +30% premium paid directly to worker */
  isEmergency?: boolean;
}

export class PricingService {
  /**
   * Generates a binding price quote with dynamic surge pricing and night/holiday premiums.
   * STRICT PPT F1 REQUIREMENT: Platform commission is ₹0. Worker receives 100% of gig price.
   */
  public generateQuote(req: PriceQuoteRequest): QuoteEntity {
    const federationId = req.federationId || store.federations[0]?.id;
    const serviceCode = req.serviceCode.toUpperCase();
    const service = store.services.find((s) => s.code === serviceCode) || store.services[0];
    const baseRate = Number(service.baseRate);

    const priceRule = store.getPriceRule(federationId);
    const premiumRule = store.getPremiumRule(federationId);

    // 1. Dynamic Pricing Calculation (PPT F8)
    // Compute demand_ratio = open_requests / available_workers
    const openRequests = Array.from(store.bookings.values()).filter(
      (b) => b.serviceCode === serviceCode && (b.status === 'requested' || b.status === 'offered')
    ).length;
    const availableWorkers = Array.from(store.workers.values()).filter(
      (w) => w.verificationStatus === 'verified' && w.isOnline
    ).length || 1;

    const demandRatio = openRequests / availableWorkers;

    // multiplier = clamp(1 + k * (ratio - r0), 1, cap)
    let surgeMultiplier = 1.0;
    if (demandRatio > priceRule.r0BaselineRatio) {
      const rawMultiplier = 1.0 + priceRule.kSensitivity * (demandRatio - priceRule.r0BaselineRatio);
      surgeMultiplier = Math.min(priceRule.surgeCap, Math.max(1.0, rawMultiplier));
    }
    surgeMultiplier = Number(surgeMultiplier.toFixed(2));
    const surgeAmount = Number((baseRate * (surgeMultiplier - 1.0)).toFixed(2));

    // Plain-language surge banner for customer & worker extra earnings
    let surgeBanner: string | undefined;
    let workerSurgeBonus: number | undefined;
    if (surgeMultiplier > 1.0) {
      const pct = Math.round((surgeMultiplier - 1.0) * 100);
      surgeBanner = `High cooperative demand in your area: +${pct}% dynamic pricing applied. 100% goes directly to the artisan.`;
      workerSurgeBonus = surgeAmount;
    }

    // 2. Night Premium Calculation (PPT F9)
    // Default night window: 22:00 to 06:00
    const now = new Date();
    const slotTimeStr = req.slotTime || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const isNightSlot = this.isTimeWithinNightWindow(
      slotTimeStr,
      premiumRule.nightStartTime,
      premiumRule.nightEndTime
    );

    const nightPremiumRate = isNightSlot ? premiumRule.nightPremiumRate : 0.0;
    const nightPremiumAmount = Number((baseRate * nightPremiumRate).toFixed(2));

    // 3. Holiday Premium Calculation (PPT F9)
    const slotDateStr = req.slotDate || now.toISOString().split('T')[0];
    const holiday = store.isHolidayDate(slotDateStr, req.state || 'Tamil Nadu');
    const isHoliday = !!holiday;
    const holidayPremiumRate = isHoliday ? premiumRule.holidayPremiumRate : 0.0;
    const holidayPremiumAmount = Number((baseRate * holidayPremiumRate).toFixed(2));

    // 3b. Emergency Premium (R26 — +30% directly to worker)
    // Emergency jobs bypass queuing; worker receives the full premium.
    const isEmergency = !!req.isEmergency;
    const emergencyPremiumRate = isEmergency ? 0.30 : 0.0;
    const emergencyPremiumAmount = Number((baseRate * emergencyPremiumRate).toFixed(2));

    // 4. Stacking Rule (PPT F9: default 'additive')
    // Emergency premium is ALWAYS additive regardless of stacking rule.
    let totalGigRate = baseRate + surgeAmount;
    if (premiumRule.stackingRule === 'additive') {
      totalGigRate = baseRate + surgeAmount + nightPremiumAmount + holidayPremiumAmount + emergencyPremiumAmount;
    } else if (premiumRule.stackingRule === 'compounded') {
      const compounded = (baseRate + surgeAmount) * (1 + nightPremiumRate) * (1 + holidayPremiumRate);
      totalGigRate = Number(compounded.toFixed(2)) + emergencyPremiumAmount;
    } else if (premiumRule.stackingRule === 'highest_only') {
      const maxExtra = Math.max(surgeAmount, nightPremiumAmount, holidayPremiumAmount);
      totalGigRate = baseRate + maxExtra + emergencyPremiumAmount;
    }

    const workerReceives = Number(totalGigRate.toFixed(2));

    // 5. Zero-Commission Ledger Guarantee (PPT F1)
    const platformCommission = 0.0; // STRICT 0% PLATFORM COMMISSION!

    // Payment Gateway Pass-Through (PPT F1 & F13: Default UPI = ₹0 pass-through fee)
    const paymentGatewayFee = req.paymentMethod === 'card' ? Number((workerReceives * 0.018).toFixed(2)) : 0.0;
    const totalPayable = Number((workerReceives + paymentGatewayFee).toFixed(2));

    // 6. Quote Lock Expiry (PPT F8: default 10 minutes)
    const lockMinutes = priceRule.quoteLockMinutes || 10;
    const expiresAt = new Date(Date.now() + lockMinutes * 60 * 1000).toISOString();

    const quote: QuoteEntity = {
      id: `quote-${uuidv4().substring(0, 8)}`,
      federationId,
      serviceCode,
      serviceName: service.name,
      baseRate,
      demandRatio: Number(demandRatio.toFixed(2)),
      surgeMultiplier,
      surgeAmount,
      isNightSlot,
      nightPremiumRate,
      nightPremiumAmount,
      isHoliday,
      holidayTitle: holiday?.title,
      holidayPremiumRate,
      holidayPremiumAmount,
      isEmergency,
      emergencyPremiumRate,
      emergencyPremiumAmount,
      workerReceives,
      platformCommission,
      paymentGatewayFee,
      totalPayable,
      surgeBanner,
      workerSurgeBonus,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    return store.saveQuote(quote);
  }

  private isTimeWithinNightWindow(timeStr: string, startStr: string, endStr: string): boolean {
    const toMins = (t: string) => {
      const parts = t.split(':').map(Number);
      return (parts[0] || 0) * 60 + (parts[1] || 0);
    };

    const target = toMins(timeStr);
    const start = toMins(startStr);
    const end = toMins(endStr);

    if (start > end) {
      // Over midnight: e.g. 22:00 (1320) to 06:00 (360)
      return target >= start || target < end;
    } else {
      return target >= start && target < end;
    }
  }
}

export const pricingService = new PricingService();
