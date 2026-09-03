import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    issuedDate: { type: String, required: true },
    domain: { type: String, default: "Statistical" },
    regNumber: { type: String },
    institute: { type: String, default: "National Statistical Systems Training Academy (NSSTA)" },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
