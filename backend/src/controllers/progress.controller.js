import UserProgress from "../models/UserProgress.model.js";
import User from "../models/User.model.js";
import Certificate from "../models/Certificate.model.js";
import CompetencyProfile from "../models/CompetencyProfile.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
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

export const getMyProgress = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);
    let progress = await UserProgress.findOne({ userId: user._id });

    if (!progress) {
      progress = await UserProgress.create({
        userId: user._id,
        completedCourseIds: [],
        inProgressCourseIds: [],
        totalHours: (Number(user.experienceYears) || 0) * 15,
        streakDays: 0,
      });
    }

    const certCount = await Certificate.countDocuments({ userId: user._id });

    res.json({
      ...progress.toObject(),
      certificateCount: certCount || 0,
    });
  } catch (err) {
    console.error("[progress.controller] getMyProgress error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const completeCourse = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);
    const { courseId, durationHours, courseTitle, domain } = req.body;

    let progress = await UserProgress.findOne({ userId: user._id });
    if (!progress) {
      progress = await UserProgress.create({
        userId: user._id,
        completedCourseIds: [],
        inProgressCourseIds: [],
        totalHours: 0,
        streakDays: 0,
      });
    }

    // Add to completed if not already there
    if (courseId && !progress.completedCourseIds.includes(courseId)) {
      progress.completedCourseIds.push(courseId);
      progress.inProgressCourseIds = progress.inProgressCourseIds.filter((id) => id !== courseId);
    }

    const addedHours = Number(durationHours) || 20;
    progress.totalHours = (progress.totalHours || 0) + addedHours;
    progress.streakDays = (progress.streakDays || 0) + 1;
    progress.lastActiveDate = new Date();
    await progress.save();

    // Create certificate in MongoDB if not already issued
    let newCert = null;
    if (courseTitle) {
      newCert = await Certificate.findOne({ userId: user._id, title: courseTitle });
      if (!newCert) {
        newCert = await Certificate.create({
          userId: user._id,
          title: courseTitle,
          issuedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
          domain: domain || "Statistical",
          regNumber: `NSSTA/ISS/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
          institute: "National Statistical Systems Training Academy (NSSTA)",
        });
      }
    }

    // Dynamically recalculate competency profile with newly earned credential
    let recalibratedProfile = null;
    try {
      const quizAttempts = await QuizAttempt.find({ userId: user._id, score: { $exists: true, $ne: null } })
        .sort({ createdAt: -1 })
        .limit(10);
      const certificates = await Certificate.find({ userId: user._id }).sort({ createdAt: -1 });

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
      console.warn("[progress.controller] Recalibration note:", recalErr.message);
    }

    res.json({
      progress,
      certificate: newCert,
      recalibratedProfile,
    });
  } catch (err) {
    console.error("[progress.controller] completeCourse error:", err);
    res.status(500).json({ error: err.message });
  }
};
