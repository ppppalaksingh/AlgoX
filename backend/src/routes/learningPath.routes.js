import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { startLearningPath, completeLearningPath } from "../controllers/learningPath.controller.js";

const router = express.Router();

router.post("/start", requireAuth, startLearningPath);
router.post("/complete", requireAuth, completeLearningPath);

export default router;