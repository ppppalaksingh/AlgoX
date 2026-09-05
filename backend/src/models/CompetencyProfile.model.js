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
    domainTargets: {
      statistical: { type: Number, default: 4.0 },
      technical: { type: Number, default: 4.0 },
      digitalGovernance: { type: Number, default: 3.0 },
      behavioural: { type: Number, default: 4.0 },
    },
    overallReadiness: { type: Number, default: 25 },
    highestGap: { type: mongoose.Schema.Types.Mixed },
    topStrength: { type: mongoose.Schema.Types.Mixed },
    aiExecutiveInsight: { type: String },
    skillGaps: [
      {
        skillName: String,
        currentLevel: Number,
        requiredLevel: Number,
        gap: Number,
      },
    ],
    subCompetencies: [
      {
        domain: String,
        subCompetency: String,
        current: Number,
        required: Number,
        gap: Number,
      },
    ],
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("CompetencyProfile", competencyProfileSchema);