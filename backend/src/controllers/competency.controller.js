import CompetencyProfile from "../models/CompetencyProfile.model.js";
import User from "../models/User.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
import Document from "../models/Document.model.js";
import Certificate from "../models/Certificate.model.js";
import UserProgress from "../models/UserProgress.model.js";
import { getGapAnalysis } from "../services/mlService.js";

async function getOrCreateUser(clerkId) {
  let user = await User.findOne({ clerkId });
  if (!user && (clerkId === "user_dev_officer_test" || clerkId === "officer-default" || !clerkId)) {
    user = await User.findOne().sort({ updatedAt: -1 });
  }
  if (!user) {
    user = await User.create({
      clerkId: clerkId || "officer-default",
      name: "Palak Singh",
      designation: "Assistant Director",
      department: "National Statistical Office (NSO)",
      experienceYears: 0,
      qualifications: [],
      pastTrainings: [],
    });
  }
  return user;
}

export const runGapAnalysis = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);

    // Fetch live user activities (only finished quiz attempts with scores, documents, certificates, progress)
    const quizAttempts = await QuizAttempt.find({ userId: user._id, score: { $exists: true, $ne: null } })
      .sort({ createdAt: -1 })
      .limit(10);
    const certificates = await Certificate.find({ userId: user._id }).sort({ createdAt: -1 });
    const progress = await UserProgress.findOne({ userId: user._id });

    const certTitles = new Set();
    const completedCourses = [...(user.pastTrainings || [])];
    for (const c of certificates) {
      if (c.title && !certTitles.has(c.title.toLowerCase().trim())) {
        certTitles.add(c.title.toLowerCase().trim());
        completedCourses.push(`${c.title} (${c.domain || 'Statistical'})`);
      }
    }
    for (const cId of (progress?.completedCourseIds || [])) {
      if (!certTitles.has(String(cId).toLowerCase().trim())) {
        completedCourses.push(String(cId));
      }
    }

    const gapResult = await getGapAnalysis({
      designation: user.designation || "Assistant Director",
      department: user.department || "National Statistical Office (NSO)",
      experienceYears: user.experienceYears != null ? Number(user.experienceYears) : 0,
      qualifications: user.qualifications || [],
      pastTrainings: user.pastTrainings || [],
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
      { upsert: true, new: true }
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
    const quizAttempts = await QuizAttempt.find({ userId: user._id, score: { $exists: true, $ne: null } })
      .sort({ createdAt: -1 })
      .limit(10);
    const certificates = await Certificate.find({ userId: user._id }).sort({ createdAt: -1 });
    const progress = await UserProgress.findOne({ userId: user._id });

    const certTitles = new Set();
    const completedCourses = [...(user.pastTrainings || [])];
    for (const c of certificates) {
      if (c.title && !certTitles.has(c.title.toLowerCase().trim())) {
        certTitles.add(c.title.toLowerCase().trim());
        completedCourses.push(`${c.title} (${c.domain || 'Statistical'})`);
      }
    }
    for (const cId of (progress?.completedCourseIds || [])) {
      if (!certTitles.has(String(cId).toLowerCase().trim())) {
        completedCourses.push(String(cId));
      }
    }

    const gapResult = await getGapAnalysis({
      designation: user.designation || "Assistant Director",
      department: user.department || "National Statistical Office (NSO)",
      experienceYears: user.experienceYears != null ? Number(user.experienceYears) : 0,
      qualifications: user.qualifications || [],
      pastTrainings: user.pastTrainings || [],
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
      { upsert: true, new: true }
    );

    res.json({
      ...gapResult,
      profileId: profile._id,
    });
  } catch (err) {
    console.error("[competency.controller] getMyCompetencyProfile error:", err.message);
    res.status(500).json({ error: err.message });
  }
};