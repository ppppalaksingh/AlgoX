import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import CompetencyProfile from "../models/CompetencyProfile.model.js";
import User from "../models/User.model.js";
import { getGapAnalysis } from "../services/mlService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

let MOSPI_CATALOG = [];
try {
  const localCatalogPath = path.resolve(__dirname, "../data/mospi_courses_catalog.json");
  const mlCatalogPath = path.resolve(__dirname, "../../../ml-service/app/data/mospi_courses_catalog.json");
  const chosenPath = fs.existsSync(localCatalogPath) ? localCatalogPath : mlCatalogPath;
  if (fs.existsSync(chosenPath)) {
    MOSPI_CATALOG = JSON.parse(fs.readFileSync(chosenPath, "utf-8"));
  }
} catch (e) {
  console.warn("[course.controller] Catalog load warning:", e.message);
}

async function getOrCreateUser(clerkId) {
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({
      clerkId,
      name: "",
      designation: "",
      department: "",
      experienceYears: null,
      qualifications: [],
      pastTrainings: [],
    });
  }
  return user;
}

function buildCatalogFallback({ user, profile, source, domain, topN }) {
  let pool = [...MOSPI_CATALOG];

  // 1. Filter by source (iGOT vs TPAC) if requested
  if (source && source !== "all") {
    pool = pool.filter((c) => {
      const isTPAC = c.source_platform?.includes("NSSTA") || c.source_platform?.includes("TPAC");
      return source === "TPAC" ? isTPAC : !isTPAC;
    });
  }

  // 2. Filter by domain if requested
  if (domain && domain.toLowerCase() !== "all") {
    pool = pool.filter((c) => {
      const d = (c.domain || "").toLowerCase();
      const target = domain.toLowerCase();
      if (target === "digital governance") return d.includes("digital");
      return d === target;
    });
  }

  // 3. Score and prioritize courses matching user's highest skill gaps
  const gapKeywords = (profile?.skillGaps || []).slice(0, 3).map((g) => ({
    name: (g.skillName || g.domain || "").toLowerCase(),
    gap: Number(g.gap || 1.0),
  }));

  const scored = pool.map((c, i) => {
    const isTPAC = c.source_platform?.includes("NSSTA") || c.source_platform?.includes("TPAC");
    const officialUrl = isTPAC
      ? "https://nssta.gov.in"
      : "https://portal.igotkarmayogi.gov.in/public/home";

    // Boost score if course domain matches user's active gaps
    let boost = 0;
    const cDom = (c.domain || "").toLowerCase();
    const cComp = (c.competency || "").toLowerCase();
    for (const g of gapKeywords) {
      if (cDom.includes(g.name) || cComp.includes(g.name) || g.name.includes(cDom)) {
        boost += Math.min(0.12, g.gap * 0.05);
        break;
      }
    }

    const baseScore = Math.max(0.65, 0.94 - (i * 0.002) + boost);
    const matchScore = parseFloat(Math.min(0.98, baseScore).toFixed(3));
    const matchPercent = Math.round(matchScore * 100);

    return {
      id: c.course_id || `CRS${i + 1}`,
      course_id: c.course_id,
      title: c.title,
      competency_id: c.competency_id,
      domain: c.domain || "Statistical",
      competency: c.competency || "",
      target_audience: c.target_audience || "All Officials",
      duration_hours: c.duration_hours || 20,
      duration: `${c.duration_hours || 20} hours`,
      source_platform: c.source_platform || (isTPAC ? "NSSTA" : "iGOT"),
      source_type: isTPAC ? "TPAC" : "iGOT",
      provider: c.source_platform || (isTPAC ? "NSSTA / MoSPI" : "iGOT Karmayogi"),
      institute: c.source_platform || (isTPAC ? "NSSTA, Greater Noida" : "iGOT Karmayogi"),
      difficulty_level: c.difficulty_level || 3,
      level: `Level ${c.difficulty_level || 3}`,
      matchScore,
      matchPercent,
      similarityScore: matchScore,
      relevance: `${matchPercent}%`,
      designationRelevance: `Aligned with ${user?.designation || "Assistant Director"} Framework`,
      officialUrl,
      igotLink: officialUrl,
      description: `Official capacity building program in ${c.competency || c.title} (${c.domain || "Statistical"} domain) for ${c.target_audience || "MoSPI statisticians"}.`,
    };
  });

  // Sort descending by matchScore
  scored.sort((a, b) => b.matchScore - a.matchScore);

  const limit = topN ? parseInt(topN, 10) : 140;
  return scored.slice(0, limit);
}

export const getRecommendedCourses = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);
    let profile = await CompetencyProfile.findOne({ userId: user._id });

    if (!profile) {
      const gapResult = await getGapAnalysis({
        designation: user.designation || "Assistant Director",
        department: user.department || "National Statistical Office (NSO)",
        experienceYears: user.experienceYears != null ? Number(user.experienceYears) : 0,
        qualifications: user.qualifications || [],
        pastTrainings: user.pastTrainings || [],
      });
      profile = await CompetencyProfile.create({
        userId: user._id,
        domainScores: gapResult.domainScores,
        skillGaps: gapResult.skillGaps,
      });
    }

    const { source, domain, topN } = req.query;

    try {
      const { data } = await axios.post(
        `${ML_BASE_URL}/recommendations`,
        {
          designation: user?.designation || "Assistant Director",
          serviceCadre: user?.department || "National Statistical Office (NSO)",
          domainScores: profile.domainScores,
          skillGaps: profile.skillGaps,
          sourceFilter: source || null,
          domainFilter: domain || null,
          topN: topN ? parseInt(topN, 10) : 140,
        },
        { timeout: 20000 }
      );

      if (data && Array.isArray(data.recommendedCourses) && data.recommendedCourses.length > 0) {
        return res.json(data);
      }
      // If ML service returned empty list, use catalog fallback
      console.warn("[course.controller] ML service returned 0 recommendations - using catalog fallback");
      const fallbackCourses = buildCatalogFallback({ user, profile, source, domain, topN });
      return res.json({ recommendedCourses: fallbackCourses });
    } catch (mlErr) {
      console.warn("[course.controller] ML service note:", mlErr.message, "- serving full 140-course catalog fallback");
      const fallbackCourses = buildCatalogFallback({ user, profile, source, domain, topN });
      return res.json({ recommendedCourses: fallbackCourses });
    }
  } catch (err) {
    console.error("[course.controller] error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    try {
      const { data } = await axios.get(`${ML_BASE_URL}/catalog`, { timeout: 6000 });
      if (data && Array.isArray(data.courses) && data.courses.length > 0) {
        return res.json(data);
      }
    } catch (catalogErr) {
      // Fallback
    }
    const user = await getOrCreateUser(req.userId).catch(() => null);
    const fallbackCourses = buildCatalogFallback({ user, profile: null, topN: 140 });
    return res.json({ courses: fallbackCourses });
  } catch (err) {
    console.error("[course.controller] getAllCourses error:", err.message);
    res.status(500).json({ error: err.message });
  }
};