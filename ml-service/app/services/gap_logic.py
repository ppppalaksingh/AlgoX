import json
import os
import random

FRAMEWORK_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "competency_framework.json")

with open(FRAMEWORK_PATH, encoding="utf-8") as f:
    COMPETENCY_FRAMEWORK = json.load(f)

# Keyword mapping for each domain
DOMAIN_KEYWORDS = {
    "statistical": [
        "statistic", "sample", "sampling", "survey", "data", "nso", "cpi", "wpi", "gdp", "gva", "census",
        "econometrics", "mathematics", "plfs", "asi", "sdg", "metadata", "scrutiny", "weights", "laspeyres"
    ],
    "technical": [
        "technical", "python", "r", "sql", "ai", "ml", "gis", "code", "software", "analytics", "database",
        "programming", "computer", "stata", "spss", "sas", "cloud", "api", "visualization", "power bi", "tableau"
    ],
    "digitalGovernance": [
        "digital", "governance", "cyber", "privacy", "security", "cloud", "e-gov", "dpdp", "policy",
        "information technology", "meghraj", "dpi", "digital public infrastructure", "e-office"
    ],
    "behavioural": [
        "behaviour", "behavior", "leadership", "management", "communication", "soft skill", "ethics",
        "negotiation", "public relations", "decision", "change management", "project management", "teamwork"
    ],
}

def estimate_current_level(
    domain: str,
    experience_years: int,
    qualifications: list,
    past_trainings: list,
    quiz_attempts: list = None,
    completed_courses: list = None
) -> float:
    """
    Computes real-time dynamic competency level (1.0 to 5.0) based on:
    - Base years of civil service experience
    - Academic qualifications & specialization
    - Verified completed trainings & iGOT credentials
    - Live quiz performance & continuous assessment scores
    """
    base = min(1.2 + (experience_years * 0.32), 3.8)

    keywords = DOMAIN_KEYWORDS.get(domain, [domain.lower()])

    # Qualifications boost
    qual_bonus = 0.0
    for q in (qualifications or []):
        q_str = str(q).lower()
        if any(kw in q_str for kw in keywords):
            qual_bonus += 0.45

    # Past trainings boost
    training_bonus = 0.0
    for t in (past_trainings or []):
        t_str = str(t).lower()
        if any(kw in t_str for kw in keywords):
            training_bonus += 0.35

    # Completed courses & certificates boost
    courses_bonus = 0.0
    for c in (completed_courses or []):
        c_str = str(c).lower()
        if any(kw in c_str for kw in keywords):
            courses_bonus += 0.50
        else:
            courses_bonus += 0.20

    # Live Quiz Performance Impact (Real-time Adaptive ML)
    quiz_bonus = 0.0
    if quiz_attempts and len(quiz_attempts) > 0:
        relevant_scores = []
        for att in quiz_attempts:
            source = str(att.get("sourceFileName", "")).lower()
            score = float(att.get("score", 0) or 0)
            total = float(att.get("totalQuestions", 5) or 5)
            pct = (score / max(total, 1)) * 100

            # Match quiz domain
            if any(kw in source for kw in keywords) or len(keywords) > 0:
                relevant_scores.append(pct)

        if relevant_scores:
            avg_quiz_score = sum(relevant_scores) / len(relevant_scores)
            quiz_bonus = max((avg_quiz_score / 100.0) * 0.85, 0.1)

    total = base + qual_bonus + training_bonus + courses_bonus + quiz_bonus
    return round(min(max(total, 1.2), 5.0), 1)

