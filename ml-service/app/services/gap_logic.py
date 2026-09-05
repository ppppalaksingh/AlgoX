import json
import os
import re

FRAMEWORK_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "competency_framework.json")
MOSPI_COMP_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "mospi_competencies.json")
CATALOG_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "mospi_courses_catalog.json")

try:
    with open(CATALOG_PATH, encoding="utf-8") as f:
        _catalog = json.load(f)
        COURSE_ID_MAP = {
            c["course_id"]: {
                "title": c.get("title", ""),
                "domain": c.get("domain", ""),
                "competency": c.get("competency", "")
            }
            for c in _catalog if "course_id" in c
        }
except Exception:
    COURSE_ID_MAP = {}

CANONICAL_DOMAIN_MAP = {
    "statistical": "statistical",
    "statistical analysis": "statistical",
    "technical": "technical",
    "technical & analytics": "technical",
    "digital governance": "digitalGovernance",
    "digitalgovernance": "digitalGovernance",
    "digital": "digitalGovernance",
    "behavioural": "behavioural",
    "behavioral": "behavioural",
    "behavioural & leadership": "behavioural",
}

# Centralized Target Matrix (Strict Monotonic Progression: JSO -> DG)
CENTRAL_TARGET_MATRIX = {
    "DG": {"statistical": 5.0, "technical": 5.0, "digitalGovernance": 5.0, "behavioural": 5.0},
    "ADG": {"statistical": 4.9, "technical": 4.7, "digitalGovernance": 4.8, "behavioural": 4.8},
    "Director": {"statistical": 4.7, "technical": 4.5, "digitalGovernance": 4.5, "behavioural": 4.6},
    "Joint Director": {"statistical": 4.5, "technical": 4.2, "digitalGovernance": 4.0, "behavioural": 4.2},
    "Deputy Director": {"statistical": 4.2, "technical": 4.0, "digitalGovernance": 3.8, "behavioural": 4.0},
    "Assistant Director": {"statistical": 4.0, "technical": 3.5, "digitalGovernance": 3.5, "behavioural": 3.5},
    "SSO": {"statistical": 3.5, "technical": 3.0, "digitalGovernance": 3.0, "behavioural": 3.0},
    "SO": {"statistical": 3.0, "technical": 2.5, "digitalGovernance": 2.5, "behavioural": 2.5},
    "JSO": {"statistical": 2.5, "technical": 2.0, "digitalGovernance": 2.0, "behavioural": 2.0},
}

# Foundational Cadre Entry Base Floor (at 0 years of experience)
CADRE_ENTRY_BASE = {
    "JSO": 1.1,
    "SO": 1.3,
    "SSO": 1.5,
    "Assistant Director": 1.8,
    "Deputy Director": 2.2,
    "Joint Director": 2.6,
    "Director": 3.0,
    "ADG": 3.4,
    "DG": 3.6,
}
CADRE_RANK_BASE = CADRE_ENTRY_BASE

def calculate_experience_bonus(exp_years: float) -> float:
    """
    Computes smooth, progressive experience bonus:
    - 0 years = 0.00 (lowest baseline)
    - 1-5 years = +0.08 / year (up to +0.40 at 5 yrs)
    - 6-15 years = +0.04 / year (up to +0.80 at 15 yrs)
    - 16+ years = +0.02 / year (capped at +1.00 max)
    """
    exp = max(0.0, float(exp_years or 0))
    if exp <= 5.0:
        return round(exp * 0.08, 2)
    elif exp <= 15.0:
        return round(0.40 + (exp - 5.0) * 0.04, 2)
    else:
        return round(min(1.0, 0.80 + (exp - 15.0) * 0.02), 2)

# Prototype Calibration Benchmark Disclaimer (Required)
BENCHMARK_DISCLAIMER = (
    "Prototype calibration benchmarks: Numerical target values (1.0–5.0) are calibrated for "
    "algorithmic demonstration and prototype evaluation; they are not official statutory MoSPI numerical quotas."
)

