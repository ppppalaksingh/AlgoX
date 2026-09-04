import express from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.middleware.js";
import { uploadAndGenerateQuiz, submitQuizAnswers, generateSampleQuiz, generateQuizFromResource, getQuizAttempts } from "../controllers/quiz.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max limit for large presentations
  fileFilter: (req, file, cb) => {
    const isExtAllowed = /\.(pdf|pptx|ppt|docx|doc|txt|xlsx|xls|csv|json|md|rtf)$/i.test(file.originalname);
    if (isExtAllowed || file.mimetype.includes("presentation") || file.mimetype.includes("pdf") || file.mimetype.includes("officedocument") || file.mimetype.includes("text") || file.mimetype.includes("stream")) {
      cb(null, true);
    } else {
      cb(null, true); // Permissive upload to prevent client rejection
    }
  },
});

const router = express.Router();

router.get("/attempts", requireAuth, getQuizAttempts);
router.post("/upload", requireAuth, upload.single("file"), uploadAndGenerateQuiz);
router.post("/sample", requireAuth, generateSampleQuiz);
router.post("/from-resource", requireAuth, generateQuizFromResource);
router.post("/submit", requireAuth, submitQuizAnswers);

export default router;