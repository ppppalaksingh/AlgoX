import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  domain: String,
  level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  igotCourseId: String,
});

export default mongoose.model("Course", courseSchema);