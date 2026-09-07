import User from "../models/User.model.js";
import UserProgress from "../models/UserProgress.model.js";
import Certificate from "../models/Certificate.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
import CompetencyProfile from "../models/CompetencyProfile.model.js";
import { getGapAnalysis } from "../services/mlService.js";
import mongoose from "mongoose";

async function getOrCreateUser(clerkId, defaultData = {}) {
  let user = await User.findOne({ clerkId });
  if (!user && mongoose.Types.ObjectId.isValid(clerkId)) {
    user = await User.findById(clerkId);
  }
  if (!user) {
    user = await User.create({
      clerkId: clerkId || "officer-default",
      name: defaultData.name || "",
      email: defaultData.email,
      designation: defaultData.designation || "",
      post: defaultData.post || "",
      department: defaultData.department || "",
      experienceYears: null,
      qualifications: [],
      pastTrainings: [],
    });
  }
  return user;
}

export const startLearningPath = async (req, res) => {
  try {
    const { courseId } = req.body || {};
    const user = await getOrCreateUser(req.userId);

    res.json({
      success: true,
      message: "Learning path started successfully",
      courseId: courseId || "data-governance-101",
      userId: user._id,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[learningPath.controller] error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const completeLearningPath = async (req, res) => {
  try {
    const { pathId, title, domain, level = 1 } = req.body || {};
    const user = await getOrCreateUser(req.userId);

    const pathTitle = `${title || "Specialized Cadre Pathway"} (${domain || "Digital Governance"})`;

    // 1. Update UserProgress
    let progress = await UserProgress.findOne({ userId: user._id });
    if (!progress) {
      progress = await UserProgress.create({
        userId: user._id,
        completedCourseIds: [],
        inProgressCourseIds: [],
        totalHours: 0,
        streakDays: 1,
        lastActiveDate: new Date(),
      });
    }

    const pathKey = pathId || `path-${String(domain).toLowerCase()}-lvl${level}`;
    if (!progress.completedCourseIds.includes(pathKey) && !progress.completedCourseIds.includes(pathTitle)) {
      progress.completedCourseIds.push(pathTitle);
    }
    progress.totalHours = (progress.totalHours || 0) + 12;
    progress.streakDays = (progress.streakDays || 0) + 1;
    progress.lastActiveDate = new Date();
    await progress.save();

    // 2. Recalibrate competency profile with newly completed pathway
    const quizAttempts = await QuizAttempt.find({ userId: user._id, score: { $exists: true, $ne: null } })
      .sort({ createdAt: -1 })
      .limit(10);
    const certificates = await Certificate.find({ userId: user._id }).sort({ createdAt: -1 });

    const certTitles = new Set();
    const completedCourses = [...(user.pastTrainings || [])];
    for (const c of certificates) {
      if (c.title && !certTitles.has(c.title.toLowerCase().trim())) {
        certTitles.add(c.title.toLowerCase().trim());
        completedCourses.push(`${c.title} (${c.domain || "Statistical"})`);
      }
    }
    for (const cId of (progress?.completedCourseIds || [])) {
      if (!certTitles.has(String(cId).toLowerCase().trim())) {
        completedCourses.push(String(cId));
      }
    }

    let recalibratedProfile = null;
    let gapResult = null;
    if (user && user.designation && user.designation.trim() !== "") {
      gapResult = await getGapAnalysis({
        designation: user.designation,
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
    } else {
      recalibratedProfile = await CompetencyProfile.findOneAndUpdate(
        { userId: user._id },
        {
          domainScores: { statistical: 0, technical: 0, digitalGovernance: 0, behavioural: 0 },
          skillGaps: [],
          subCompetencies: [],
          overallReadiness: 0,
          highestGap: null,
          topStrength: null,
          aiExecutiveInsight: "Please configure your official Designation and Role in your Profile to generate your AI skill gap analysis and competency benchmarks.",
          domainTargets: { statistical: 0, technical: 0, digitalGovernance: 0, behavioural: 0 },
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      message: `Learning pathway "${pathTitle}" completed successfully`,
      pathId: pathKey,
      recalibratedProfile: {
        ...gapResult,
        profileId: recalibratedProfile._id,
      },
      progress,
    });
  } catch (err) {
    console.error("[learningPath.controller] completeLearningPath error:", err.message);
    res.status(500).json({ error: err.message });
  }
};