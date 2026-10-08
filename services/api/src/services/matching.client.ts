import { store, WorkerEntity, MatchingWeights } from '../data/store.js';

export interface MatchCandidate {
  id: string;
  name: string;
  phone_type: 'smartphone' | 'keypad';
  verification_status: string;
  service_code: string;
  experience_years: number;
  is_certified: boolean;
  is_online: boolean;
  available_nights: boolean;
  rating_average: number;
  rating_count: number;
  jobs_completed: number;
  on_time_rate: number;
  completion_rate: number;
  recent_jobs_today: number;
  latitude: number;
  longitude: number;
  service_radius_km: number;
  languages: string[];
}

export interface FactorBreakdown {
  skill_score: number;
  availability_score: number;
  distance_score: number;
  reliability_score: number;
  workload_score: number;
  customer_pref_score: number;
  total_weighted_score: number;
  distance_meters: number;
  estimated_travel_minutes: number;
}

export interface RankedWorkerResult {
  worker_id: string;
  worker_name: string;
  phone_type: string;
  total_score: number;
  rank: number;
  breakdown: FactorBreakdown;
  why_this_worker: string;
}

export interface MatchRequestParams {
  booking_type: 'scheduled' | 'on_demand' | 'emergency';
  service_code: string;
  customer_lat: number;
  customer_lon: number;
  customer_language?: string;
  is_night_slot?: boolean;
  federation_id?: string;
  weights?: MatchingWeights;
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dPhi = ((lat2 - lat1) * Math.PI) / 180;
  const dLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class MatchingClient {
  private pythonServiceUrl: string;

  constructor(pythonServiceUrl: string = process.env.MATCHING_SERVICE_URL || 'http://127.0.0.1:8000') {
    this.pythonServiceUrl = pythonServiceUrl;
  }

  /**
   * Main matching entrypoint:
   * 1. Fetches candidate workers from store
   * 2. Attempts Python FastAPI ML matching service
   * 3. Falls back to identical built-in 6-factor Bayesian scoring if Python service unreachable
   */
  public async findRankedWorkers(params: MatchRequestParams): Promise<RankedWorkerResult[]> {
    const fedId = params.federation_id || store.federations[0]?.id;
    const weights = params.weights || store.getMatchingWeights(fedId);

    // Prepare candidate records from verified workers in store
    const verifiedWorkers = store.getVerifiedWorkers();
    const candidates: MatchCandidate[] = verifiedWorkers.map((w) => {
      const skill = w.serviceSkills.find((s) => s.serviceId === params.service_code || s.serviceName.toLowerCase().includes(params.service_code.toLowerCase())) ||
                    w.serviceSkills[0];

      return {
        id: w.id,
        name: store.users.get(w.userId)?.fullName || 'Cooperative Artisan',
        phone_type: w.phoneType,
        verification_status: w.verificationStatus,
        service_code: params.service_code.toUpperCase(),
        experience_years: skill ? skill.experienceYears : w.yearsExperience,
        is_certified: skill ? skill.isCertified : false,
        is_online: w.isOnline,
        available_nights: w.availableNights,
        rating_average: w.ratingAverage,
        rating_count: w.ratingCount,
        jobs_completed: w.jobsCompleted,
        on_time_rate: w.onTimeRate,
        completion_rate: w.completionRate,
        recent_jobs_today: 0,
        latitude: w.latitude,
        longitude: w.longitude,
        service_radius_km: 15.0,
        languages: w.languages,
      };
    });

    const payload = {
      booking_type: params.booking_type,
      service_code: params.service_code.toUpperCase(),
      customer_lat: params.customer_lat,
      customer_lon: params.customer_lon,
      customer_language: params.customer_language || 'Tamil',
      is_night_slot: !!params.is_night_slot,
      candidates,
      weights,
    };

    // Try Python ML Service
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const resp = await fetch(`${this.pythonServiceUrl}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const data: any = await resp.json();
        return data.ranked_workers;
      }
    } catch {
      // Python service not running synchronously, run deterministic fallback
    }

    // Built-in Deterministic Six-Factor Algorithm (Exact parity with services/matching/app/main.py)
    return this.calculateLocalMatch(payload);
  }

  public calculateLocalMatch(payload: {
    booking_type: string;
    service_code: string;
    customer_lat: number;
    customer_lon: number;
    customer_language: string;
    is_night_slot: boolean;
    candidates: MatchCandidate[];
    weights: MatchingWeights;
  }): RankedWorkerResult[] {
    const { booking_type, customer_lat, customer_lon, customer_language, is_night_slot, candidates, weights } = payload;

    const scoredList: {
      worker_id: string;
      worker_name: string;
      phone_type: string;
      recent_jobs: number;
      total_score: number;
      breakdown: FactorBreakdown;
      why_this_worker: string;
    }[] = [];

    for (const cand of candidates) {
      // HARD FILTER 1: Verified
      if (cand.verification_status !== 'verified') continue;

      // HARD FILTER 2: Service code match
      if (cand.service_code !== payload.service_code) continue;

      // HARD FILTER 3: Keypad Phone Exclusion for On-Demand / Emergency Jobs (PPT F6 & F7)
      if ((booking_type === 'on_demand' || booking_type === 'emergency') && cand.phone_type === 'keypad') {
        continue;
      }

      // HARD FILTER 4: Night Availability
      if (is_night_slot && !cand.available_nights) continue;

      // Distance calculation
      const distM = haversineMeters(customer_lat, customer_lon, cand.latitude, cand.longitude);
      const maxRadiusM = cand.service_radius_km * 1000;

      // HARD FILTER 5: Radius boundary
      if (distM > maxRadiusM) continue;

      // Factor 1: Skill Score
      const expNorm = Math.min(1.0, cand.experience_years / 15.0);
      const certBonus = cand.is_certified ? 0.2 : 0.0;
      const skillScore = Math.min(1.0, 0.5 + 0.3 * expNorm + certBonus);

      // Factor 2: Availability Score
      const availScore = booking_type === 'on_demand' ? (cand.is_online ? 1.0 : 0.0) : (cand.is_online ? 1.0 : 0.85);

      // Factor 3: Distance & Travel Time Score
      const travelMins = Math.round(distM / (25000 / 60));
      const distScore = Math.max(0.0, 1.0 - distM / maxRadiusM);

      // Factor 4: Reliability & Service History (Bayesian smoothed)
      const smoothedRating = (cand.rating_average * cand.jobs_completed + 4.5 * 10) / (cand.jobs_completed + 10);
      const ratingNorm = smoothedRating / 5.0;
      const relScore = 0.5 * ratingNorm + 0.25 * cand.completion_rate + 0.25 * cand.on_time_rate;

      // Factor 5: Workload (Fairness: fewer recent jobs today scores higher)
      const workloadScore = 1.0 / (1.0 + cand.recent_jobs_today);

      // Factor 6: Customer Preferences
      const custLang = customer_language.toLowerCase();
      const hasLang = cand.languages.some((l) => l.toLowerCase().includes(custLang));
      const prefScore = hasLang ? 1.0 : 0.5;

      // Total Weighted Score
      const totalScore =
        skillScore * weights.skill +
        availScore * weights.availability +
        distScore * weights.distance +
        relScore * weights.reliability +
        workloadScore * weights.workload +
        prefScore * weights.customerPref;

      const breakdown: FactorBreakdown = {
        skill_score: Number(skillScore.toFixed(3)),
        availability_score: Number(availScore.toFixed(3)),
        distance_score: Number(distScore.toFixed(3)),
        reliability_score: Number(relScore.toFixed(3)),
        workload_score: Number(workloadScore.toFixed(3)),
        customer_pref_score: Number(prefScore.toFixed(3)),
        total_weighted_score: Number(totalScore.toFixed(4)),
        distance_meters: Math.round(distM),
        estimated_travel_minutes: travelMins,
      };

      // Why this worker breakdown text
      const topFactors: string[] = [];
      if (skillScore >= 0.8) topFactors.push(`Top-rated trade skill (${cand.experience_years} yrs)`);
      if (distScore >= 0.8) topFactors.push(`Nearby (${(distM / 1000).toFixed(1)} km)`);
      if (relScore >= 0.85) topFactors.push(`Reliable history (${Math.round(cand.completion_rate * 100)}%)`);
      if (workloadScore >= 0.9) topFactors.push('Fair cooperative distribution');

      scoredList.push({
        worker_id: cand.id,
        worker_name: cand.name,
        phone_type: cand.phone_type,
        recent_jobs: cand.recent_jobs_today,
        total_score: totalScore,
        breakdown,
        why_this_worker: topFactors.length > 0 ? topFactors.join(' • ') : 'Verified cooperative artisan',
      });
    }

    // Fairness tie-breaking: Sort descending by totalScore, break exact ties by fewest recent_jobs
    scoredList.sort((a, b) => {
      if (Math.abs(b.total_score - a.total_score) > 0.0001) {
        return b.total_score - a.total_score;
      }
      return a.recent_jobs - b.recent_jobs;
    });

    return scoredList.map((item, idx) => ({
      worker_id: item.worker_id,
      worker_name: item.worker_name,
      phone_type: item.phone_type,
      total_score: item.total_score,
      rank: idx + 1,
      breakdown: item.breakdown,
      why_this_worker: item.why_this_worker,
    }));
  }
}

export const matchingClient = new MatchingClient();
