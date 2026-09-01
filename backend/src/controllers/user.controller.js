import User from "../models/User.model.js";

// Called once after signup to build the official's profile
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { name, email, designation, department, experienceYears, qualifications, pastTrainings } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId: req.userId },
      { name, email, designation, department, experienceYears, qualifications, pastTrainings },
      { upsert: true, new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });
    if (!user) return res.status(404).json({ error: "Profile not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};