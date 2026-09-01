import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    mimetype: { type: String },
    size: { type: Number },
    summary: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
