import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import "dotenv/config";
import mongoose from "mongoose";

async function reset() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const tarunId = new mongoose.Types.ObjectId("6a9a8d3bcb927a5f375a8bcd");

  const Cert = mongoose.model("Certificate", new mongoose.Schema({}, { strict: false }));
  const Progress = mongoose.model("UserProgress", new mongoose.Schema({}, { strict: false }));
  const Competency = mongoose.model("CompetencyProfile", new mongoose.Schema({}, { strict: false }));
  const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));

  const certsCount = await Cert.countDocuments({ userId: tarunId });
  const progress = await Progress.findOne({ userId: tarunId });
  const comp = await Competency.findOne({ userId: tarunId });
  const user = await User.findById(tarunId);

  console.log("User before reset:", { name: user?.name, exp: user?.experienceYears, pastTrainings: user?.pastTrainings });
  console.log("Certs before reset:", certsCount);
  console.log("Progress before reset:", { hours: progress?.totalHours, completed: progress?.completedCourseIds });
  console.log("Competency before reset:", { readiness: comp?.overallReadiness, scores: comp?.domainScores });

  const Quiz = mongoose.model("QuizAttempt", new mongoose.Schema({}, { strict: false }));

  // 1. Delete all certificates & quiz attempts for this user ID
  await Cert.deleteMany({ userId: tarunId });
  await Quiz.deleteMany({ userId: tarunId });

  // 2. Reset progress
  await Progress.findOneAndUpdate(
    { userId: tarunId },
    {
      completedCourseIds: [],
      inProgressCourseIds: [],
      totalHours: 0,
      streakDays: 0,
      lastActiveDate: new Date()
    },
    { upsert: true }
  );

  // 3. Reset user qualifications and experience to 0
  await User.findByIdAndUpdate(tarunId, {
    experienceYears: 0,
    qualifications: [],
    pastTrainings: []
  });

  // 4. Reset competency profile to baseline (23% readiness, 1.0 domain scores)
  await Competency.findOneAndUpdate(
    { userId: tarunId },
    {
      overallReadiness: 23,
      domainScores: {
        statistical: 1.0,
        technical: 1.0,
        digitalGovernance: 1.0,
        behavioural: 1.0
      },
      highestGap: {
        skillName: "Statistical Analysis",
        gap: 3.0
      }
    },
    { upsert: true }
  );

  console.log("✅ Successfully deleted certificates and reset courses/progress for Tarun!");
  process.exit(0);
}

reset().catch(err => {
  console.error("Error resetting:", err);
  process.exit(1);
});
