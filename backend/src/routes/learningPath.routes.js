import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { startLearningPath } from "../controllers/learningPath.controller.js";

const router = express.Router();

router.post("/start", requireAuth, startLearningPath);

export default router;