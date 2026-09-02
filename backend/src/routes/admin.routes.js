import express from "express";
import { getAdminAnalytics, checkAdminAccess, registerNewAdmin, getAllOfficialsData } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/analytics", getAdminAnalytics);
router.get("/check-access", checkAdminAccess);
router.post("/check-access", checkAdminAccess);
router.post("/register", registerNewAdmin);
router.get("/officials", getAllOfficialsData);

export default router;
