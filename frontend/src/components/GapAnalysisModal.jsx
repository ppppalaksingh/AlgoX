import { useState } from "react";
import { X, Sparkles, AlertCircle, CheckCircle2, TrendingUp, BookOpen, ArrowRight, ShieldCheck, Download, Award, Bot, RefreshCw } from "lucide-react";

export default function GapAnalysisModal({ isOpen, onClose, analysisData, onStartCourse, user }) {
  if (!isOpen) return null;

  const domainScores = analysisData?.domainScores || {
    statistical: 1.2,
    technical: 1.0,
    digitalGovernance: 1.0,
    behavioural: 1.2,
  };

  const domainTargets = analysisData?.domainTargets || {
    statistical: 4.0,
    technical: 3.8,
    digitalGovernance: 3.5,
    behavioural: 3.8,
  };

  const domainMeta = {
    statistical: { name: "Statistical Competencies", color: "blue" },
    technical: { name: "Technical & Analytics", color: "orange" },
    digitalGovernance: { name: "Digital Governance", color: "emerald" },
    behavioural: { name: "Behavioural & Leadership", color: "purple" },
  };

  const overallReadiness = analysisData?.overallReadiness ?? 25;
  const highestGap = analysisData?.highestGap || {
    displayName: "Technical & Analytics",
    gap: 2.8,
    current: 1.0,
    required: 3.8,
  };

  const topStrength = analysisData?.topStrength || {
    displayName: "Statistical Competencies",
    current: 4.0,
    required: 4.0,
  };

  const aiInsight = analysisData?.aiExecutiveInsight ||
    `Evaluated against official MoSPI Framework: Your statistical foundational competencies meet national benchmarks. Enrolling in accredited NSSTA TPAC modules in data scrutiny and DPDP compliance is recommended to attain 100% cadre readiness.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900 p-6 text-white flex items-start justify-between relative shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur-xs">
                <Sparkles size={12} /> Python ML Engine v2.4 (Adaptive)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[11px] font-bold border border-emerald-300/30">
                MoSPI Framework Active
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight">AI Competency &amp; Gap Impact Report</h2>
            <p className="text-xs text-blue-100">
              Evaluated for: <strong className="text-white">{user?.name || "Officer"}</strong> • {analysisData?.matchedDesignation || "Assistant Director"} ({analysisData?.department || "NSO"})
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/40">
          {/* 3 Dynamic Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center gap-3 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">Overall Readiness</p>
                <p className="text-2xl font-black text-slate-800">{overallReadiness}%</p>
                <p className="text-[10px] text-slate-500">Against Cadre Target</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 flex items-center gap-3 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                <AlertCircle size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider">Highest Gap Area</p>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {highestGap.displayName}
                </p>
                <p className="text-[11px] text-rose-600 font-bold">
                  {highestGap.gap > 0 ? `Gap: -${highestGap.gap} Level` : "Benchmark Met ✓"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-3 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                <CheckCircle2 size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Top Strength</p>
                <p className="text-sm font-bold text-slate-800 truncate">{topStrength.displayName}</p>
                <p className="text-[11px] text-emerald-700 font-bold">
                  {topStrength.current >= topStrength.required ? `Exceeded (${topStrength.current}/${topStrength.required})` : `Score: ${topStrength.current}/5.0`}
                </p>
              </div>
            </div>
          </div>

          {/* Domain Breakdown Chart / Comparison Bars */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck size={17} className="text-blue-600" /> Domain Competency Levels (Current vs MoSPI Target)
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> Current
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span> Cadre Target
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              {Object.entries(domainScores).map(([domainKey, score]) => {
                const meta = domainMeta[domainKey] || { name: domainKey, color: "blue" };
                const target = domainTargets[domainKey] || 3.5;
                const current = Number(score);
                const percent = Math.min(100, Math.round((current / 5.0) * 100));
                const targetPercent = Math.min(100, Math.round((target / 5.0) * 100));
                const gap = Math.max(0, target - current).toFixed(1);

                return (
                  <div key={domainKey} className="space-y-1.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{meta.name}</span>
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-500 text-[11px]">
                          Current: <strong className="text-slate-800 font-extrabold">{current.toFixed(1)}</strong> / 5.0
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-slate-500 text-[11px]">
                          Target: <strong className="text-blue-600 font-extrabold">{target.toFixed(1)}</strong> / 5.0
                        </span>
                        {gap > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                            Gap -{gap}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
                            Met ✓
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Fill */}
                    <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-500 z-10"
                        style={{ left: `${targetPercent}%` }}
                        title={`Target: ${target}/5.0`}
                      />
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          current >= target ? "bg-emerald-500" : "bg-gradient-to-r from-blue-500 to-indigo-600"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Executive Diagnostic Commentary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2 shadow-2xs">
            <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
              <Bot size={16} className="text-amber-600" /> AI Executive Diagnostic Commentary
            </h4>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              {aiInsight}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Download size={14} /> Print / Export Official Report
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartCourse?.();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <BookOpen size={14} /> Bridge Gaps with iGOT / TPAC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
