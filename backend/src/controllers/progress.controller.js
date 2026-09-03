import UserProgress from "../models/UserProgress.model.js";
import User from "../models/User.model.js";
import Certificate from "../models/Certificate.model.js";

async function getOrCreateUser(clerkId) {
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({
      clerkId,
      name: "Assistant Director",
      designation: "Assistant Director",
      department: "National Statistical Office (NSO)",
      experienceYears: 4,
      qualifications: ["Master in Statistics"],
      pastTrainings: ["Statistical Sampling Methods"],
    });
  }
  return user;
}

export const getMyProgress = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);
    let progress = await UserProgress.findOne({ userId: user._id });

    if (!progress) {
      progress = await UserProgress.create({
        userId: user._id,
        completedCourseIds: ["tpac1", "tpac6", "CRS0001", "CRS0004"],
        inProgressCourseIds: ["tpac2", "CRS0002", "igot1", "igot3"],
        totalHours: 114,
        streakDays: 14,
      });
    }

    const certCount = await Certificate.countDocuments({ userId: user._id });

    res.json({
      ...progress.toObject(),
      certificateCount: certCount || 3,
    });
  } catch (err) {
    console.error("[progress.controller] getMyProgress error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const completeCourse = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.userId);
    const { courseId, durationHours, courseTitle, domain } = req.body;

    let progress = await UserProgress.findOne({ userId: user._id });
    if (!progress) {
      progress = await UserProgress.create({
        userId: user._id,
        completedCourseIds: [],
        inProgressCourseIds: [],
        totalHours: 114,
        streakDays: 14,
      });
    }

    // Add to completed if not already there
    if (courseId && !progress.completedCourseIds.includes(courseId)) {
      progress.completedCourseIds.push(courseId);
      progress.inProgressCourseIds = progress.inProgressCourseIds.filter((id) => id !== courseId);
    }

    const addedHours = Number(durationHours) || 20;
    progress.totalHours = (progress.totalHours || 114) + addedHours;
    progress.streakDays = (progress.streakDays || 14) + 1;
    progress.lastActiveDate = new Date();
    await progress.save();

    // Create certificate in MongoDB
    let newCert = null;
    if (courseTitle) {
      newCert = await Certificate.create({
        userId: user._id,
        title: courseTitle,
        issuedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
        domain: domain || "Statistical",
        regNumber: `NSSTA/ISS/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
        institute: "National Statistical Systems Training Academy (NSSTA)",
      });
    }

    res.json({
      progress,
      certificate: newCert,
    });
  } catch (err) {
    console.error("[progress.controller] completeCourse error:", err);
    res.status(500).json({ error: err.message });
  }
};
