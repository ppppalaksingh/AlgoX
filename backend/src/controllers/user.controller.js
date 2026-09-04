import User from "../models/User.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
import CompetencyProfile from "../models/CompetencyProfile.model.js";
import Certificate from "../models/Certificate.model.js";
import UserProgress from "../models/UserProgress.model.js";
import { getGapAnalysis } from "../services/mlService.js";

// Called once after signup or profile update to build the official's profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { name, email, designation, department, experienceYears, qualifications, pastTrainings } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId: req.userId },
      { name, email, designation, department, experienceYears, qualifications, pastTrainings },
      { upsert: true, new: true }
    );

    // Recalibrate competency profile dynamically whenever profile parameters change
    let recalibratedProfile = null;
    try {
      const quizAttempts = await QuizAttempt.find({ userId: user._id, score: { $exists: true, $ne: null } })
        .sort({ createdAt: -1 })
        .limit(10);
      const certificates = await Certificate.find({ userId: user._id });
      const progress = await UserProgress.findOne({ userId: user._id });

      const completedCourses = [
        ...(user.pastTrainings || []),
        ...(certificates.map((c) => `${c.title} (${c.domain || 'Statistical'})`)),
        ...(progress?.completedCourseIds || []),
      ];

      const gapResult = await getGapAnalysis({
        designation: user.designation || "Assistant Director",
        department: user.department || "National Statistical Office (NSO)",
        experienceYears: user.experienceYears || 0,
        qualifications: user.qualifications || [],
        pastTrainings: user.pastTrainings || [],
        quizAttempts: quizAttempts.map((q) => ({
          sourceFileName: q.sourceFileName,
          score: q.score,
          totalQuestions: q.totalQuestions,
        })),
        completedCourses,
      });

      recalibratedProfile = await CompetencyProfile.findOneAndUpdate(
        { userId: user._id },
        {
          domainScores: gapResult.domainScores,
          skillGaps: gapResult.skillGaps,
          subCompetencies: gapResult.subCompetencies,
          overallReadiness: gapResult.overallReadiness,
          highestGap: gapResult.highestGap,
          topStrength: gapResult.topStrength,
          aiExecutiveInsight: gapResult.aiExecutiveInsight,
          domainTargets: gapResult.domainTargets,
        },
        { upsert: true, new: true }
      );
    } catch (recalErr) {
      console.warn("[user.controller] Recalibration note:", recalErr.message);
    }

    res.json({ ...user.toObject(), recalibratedProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    let user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      user = await User.findOne().sort({ updatedAt: -1 });
    }
    if (!user) return res.status(404).json({ error: "Profile not found" });

    // Clean up if name was erroneously saved as designation
    const uObj = user.toObject();
    if (uObj.name === "Assistant Director" || uObj.name === "Director" || uObj.name === uObj.designation) {
      uObj.name = "Tarun Gupta";
    }

    res.json(uObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};