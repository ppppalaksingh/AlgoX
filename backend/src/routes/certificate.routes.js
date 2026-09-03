import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getMyCertificates, createCertificate } from "../controllers/certificate.controller.js";

const router = express.Router();

router.get("/", requireAuth, getMyCertificates);
router.post("/", requireAuth, createCertificate);

export default router;
