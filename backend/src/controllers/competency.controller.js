import CompetencyProfile from "../models/CompetencyProfile.model.js";
import User from "../models/User.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
import Document from "../models/Document.model.js";
import Certificate from "../models/Certificate.model.js";
import UserProgress from "../models/UserProgress.model.js";
import { getGapAnalysis } from "../services/mlService.js";

async function getOrCreateUser(clerkId, defaultData = {}) {
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({
      clerkId: clerkId || "officer-default",
      name: defaultData.name || "",
      email: defaultData.email || "",
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

export const runGapAnalysis = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);

    // If body contains profile updates (e.g. changed designation / role from Profile), persist them
    if (req.body && Object.keys(req.body).length > 0) {
      const { designation, post, jobRole, department, experienceYears, qualifications, pastTrainings, name } = req.body;
      if (designation !== undefined) user.designation = designation;
      if (post !== undefined || jobRole !== undefined) user.post = post || jobRole || "";
      if (department !== undefined) user.department = department;
      if (name !== undefined) user.name = name;
      if (experienceYears !== undefined && experienceYears !== null && !isNaN(Number(experienceYears))) {
        user.experienceYears = Number(experienceYears);
      }
      if (qualifications !== undefined) user.qualifications = qualifications;
      if (pastTrainings !== undefined) user.pastTrainings = pastTrainings;
      await user.save();
    }

    const effectiveDesignation = req.body?.designation || user.designation;
    if (!effectiveDesignation || effectiveDesignation.trim() === "") {
      return res.json({
        overallReadiness: 0,
        domainScores: { statistical: 0, technical: 0, digitalGovernance: 0, behavioural: 0 },
        skillGaps: [],
        subCompetencies: [],
        highestGap: null,
        topStrength: null,
        aiExecutiveInsight: "Please select your Designation in Profile to run AI Gap Analysis.",
        domainTargets: { statistical: 0, technical: 0, digitalGovernance: 0, behavioural: 0 },
        profileComplete: false,
      });
    }

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
      designation: effectiveDesignation,
      post: req.body?.post || req.body?.jobRole || user.post || "",
      department: req.body?.department || user.department || "",
      experienceYears: req.body?.experienceYears != null ? Number(req.body.experienceYears) : (user.experienceYears != null ? Number(user.experienceYears) : 0),
      qualifications: req.body?.qualifications || user.qualifications || [],
      pastTrainings: req.body?.pastTrainings || user.pastTrainings || [],
      quizAttempts: (req.body?.quizAttempts != null)
        ? req.body.quizAttempts
        : quizAttempts.map((q) => {
            const questionTopics = (q.questions || [])
              .map((item) => `${item.question || ""} ${item.explanation || ""}`)
              .join(" ");
            return {
              sourceFileName: q.sourceFileName,
              score: q.score,
              totalQuestions: q.totalQuestions,
              domain: q.domain || "",
              title: q.title || "",
              questionTopics,
              createdAt: q.createdAt,
            };
          }),
      completedCourses: (req.body?.completedCourses != null)
        ? req.body.completedCourses
        : completedCourses,
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

    // If user has not set their designation yet, overall readiness must be 0
    if (!user.designation || user.designation.trim() === "") {
      return res.json({
        overallReadiness: 0,
        domainScores: { statistical: 0, technical: 0, digitalGovernance: 0, behavioural: 0 },
        skillGaps: [],
        subCompetencies: [],
        highestGap: null,
        topStrength: null,
        aiExecutiveInsight: "Please configure your official Designation and Role in your Profile to generate your AI skill gap analysis and competency benchmarks.",
        domainTargets: { statistical: 0, technical: 0, digitalGovernance: 0, behavioural: 0 },
        profileComplete: false,
      });
    }

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
      designation: user.designation,
      post: user.post || "",
      department: user.department || "",
      experienceYears: user.experienceYears != null ? Number(user.experienceYears) : 0,
      qualifications: user.qualifications || [],
      pastTrainings: user.pastTrainings || [],
      quizAttempts: quizAttempts.map((q) => {
        const questionTopics = (q.questions || [])
          .map((item) => `${item.question || ""} ${item.explanation || ""}`)
          .join(" ");
        return {
          sourceFileName: q.sourceFileName,
          score: q.score,
          totalQuestions: q.totalQuestions,
          domain: q.domain || "",
          title: q.title || "",
          questionTopics,
        };
      }),
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