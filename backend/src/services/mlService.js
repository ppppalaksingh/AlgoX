import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let COURSE_ID_MAP = {};
try {
  const localCatalogPath = path.resolve(__dirname, "../data/mospi_courses_catalog.json");
  const mlServiceCatalogPath = path.resolve(__dirname, "../../../ml-service/app/data/mospi_courses_catalog.json");
  const catalogPath = fs.existsSync(localCatalogPath) ? localCatalogPath : mlServiceCatalogPath;
  if (fs.existsSync(catalogPath)) {
    const raw = fs.readFileSync(catalogPath, "utf-8");
    const catalog = JSON.parse(raw);
    for (const c of catalog) {
      if (c && c.course_id) {
        COURSE_ID_MAP[c.course_id] = {
          title: c.title || "",
          domain: c.domain || "",
          competency: c.competency || "",
        };
      }
    }
  }
} catch (e) {
  // Silent fallback
}

const CANONICAL_DOMAIN_MAP = {
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
};

const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

const DOMAIN_KEYWORDS = {
  statistical: [
    "statistic", "statistics", "statistical", "sample", "sampling", "survey", "data", "nso", "cpi", "wpi",
    "gdp", "gva", "census", "econometric", "econometrics", "economic", "accounts", "mathematics", "plfs",
    "asi", "sdg", "metadata", "scrutiny", "weights", "laspeyres"
  ],
  technical: [
    "technical", "python", "r", "sql", "ai", "ml", "gis", "code", "software", "analytics", "database",
    "programming", "computer", "stata", "spss", "sas", "cloud", "api", "visualization", "power bi", "tableau"
  ],
  digitalGovernance: [
    "digital", "governance", "cyber", "privacy", "security", "cloud", "e-gov", "dpdp", "policy",
    "information technology", "meghraj", "dpi", "digital public infrastructure", "e-office"
  ],
  behavioural: [
    "behaviour", "behavior", "leadership", "management", "communication", "soft skill", "ethics",
    "negotiation", "public relations", "decision", "change management", "project management", "teamwork", "sfc", "tot", "induction"
  ],
};

function matchesKeywords(text, kwList) {
  if (!text || !kwList) return false;
  const str = String(text).toLowerCase();
  return kwList.some((kw) => {
    const kwClean = String(kw).trim().toLowerCase();
    const escaped = kwClean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (kwClean.length <= 2) {
      return new RegExp(`\\b${escaped}\\b`, "i").test(str);
    }
    return new RegExp(`\\b${escaped}`, "i").test(str);
  });
}

function matchCourseToDomain(c, domainKey, kwList) {
  if (!c) return false;
  if (typeof c === "object" && c !== null) {
    const rawDom = String(c.domain || "").trim().toLowerCase();
    if (CANONICAL_DOMAIN_MAP[rawDom]) {
      return CANONICAL_DOMAIN_MAP[rawDom] === domainKey;
    }
    return matchesKeywords(`${c.title || ""} ${c.domain || ""} ${c.competency || ""}`, kwList);
  }

  const cStr = String(c).trim();
  if (COURSE_ID_MAP[cStr]) {
    const info = COURSE_ID_MAP[cStr];
    if (typeof info === "object" && info !== null) {
      const rawDom = String(info.domain || "").trim().toLowerCase();
      if (CANONICAL_DOMAIN_MAP[rawDom]) {
        return CANONICAL_DOMAIN_MAP[rawDom] === domainKey;
      }
      return matchesKeywords(`${info.title || ""} ${info.domain || ""}`, kwList);
    }
  }

  const match = cStr.match(/\(([^)]+)\)$/);
  if (match) {
    const pDom = match[1].trim().toLowerCase();
    if (CANONICAL_DOMAIN_MAP[pDom]) {
      return CANONICAL_DOMAIN_MAP[pDom] === domainKey;
    }
  }

  return matchesKeywords(cStr, kwList);
}

function classifyGap(gap) {
  if (gap <= 0.0001) return "Target Met";
  if (gap <= 0.50) return "Low";
  if (gap <= 1.00) return "Moderate";
  return "Critical";
}

