import math
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(
    title="TaskLink Six-Factor Matching Service",
    description="Fair, cooperative ML matching service with 0% bias and zero commission (PPT F6)",
    version="1.0.0",
)

# ----------------- Models -----------------

class MatchingWeights(BaseModel):
    skill: float = Field(0.25, description="Weight for trade skill & certifications")
    availability: float = Field(0.20, description="Weight for slot overlap and online status")
    distance: float = Field(0.20, description="Weight for travel distance & time")
    reliability: float = Field(0.15, description="Weight for Bayesian rating & completion rate")
    workload: float = Field(0.10, description="Weight favoring fewer recent jobs (Fairness)")
    customer_pref: float = Field(0.10, description="Weight for language and preferences")

class WorkerCandidate(BaseModel):
    id: str = Field(..., alias="id")
    name: str
    phone_type: str = "smartphone"  # smartphone | keypad
    verification_status: str = "verified"
    service_code: str
    experience_years: int = 1
    is_certified: bool = False
    is_online: bool = True
    available_nights: bool = False
    rating_average: float = 4.5
    rating_count: int = 0
    jobs_completed: int = 0
    on_time_rate: float = 0.95
    completion_rate: float = 0.98
    recent_jobs_today: int = 0
    latitude: float
    longitude: float
    service_radius_km: float = 15.0
    languages: List[str] = ["Tamil", "English"]

    class Config:
        populate_by_name = True

class MatchRequest(BaseModel):
    booking_type: str = "scheduled"  # scheduled | on_demand | emergency
    service_code: str
    customer_lat: float
    customer_lon: float
    customer_language: str = "Tamil"
    is_night_slot: bool = False
    candidates: List[WorkerCandidate]
    weights: Optional[MatchingWeights] = None

class FactorBreakdown(BaseModel):
    skill_score: float
    availability_score: float
    distance_score: float
    reliability_score: float
    workload_score: float
    customer_pref_score: float
    total_weighted_score: float
    distance_meters: float
    estimated_travel_minutes: float

class RankedWorker(BaseModel):
    worker_id: str
    worker_name: str
    phone_type: str
    total_score: float
    rank: int
    breakdown: FactorBreakdown
    why_this_worker: str

class MatchResponse(BaseModel):
    success: bool
    matched_count: int
    booking_type: str
    ranked_workers: List[RankedWorker]

# ----------------- Haversine Distance Helper -----------------

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000  # Radius of earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

# ----------------- Six-Factor Scoring Algorithm -----------------

