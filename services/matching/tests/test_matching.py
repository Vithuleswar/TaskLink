"""
Unit tests for TaskLink Six-Factor Matching Service (PPT F6)
"""

import sys
import os

# Add parent dir to sys.path so app can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import (
    WorkerCandidate,
    MatchRequest,
    MatchingWeights,
    compute_six_factor_score,
    match_workers,
)

def test_hard_filters_and_keypad_exclusion():
    cand_keypad = WorkerCandidate(
        id="w-keypad",
        name="Keypad Worker",
        phone_type="keypad",
        verification_status="verified",
        service_code="ELEC",
        latitude=11.0185,
        longitude=76.9634,
        experience_years=5,
    )

    weights = MatchingWeights()

    # Pre-booked / scheduled job -> allowed
    req_scheduled = MatchRequest(
        booking_type="scheduled",
        service_code="ELEC",
        customer_lat=11.0185,
        customer_lon=76.9634,
        candidates=[cand_keypad],
    )
    score_sched = compute_six_factor_score(cand_keypad, req_scheduled, weights)
    assert score_sched is not None, "Keypad worker should be allowed for scheduled jobs"

    # On-demand job -> hard filtered out! (F6 / F7)
    req_ondemand = MatchRequest(
        booking_type="on_demand",
        service_code="ELEC",
        customer_lat=11.0185,
        customer_lon=76.9634,
        candidates=[cand_keypad],
    )
    score_ondemand = compute_six_factor_score(cand_keypad, req_ondemand, weights)
    assert score_ondemand is None, "Keypad worker must NOT be offered on-demand jobs"

    # Unverified worker -> hard filtered out!
    cand_unverified = WorkerCandidate(
        id="w-unverified",
        name="Unverified Worker",
        phone_type="smartphone",
        verification_status="pending",
        service_code="ELEC",
        latitude=11.0185,
        longitude=76.9634,
    )
    score_unver = compute_six_factor_score(cand_unverified, req_scheduled, weights)
    assert score_unver is None, "Unverified worker must be excluded"
    print("  [PASS] Hard filters and keypad exclusion")

def test_six_factors_breakdown():
    cand = WorkerCandidate(
        id="w-smart",
        name="Karthik Master",
        phone_type="smartphone",
        verification_status="verified",
        service_code="ELEC",
        experience_years=10,
        is_certified=True,
        is_online=True,
        rating_average=4.9,
        jobs_completed=100,
        on_time_rate=0.99,
        completion_rate=0.99,
        recent_jobs_today=0,
        latitude=11.0185,
        longitude=76.9634,
        languages=["Tamil", "English"],
    )

    req = MatchRequest(
        booking_type="scheduled",
        service_code="ELEC",
        customer_lat=11.0185,
        customer_lon=76.9634,
        customer_language="Tamil",
        candidates=[cand],
    )
    weights = MatchingWeights()
    breakdown = compute_six_factor_score(cand, req, weights)
    assert breakdown is not None
    assert breakdown.skill_score >= 0.8, f"Expected high skill score, got {breakdown.skill_score}"
    assert breakdown.distance_score == 1.0, f"Distance 0m should have score 1.0, got {breakdown.distance_score}"
    assert breakdown.reliability_score >= 0.9, f"Expected high reliability, got {breakdown.reliability_score}"
    assert breakdown.workload_score == 1.0, f"Zero recent jobs should yield workload 1.0"
    assert breakdown.customer_pref_score == 1.0, f"Matching language should yield pref 1.0"
    print("  [PASS] Six factors individual scoring breakdown")

def test_fairness_tie_breaking():
    # Two workers with identical scores, but worker B has fewer jobs today
    cand_a = WorkerCandidate(
        id="w-a",
        name="Worker A",
        phone_type="smartphone",
        verification_status="verified",
        service_code="ELEC",
        experience_years=5,
        is_certified=False,
        is_online=True,
        rating_average=4.5,
        jobs_completed=50,
        recent_jobs_today=2,  # Has done 2 jobs today
        latitude=11.0185,
        longitude=76.9634,
    )
    cand_b = WorkerCandidate(
        id="w-b",
        name="Worker B",
        phone_type="smartphone",
        verification_status="verified",
        service_code="ELEC",
        experience_years=5,
        is_certified=False,
        is_online=True,
        rating_average=4.5,
        jobs_completed=50,
        recent_jobs_today=0,  # Zero jobs today!
        latitude=11.0185,
        longitude=76.9634,
    )

    req = MatchRequest(
        booking_type="scheduled",
        service_code="ELEC",
        customer_lat=11.0185,
        customer_lon=76.9634,
        candidates=[cand_a, cand_b],
    )
    res = match_workers(req)
    assert res.ranked_workers[0].worker_id == "w-b", "Fairness tie-breaker must rank worker with fewest jobs first"
    print("  [PASS] Fairness tie-breaking (fewer recent jobs scores higher)")

def test_weights_change_alters_ranking():
    # Worker 1: Close by (0km), but junior (1 yr exp)
    cand_near = WorkerCandidate(
        id="w-near",
        name="Near Junior",
        phone_type="smartphone",
        verification_status="verified",
        service_code="ELEC",
        experience_years=1,
        is_certified=False,
        latitude=11.0185,
        longitude=76.9634,
    )
    # Worker 2: Farther away (8km), but senior master (15 yrs exp, certified)
    cand_expert = WorkerCandidate(
        id="w-expert",
        name="Expert Far",
        phone_type="smartphone",
        verification_status="verified",
        service_code="ELEC",
        experience_years=15,
        is_certified=True,
        latitude=11.0885,
        longitude=76.9634,
    )

    # 1. Distance-heavy weights (Distance 70%, Skill 10%)
    req_dist_heavy = MatchRequest(
        booking_type="scheduled",
        service_code="ELEC",
        customer_lat=11.0185,
        customer_lon=76.9634,
        candidates=[cand_near, cand_expert],
        weights=MatchingWeights(distance=0.70, skill=0.10, availability=0.05, reliability=0.05, workload=0.05, customer_pref=0.05),
    )
    res1 = match_workers(req_dist_heavy)
    assert res1.ranked_workers[0].worker_id == "w-near", "With distance-heavy weights, nearer worker should rank 1st"

    # 2. Skill-heavy weights (Skill 70%, Distance 10%)
    req_skill_heavy = MatchRequest(
        booking_type="scheduled",
        service_code="ELEC",
        customer_lat=11.0185,
        customer_lon=76.9634,
        candidates=[cand_near, cand_expert],
        weights=MatchingWeights(distance=0.10, skill=0.70, availability=0.05, reliability=0.05, workload=0.05, customer_pref=0.05),
    )
    res2 = match_workers(req_skill_heavy)
    assert res2.ranked_workers[0].worker_id == "w-expert", "With skill-heavy weights, expert worker should rank 1st"
    print("  [PASS] Changing federation weights visibly alters rankings")

if __name__ == "__main__":
    print("[TEST] Running Python Six-Factor Matching Engine Unit Tests...")
    test_hard_filters_and_keypad_exclusion()
    test_six_factors_breakdown()
    test_fairness_tie_breaking()
    test_weights_change_alters_ranking()
    print("[SUCCESS] All 4 Matching Engine Unit Tests Passed Successfully!\n")
