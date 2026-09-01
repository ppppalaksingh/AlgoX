import mongoose from "mongoose";

const competencyProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    domainScores: {
      statistical: { type: Number, default: 0 },
      technical: { type: Number, default: 0 },
      digitalGovernance: { type: Number, default: 0 },
      behavioural: { type: Number, default: 0 },
    },
    skillGaps: [
      {
        skillName: String,
        currentLevel: Number,
        requiredLevel: Number,
        gap: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("CompetencyProfile", competencyProfileSchema);