def compute_six_factor_score(
    candidate: WorkerCandidate,
    req: MatchRequest,
    weights: MatchingWeights
) -> Optional[FactorBreakdown]:
    """
    Computes individual factor scores (each 0.0 - 1.0) and total weighted score.
    Returns None if hard filters fail.
    """
    # HARD FILTER 1: Must be verified
    if candidate.verification_status != "verified":
        return None

    # HARD FILTER 2: Service code match
    if candidate.service_code.upper() != req.service_code.upper():
        return None

    # HARD FILTER 3: Keypad Phone Exclusion for On-Demand / Emergency Jobs (F7 & F6)
    # PPT Requirement: Keypad-phone workers are offered pre-booked / scheduled jobs only!
    if req.booking_type in ["on_demand", "emergency"] and candidate.phone_type == "keypad":
        return None

    # HARD FILTER 4: Night Availability
    if req.is_night_slot and not candidate.available_nights:
        return None

    # Compute Distance
    dist_m = haversine_distance_meters(
        req.customer_lat, req.customer_lon,
        candidate.latitude, candidate.longitude
    )
    max_radius_m = candidate.service_radius_km * 1000.0

    # HARD FILTER 5: Service radius boundary
    if dist_m > max_radius_m:
        return None

    # Factor 1: Skill Score (Match, Certification, Experience)
    exp_norm = min(1.0, candidate.experience_years / 15.0)
    cert_bonus = 0.2 if candidate.is_certified else 0.0
    skill_score = min(1.0, 0.5 + 0.3 * exp_norm + cert_bonus)

    # Factor 2: Availability Score (Online status & slot readiness)
    if req.booking_type == "on_demand":
        avail_score = 1.0 if candidate.is_online else 0.0
    else:
        avail_score = 1.0 if candidate.is_online else 0.85

    # Factor 3: Distance & Travel Time Score (Normalized)
    # 25 km/h urban travel speed estimate
    travel_minutes = round((dist_m / (25000.0 / 60.0)), 1)
    dist_score = max(0.0, 1.0 - (dist_m / max_radius_m))

    # Factor 4: Reliability & Service History (Bayesian smoothed rating + completion rate)
    # Bayesian prior: weight with 10 jobs at 4.5 baseline
    smoothed_rating = (candidate.rating_average * candidate.jobs_completed + 4.5 * 10) / (candidate.jobs_completed + 10)
    rating_norm = smoothed_rating / 5.0
    rel_score = (0.5 * rating_norm +
                 0.25 * candidate.completion_rate +
                 0.25 * candidate.on_time_rate)

    # Factor 5: Current Workload (Fairness: fewer recent jobs today scores higher)
    workload_score = 1.0 / (1.0 + candidate.recent_jobs_today)

    # Factor 6: Customer Preferences (Language match, etc.)
    customer_lang = req.customer_language.lower()
    has_lang = any(customer_lang in l.lower() for l in candidate.languages)
    pref_score = 1.0 if has_lang else 0.5

    # Total Weighted Score
    total_score = (
        skill_score * weights.skill +
        avail_score * weights.availability +
        dist_score * weights.distance +
        rel_score * weights.reliability +
        workload_score * weights.workload +
        pref_score * weights.customer_pref
    )

    return FactorBreakdown(
        skill_score=round(skill_score, 3),
        availability_score=round(avail_score, 3),
        distance_score=round(dist_score, 3),
        reliability_score=round(rel_score, 3),
        workload_score=round(workload_score, 3),
        customer_pref_score=round(pref_score, 3),
        total_weighted_score=round(total_score, 4),
        distance_meters=round(dist_m, 1),
        estimated_travel_minutes=travel_minutes,
    )

# ----------------- API Endpoints -----------------

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "TaskLink Python ML Matching Engine",
        "algorithm": "Six-Factor Bayesian Fair Matching",
    }

@app.post("/match", response_model=MatchResponse)
def match_workers(req: MatchRequest):
    weights = req.weights or MatchingWeights()

    scored_candidates = []
    for cand in req.candidates:
        breakdown = compute_six_factor_score(cand, req, weights)
        if breakdown is not None:
            # Generate human-readable "Why this worker" explanation
            top_factors = []
            if breakdown.skill_score >= 0.85:
                top_factors.append(f"Top-rated trade skills ({cand.experience_years} yrs exp)")
            if breakdown.distance_score >= 0.80:
                top_factors.append(f"Nearby ({round(breakdown.distance_meters/1000, 1)} km, ~{int(breakdown.estimated_travel_minutes)} min)")
            if breakdown.reliability_score >= 0.85:
                top_factors.append(f"High completion history ({int(cand.completion_rate*100)}%)")
            if breakdown.workload_score >= 0.90:
                top_factors.append("Fair work distribution bonus")

            why_text = " • ".join(top_factors) if top_factors else "Verified cooperative artisan"

            scored_candidates.append({
                "worker_id": cand.id,
                "worker_name": cand.name,
                "phone_type": cand.phone_type,
                "recent_jobs": cand.recent_jobs_today,
                "total_score": breakdown.total_weighted_score,
                "breakdown": breakdown,
                "why_this_worker": why_text,
            })

    # Fairness Sorting Rule (PPT F6):
    # Sort descending by total_score. Break exact ties by fewest recent jobs today!
    scored_candidates.sort(
        key=lambda x: (x["total_score"], -x["recent_jobs"]),
        reverse=True
    )

    ranked_results = []
    for rank_idx, item in enumerate(scored_candidates):
        ranked_results.append(
            RankedWorker(
                worker_id=item["worker_id"],
                worker_name=item["worker_name"],
                phone_type=item["phone_type"],
                total_score=item["total_score"],
                rank=rank_idx + 1,
                breakdown=item["breakdown"],
                why_this_worker=item["why_this_worker"],
            )
        )

    return MatchResponse(
        success=True,
        matched_count=len(ranked_results),
        booking_type=req.booking_type,
        ranked_workers=ranked_results,
    )
