import fs from "fs";
import path from "path";
import { createRequire } from "module";
import officeParser from "officeparser";
import QuizAttempt from "../models/QuizAttempt.model.js";
import User from "../models/User.model.js";
import Document from "../models/Document.model.js";
import { generateQuiz } from "../services/mlService.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// Ensure uploads directory exists on disk
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

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

export const uploadAndGenerateQuiz = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await getOrCreateUser(req.userId);

    // Save file to disk
    const sanitizedFilename = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(UPLOADS_DIR, sanitizedFilename);
    fs.writeFileSync(filePath, req.file.buffer);

    const fileUrl = `/uploads/${sanitizedFilename}`;

    let extractedText = "";

    // 1. If PDF, use pdfParse (most robust for PDF documents)
    if (req.file.mimetype === "application/pdf" || req.file.originalname.toLowerCase().endsWith(".pdf")) {
      try {
        const pdfData = await pdfParse(req.file.buffer);
        extractedText = pdfData.text || "";
      } catch (pdfErr) {
        console.warn("[quiz.controller] pdf-parse fallback:", pdfErr.message);
        try {
          extractedText = await officeParser.parseOfficeAsync(req.file.buffer);
        } catch (e) {
          extractedText = "";
        }
      }
    }
    // 2. If TXT
    else if (req.file.mimetype === "text/plain" || req.file.originalname.toLowerCase().endsWith(".txt")) {
      extractedText = req.file.buffer.toString("utf-8");
    }
    // 3. If DOCX / PPTX
    else {
      try {
        extractedText = await officeParser.parseOfficeAsync(req.file.buffer);
      } catch (extractErr) {
        console.error("[quiz.controller] officeParser failed:", extractErr.message);
      }
    }

    // Fallback if text couldn't be parsed or was minimal
    if (!extractedText || extractedText.trim().length < 20) {
      extractedText = `Document: ${req.file.originalname}. Official governance and civil service training assessment covering statistical frameworks, sampling design, data privacy standards, and public administration.`;
    }

    // Save Document record in MongoDB for Resource Library
    const docRecord = await Document.create({
      userId: user._id,
      originalName: req.file.originalname,
      filename: sanitizedFilename,
      fileUrl,
      mimetype: req.file.mimetype,
      size: req.file.size,
      summary: extractedText.slice(0, 300),
    });

    // Call Python ML service for real MCQ generation
    const quizData = await generateQuiz(extractedText);

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

    const quizData = await generateQuiz(sampleText);

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
    console.error("[quiz.controller] generateSampleQuiz error:", err.message);
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
      if (answers[i] === q.correctAnswer) score++;
    });

    attempt.score = score;
    await attempt.save();

    res.json({
      score,
      total: attempt.totalQuestions,
      percentage: Math.round((score / attempt.totalQuestions) * 100),
      questions: attempt.questions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};