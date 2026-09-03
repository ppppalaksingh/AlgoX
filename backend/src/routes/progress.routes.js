import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getMyProgress, completeCourse } from "../controllers/progress.controller.js";

const router = express.Router();

router.get("/", requireAuth, getMyProgress);
router.post("/complete-course", requireAuth, completeCourse);

export default router;