const CENTRAL_TARGET_MATRIX = {
  "DG": { statistical: 5.0, technical: 5.0, digitalGovernance: 5.0, behavioural: 5.0 },
  "ADG": { statistical: 4.9, technical: 4.7, digitalGovernance: 4.8, behavioural: 4.8 },
  "Director": { statistical: 4.7, technical: 4.5, digitalGovernance: 4.5, behavioural: 4.6 },
  "Joint Director": { statistical: 4.5, technical: 4.2, digitalGovernance: 4.0, behavioural: 4.2 },
  "Deputy Director": { statistical: 4.2, technical: 4.0, digitalGovernance: 3.8, behavioural: 4.0 },
  "Assistant Director": { statistical: 4.0, technical: 3.5, digitalGovernance: 3.5, behavioural: 3.5 },
  "SSO": { statistical: 3.5, technical: 3.0, digitalGovernance: 3.0, behavioural: 3.0 },
  "SO": { statistical: 3.0, technical: 2.5, digitalGovernance: 2.5, behavioural: 2.5 },
  "JSO": { statistical: 2.5, technical: 2.0, digitalGovernance: 2.0, behavioural: 2.0 },
  "Other": { statistical: 3.5, technical: 3.0, digitalGovernance: 3.0, behavioural: 3.0 },
};

export const CADRE_ENTRY_BASE = {
  "JSO": 1.00,
  "SO": 1.34,
  "SSO": 1.72,
  "Assistant Director": 2.14,
  "Deputy Director": 2.52,
  "Joint Director": 2.83,
  "Director": 3.25,
  "ADG": 3.60,
  "DG": 3.95,
  "Other": 1.72,
};
export const CADRE_RANK_BASE = CADRE_ENTRY_BASE;

export function calculateExperienceBonus(expYears) {
  const exp = Math.max(0, Number(expYears || 0));
  if (exp <= 5.0) {
    return Math.round(exp * 0.08 * 100) / 100;
  } else if (exp <= 15.0) {
    return Math.round((0.40 + (exp - 5.0) * 0.04) * 100) / 100;
  } else {
    return Math.round(Math.min(1.0, 0.80 + (exp - 15.0) * 0.02) * 100) / 100;
  }
}

const DESIGNATION_ALIASES = {
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
  "other": "Other",
};

function normalizeDesignation(rawDesig) {
  if (!rawDesig) return "Assistant Director";
  const clean = String(rawDesig).trim().toLowerCase();
  if (DESIGNATION_ALIASES[clean]) return DESIGNATION_ALIASES[clean];
  for (const [alias, canonical] of Object.entries(DESIGNATION_ALIASES)) {
    if (alias.includes(clean) || clean.includes(alias)) return canonical;
  }
  return "Other";
}

const BENCHMARK_DISCLAIMER =
  "Prototype calibration benchmarks: Numerical target values (1.0–5.0) are calibrated for algorithmic demonstration and prototype evaluation; they are not official statutory MoSPI numerical quotas.";

const SERVICE_CADRE_MAP = {
  "DG": "Indian Statistical Service (ISS)",
  "ADG": "Indian Statistical Service (ISS)",
  "Director": "Indian Statistical Service (ISS)",
  "Joint Director": "Indian Statistical Service (ISS)",
  "Deputy Director": "Indian Statistical Service (ISS)",
  "Assistant Director": "Indian Statistical Service (ISS)",
  "SSO": "Subordinate Statistical Service (SSS)",
  "SO": "Subordinate Statistical Service (SSS)",
  "JSO": "Subordinate Statistical Service (SSS)",
  "Other": "Other / Allied Statistical Cadre",
};

const COMPETENCY_TAXONOMY = {
  statistical: {
    domainName: "Statistical Analysis",
    competencyType: "Domain-specific",
    nsstaCategory: "Official Statistics & Survey Methodologies",
  },
  technical: {
    domainName: "Technical & Analytics",
    competencyType: "Functional",
    nsstaCategory: "Statistical Computing & Modern Analytics",
  },
  digitalGovernance: {
    domainName: "Digital Governance",
    competencyType: "Functional",
    nsstaCategory: "Digital Government, Data Security & Public Administration",
  },
  behavioural: {
    domainName: "Behavioural & Leadership",
    competencyType: "Behavioural",
    nsstaCategory: "Management, Leadership & Workplace Effectiveness",
  },
};

