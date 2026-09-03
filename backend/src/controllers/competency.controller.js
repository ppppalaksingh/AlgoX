import CompetencyProfile from "../models/CompetencyProfile.model.js";
import User from "../models/User.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
import Document from "../models/Document.model.js";
import Certificate from "../models/Certificate.model.js";
import UserProgress from "../models/UserProgress.model.js";
import { getGapAnalysis } from "../services/mlService.js";

async function getOrCreateUser(clerkId) {
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({
      clerkId: clerkId || "officer-default",
      name: "Assistant Director",
      designation: "Assistant Director",
      department: "National Statistical Office (NSO)",
      experienceYears: 4,
      qualifications: ["Master in Statistics", "Civil Services Foundation"],
      pastTrainings: ["iGOT Basics", "Statistical Sampling Methods"],
    });
  }
  return user;
}

export const runGapAnalysis = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);

    // Fetch live user activities (quiz scores, documents, certificates, progress)
    const quizAttempts = await QuizAttempt.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10);
    const certificates = await Certificate.find({ userId: user._id }).sort({ createdAt: -1 });
    const progress = await UserProgress.findOne({ userId: user._id });

    const completedCourses = [
      ...(user.pastTrainings || []),
      ...(certificates.map((c) => `${c.title} (${c.domain || 'Statistical'})`)),
      ...(progress?.completedCourseIds || []),
    ];

    const gapResult = await getGapAnalysis({
      designation: user.designation || "Assistant Director",
      department: user.department || "National Statistical Office (NSO)",
      experienceYears: user.experienceYears || 4,
      qualifications: user.qualifications?.length ? user.qualifications : ["Master in Statistics"],
      pastTrainings: user.pastTrainings?.length ? user.pastTrainings : ["Statistical Sampling Methods"],
      quizAttempts: quizAttempts.map((q) => ({
        sourceFileName: q.sourceFileName,
        score: q.score,
        totalQuestions: q.totalQuestions,
      })),
      completedCourses,
    });

    const profile = await CompetencyProfile.findOneAndUpdate(
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
      { upsert: true, returnDocument: "after" }
    );

    res.json({
      ...gapResult,
      profileId: profile._id,
    });
  } catch (err) {
    console.error("[competency.controller] runGapAnalysis error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getMyCompetencyProfile = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);
    const quizAttempts = await QuizAttempt.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10);
    const certificates = await Certificate.find({ userId: user._id }).sort({ createdAt: -1 });
    const progress = await UserProgress.findOne({ userId: user._id });

    const completedCourses = [
      ...(user.pastTrainings || []),
      ...(certificates.map((c) => `${c.title} (${c.domain || 'Statistical'})`)),
      ...(progress?.completedCourseIds || []),
    ];

    const gapResult = await getGapAnalysis({
      designation: user.designation || "Assistant Director",
      department: user.department || "National Statistical Office (NSO)",
      experienceYears: user.experienceYears || 4,
      qualifications: user.qualifications || ["Master in Statistics"],
      pastTrainings: user.pastTrainings || ["Statistical Sampling Methods"],
      quizAttempts: quizAttempts.map((q) => ({
        sourceFileName: q.sourceFileName,
        score: q.score,
        totalQuestions: q.totalQuestions,
      })),
      completedCourses,
    });

    res.json(gapResult);
  } catch (err) {
    console.error("[competency.controller] getMyCompetencyProfile error:", err.message);
    res.status(500).json({ error: err.message });
  }
};