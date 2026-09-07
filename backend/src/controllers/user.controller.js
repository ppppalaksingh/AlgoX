import User from "../models/User.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
import CompetencyProfile from "../models/CompetencyProfile.model.js";
import Certificate from "../models/Certificate.model.js";
import UserProgress from "../models/UserProgress.model.js";
import { getGapAnalysis } from "../services/mlService.js";

// Called once after signup or profile update to build the official's profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { name, email, designation, post, jobRole, department, experienceYears, qualifications, pastTrainings } = req.body;
    const resolvedPost = post || jobRole || "";

    const expY = (experienceYears !== undefined && experienceYears !== null && !isNaN(Number(experienceYears)) && experienceYears !== "")
      ? Number(experienceYears)
      : null;

    const user = await User.findOneAndUpdate(
      { clerkId: req.userId },
      { name, email, designation: designation || "", post: resolvedPost, department: department || "", experienceYears: expY, qualifications: qualifications || [], pastTrainings: pastTrainings || [] },
      { upsert: true, new: true }
    );

    let recalibratedProfile = null;

    // Only compute competency profile & readiness when user has explicitly chosen a designation
    if (user.designation && user.designation.trim() !== "") {
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
          designation: user.designation,
          post: user.post || resolvedPost,
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
    } else {
      // User has not set designation yet - overall readiness must remain 0
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

    res.json({ ...user.toObject(), recalibratedProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    let user = await User.findOne({ clerkId: req.userId });
    if (!user) {
      // Never return another user's profile to an authenticated session
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(user.toObject());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};