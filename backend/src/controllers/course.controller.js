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
      department: "Data & Statistics",
      experienceYears: 4,
      qualifications: ["Data Analytics", "Civil Services Foundation"],
      pastTrainings: ["iGOT Basics", "Statistical Methods"],
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
        department: user.department || "Data & Statistics",
        experienceYears: user.experienceYears || 4,
        qualifications: user.qualifications || ["Data Analytics"],
        pastTrainings: user.pastTrainings || ["iGOT Basics"],
      });
      profile = await CompetencyProfile.create({
        userId: user._id,
        domainScores: gapResult.domainScores,
        skillGaps: gapResult.skillGaps,
      });
    }

    const { data } = await axios.post(`${ML_BASE_URL}/recommendations`, {
      domainScores: profile.domainScores,
      skillGaps: profile.skillGaps,
    });

    res.json(data);
  } catch (err) {
    console.error("[course.controller] error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);
    let profile = await CompetencyProfile.findOne({ userId: user._id });

    if (!profile) {
      const gapResult = await getGapAnalysis({
        designation: user.designation || "Assistant Director",
        department: user.department || "Data & Statistics",
        experienceYears: user.experienceYears || 4,
        qualifications: user.qualifications || ["Data Analytics"],
        pastTrainings: user.pastTrainings || ["iGOT Basics"],
      });
      profile = await CompetencyProfile.create({
        userId: user._id,
        domainScores: gapResult.domainScores,
        skillGaps: gapResult.skillGaps,
      });
    }

    const { data } = await axios.post(`${ML_BASE_URL}/recommendations`, {
      domainScores: profile.domainScores,
      skillGaps: profile.skillGaps,
    });

    res.json(data);
  } catch (err) {
    console.error("[course.controller] getAllCourses error:", err.message);
    res.status(500).json({ error: err.message });
  }
};