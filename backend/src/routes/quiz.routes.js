import express from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.middleware.js";
import { uploadAndGenerateQuiz, submitQuizAnswers, generateSampleQuiz } from "../controllers/quiz.controller.js";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  // .docx
  "text/plain",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max, matches your frontend UI text
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Upload PDF, PPTX, DOCX, or TXT."));
    }
  },
});

const router = express.Router();

router.post("/upload", requireAuth, upload.single("file"), uploadAndGenerateQuiz);
router.post("/sample", requireAuth, generateSampleQuiz);
router.post("/submit", requireAuth, submitQuizAnswers);

export default router;