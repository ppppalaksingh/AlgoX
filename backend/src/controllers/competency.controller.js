import CompetencyProfile from "../models/CompetencyProfile.model.js";
import User from "../models/User.model.js";
import { getGapAnalysis } from "../services/mlService.js";

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

export const runGapAnalysis = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);

    const gapResult = await getGapAnalysis({
      designation: user.designation || "Assistant Director",
      department: user.department || "Data & Statistics",
      experienceYears: user.experienceYears || 4,
      qualifications: user.qualifications?.length ? user.qualifications : ["Data Analytics"],
      pastTrainings: user.pastTrainings?.length ? user.pastTrainings : ["iGOT Basics"],
    });

    const profile = await CompetencyProfile.findOneAndUpdate(
      { userId: user._id },
      { domainScores: gapResult.domainScores, skillGaps: gapResult.skillGaps },
      { upsert: true, new: true }
    );

    res.json(profile);
  } catch (err) {
    console.error("[competency.controller] error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getMyCompetencyProfile = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);
    let profile = await CompetencyProfile.findOne({ userId: user._id });
    if (!profile) {
      // Create initial profile
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
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};