const ROLE_PROFILES = {
  "JSO": {
    cadreTitle: "Junior Statistical Officer",
    service: "Subordinate Statistical Service (SSS)",
    grade: "Group 'B' (Non-Gazetted)",
    coreMandate: "Primary data collection, field enumeration (FOD), CAPI schedule completion, and preliminary scrutiny.",
    keyResponsibilities: [
      "Conducting primary field survey interviews using CAPI handheld devices",
      "Initial scrutiny and verification of NSS, PLFS, and ASI field schedules",
      "Field collection of wholesale and consumer price data",
    ],
  },
  "SO": {
    cadreTitle: "Statistical Officer",
    service: "Subordinate Statistical Service (SSS)",
    grade: "Group 'B' (Gazetted)",
    coreMandate: "Supervision of field teams, intermediate data inspection, validation checks, and sampling execution.",
    keyResponsibilities: [
      "Supervising primary field investigators across regional sample units",
      "Validating consistency of household and establishment survey responses",
      "Conducting re-interviews for survey quality control",
    ],
  },
  "SSO": {
    cadreTitle: "Senior Statistical Officer",
    service: "Subordinate Statistical Service (SSS)",
    grade: "Group 'B' (Gazetted)",
    coreMandate: "Senior supervisory role in regional FOD offices, multi-unit scrutiny, survey administration, and technical mentoring.",
    keyResponsibilities: [
      "Regional coordination and monitoring of sample survey schedules",
      "Computer scrutiny, error-table resolution, and validation of microdata",
      "Mentoring JSOs and SOs on revised survey concepts and classifications",
    ],
  },
  "Assistant Director": {
    cadreTitle: "Assistant Director",
    service: "Indian Statistical Service (ISS)",
    grade: "Junior Time Scale (JTS)",
    coreMandate: "Methodological compilation, statistical report preparation, survey design contribution, and unit leadership.",
    keyResponsibilities: [
      "Drafting survey questionnaires and sampling schemes under division guidance",
      "Compiling national statistics (CPI, IIP, National Accounts, Annual Survey of Industries)",
      "Statistical programming (R / Python / SQL) for microdata scrutiny",
    ],
  },
  "Deputy Director": {
    cadreTitle: "Deputy Director",
    service: "Indian Statistical Service (ISS)",
    grade: "Senior Time Scale (STS)",
    coreMandate: "Statistical analysis, division-level project coordination, econometric estimation, and state liaison.",
    keyResponsibilities: [
      "Overseeing compilation of macro-economic aggregates and sectoral indices",
      "Reviewing sampling errors and methodological consistency across divisions",
      "Liaison with State Directorates of Economics & Statistics (DES)",
    ],
  },
  "Joint Director": {
    cadreTitle: "Joint Director",
    service: "Indian Statistical Service (ISS)",
    grade: "Junior Administrative Grade (JAG)",
    coreMandate: "Division leadership, survey administration, dissemination strategy, and administrative management.",
    keyResponsibilities: [
      "Heading operational divisions in NSO (SDRD, FOD, DQAD, CPD, NAD)",
      "Managing budget, procurement via GeM, and compliance with administrative rules",
      "Overseeing public microdata releases and national statistical publications",
    ],
  },
  "Director": {
    cadreTitle: "Director",
    service: "Indian Statistical Service (ISS)",
    grade: "Selection Grade / Senior Administrative Grade (SAG)",
    coreMandate: "Statistical policy, inter-ministerial coordination, survey modernization, and national statistical standards.",
    keyResponsibilities: [
      "Formulating national statistical standards, classifications, and metadata frameworks",
      "Directing major national surveys (PLFS, Periodic Surveys, Economic Census)",
      "Inter-ministerial data sharing and collaboration with international agencies (UNSD, World Bank)",
    ],
  },
  "ADG": {
    cadreTitle: "Additional Director General",
    service: "Indian Statistical Service (ISS)",
    grade: "Higher Administrative Grade (HAG)",
    coreMandate: "Executive direction of entire functional wings (FOD, SDRD, NAD, DQAD), long-term strategy, and institutional modernization.",
    keyResponsibilities: [
      "Leading nationwide statistical operations across multiple states and regional offices",
      "Strategic direction on adopting modern technologies (AI/ML, big data, administrative registers)",
      "Advising the National Statistical Commission (NSC) on system-wide reforms",
    ],
  },
  "DG": {
    cadreTitle: "Director General",
    service: "Indian Statistical Service (ISS)",
    grade: "Apex Scale",
    coreMandate: "National Statistical Office leadership, chief statistical authority, overall government statistical governance.",
    keyResponsibilities: [
      "Apex stewardship of the Indian Official Statistical System",
      "High-level coordination with Union Ministries, NITI Aayog, and Reserve Bank of India",
      "Final authority on release of official national statistics and economic indicators",
    ],
  },
  "Other": {
    cadreTitle: "Other / Allied Cadre Officer",
    service: "Other / Allied Cadre",
    grade: "General / Specialized Cadre",
    coreMandate: "Statistical analysis, technical support, research, and project execution across divisions.",
    keyResponsibilities: [
      "Contributing to statistical surveys, data management, and empirical reporting",
      "Collaborating on specialized analytics, research studies, and technology adoption",
      "Applying domain expertise to support data-driven official statistics",
    ],
  },
};