# Service / Cadre Taxonomy (MoSPI Architecture) - Highest to Lowest
SERVICE_CADRE_MAP = {
    "DG": "Indian Statistical Service (ISS)",
    "ADG": "Indian Statistical Service (ISS)",
    "Director": "Indian Statistical Service (ISS)",
    "Joint Director": "Indian Statistical Service (ISS)",
    "Deputy Director": "Indian Statistical Service (ISS)",
    "Assistant Director": "Indian Statistical Service (ISS)",
    "SSO": "Subordinate Statistical Service (SSS)",
    "SO": "Subordinate Statistical Service (SSS)",
    "JSO": "Subordinate Statistical Service (SSS)",
}

# Role Profiles: Responsibilities, Grade, and Target Training Tiers
ROLE_PROFILES = {
    "JSO": {
        "cadreTitle": "Junior Statistical Officer",
        "service": "Subordinate Statistical Service (SSS)",
        "grade": "Group 'B' (Non-Gazetted)",
        "coreMandate": "Primary data collection, field enumeration (FOD), CAPI schedule completion, and preliminary scrutiny.",
        "keyResponsibilities": [
            "Conducting primary field survey interviews using CAPI handheld devices",
            "Initial scrutiny and verification of NSS, PLFS, and ASI field schedules",
            "Field collection of wholesale and consumer price data",
            "Assisting in localized survey frame updation and primary data entry"
        ],
        "targetTrainingTier": "NSSTA Induction Training Programme for JSOs",
        "primaryNsstaCategory": "NSSTA-DOM-100: Survey Methodologies & Field Operations",
    },
    "SO": {
        "cadreTitle": "Statistical Officer",
        "service": "Subordinate Statistical Service (SSS)",
        "grade": "Group 'B' (Gazetted)",
        "coreMandate": "Survey field supervision, intermediate data scrutiny, and regional statistical coordination.",
        "keyResponsibilities": [
            "Supervisory field inspection and cross-scrutiny of CAPI survey returns",
            "First-stage data validation, inconsistency resolution, and query handling",
            "Regional office coordination for price statistics and annual surveys",
            "Mentoring junior field investigators on sampling techniques"
        ],
        "targetTrainingTier": "SSS In-service Refresher & Technical Analytics Workshop",
        "primaryNsstaCategory": "NSSTA-DOM-100 & NSSTA-FNC-200: Field Supervision & Data Scrutiny",
    },
    "SSO": {
        "cadreTitle": "Senior Statistical Officer",
        "service": "Subordinate Statistical Service (SSS)",
        "grade": "Group 'B' (Gazetted)",
        "coreMandate": "Field quality assurance, complex survey compilation, industrial data audit, and regional training.",
        "keyResponsibilities": [
            "Quality audit of primary and secondary survey data across field units",
            "Compilation and validation of regional index numbers and ASI factory schedules",
            "Calculation of primary multiplier weights and sample unit replacement checks",
            "Delivering local training for new survey rounds and digital CAPI workflows"
        ],
        "targetTrainingTier": "SSS Advanced In-Service & Pre-Promotion Preparatory Course",
        "primaryNsstaCategory": "NSSTA-DOM-100: Advanced Survey Scrutiny & Data Quality",
    },
    "Assistant Director": {
        "cadreTitle": "Assistant Director",
        "service": "Indian Statistical Service (ISS)",
        "grade": "Group 'A' (Junior Time Scale - JTS)",
        "coreMandate": "Statistical methodology design, survey planning, report drafting, and analytical pipelines.",
        "keyResponsibilities": [
            "Formulating sample design specifications, stratification schemes, and multipliers",
            "Designing data tabulation plans and analytical report structures",
            "Writing statistical data scrutiny pipelines using R and Python",
            "Drafting official survey reports and departmental analytical briefs"
        ],
        "targetTrainingTier": "ISS Probationary Training (NSSTA) & Applied Statistical Analysis",
        "primaryNsstaCategory": "NSSTA-DOM-100 & NSSTA-FNC-200: Survey Design & Analytics",
    },
    "Deputy Director": {
        "cadreTitle": "Deputy Director",
        "service": "Indian Statistical Service (ISS)",
        "grade": "Group 'A' (Senior Time Scale - STS)",
        "coreMandate": "Sectoral National Accounts compilation, Price statistics index management, and econometric modeling.",
        "keyResponsibilities": [
            "Compiling Gross Value Added (GVA) and GDP aggregates under SNA 2008",
            "Overseeing Consumer Price Index (CPI) and Index of Industrial Production (IIP) methodology",
            "Applying econometric and time-series modeling for macroeconomic analysis",
            "Liaising with central ministries and RBI on statistical data harmonisation"
        ],
        "targetTrainingTier": "Mid-Career Training Programme (MCTP Stage I) - NSSTA",
        "primaryNsstaCategory": "NSSTA-DOM-100: Macroeconomic & National Accounts Statistics",
    },
    "Joint Director": {
        "cadreTitle": "Joint Director",
        "service": "Indian Statistical Service (ISS)",
        "grade": "Group 'A' (Junior Administrative Grade - JAG)",
        "coreMandate": "Divisional administration, statistical policy execution, and large-scale survey management.",
        "keyResponsibilities": [
            "Directing major statistical divisions (NAD, ESD, FOD, SDRD, DIID)",
            "Enforcing national data quality frameworks and microdata anonymization",
            "Monitoring Sustainable Development Goals (SDG) National Indicator Framework",
            "Guiding inter-agency statistical data sharing and digital public infrastructure"
        ],
        "targetTrainingTier": "Mid-Career Training Programme (MCTP Stage II) - NSSTA / International",
        "primaryNsstaCategory": "NSSTA-DOM-100 & NSSTA-BEH-400: Policy & Divisional Leadership",
    },
    "Director": {
        "cadreTitle": "Director",
        "service": "Indian Statistical Service (ISS)",
        "grade": "Group 'A' (Selection Grade - NFSG)",
        "coreMandate": "Strategic statistical management, national report authorization, and data governance.",
        "keyResponsibilities": [
            "Directing national statistical census and nationwide sample survey operations",
            "Final clearance and methodology sign-off for official statistical releases",
            "Implementation of DPDP Act compliance and official microdata policies",
            "Representing MoSPI at national inter-ministerial expert committees"
        ],
        "targetTrainingTier": "Senior Executive Leadership Programme in Data Governance - NSSTA",
        "primaryNsstaCategory": "NSSTA-FNC-300 & NSSTA-BEH-400: Data Governance & Strategic Policy",
    },
    "ADG": {
        "cadreTitle": "Additional Director General",
        "service": "Indian Statistical Service (ISS)",
        "grade": "Group 'A' (Senior Administrative Grade - SAG / HAG)",
        "coreMandate": "Executive leadership, national statistical standards formulation, and institutional governance.",
        "keyResponsibilities": [
            "Executive oversight of specialized NSO divisions and training academies (NSSTA)",
            "Formulating national statistical policies, metadata standards, and code of practice",
            "Strategic advisory to the Chief Statistician of India and Union Ministries",
            "High-level liaison with international agencies (UNSD, World Bank, IMF)"
        ],
        "targetTrainingTier": "Advanced Leadership & Global Statistical Standards Seminar",
        "primaryNsstaCategory": "NSSTA-BEH-400: Institutional Leadership & Global Standards",
    },
    "DG": {
        "cadreTitle": "Director General",
        "service": "Indian Statistical Service (ISS)",
        "grade": "Group 'A' (Apex / Higher Administrative Grade+)",
        "coreMandate": "Apex stewardship of the National Statistical System, NSC advisory, and global statistical diplomacy.",
        "keyResponsibilities": [
            "Overall stewardship and strategic modernization of the Indian Statistical System",
            "Advisory liaison with the National Statistical Commission (NSC)",
            "Formulating whole-of-government data policies and statistical legislative reforms",
            "Representing the Republic of India at the United Nations Statistical Commission"
        ],
        "targetTrainingTier": "Apex Executive Forum on Global Statistical Governance",
        "primaryNsstaCategory": "NSSTA-BEH-400: Apex Statistical Governance & Public Policy",
    },
}

