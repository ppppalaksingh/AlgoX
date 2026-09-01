import { useState } from "react";
import { X, Sparkles, AlertCircle, CheckCircle2, TrendingUp, BookOpen, ArrowRight, ShieldCheck, Download, Award } from "lucide-react";

export default function GapAnalysisModal({ isOpen, onClose, analysisData, onStartCourse, user }) {
  if (!isOpen) return null;

  const domainScores = analysisData?.domainScores || {
    statistical: 3.5,
    technical: 3.6,
    digitalGovernance: 2.4,
    behavioural: 2.4,
  };

  const skillGaps = analysisData?.skillGaps || [
    { skillName: "behavioural", currentLevel: 2.4, requiredLevel: 3.0, gap: 0.6 },
    { skillName: "statistical", currentLevel: 3.5, requiredLevel: 4.0, gap: 0.5 },
    { skillName: "technical", currentLevel: 3.6, requiredLevel: 3.0, gap: 0 },
    { skillName: "digitalGovernance", currentLevel: 2.4, requiredLevel: 2.0, gap: 0 },
  ];

  const domainMeta = {
    statistical: { name: "Statistical Competencies", color: "blue", target: 4.0 },
    technical: { name: "Technical & Analytics", color: "orange", target: 3.0 },
    digitalGovernance: { name: "Digital Governance", color: "emerald", target: 2.0 },
    behavioural: { name: "Behavioural & Leadership", color: "purple", target: 3.0 },
  };

  // Calculate Overall Readiness
  const scores = Object.values(domainScores);
  const avgCurrent = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
  const overallReadiness = Math.round((avgCurrent / 4.0) * 100);

  // Find biggest gap
  const highestGap = skillGaps.find((g) => g.gap > 0) || skillGaps[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white flex items-start justify-between relative shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold flex items-center gap-1 backdrop-blur-xs">
                <Sparkles size={12} /> Python ML Engine v2.4
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[11px] font-semibold">
                MoSPI Framework Active
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">AI Competency &amp; Gap Impact Report</h2>
            <p className="text-xs text-blue-100">
              Evaluated for: <span className="font-semibold text-white">{user?.name || "Officer"}</span> • Assistant Director (NSO)
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-blue-700 uppercase tracking-wider">Overall Readiness</p>
                <p className="text-xl font-extrabold text-slate-800">{overallReadiness}%</p>
                <p className="text-[11px] text-slate-500">Based on 4 Core Domains</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-rose-700 uppercase tracking-wider">Highest Gap Area</p>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {domainMeta[highestGap?.skillName]?.name || highestGap?.skillName || "None"}
                </p>
                <p className="text-[11px] text-rose-600 font-semibold">Gap: -{highestGap?.gap || 0} Level</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Top Strength</p>
                <p className="text-sm font-bold text-slate-800">Technical &amp; Analytics</p>
                <p className="text-[11px] text-emerald-700 font-semibold">Target Exceeded (3.6/3.0)</p>
              </div>
            </div>
          </div>

          {/* Domain Breakdown Chart / Bars */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-600" /> Domain Competency Levels (Current vs MoSPI Target)
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> Current Level
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span> Target Level
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(domainScores).map(([domainKey, score]) => {
                const meta = domainMeta[domainKey] || { name: domainKey, color: "blue", target: 3.0 };
                const target = meta.target;
                const current = Number(score);
                const percent = Math.min(100, Math.round((current / 5.0) * 100));
                const targetPercent = Math.min(100, Math.round((target / 5.0) * 100));
                const gap = Math.max(0, target - current).toFixed(1);

                return (
                  <div key={domainKey} className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{meta.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">
                          Current: <strong className="text-slate-800 font-bold">{current.toFixed(1)}</strong> / 5.0
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-500">
                          Target: <strong className="text-blue-600 font-bold">{target.toFixed(1)}</strong> / 5.0
                        </span>
                        {gap > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
                            Gap -{gap}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            Met ✓
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Visual Comparison Progress Bars */}
                    <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      {/* Target Indicator Marker */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                        style={{ left: `${targetPercent}%` }}
                        title={`Target: ${target}/5`}
                      />
                      {/* Current Fill */}
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          current >= target ? "bg-emerald-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Recommendations & Impact Insights */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
              <Sparkles size={14} className="text-amber-600" /> AI Executive Insight &amp; Roadmap Suggestion
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Based on your 4 years of experience and past statistical sampling trainings, your <strong>Technical &amp; Analytics</strong> baseline is strong (3.6/3.0). To qualify for Senior Statistical Officer / Joint Director benchmarks, prioritising <strong>Behavioural Leadership</strong> and <strong>Data Storytelling</strong> on iGOT Karmayogi is recommended.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              window.print();
            }}
            className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download size={14} /> Print / Export Report
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartCourse?.();
              }}
              className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <BookOpen size={14} /> Bridge Gaps with iGOT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
