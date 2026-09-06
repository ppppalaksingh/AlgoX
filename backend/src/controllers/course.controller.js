import axios from "axios";
import CompetencyProfile from "../models/CompetencyProfile.model.js";
import User from "../models/User.model.js";
import { getGapAnalysis } from "../services/mlService.js";

const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

async function getOrCreateUser(clerkId) {
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({
      clerkId,
      name: "Learner",
      designation: "Assistant Director",
      department: "National Statistical Office (NSO)",
      experienceYears: 0,
      qualifications: [],
      pastTrainings: [],
    });
  }
  return user;
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
          topN: topN ? parseInt(topN) : 140,
        },
        { timeout: 5000 }
      );
      return res.json(data);
    } catch (mlErr) {
      console.warn("[course.controller] ML service unavailable or timed out:", mlErr.message, "- serving catalog fallback");
      try {
        const catalogPath = new URL("../data/mospi_courses_catalog.json", import.meta.url);
        const { default: catalog } = await import(catalogPath, { assert: { type: "json" } }).catch(() => ({ default: [] }));
        const mapped = (catalog || []).map((c, i) => ({
          ...c,
          id: c.course_id || `CRS${i + 1}`,
          similarityScore: 0.85 - i * 0.003,
          relevance: `${Math.round(85 - i * 0.3)}%`,
          igotLink: "https://portal.igotkarmayogi.gov.in/public/home",
          officialUrl: "https://portal.igotkarmayogi.gov.in/public/home",
        }));
        return res.json({ recommendedCourses: mapped.slice(0, topN ? parseInt(topN) : 140) });
      } catch (fallbackErr) {
        return res.json({ recommendedCourses: [] });
      }
    }
  } catch (err) {
    console.error("[course.controller] error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    try {
      const { data } = await axios.get(`${ML_BASE_URL}/catalog`);
      return res.json(data);
    } catch (catalogErr) {
      // Fallback to recommendation endpoint
      return getRecommendedCourses(req, res);
    }
  } catch (err) {
    console.error("[course.controller] getAllCourses error:", err.message);
    res.status(500).json({ error: err.message });
  }
};