# 3 Competency Types Mapped onto the 4 AlgoX Domains
COMPETENCY_TAXONOMY = {
    "statistical": {
        "name": "Statistical Analysis",
        "competencyType": "Domain-specific Competency",
        "categoryCode": "NSSTA-DOM-100",
        "nsstaCategory": "NSSTA-DOM-100: Official Statistics & National Accounting",
        "description": "Core quantitative mandate of MoSPI: sample survey design, GDP/GVA compilation, price index calculation, and official statistical validation.",
        "keySubjects": [
            "Sample Survey Design & Multi-Stage Sampling",
            "System of National Accounts (SNA 2008) & GVA Compilation",
            "CPI / WPI Index Numbers & Inflation Tracking",
            "Labour & Employment Statistics (PLFS)",
            "SDG National Indicator Framework (NIF) Monitoring"
        ]
    },
    "technical": {
        "name": "Technical & Analytics",
        "competencyType": "Functional Competency",
        "categoryCode": "NSSTA-FNC-200",
        "nsstaCategory": "NSSTA-FNC-200: Data Science & Analytics Technologies",
        "description": "Operational technical and data science capabilities: automated Python/R pipelines, database querying, spatial GIS mapping, and machine learning.",
        "keySubjects": [
            "Python for Survey Data Scrutiny & Scipy/Pandas",
            "Handling Large Scale Data & Statistics in R",
            "Relational Database Engineering & SQL Optimization",
            "GIS & Spatial Frame Sampling for Surveys",
            "Big Data & AI Predictive Modeling in Official Stats"
        ]
    },
    "digitalGovernance": {
        "name": "Digital Governance",
        "competencyType": "Functional Competency",
        "categoryCode": "NSSTA-FNC-300",
        "nsstaCategory": "NSSTA-FNC-300: Digital Governance & Regulatory Compliance",
        "description": "Statutory, regulatory, and infrastructural compliance: citizen privacy under DPDP Act 2023, government cloud protocols, and open microdata standards.",
        "keySubjects": [
            "Digital Personal Data Protection (DPDP Act 2023)",
            "MeghRaj Government Cloud & Infrastructure Protocols",
            "UN-SDMX Metadata Standards & Data Dissemination",
            "Survey Microdata Anonymization & Privacy Preservation",
            "Digital Public Infrastructure (DPI) & Government e-Office"
        ]
    },
    "behavioural": {
        "name": "Behavioural & Leadership",
        "competencyType": "Behavioural Competency",
        "categoryCode": "NSSTA-BEH-400",
        "nsstaCategory": "NSSTA-BEH-400: Public Administration & Statistical Leadership",
        "description": "Civil service ethics, leadership, stakeholder communication, and organizational behaviors defined in Karmayogi Competency Model.",
        "keySubjects": [
            "Leadership in Civil Services & Administrative Integrity",
            "Evidence-Based Policy Communication & Dissemination",
            "Field Team Supervision & FOD Operational Management",
            "UN Fundamental Principles of Official Statistics",
            "Public Administration Ethics & Stakeholder Negotiation"
        ]
    },
}

