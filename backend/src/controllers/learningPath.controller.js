import User from "../models/User.model.js";

async function getOrCreateUser(clerkId) {
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({
      clerkId,
      name: "Learner",
      designation: "Assistant Director",
      department: "Data & Statistics",
      experienceYears: 4,
      qualifications: ["Data Analytics", "Civil Services Foundation"],
      pastTrainings: ["iGOT Basics", "Statistical Methods"],
    });
  }
  return user;
}

export const startLearningPath = async (req, res) => {
  try {
    const { courseId } = req.body || {};
    const user = await getOrCreateUser(req.userId);

    res.json({
      success: true,
      message: "Learning path started successfully",
      courseId: courseId || "data-governance-101",
      userId: user._id,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[learningPath.controller] error:", err.message);
    res.status(500).json({ error: err.message });
  }
};