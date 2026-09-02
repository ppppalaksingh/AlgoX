import express from "express";
import { handleMentorChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", handleMentorChat);

export default router;