DESIGNATION_ALIASES = {
    "jso": "JSO",
    "junior statistical officer": "JSO",
    "junior statistical officer (jso)": "JSO",
    "so": "SO",
    "statistical officer": "SO",
    "statistical officer (so)": "SO",
    "sso": "SSO",
    "senior statistical officer": "SSO",
    "senior statistical officer (sso)": "SSO",
    "ad": "Assistant Director",
    "assistant director": "Assistant Director",
    "dd": "Deputy Director",
    "deputy director": "Deputy Director",
    "jd": "Joint Director",
    "joint director": "Joint Director",
    "director": "Director",
    "adg": "ADG",
    "additional director general": "ADG",
    "dg": "DG",
    "director general": "DG",
}

def normalize_designation(raw_desig: str) -> str:
    if not raw_desig:
        return "Assistant Director"
    clean = str(raw_desig).strip().lower()
    if clean in DESIGNATION_ALIASES:
        return DESIGNATION_ALIASES[clean]
    for alias, canonical in DESIGNATION_ALIASES.items():
        if alias in clean or clean in alias:
            return canonical
    return "Assistant Director"

try:
    with open(FRAMEWORK_PATH, encoding="utf-8") as f:
        COMPETENCY_FRAMEWORK = json.load(f)
except Exception:
    COMPETENCY_FRAMEWORK = {}

