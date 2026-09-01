import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import Document from "../models/Document.model.js";
import User from "../models/User.model.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) return res.json([]);

    const docs = await Document.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    await Document.findOneAndDelete({ _id: req.params.id, userId: user._id });
    res.json({ success: true, message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
