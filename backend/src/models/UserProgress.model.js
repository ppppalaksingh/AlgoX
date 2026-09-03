import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    completedCourseIds: [{ type: String }],
    inProgressCourseIds: [{ type: String }],
    totalHours: { type: Number, default: 114 },
    streakDays: { type: Number, default: 14 },
    lastActiveDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("UserProgress", userProgressSchema);