try:
    with open(MOSPI_COMP_PATH, encoding="utf-8") as f:
        _comps = json.load(f)
        COMPETENCY_ID_MAP = {c["competency_id"]: c["domain"].lower() for c in _comps if "competency_id" in c}
except Exception:
    COMPETENCY_ID_MAP = {}

# Exact 4 Domains (Requirement 2)
DOMAIN_DISPLAY_NAMES = {
    "statistical": "Statistical Analysis",
    "technical": "Technical & Analytics",
    "digitalGovernance": "Digital Governance",
    "behavioural": "Behavioural & Leadership"
}

# Domain keyword lexicon for evidence matching
DOMAIN_KEYWORDS = {
    "statistical": [
        "statistic", "statistics", "statistical", "sample", "sampling", "survey", "data", "nso", "cpi", "wpi",
        "gdp", "gva", "census", "econometric", "econometrics", "economic", "accounts", "mathematics", "plfs",
        "asi", "sdg", "metadata", "scrutiny", "weights", "laspeyres"
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
        "negotiation", "public relations", "decision", "change management", "project management", "teamwork",
        "sfc", "tot", "induction"
    ],
}

def matches_keywords(text: str, kws: list) -> bool:
    """Matches keywords with word boundary."""
    if not text or not kws:
        return False
    lower_text = str(text).lower()
    for kw in kws:
        kw_clean = kw.strip().lower()
        if len(kw_clean) <= 2:
            pattern = r'\b' + re.escape(kw_clean) + r'\b'
        else:
            pattern = r'\b' + re.escape(kw_clean)
        if re.search(pattern, lower_text, re.IGNORECASE):
            return True
    return False

def match_course_to_domain(c, domain: str, keywords: list) -> bool:
    """Matches course/certificate evidence strictly to its relevant domain."""
    if not c:
        return False
    if isinstance(c, dict):
        raw_dom = str(c.get("domain", "")).strip().lower()
        if raw_dom in CANONICAL_DOMAIN_MAP:
            return CANONICAL_DOMAIN_MAP[raw_dom] == domain
        return matches_keywords(f"{c.get('title', '')} {c.get('domain', '')} {c.get('competency', '')}", keywords)

    c_str = str(c).strip()
    if c_str in COURSE_ID_MAP:
        info = COURSE_ID_MAP[c_str]
        if isinstance(info, dict):
            raw_dom = str(info.get("domain", "")).strip().lower()
            if raw_dom in CANONICAL_DOMAIN_MAP:
                return CANONICAL_DOMAIN_MAP[raw_dom] == domain
            return matches_keywords(f"{info.get('title', '')} {info.get('domain', '')}", keywords)

    match = re.search(r'\(([^)]+)\)$', c_str)
    if match:
        p_dom = match.group(1).strip().lower()
        if p_dom in CANONICAL_DOMAIN_MAP:
            return CANONICAL_DOMAIN_MAP[p_dom] == domain

    return matches_keywords(c_str, keywords)

def classify_gap(gap: float) -> str:
    """
    Requirement 5:
    0 = Target Met
    0.01-0.50 = Low
    0.51-1.00 = Moderate
    >1.00 = Critical
    """
    if gap <= 0.0001:
        return "Target Met"
    elif gap <= 0.50:
        return "Low"
    elif gap <= 1.00:
        return "Moderate"
    else:
        return "Critical"

