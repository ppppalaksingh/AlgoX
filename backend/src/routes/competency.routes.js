import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { runGapAnalysis, getMyCompetencyProfile } from "../controllers/competency.controller.js";

const router = express.Router();

router.post("/analyze", requireAuth, runGapAnalysis);
router.get("/me", requireAuth, getMyCompetencyProfile);

export default router;