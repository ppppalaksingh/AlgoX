import { useState } from "react";
import { Route, CheckCircle2, PlayCircle, Clock, Award, Sparkles, ChevronRight, Lock } from "lucide-react";

export default function LearningPathView({ onStartCourse, pathProgress = 25 }) {
  const [stages, setStages] = useState([
    {
      id: 1,
      title: "Stage 1: Statistical Foundations & Survey Sampling",
      description: "Master survey design, sampling strategies, and official census standards.",
      status: "Completed",
      duration: "4 hours",
      competency: "Statistical Competency",
      modules: [
        { id: "m1", title: "Introduction to Official Statistics", done: true },
        { id: "m2", title: "Sampling Techniques & Survey Weighting", done: true },
        { id: "m3", title: "Data Quality & Validation Standards", done: true },
      ],
    },
    {
      id: 2,
      title: "Stage 2: Python & Data Processing for Civil Services",
      description: "Automate government dataset cleaning, ETL workflows, and statistical pipelines.",
      status: "In Progress",
      duration: "6 hours",
      competency: "Technical Competency",
      modules: [
        { id: "m4", title: "Pandas & NumPy for Government Tables", done: true },
        { id: "m5", title: "Handling Missing & Noisy Survey Data", done: false },
        { id: "m6", title: "Automated Report Generation", done: false },
      ],
    },
    {
      id: 3,
      title: "Stage 3: Interactive Dashboards & Data Visualization",
      description: "Design executive dashboards and geospatial maps for policy makers.",
      status: "Upcoming",
      duration: "5 hours",
      competency: "Digital Governance",
      modules: [
        { id: "m7", title: "GIS Mapping for District Data", done: false },
        { id: "m8", title: "Chart Selection & Storytelling with Data", done: false },
        { id: "m9", title: "Executive KPI Dashboarding", done: false },
      ],
    },
    {
      id: 4,
      title: "Stage 4: AI & Machine Learning in Public Governance",
      description: "Leverage ML models for predictive policymaking and anomaly detection.",
      status: "Locked",
      duration: "8 hours",
      competency: "Advanced Analytics",
      modules: [
        { id: "m10", title: "Predictive Analytics in Social Schemes", done: false },
        { id: "m11", title: "Security & Ethics in Public Sector AI", done: false },
        { id: "m12", title: "Capstone: Ministry Policy Simulator", done: false },
      ],
    },
  ]);

  const handleToggleModule = (stageIdx, modIdx) => {
    setStages((prev) => {
      const next = [...prev];
      const stage = { ...next[stageIdx] };
      const mods = [...stage.modules];
      mods[modIdx] = { ...mods[modIdx], done: !mods[modIdx].done };
      stage.modules = mods;
      next[stageIdx] = stage;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-blue-900 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={16} /> AI-Recommended Personalized Journey
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Data Leadership in Official Statistics</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Curated specifically for your role based on competency gap analysis. Complete all 4 stages to earn the Master Data Practitioner credential.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-48 text-center shrink-0">
            <span className="text-xs text-slate-300 font-medium">Path Completion</span>
            <div className="text-2xl font-bold text-white mt-0.5">{pathProgress}%</div>
            <div className="w-full h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${pathProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Roadmap */}
      <div className="space-y-4">
        {stages.map((stage, sIdx) => {
          const isCompleted = stage.status === "Completed";
          const isInProgress = stage.status === "In Progress";
          const isLocked = stage.status === "Locked";

          return (
            <div
              key={stage.id}
              className={`bg-white rounded-2xl border transition-all p-6 ${
                isInProgress
                  ? "border-blue-300 ring-2 ring-blue-500/10 shadow-sm"
                  : isCompleted
                  ? "border-slate-200 bg-slate-50/40"
                  : "border-slate-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : isInProgress
                        ? "bg-blue-600 text-white"
                        : isLocked
                        ? "bg-slate-100 text-slate-400"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={18} /> : stage.id}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800 text-base">{stage.title}</h3>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isInProgress
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {stage.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{stage.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={13} /> {stage.duration}
                  </span>
                </div>
              </div>

              {/* Modules list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                {stage.modules.map((m, mIdx) => (
                  <button
                    key={m.id}
                    onClick={() => handleToggleModule(sIdx, mIdx)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      m.done
                        ? "bg-emerald-50/50 border-emerald-200 text-slate-800"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="truncate">{m.title}</span>
                    {m.done ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              {isInProgress && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => onStartCourse?.({ title: stage.title, domain: stage.competency, color: "blue" })}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <PlayCircle size={15} /> Resume Stage Modules
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