def estimate_current_level(
    domain: str,
    experience_years: int,
    qualifications: list,
    past_trainings: list,
    quiz_attempts: list = None,
    completed_courses: list = None,
    designation: str = None
) -> float:
    """
    Computes domain-specific current competency level strictly between 1.0 and 5.0:
    - Base years of civil service experience and cadre rank seniority: 1.5 to 4.0 scale
    - Academic qualifications in relevant domain: +0.35 to +0.60
    - Past in-service trainings in relevant domain: +0.30 to +0.50
    - Assessment/Quiz performance on this domain or official assessment:
        * High score (>=80%): positive boost up to +0.35
        * Good score (>=60%): positive boost up to +0.15
        * Average score (40-60%): small penalty down to -0.10
        * Low score (<40%): penalty down to -0.20
    - Completed courses are learning evidence (capped at +0.30).
    """
    exp_years = max(0.0, float(experience_years or 0))
    entry_base = CADRE_ENTRY_BASE.get(designation, CADRE_RANK_BASE.get(designation, 1.8))
    exp_bonus = calculate_experience_bonus(exp_years)
    base = min(4.8, entry_base + exp_bonus)

    keywords = DOMAIN_KEYWORDS.get(domain, [domain.lower()])

    # Academic degree bonus (domain-specific)
    qual_bonus = 0.0
    for q in (qualifications or []):
        if matches_keywords(q, keywords):
            qual_bonus += 0.35
    qual_bonus = min(qual_bonus, 0.60)

    # Past verified training bonus (domain-specific)
    training_bonus = 0.0
    for t in (past_trainings or []):
        if matches_keywords(t, keywords):
            training_bonus += 0.30
    training_bonus = min(training_bonus, 0.50)

    # Completed courses / certificates learning evidence (domain-specific, capped at 0.30)
    past_set = {str(t).strip().lower() for t in (past_trainings or [])}
    course_bonus = 0.0
    for c in (completed_courses or []):
        if not c:
            continue
        c_raw = str(c).strip()
        if c_raw.lower() in past_set:
            continue
        if match_course_to_domain(c, domain, keywords):
            course_bonus += 0.08
    course_bonus = min(course_bonus, 0.30)

    # Assessment / Quiz Mastery Evidence
    quiz_delta = 0.0
    valid_attempts = [
        att for att in (quiz_attempts or [])
        if att.get("score") is not None and str(att.get("score")).strip() != ""
    ]
    if valid_attempts:
        domain_attempts = [
            att for att in valid_attempts
            if matches_keywords(
                f"{att.get('sourceFileName', '')} {att.get('domain', '')} {att.get('title', '')} {att.get('questionTopics', '')}",
                keywords
            )
        ]
        # If domain-specific attempts found, prioritize them. Otherwise, any valid assessment counts as evidence.
        target_attempts = domain_attempts if domain_attempts else valid_attempts

        total_correct = 0.0
        total_questions = 0.0
        for att in target_attempts:
            try:
                s = float(att.get("score", 0) or 0)
                tot = float(att.get("totalQuestions", 5) or 5)
                total_correct += s
                total_questions += max(tot, 1.0)
            except (ValueError, TypeError):
                continue

        if total_questions > 0:
            avg_pct = (total_correct / total_questions) * 100.0
            if avg_pct >= 80.0:
                quiz_delta = 0.15 + min(((avg_pct - 80.0) / 20.0) * 0.15, 0.20)
            elif avg_pct >= 60.0:
                quiz_delta = 0.05 + min(((avg_pct - 60.0) / 20.0) * 0.10, 0.10)
            elif avg_pct >= 40.0:
                quiz_delta = -0.05 - (((60.0 - avg_pct) / 20.0) * 0.05)
            else:
                quiz_delta = -0.12 - (((40.0 - avg_pct) / 40.0) * 0.08)

    total = base + qual_bonus + training_bonus + course_bonus + quiz_delta
    return round(min(max(total, 1.0), 5.0), 2)