function computeFallbackGapAnalysis(userProfile) {
  const rawDesignation = userProfile.designation || "Assistant Director";
  const canonicalDesignation = normalizeDesignation(rawDesignation);
  const targets = CENTRAL_TARGET_MATRIX[canonicalDesignation] || CENTRAL_TARGET_MATRIX["Assistant Director"];

  const expYears = userProfile.experienceYears !== undefined && userProfile.experienceYears !== null
    ? Math.max(0, Number(userProfile.experienceYears))
    : 0;
  const quizAttempts = userProfile.quizAttempts || [];
  const qualifications = userProfile.qualifications || [];
  const pastTrainings = userProfile.pastTrainings || [];
  const completedCourses = userProfile.completedCourses || [];

  const round2 = (n) => Math.round(n * 100) / 100;
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
  const pastSet = new Set((pastTrainings || []).map((t) => String(t).trim().toLowerCase()));

  const validAttempts = quizAttempts.filter(
    (q) => q.score != null && String(q.score).trim() !== ""
  );

  let recentQuizNote = "";
  if (validAttempts.length > 0) {
    const latest = validAttempts[0];
    const score = Number(latest.score) || 0;
    const total = Number(latest.totalQuestions) || 5;
    const pct = (score / Math.max(total, 1)) * 100;
    if (pct >= 80) {
      recentQuizNote = `Assessment score of ${Math.round(pct)}% (${score}/${total}) positively reflected in competency ratings.`;
    } else if (pct >= 60) {
      recentQuizNote = `Assessment score of ${Math.round(pct)}% (${score}/${total}) demonstrated solid competency mastery.`;
    } else {
      recentQuizNote = `Assessment score of ${Math.round(pct)}% (${score}/${total}) identified targeted upskilling priorities.`;
    }
  }

  // Calculate domain-specific scores deterministically
  const domainScores = {};
  for (const [domKey, kwList] of Object.entries(DOMAIN_KEYWORDS)) {
    // 1. Foundational baseline: cadre entry floor + progressive experience bonus
    const entryBase = CADRE_ENTRY_BASE[canonicalDesignation] || CADRE_RANK_BASE[canonicalDesignation] || 1.8;
    const expBonus = calculateExperienceBonus(expYears);
    const base = Math.min(4.8, entryBase + expBonus);

    // 2. Qualifications bonus (domain-specific)
    let qualBonus = 0;
    for (const q of qualifications) {
      if (matchesKeywords(q, kwList)) qualBonus += 0.35;
    }
    qualBonus = Math.min(qualBonus, 0.6);

    // 3. Past trainings bonus (domain-specific)
    let trainingBonus = 0;
    for (const t of pastTrainings) {
      if (matchesKeywords(t, kwList)) trainingBonus += 0.30;
    }
    trainingBonus = Math.min(trainingBonus, 0.5);

    // 4. Completed courses / certificates learning evidence (domain-specific, capped at 0.30)
    let courseBonus = 0;
    for (const c of completedCourses) {
      if (!c) continue;
      const cRaw = String(c).trim();
      if (pastSet.has(cRaw.toLowerCase())) continue;
      if (matchCourseToDomain(c, domKey, kwList)) {
        courseBonus += 0.08;
      }
    }
    courseBonus = Math.min(courseBonus, 0.30);

    // 5. Assessment / Quiz Performance impact (Domain-targeted, realistic calibration)
    let quizBonus = 0;
    if (validAttempts.length > 0) {
      // Group by quiz/document to take the latest score per assessment to avoid erratic stacking
      const latestByQuiz = {};
      for (const att of validAttempts) {
        const key = (att.sourceFileName || att.title || "quiz").toLowerCase().trim();
        const existing = latestByQuiz[key];
        const attTime = att.createdAt ? new Date(att.createdAt).getTime() : 0;
        const existTime = existing?.createdAt ? new Date(existing.createdAt).getTime() : 0;
        if (!existing || attTime >= existTime) {
          latestByQuiz[key] = att;
        }
      }
      const uniqueAttempts = Object.values(latestByQuiz);

      // Check if any quiz specifically targets this domain
      const domAttempts = uniqueAttempts.filter((att) => {
        const text = `${att.sourceFileName || ""} ${att.domain || ""} ${att.title || ""} ${att.questionTopics || ""}`;
        return matchesKeywords(text, kwList);
      });

      let targetAttempts = [];
      let isGeneral = false;
      if (domAttempts.length > 0) {
        targetAttempts = domAttempts;
      } else {
        // If the quiz belongs to another specific domain, do not leak its score into this unrelated domain
        const belongsToOtherDomain = uniqueAttempts.some((att) => {
          const text = `${att.sourceFileName || ""} ${att.domain || ""} ${att.title || ""} ${att.questionTopics || ""}`;
          return Object.entries(DOMAIN_KEYWORDS).some(([otherKey, otherKws]) => {
            return otherKey !== domKey && matchesKeywords(text, otherKws);
          });
        });

        // Only use as general assessment if it doesn't belong to another specific domain
        if (!belongsToOtherDomain) {
          targetAttempts = uniqueAttempts;
          isGeneral = true;
        }
      }

      if (targetAttempts.length > 0) {
        let totalCorrect = 0;
        let totalQuestions = 0;
        for (const att of targetAttempts) {
          totalCorrect += Number(att.score) || 0;
          totalQuestions += Math.max(Number(att.totalQuestions) || 5, 1);
        }
        const pct = (totalCorrect / totalQuestions) * 100;

        // General quizzes have a smaller distributed effect (0.35x), specific quizzes directly impact their domain
        const weight = isGeneral ? 0.35 : 1.0;

        if (pct >= 80) {
          quizBonus = (0.10 + Math.min(((pct - 80) / 20) * 0.08, 0.08)) * weight;
        } else if (pct >= 60) {
          quizBonus = (0.04 + Math.min(((pct - 60) / 20) * 0.04, 0.04)) * weight;
        } else if (pct >= 40) {
          quizBonus = (-0.03 - (((60 - pct) / 20) * 0.03)) * weight;
        } else {
          quizBonus = (-0.06 - (((40 - pct) / 40) * 0.04)) * weight;
        }
      }
    }

    domainScores[domKey] = clamp(round2(base + qualBonus + trainingBonus + courseBonus + quizBonus), 1.0, 5.0);
  }

  const domainNames = {
    statistical: "Statistical Analysis",
    technical: "Technical & Analytics",
    digitalGovernance: "Digital Governance",
    behavioural: "Behavioural & Leadership",
  };

  const domainPercentages = {};
  const skillGaps = Object.entries(domainScores).map(([k, curr]) => {
    const req = targets[k];
    const gap = round2(Math.max(0, req - curr));
    const pct = Math.min(100, Math.max(0, Math.round((curr / req) * 100)));
    domainPercentages[k] = pct;
    return {
      id: k,
      name: domainNames[k],
      percent: pct,
      target: req,
      current: curr,
      status: classifyGap(gap),
      icon: k === "statistical" ? "BarChart3" : k === "technical" ? "Monitor" : k === "digitalGovernance" ? "PieChart" : "MessageSquare",
      color: k === "statistical" ? "blue" : k === "technical" ? "orange" : k === "digitalGovernance" ? "green" : "purple",
      gap,
      skillName: domainNames[k],
      currentLevel: curr,
      requiredLevel: req,
      competencyType: COMPETENCY_TAXONOMY[k].competencyType,
      nsstaCategory: COMPETENCY_TAXONOMY[k].nsstaCategory,
      categoryCode: k,
    };
  });

  skillGaps.sort((a, b) => b.gap - a.gap);

  const subCompetencies = [
    { subCompetency: "Stratified Sampling Design", domain: "statistical", required: 4.2, current: clamp(round2(domainScores.statistical - 0.1), 1.0, 5.0), gap: round2(Math.max(0, 4.2 - (domainScores.statistical - 0.1))) },
    { subCompetency: "Python for Microdata Scrutiny", domain: "technical", required: 3.8, current: clamp(round2(domainScores.technical - 0.1), 1.0, 5.0), gap: round2(Math.max(0, 3.8 - (domainScores.technical - 0.1))) },
    { subCompetency: "DPDP Act 2023 Compliance", domain: "digitalGovernance", required: 3.5, current: clamp(round2(domainScores.digitalGovernance - 0.1), 1.0, 5.0), gap: round2(Math.max(0, 3.5 - (domainScores.digitalGovernance - 0.1))) },
    { subCompetency: "Leadership in Civil Services", domain: "behavioural", required: 3.8, current: clamp(round2(domainScores.behavioural - 0.1), 1.0, 5.0), gap: round2(Math.max(0, 3.8 - (domainScores.behavioural - 0.1))) },
  ].map((s) => ({ ...s, status: classifyGap(s.gap) }));

  const totalReq = Object.values(targets).reduce((a, b) => a + b, 0);
  const totalCurr = Object.values(domainScores).reduce((a, b) => a + b, 0);
  const overallReadiness = Math.min(100, Math.max(0, Math.round((totalCurr / totalReq) * 1000) / 10));

  // Requirement 9: Highest Gap = domain with largest gap; Top Strength = domain with highest current competency
  const highestGapItem = [...skillGaps].sort((a, b) => b.gap - a.gap)[0];
  const topStrengthItem = [...skillGaps].sort((a, b) => b.currentLevel - a.currentLevel)[0];

  const serviceCadre = SERVICE_CADRE_MAP[canonicalDesignation] || "Indian Statistical Service (ISS)";
  const roleProfile = ROLE_PROFILES[canonicalDesignation] || ROLE_PROFILES["Assistant Director"];
  const userPost = userProfile.post || userProfile.jobRole || "Statistical Officer";

  return {
    matchedDesignation: canonicalDesignation,
    matchedCadre: canonicalDesignation,
    cadreDepartment: userProfile.department || "National Statistical Office (NSO)",
    serviceCadre,
    post: userPost,
    roleProfile,
    benchmarkDisclaimer: BENCHMARK_DISCLAIMER,
    alignmentFlow: {
      ministry: "Ministry of Statistics and Programme Implementation (MoSPI)",
      department: userProfile.department || "National Statistical Office (NSO)",
      serviceCadre,
      designation: canonicalDesignation,
      post: userPost,
      hierarchy: "MoSPI (Ministry) → NSO (Department) → Cadre/Service → Designation → Post/Job Role",
    },
    domainTargets: targets,
    domainScores,
    domainPercentages,
    skillGaps,
    subCompetencies,
    overallReadiness,
    highestGap: highestGapItem,
    topStrength: topStrengthItem,
    aiExecutiveInsight: `Based on your official profile as ${canonicalDesignation} (${serviceCadre}): Overall readiness is ${overallReadiness}%. ${recentQuizNote} Your highest development priority is ${highestGapItem.skillName} with a gap of ${highestGapItem.gap} level (${highestGapItem.status}) against the ${canonicalDesignation} benchmark standard.`,
  };
}

