import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getRecommendedCourses, getAllCourses } from "../controllers/course.controller.js";

const router = express.Router();

router.get("/", requireAuth, getAllCourses);
router.get("/recommended", requireAuth, getRecommendedCourses);

export default router;