def run_gap_analysis(profile: dict) -> dict:
    raw_designation = profile.get("designation", "Assistant Director")
    canonical_designation = normalize_designation(raw_designation)
    post = profile.get("post") or profile.get("jobRole") or "Statistical Officer"
    department = profile.get("department", "National Statistical Office (NSO)")

    # 1. Retrieve Single Source of Truth Target Matrix (Requirement 3)
    target_levels = CENTRAL_TARGET_MATRIX.get(
        canonical_designation,
        CENTRAL_TARGET_MATRIX["Assistant Director"]
    )

    experience_years = float(profile.get("experienceYears") or profile.get("experience_years") or 0)
    qualifications = profile.get("qualifications", [])
    if isinstance(qualifications, str):
        qualifications = [q.strip() for q in qualifications.split(",") if q.strip()]

    past_trainings = profile.get("pastTrainings") or profile.get("past_trainings") or []
    if isinstance(past_trainings, str):
        past_trainings = [t.strip() for t in past_trainings.split(",") if t.strip()]

    quiz_attempts = profile.get("quizAttempts") or profile.get("quiz_attempts") or []
    completed_courses = profile.get("completedCourses") or profile.get("completed_courses") or []

    domain_keys = ["statistical", "technical", "digitalGovernance", "behavioural"]
    domain_scores = {}
    domain_targets = {}
    domain_percentages = {}
    skill_gaps = []

    for domain in domain_keys:
        required = float(target_levels.get(domain, 3.5))
        current = estimate_current_level(
            domain,
            experience_years,
            qualifications,
            past_trainings,
            quiz_attempts,
            completed_courses,
            designation=canonical_designation
        )
        domain_scores[domain] = current
        domain_targets[domain] = required

        # Domain Readiness = Current / Target * 100 clamped to 0-100 (Requirement 6)
        domain_readiness_pct = max(0.0, min(100.0, round((current / required) * 100.0, 1)))
        domain_percentages[domain] = domain_readiness_pct

        # Gap = max(0, Target - Current) (Requirement 5)
        gap = round(max(0.0, required - current), 2)
        status = classify_gap(gap)

        tax = COMPETENCY_TAXONOMY.get(domain, {})
        skill_gaps.append({
            "id": domain,
            "skillName": DOMAIN_DISPLAY_NAMES.get(domain, domain),
            "currentLevel": current,
            "requiredLevel": required,
            "gap": gap,
            "percent": domain_readiness_pct,
            "status": status,
            "domain": domain,
            "competencyType": tax.get("competencyType", "Domain-specific Competency"),
            "nsstaCategory": tax.get("nsstaCategory", "NSSTA Training Category"),
            "categoryCode": tax.get("categoryCode", "NSSTA-100"),
        })

    # Sub-competencies analysis
    framework_entry = COMPETENCY_FRAMEWORK.get(canonical_designation) or COMPETENCY_FRAMEWORK.get("Assistant Director", {})
    sub_competencies = framework_entry.get("subCompetencies", {})
    sub_gaps = []
    for sub_name, req_score in sub_competencies.items():
        matched_domain = None
        cmp_match = re.search(r'CMP\d{3}', sub_name)
        if cmp_match and cmp_match.group(0) in COMPETENCY_ID_MAP:
            raw_dom = COMPETENCY_ID_MAP[cmp_match.group(0)]
            if raw_dom in ["digital governance", "digitalgovernance"]:
                matched_domain = "digitalGovernance"
            elif raw_dom in ["behavioural", "behavioral"]:
                matched_domain = "behavioural"
            elif raw_dom in ["technical"]:
                matched_domain = "technical"
            else:
                matched_domain = "statistical"

        if not matched_domain:
            matched_domain = "statistical"
            for d, kws in DOMAIN_KEYWORDS.items():
                if matches_keywords(sub_name, kws):
                    matched_domain = d
                    break

        curr_sub = round(min(max(domain_scores[matched_domain] - 0.1, 1.0), 5.0), 2)
        sub_gap = round(max(0.0, req_score - curr_sub), 2)
        sub_gaps.append({
            "subCompetency": sub_name,
            "domain": matched_domain,
            "required": req_score,
            "current": curr_sub,
            "gap": sub_gap,
            "status": classify_gap(sub_gap),
        })

    skill_gaps.sort(key=lambda x: x["gap"], reverse=True)
    sub_gaps.sort(key=lambda x: x["gap"], reverse=True)

    # Highest Gap = domain with largest gap (Requirement 9)
    highest_gap_item = max(skill_gaps, key=lambda x: x["gap"])

    # Top Strength = domain with highest current competency (Requirement 9)
    top_strength_item = max(skill_gaps, key=lambda x: x["currentLevel"])

    # Overall Readiness = SUM(Current) / SUM(Target) * 100 clamped to 0-100 (Requirement 6)
    total_curr = sum(domain_scores[d] for d in domain_keys)
    total_req = sum(domain_targets[d] for d in domain_keys)
    overall_readiness = max(0.0, min(100.0, round((total_curr / total_req) * 100.0, 1)))

    recent_quiz_info = ""
    if quiz_attempts and len(quiz_attempts) > 0:
        last_q = quiz_attempts[0] if isinstance(quiz_attempts, list) and len(quiz_attempts) > 0 else {}
        score_val = last_q.get("score", 0)
        tot_val = last_q.get("totalQuestions", 5)
        pct_val = int(round((score_val / max(tot_val, 1)) * 100))
        if pct_val >= 60:
            recent_quiz_info = f"Latest assessment score of {pct_val}% ({score_val}/{tot_val}) positively reflected in competency evaluation. "
        elif pct_val < 50:
            recent_quiz_info = f"Latest assessment score of {pct_val}% ({score_val}/{tot_val}) identified critical growth priorities. "
        else:
            recent_quiz_info = f"Latest assessment score: {pct_val}% ({score_val}/{tot_val}). "

    if highest_gap_item["gap"] > 0:
        ai_insight = (
            f"Based on your profile as {canonical_designation} ({department}) with {experience_years} years of service: "
            f"Your {top_strength_item['skillName']} is your highest competency domain at {top_strength_item['currentLevel']}/5.0 (Target: {top_strength_item['requiredLevel']}). "
            f"{recent_quiz_info}"
            f"Your primary development priority is {highest_gap_item['skillName']} with a gap of {highest_gap_item['gap']} level ({highest_gap_item['status']}). "
            f"Targeted accredited modules will systematically advance your overall readiness toward 100%."
        )
    else:
        ai_insight = (
            f"Exemplary performance! As {canonical_designation} ({department}), you have met all core competency benchmarks (Overall Readiness: {overall_readiness}%). "
            f"{recent_quiz_info}"
            f"Your expertise in {top_strength_item['skillName']} is outstanding. "
            f"You are eligible for higher cadre nominations and departmental leadership roles."
        )

    role_info = ROLE_PROFILES.get(canonical_designation, ROLE_PROFILES["Assistant Director"])
    service_cadre = SERVICE_CADRE_MAP.get(canonical_designation, "Indian Statistical Service (ISS)")

    alignment_flow = {
        "ministry": "Ministry of Statistics and Programme Implementation (MoSPI)",
        "department": department or "National Statistical Office (NSO)",
        "serviceCadre": service_cadre,
        "designation": canonical_designation,
        "post": post,
        "hierarchy": "MoSPI (Ministry) → NSO (Department) → Cadre/Service → Designation → Post/Job Role",
        "roleMandate": role_info.get("coreMandate", ""),
        "competencies": [
            {
                "domain": d,
                "name": DOMAIN_DISPLAY_NAMES.get(d, d),
                "type": COMPETENCY_TAXONOMY.get(d, {}).get("competencyType", ""),
                "nsstaCategory": COMPETENCY_TAXONOMY.get(d, {}).get("categoryCode", ""),
                "targetBenchmark": domain_targets[d],
                "currentEvaluated": domain_scores[d],
                "gap": round(max(0.0, domain_targets[d] - domain_scores[d]), 2),
            }
            for d in domain_keys
        ],
        "targetTrainingTier": role_info.get("targetTrainingTier", ""),
        "assessmentIntegration": "Dynamic assessment evidence from quizzes and verified certificates directly recalibrate competency evaluations."
    }

    return {
        "matchedDesignation": canonical_designation,
        "serviceCadre": service_cadre,
        "department": department,
        "post": post,
        "experienceYears": experience_years,
        "overallReadiness": overall_readiness,
        "roleProfile": role_info,
        "alignmentFlow": alignment_flow,
        "benchmarkDisclaimer": BENCHMARK_DISCLAIMER,
        "domainScores": domain_scores,
        "domainTargets": domain_targets,
        "domainPercentages": domain_percentages,
        "skillGaps": skill_gaps,
        "subCompetencies": sub_gaps,
        "highestGap": {
            "domain": highest_gap_item["skillName"],
            "displayName": highest_gap_item["skillName"],
            "gap": highest_gap_item["gap"],
            "current": highest_gap_item["currentLevel"],
            "required": highest_gap_item["requiredLevel"],
            "status": highest_gap_item["status"]
        },
        "topStrength": {
            "domain": top_strength_item["skillName"],
            "displayName": top_strength_item["skillName"],
            "current": top_strength_item["currentLevel"],
            "required": top_strength_item["requiredLevel"]
        },
        "aiExecutiveInsight": ai_insight
    }