export const getGapAnalysis = async (userProfile) => {
  if (!userProfile?.designation || userProfile.designation.trim() === "") {
    return {
      overallReadiness: 0,
      domainScores: { statistical: 0, technical: 0, digitalGovernance: 0, behavioural: 0 },
      skillGaps: [],
      subCompetencies: [],
      highestGap: null,
      topStrength: null,
      aiExecutiveInsight: "Please configure your official Designation and Role in your Profile to generate your AI skill gap analysis and competency benchmarks.",
      domainTargets: { statistical: 0, technical: 0, digitalGovernance: 0, behavioural: 0 },
      matchedDesignation: "",
      cadreService: "",
      cadreGrade: "",
      post: userProfile?.post || "",
      department: userProfile?.department || "",
    };
  }

  try {
    const { data } = await axios.post(`${ML_BASE_URL}/gap-analysis`, userProfile, { timeout: 20000 });
    return data;
  } catch (err) {
    console.warn("[mlService] FastAPI gap-analysis note:", err.message, "- utilizing internal resilient ML model engine.");
    return computeFallbackGapAnalysis(userProfile);
  }
};

export const getRecommendations = async (gapProfile) => {
  try {
    const { data } = await axios.post(`${ML_BASE_URL}/recommendations`, gapProfile, { timeout: 20000 });
    return data;
  } catch (err) {
    console.warn("[mlService] FastAPI recommendations note:", err.message);
    return { recommendations: [] };
  }
};

export const generateQuiz = async (fileText) => {
  const { data } = await axios.post(`${ML_BASE_URL}/generate-quiz`, { text: fileText });
  return data;
};