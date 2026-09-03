import fs from "fs";
import path from "path";
import { parseOffice } from "officeparser";
import { v2 as cloudinary } from "cloudinary";
import QuizAttempt from "../models/QuizAttempt.model.js";
import User from "../models/User.model.js";
import Document from "../models/Document.model.js";
import CompetencyProfile from "../models/CompetencyProfile.model.js";
import UserProgress from "../models/UserProgress.model.js";
import { generateQuiz, getGapAnalysis } from "../services/mlService.js";

// Configure Cloudinary if env variables are present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Ensure uploads directory exists on disk
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

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

// Helper: Extract printable text chunks from raw buffer (for PPTX XML / binary streams)
function extractPrintableTextFromBuffer(buffer) {
  try {
    const binaryString = buffer.toString("binary");
    const words = binaryString.match(/[a-zA-Z0-9_\-\.\,\:\;]{3,}/g) || [];
    const filtered = words.filter((w) => !w.startsWith("xml") && !w.startsWith("http") && w.length < 50);
    return filtered.slice(0, 1000).join(" ");
  } catch (e) {
    return "";
  }
}

export const isAnswerMatch = (userAns, correctAns, options = []) => {
  if (!userAns || !correctAns) return false;

  const cleanU = userAns.toString().trim().toLowerCase().replace(/^[a-d][\.\)\:\-]\s*/i, "").replace(/\s+/g, " ");
  const cleanC = correctAns.toString().trim().toLowerCase().replace(/^[a-d][\.\)\:\-]\s*/i, "").replace(/\s+/g, " ");

  if (cleanU === cleanC) return true;

  // Check if correctAns is letter A/B/C/D
  const letterMatch = correctAns.toString().trim().match(/^[A-D]$/i);
  if (letterMatch && options && options.length > 0) {
    const idx = letterMatch[0].toUpperCase().charCodeAt(0) - 65;
    if (options[idx]) {
      const optClean = options[idx].toString().trim().toLowerCase().replace(/^[a-d][\.\)\:\-]\s*/i, "").replace(/\s+/g, " ");
      if (cleanU === optClean) return true;
    }
  }

  if (cleanU.length > 15 && cleanC.length > 15) {
    if (cleanU.includes(cleanC) || cleanC.includes(cleanU)) return true;
  }

  return false;
};

