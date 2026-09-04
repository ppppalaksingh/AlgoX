import Certificate from "../models/Certificate.model.js";
import User from "../models/User.model.js";
import QuizAttempt from "../models/QuizAttempt.model.js";
import CompetencyProfile from "../models/CompetencyProfile.model.js";
import UserProgress from "../models/UserProgress.model.js";
import { getGapAnalysis } from "../services/mlService.js";

async function getOrCreateUser(clerkId) {
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({
      clerkId,
      name: "Assistant Director",
      designation: "Assistant Director",
      department: "National Statistical Office (NSO)",
      experienceYears: 0,
      qualifications: [],
      pastTrainings: [],
    });
  }
  return user;
}

export const getMyCertificates = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);
    let certs = await Certificate.find({ userId: user._id }).sort({ createdAt: -1 });

    // Only seed baseline certificates if user has established prior experience (>0) and no certificates
    if ((!certs || certs.length === 0) && (Number(user.experienceYears) || 0) > 0) {
      const defaultCerts = [
        {
          userId: user._id,
          title: "Planning and Designing of Large Scale Sample Surveys",
          issuedDate: "14 January 2026",
          domain: "Statistical",
          regNumber: "NSSTA/ISS/2026/08941",
          institute: "National Statistical Systems Training Academy (NSSTA)",
        },
        {
          userId: user._id,
          title: "Data Privacy and DPDP Act in Governance",
          issuedDate: "28 February 2026",
          domain: "Digital Governance",
          regNumber: "DPDP/GOV/2026/04122",
          institute: "Digital India Academy & MoSPI",
        },
        {
          userId: user._id,
          title: "National Accounts Statistics & SNA 2008 Guidelines",
          issuedDate: "05 August 2025",
          domain: "Statistical",
          regNumber: "NSSTA/SNA/2025/11902",
          institute: "National Statistical Systems Training Academy (NSSTA)",
        },
      ];

      certs = await Certificate.insertMany(defaultCerts);
    }

    res.json(certs || []);
  } catch (err) {
    console.error("[certificate.controller] getMyCertificates error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);
    const { title, domain, institute } = req.body;

    const cert = await Certificate.create({
      userId: user._id,
      title: title || "Statistical Capacity Building Programme",
      issuedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      domain: domain || "Statistical",
      regNumber: `NSSTA/ISS/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
      institute: institute || "National Statistical Systems Training Academy (NSSTA)",
    });

    // Recalibrate competency profile on certificate acquisition
    let recalibratedProfile = null;
    try {
      const quizAttempts = await QuizAttempt.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10);
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
      console.warn("[certificate.controller] Recalibration note:", recalErr.message);
    }

    res.status(201).json({ ...cert.toObject(), recalibratedProfile });
  } catch (err) {
    console.error("[certificate.controller] createCertificate error:", err);
    res.status(500).json({ error: err.message });
  }
};