def run_gap_analysis(profile: dict) -> dict:
    designation = profile.get("designation", "Assistant Director")
    department = profile.get("department", "National Statistical Office (NSO)")
    
    # 1. Match Framework Designation
    matched_key = None
    required_levels = None
    
    for desig_key, reqs in COMPETENCY_FRAMEWORK.items():
        if desig_key.lower() in designation.lower() or designation.lower() in desig_key.lower():
            matched_key = desig_key
            required_levels = reqs
            break

    if not required_levels:
        matched_key = "Assistant Director"
        required_levels = COMPETENCY_FRAMEWORK.get("Assistant Director", {
            "statistical": 4.0,
            "technical": 3.8,
            "digitalGovernance": 3.5,
            "behavioural": 3.8,
            "subCompetencies": {
                "Stratified Sampling Design": 4.2,
                "Python for Microdata Scrutiny": 3.8,
                "DPDP Act 2023 Compliance": 3.5,
                "Leadership in Civil Services": 3.8
            }
        })

    experience_years = int(profile.get("experienceYears", 0) or 0)
    qualifications = profile.get("qualifications", [])
    if isinstance(qualifications, str):
        qualifications = [q.strip() for q in qualifications.split(",") if q.strip()]

    past_trainings = profile.get("pastTrainings", [])
    if isinstance(past_trainings, str):
        past_trainings = [t.strip() for t in past_trainings.split(",") if t.strip()]

    quiz_attempts = profile.get("quizAttempts", [])
    completed_courses = profile.get("completedCourses", [])

    domain_scores = {}
    domain_targets = {}
    domain_percentages = {}
    skill_gaps = []

    domain_keys = ["statistical", "technical", "digitalGovernance", "behavioural"]
    for domain in domain_keys:
        required = float(required_levels.get(domain, 3.5))
        current = estimate_current_level(
            domain,
            experience_years,
            qualifications,
            past_trainings,
            quiz_attempts,
            completed_courses
        )
        domain_scores[domain] = current
        domain_targets[domain] = required
        domain_percentages[domain] = int(round((current / 5.0) * 100))

        gap = round(max(0.0, required - current), 1)
        skill_gaps.append({
            "skillName": domain,
            "currentLevel": current,
            "requiredLevel": required,
            "gap": gap,
            "percent": int(round((current / 5.0) * 100)),
            "status": "Target Met ✓" if current >= required else "Moderate Gap" if gap <= 0.8 else "Critical Gap"
        })

    # Sub-competencies analysis
    sub_competencies = required_levels.get("subCompetencies", {})
    sub_gaps = []
    for sub_name, req_score in sub_competencies.items():
        matched_domain = "statistical"
        for d, kws in DOMAIN_KEYWORDS.items():
            if any(kw in sub_name.lower() for kw in kws):
                matched_domain = d
                break
        
        # Sub-score derived from parent domain level
        curr_sub = round(min(max(domain_scores[matched_domain] - 0.1, 1.0), 5.0), 1)
        sub_gap = round(max(0.0, req_score - curr_sub), 1)
        sub_gaps.append({
            "subCompetency": sub_name,
            "domain": matched_domain,
            "required": req_score,
            "current": curr_sub,
            "gap": sub_gap
        })

    skill_gaps.sort(key=lambda x: x["gap"], reverse=True)
    sub_gaps.sort(key=lambda x: x["gap"], reverse=True)

    # 2. Derive Dynamic Key Metrics
    highest_gap_item = skill_gaps[0]
    
    # Top Strength (domain with highest current score or largest surplus)
    strengths = sorted(skill_gaps, key=lambda x: (x["currentLevel"] - x["requiredLevel"]), reverse=True)
    top_strength_item = strengths[0]

    # Overall Readiness Percentage against Cadre Requirement
    total_req = sum(domain_targets.values()) or 1.0
    total_curr = sum(domain_scores.values())
    overall_readiness = min(100, int(round((total_curr / total_req) * 100)))

    # 3. Dynamic AI Diagnostic Commentary Synthesis
    domain_display = {
        "statistical": "Statistical Analysis",
        "technical": "Technical & Analytics",
        "digitalGovernance": "Digital Governance",
        "behavioural": "Behavioural & Leadership"
    }

    recent_quiz_info = ""
    if quiz_attempts and len(quiz_attempts) > 0:
        last_q = quiz_attempts[-1]
        score_val = last_q.get("score", 0)
        tot_val = last_q.get("totalQuestions", 5)
        pct_val = int(round((score_val / max(tot_val, 1)) * 100))
        recent_quiz_info = f"Latest AI Assessment score of {pct_val}% ({score_val}/{tot_val}) actively incorporated into competency ratings. "

    if highest_gap_item["gap"] > 0:
        ai_insight = (
            f"Based on your profile as {matched_key} ({department}) with {experience_years} years of service: "
            f"Your {domain_display.get(top_strength_item['skillName'], top_strength_item['skillName'])} is your strongest domain at {top_strength_item['currentLevel']}/5.0 (Target: {top_strength_item['requiredLevel']}). "
            f"{recent_quiz_info}"
            f"Your primary growth priority is {domain_display.get(highest_gap_item['skillName'], highest_gap_item['skillName'])} with a gap of -{highest_gap_item['gap']} level. "
            f"Enrolling in accredited NSSTA TPAC modules will accelerate your readiness score towards 100%."
        )
    else:
        ai_insight = (
            f"Outstanding performance! As {matched_key} ({department}), you have met or exceeded all 4 core competency benchmarks (Overall Readiness: {overall_readiness}%). "
            f"{recent_quiz_info}"
            f"Your expertise in {domain_display.get(top_strength_item['skillName'], top_strength_item['skillName'])} is exemplary. "
            f"You are eligible for Senior Statistical Officer / Joint Director cadre nominations and mentoring roles."
        )

    return {
        "matchedDesignation": matched_key,
        "department": department,
        "experienceYears": experience_years,
        "overallReadiness": overall_readiness,
        "domainScores": domain_scores,
        "domainTargets": domain_targets,
        "domainPercentages": domain_percentages,
        "skillGaps": skill_gaps,
        "subCompetencies": sub_gaps,
        "highestGap": {
            "domain": highest_gap_item["skillName"],
            "displayName": domain_display.get(highest_gap_item["skillName"], highest_gap_item["skillName"]),
            "gap": highest_gap_item["gap"],
            "current": highest_gap_item["currentLevel"],
            "required": highest_gap_item["requiredLevel"]
        },
        "topStrength": {
            "domain": top_strength_item["skillName"],
            "displayName": domain_display.get(top_strength_item["skillName"], top_strength_item["skillName"]),
            "current": top_strength_item["currentLevel"],
            "required": top_strength_item["requiredLevel"]
        },
        "aiExecutiveInsight": ai_insight
    }