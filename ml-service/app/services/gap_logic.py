import json
import os

FRAMEWORK_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "competency_framework.json")

with open(FRAMEWORK_PATH) as f:
    COMPETENCY_FRAMEWORK = json.load(f)

# Keyword mapping for each domain
DOMAIN_KEYWORDS = {
    "statistical": ["statistic", "sample", "sampling", "survey", "data", "nso", "cpi", "census", "econometrics", "mathematics"],
    "technical": ["technical", "python", "r", "sql", "ai", "ml", "gis", "code", "software", "analytics", "database", "programming", "computer"],
    "digitalGovernance": ["digital", "governance", "cyber", "privacy", "security", "cloud", "e-gov", "dpdp", "policy", "information technology"],
    "behavioural": ["behaviour", "behavior", "leadership", "management", "communication", "soft skill", "ethics", "negotiation", "public relations"],
}

def estimate_current_level(domain: str, experience_years: int, qualifications: list, past_trainings: list) -> float:
    """
    Calculates competency level (1.0 to 5.0) based on:
    - Base experience years
    - Relevant academic qualifications
    - Relevant completed trainings and certifications
    """
    # Base level from experience: 0 yrs -> 1.0, 5 yrs -> 3.0, 10+ yrs -> 4.0
    base = min(1.0 + (experience_years * 0.35), 4.0)

    keywords = DOMAIN_KEYWORDS.get(domain, [domain.lower()])

    # Qualifications boost: +0.6 per matching qualification
    qual_bonus = 0.0
    for q in qualifications:
        q_str = str(q).lower()
        if any(kw in q_str for kw in keywords):
            qual_bonus += 0.6

    # Training boost: +0.5 per matching training
    training_bonus = 0.0
    for t in past_trainings:
        t_str = str(t).lower()
        if any(kw in t_str for kw in keywords):
            training_bonus += 0.5

    total = base + qual_bonus + training_bonus
    # Scale within realistic 1.0 to 5.0 bounds
    return round(min(max(total, 1.2), 4.9), 1)

def run_gap_analysis(profile: dict) -> dict:
    designation = profile.get("designation", "Statistical Officer")
    # Match framework designation safely (case-insensitive search)
    required_levels = None
    for desig_key, reqs in COMPETENCY_FRAMEWORK.items():
        if desig_key.lower() in designation.lower() or designation.lower() in desig_key.lower():
            required_levels = reqs
            break

    if not required_levels:
        required_levels = COMPETENCY_FRAMEWORK.get("Statistical Officer", {
            "statistical": 4,
            "technical": 3,
            "digitalGovernance": 2,
            "behavioural": 3
        })

    experience_years = int(profile.get("experienceYears", 0) or 0)
    qualifications = profile.get("qualifications", [])
    if isinstance(qualifications, str):
        qualifications = [q.strip() for q in qualifications.split(",") if q.strip()]

    past_trainings = profile.get("pastTrainings", [])
    if isinstance(past_trainings, str):
        past_trainings = [t.strip() for t in past_trainings.split(",") if t.strip()]

    domain_scores = {}
    domain_percentages = {}
    skill_gaps = []

    for domain, required in required_levels.items():
        current = estimate_current_level(domain, experience_years, qualifications, past_trainings)
        domain_scores[domain] = current
        domain_percentages[domain] = int(round((current / 5.0) * 100))

        gap = round(max(0.0, required - current), 1)
        skill_gaps.append({
            "skillName": domain,
            "currentLevel": current,
            "requiredLevel": required,
            "gap": gap,
            "percent": int(round((current / 5.0) * 100)),
            "status": "Strong" if current >= (required * 0.9) else "Average" if current >= (required * 0.6) else "Needs Improvement"
        })

    skill_gaps.sort(key=lambda x: x["gap"], reverse=True)

    return {
        "domainScores": domain_scores,
        "domainPercentages": domain_percentages,
        "skillGaps": skill_gaps
    }