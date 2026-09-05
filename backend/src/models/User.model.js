import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    designation: String,
    post: { type: String, default: "Statistical Officer" },
    department: String,
    experienceYears: Number,
    qualifications: [String],
    pastTrainings: [String],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);