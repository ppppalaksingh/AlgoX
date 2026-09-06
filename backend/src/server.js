import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

import path from "path";
import mongoose from "mongoose";
import axios from "axios";
import competencyRoutes from "./routes/competency.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import courseRoutes from "./routes/course.routes.js";
import userRoutes from "./routes/user.routes.js";
import learningPathRoutes from "./routes/learningPath.routes.js";
import documentRoutes from "./routes/document.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import progressRoutes from "./routes/progress.routes.js";

connectDB();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Serve uploaded documents statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/competency", competencyRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/learning-path", learningPathRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/progress", progressRoutes);

app.get("/api/health", async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const mlUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";
  let mlStatus = "disconnected";
  let mlError = null;

  try {
    const mlCheck = await axios.get(`${mlUrl}/docs`, { timeout: 3000 });
    if (mlCheck.status === 200) {
      mlStatus = "connected";
    }
  } catch (err) {
    mlError = err.message;
  }

  res.json({
    status: mongoStatus === "connected" && mlStatus === "connected" ? "healthy" : "degraded",
    database: mongoStatus,
    mlService: {
      status: mlStatus,
      url: mlUrl,
      error: mlError,
    },
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => res.send("AlgoX Official Statistics Platform backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));