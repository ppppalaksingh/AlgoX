import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { createOrUpdateProfile, getMyProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/profile", requireAuth, createOrUpdateProfile);
router.get("/profile", requireAuth, getMyProfile);

export default router;