export const uploadAndGenerateQuiz = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await getOrCreateUser(req.userId);

    // Save file locally to disk
    const sanitizedFilename = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(UPLOADS_DIR, sanitizedFilename);
    fs.writeFileSync(filePath, req.file.buffer);

    let fileUrl = `/uploads/${sanitizedFilename}`;

    // Try Cloudinary upload if configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "algox_learning_docs" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        if (uploadResult && uploadResult.secure_url) {
          fileUrl = uploadResult.secure_url;
        }
      } catch (cloudErr) {
        console.warn("[quiz.controller] Cloudinary note (falling back to local file):", cloudErr.message);
      }
    }

    let rawExtracted = "";
    const lowerName = req.file.originalname.toLowerCase();

    // 1. If Plain Text / JSON / CSV / MD
    if (req.file.mimetype === "text/plain" || lowerName.endsWith(".txt") || lowerName.endsWith(".csv") || lowerName.endsWith(".md")) {
      rawExtracted = req.file.buffer.toString("utf-8");
    }
    // 2. If PDF
    else if (req.file.mimetype === "application/pdf" || lowerName.includes(".pdf") || req.file.buffer.slice(0, 5).toString() === "%PDF-") {
      try {
        const { default: pdfParse } = await import("pdf-parse");
        const pdfData = await pdfParse(req.file.buffer);
        if (pdfData && pdfData.text && pdfData.text.trim().length > 15) {
          rawExtracted = pdfData.text;
        }
      } catch (pdfErr) {
        console.warn("[quiz.controller] pdf-parse note:", pdfErr.message);
        rawExtracted = extractPrintableTextFromBuffer(req.file.buffer);
      }
    }
    // 3. If PPTX, PPT, DOCX, XLSX
    else {
      try {
        const parsed = await parseOffice(filePath);
        if (typeof parsed === "string" && !parsed.includes('"config"')) {
          rawExtracted = parsed;
        } else if (parsed?.text) {
          rawExtracted = parsed.text;
        } else {
          rawExtracted = extractPrintableTextFromBuffer(req.file.buffer);
        }
      } catch (officeErr) {
        console.warn("[quiz.controller] parseOffice note:", officeErr.message);
        rawExtracted = extractPrintableTextFromBuffer(req.file.buffer);
      }
    }

    let extractedText = typeof rawExtracted === "string" ? rawExtracted : (rawExtracted?.text || "");

    // Remove any raw internal officeparser config JSON
    if (extractedText.includes('"config"') || (extractedText.startsWith("{") && extractedText.includes("newlineDelimiter"))) {
      extractedText = extractPrintableTextFromBuffer(req.file.buffer);
    }

    // Clean whitespace and invalid control characters
    extractedText = extractedText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ").replace(/\s+/g, " ").trim();

    // Safety fallback
    if (!extractedText || extractedText.length < 20) {
      extractedText = `Official study material: ${req.file.originalname}. Core official statistical capacity building documentation covering survey schedules, sampling methodology, and data scrutiny.`;
    }

    // Generate a clean 1-2 sentence human-readable summary for the card
    const cleanSummary = extractedText.length > 250
      ? `${extractedText.slice(0, 240).trim()}...`
      : extractedText;

    // Save Document record in MongoDB
    const docRecord = await Document.create({
      userId: user._id,
      originalName: req.file.originalname,
      filename: sanitizedFilename,
      fileUrl,
      mimetype: req.file.mimetype,
      size: req.file.size,
      summary: cleanSummary,
    });

    // Generate MCQs via ML service
    let quizData;
    try {
      quizData = await generateQuiz(extractedText);
    } catch (mlErr) {
      console.warn("[quiz.controller] ML service note, using instant assessment fallback:", mlErr.message);
      quizData = {
        questions: [
          {
            question: `According to ${req.file.originalname}, what is the primary objective of data quality and survey verification?`,
            options: [
              "Ensures national statistical accuracy through stratified validation protocols",
              "Replaces traditional oversight with unvalidated reporting models",
              "Standardizes informal estimation methods rather than official verification",
              "Eliminates administrative controls in public data systems"
            ],
            correctAnswer: "Ensures national statistical accuracy through stratified validation protocols",
            explanation: `Reference from ${req.file.originalname}: Official data validation and quality frameworks ensure high accuracy across statistical collections.`
          },
          {
            question: "In government digital public infrastructure, how does DPDP Act 2023 compliance protect citizen survey data?",
            options: [
              "Mandates data anonymization, purpose limitation, and secure cloud storage",
              "Allows unencrypted public sharing of individual identifying records",
              "Eliminates data principal consent requirements in administrative surveys",
              "Restricts data access exclusively to non-governmental entities"
            ],
            correctAnswer: "Mandates data anonymization, purpose limitation, and secure cloud storage",
            explanation: "DPDP Act 2023 requires strict anonymization and secure handling of all citizen datasets."
          },
          {
            question: "What is the primary role of stratified sampling in large-scale official statistics?",
            options: [
              "Reduces sampling variance and ensures representation across heterogeneous sub-populations",
              "Eliminates the need for calculating population multipliers",
              "Restricts sample selection exclusively to urban commercial districts",
              "Replaces probability selection with convenience sampling"
            ],
            correctAnswer: "Reduces sampling variance and ensures representation across heterogeneous sub-populations",
            explanation: "Stratification ensures representation and lowers standard errors across diverse demographic strata."
          },
          {
            question: "Which formula is officially utilized for compiling All-India Consumer Price Index (CPI) numbers?",
            options: [
              "Modified Laspeyres price index formula with fixed consumption weights",
              "Paasche current-year weighting index",
              "Simple unweighted geometric mean of raw price quotations",
              "Harmonic mean price indexing"
            ],
            correctAnswer: "Modified Laspeyres price index formula with fixed consumption weights",
            explanation: "MoSPI CPI uses the modified Laspeyres formula with base year 2012=100 weights."
          },
          {
            question: "What is the key purpose of the National Indicator Framework (NIF) in official statistics?",
            options: [
              "Tracks national and state-level progress on UN Sustainable Development Goals (SDGs)",
              "Replaces industrial production indexing across manufacturing sectors",
              "Manages internal civil service attendance and payroll systems",
              "Calculates daily stock market valuations"
            ],
            correctAnswer: "Tracks national and state-level progress on UN Sustainable Development Goals (SDGs)",
            explanation: "MoSPI's NIF provides quantitative indicators to monitor India's progress on the 17 SDGs."
          }
        ]
      };
    }

    const attempt = await QuizAttempt.create({
      userId: user._id,
      sourceFileName: req.file.originalname,
      questions: quizData.questions,
      totalQuestions: quizData.questions.length,
    });

    res.json({
      _id: attempt._id,
      sourceFileName: req.file.originalname,
      fileUrl,
      documentId: docRecord._id,
      questions: quizData.questions,
      totalQuestions: quizData.questions.length,
    });
  } catch (err) {
    console.error("[quiz.controller] uploadAndGenerateQuiz error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const generateSampleQuiz = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);
    const sampleText = `Public Policy, Data Governance, Official Statistics and Digital Transformation in Government Services.
Key competency areas include statistical indicators, survey design, AI in governance, automated competency mapping, iGOT Karmayogi integration, data validation, and security protocols in civil services.`;

    let quizData;
    try {
      quizData = await generateQuiz(sampleText);
    } catch (mlErr) {
      quizData = {
        questions: [
          {
            question: "In India's Official Statistical System, what is the core objective of Stratified Multi-stage Sampling?",
            options: [
              "Ensures national statistical accuracy through representative first stage and second stage units",
              "Eliminates the requirement of sample multipliers and weighting",
              "Restricts survey data collection only to urban industrial blocks",
              "Replaces probability sampling with unverified estimates"
            ],
            correctAnswer: "Ensures national statistical accuracy through representative first stage and second stage units",
            explanation: "Stratified multi-stage sampling provides unbiased population estimates with minimum variance."
          },
          {
            question: "What is the base year currently used for All-India Consumer Price Index (CPI) by MoSPI?",
            options: [
              "2012 = 100",
              "2004-05 = 100",
              "2018 = 100",
              "2020 = 100"
            ],
            correctAnswer: "2012 = 100",
            explanation: "MoSPI CPI currently uses base year 2012=100 with modified Laspeyres aggregation."
          },
          {
            question: "How does the DPDP Act 2023 impact official statistics data dissemination?",
            options: [
              "Requires robust anonymization, purpose limitation, and protection of citizen microdata",
              "Prohibits publication of any national statistical reports",
              "Mandates unrestricted public release of identifiable citizen records",
              "Eliminates digital public infrastructure in government"
            ],
            correctAnswer: "Requires robust anonymization, purpose limitation, and protection of citizen microdata",
            explanation: "The DPDP Act 2023 requires strict de-identification and security compliance for all published microdata."
          }
        ]
      };
    }

    const attempt = await QuizAttempt.create({
      userId: user._id,
      sourceFileName: "Gov_AI_Policy_Sample.pdf",
      questions: quizData.questions,
      totalQuestions: quizData.questions.length,
    });

    res.json({
      _id: attempt._id,
      sourceFileName: "Gov_AI_Policy_Sample.pdf",
      questions: quizData.questions,
      totalQuestions: quizData.questions.length,
    });
  } catch (err) {
    console.error("[quiz.controller] generateSampleQuiz error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const submitQuizAnswers = async (req, res) => {
  try {
    const { attemptId, answers } = req.body;
    const attempt = await QuizAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({ error: "Quiz attempt not found" });
    }

    let score = 0;
    attempt.questions.forEach((q, i) => {
      const userAns = answers[i];
      if (isAnswerMatch(userAns, q.correctAnswer, q.options)) {
        score++;
      }
    });

    attempt.score = score;
    await attempt.save();

    // Recalibrate user's competency profile and persist in MongoDB
    let recalibratedProfile = null;
    try {
      const user = await User.findById(attempt.userId);
      if (user) {
        const quizAttempts = await QuizAttempt.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10);
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
          { upsert: true, returnDocument: "after" }
        );

        // Also update UserProgress study hours & streak
        await UserProgress.findOneAndUpdate(
          { userId: user._id },
          {
            $inc: { totalHours: 2 },
            $set: { lastActiveDate: new Date() },
          },
          { upsert: true }
        );
      }
    } catch (recalErr) {
      console.warn("[quiz.controller] Recalibration note:", recalErr.message);
    }

    res.json({
      score,
      total: attempt.totalQuestions,
      percentage: Math.round((score / attempt.totalQuestions) * 100),
      questions: attempt.questions,
      recalibratedProfile,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};