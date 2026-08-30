import { useState } from "react";
import { Sparkles } from "lucide-react";
import Login from "./components/Login";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsGrid from "./components/StatsGrid";
import SkillGapOverview from "./components/SkillGapOverview";
import RecommendedPath from "./components/RecommendedPath";
import AIQuizGenerator from "./components/AIQuizGenerator";
import ProgressWidget from "./components/ProgressWidget";
import ContinueLearning from "./components/ContinueLearning";

import {
  overviewStats,
  skillGaps,
  recommendedPath,
  progressSummary,
  continueLearningCourses,
} from "./data/dashboardData";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeNav, setActiveNav] = useState("dashboard");

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // --- These are placeholder handlers. -------------------------------------
  // The backend team can replace the bodies of these functions with real
  // API calls (fetch/axios) without touching any component above.
  const handleStartLearningPath = () => {
    console.log("TODO: call backend to start/continue the learning path");
  };
  const handleQuizUpload = (file) => {
    console.log("TODO: upload file to backend for AI quiz generation:", file);
  };
  const handleGenerateSample = () => {
    console.log("TODO: call backend to generate a sample quiz");
  };
  // ---------------------------------------------------------------------

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar activeItem={activeNav} onNavigate={setActiveNav} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header user={user} />

        <main className="flex-1 p-6 space-y-6">
          {/* Greeting */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Good Morning, {user.name}! 👋
              </h1>
              <p className="text-sm text-slate-500">
                Continue your personalized learning journey.
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
              <Sparkles size={14} /> AI-Powered
            </span>
          </div>

          {/* Top stat cards */}
          <StatsGrid stats={overviewStats} />

          {/* Middle row: skill gaps / recommended path / AI quiz + progress */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            <div className="xl:col-span-1">
              <SkillGapOverview skills={skillGaps} />
            </div>

            <div className="xl:col-span-1">
              <RecommendedPath path={recommendedPath} onStart={handleStartLearningPath} />
            </div>

            <div className="xl:col-span-1 space-y-6">
              <AIQuizGenerator onUpload={handleQuizUpload} onGenerateSample={handleGenerateSample} />
              <ProgressWidget summary={progressSummary} />
            </div>
          </div>

          {/* Continue learning */}
          <ContinueLearning courses={continueLearningCourses} />
        </main>
      </div>
    </div>
  );
}
