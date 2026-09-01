import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sourceFileName: String,
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: String,
        explanation: String,
      },
    ],
    score: Number,
    totalQuestions: Number,
  },
  { timestamps: true }
);

export default mongoose.model("QuizAttempt", quizAttemptSchema);