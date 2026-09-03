import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import path from "path";
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

dotenv.config();
connectDB();

const app = express();
app.use(cors());
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

app.get("/", (req, res) => res.send("AlgoX Official Statistics Platform backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));