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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c101d] w-full max-w-3xl rounded-3xl shadow-2xl border border-white/[0.12] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 text-white flex items-start justify-between relative shrink-0 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-[11px] font-bold flex items-center gap-1">
                <Sparkles size={12} className="text-blue-400" /> Python ML Engine v2.4 (Adaptive)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-bold border border-emerald-500/25">
                MoSPI Framework Active
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-white mt-1">AI Competency &amp; Gap Impact Report</h2>
            <p className="text-xs text-slate-400">
              Evaluated for: <strong className="text-white">{user?.name || "Officer"}</strong> • {analysisData?.matchedDesignation || "Assistant Director"} ({analysisData?.department || "NSO"})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#07090e]/40">
          {/* 3 Dynamic Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-3xl bg-[#0f1422] border border-white/[0.08] flex items-center gap-3.5 shadow-xl">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/25 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-blue-300 uppercase tracking-wider">Overall Readiness</p>
                <p className="text-2xl font-black text-white">{overallReadiness}%</p>
                <p className="text-[10px] text-slate-400">Against Cadre Target</p>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-[#0f1422] border border-white/[0.08] flex items-center gap-3.5 shadow-xl">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/25 text-rose-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner">
                <AlertCircle size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-rose-300 uppercase tracking-wider">Highest Gap Area</p>
                <p className="text-sm font-bold text-white truncate">
                  {highestGap.displayName}
                </p>
                <p className="text-[11px] text-rose-400 font-bold">
                  {highestGap.gap > 0 ? `Gap: -${highestGap.gap} Level` : "Benchmark Met ✓"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-[#0f1422] border border-white/[0.08] flex items-center gap-3.5 shadow-xl">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner">
                <CheckCircle2 size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider">Top Strength</p>
                <p className="text-sm font-bold text-white truncate">{topStrength.displayName}</p>
                <p className="text-[11px] text-emerald-400 font-bold">
                  {topStrength.current >= topStrength.required ? `Exceeded (${topStrength.current}/${topStrength.required})` : `Score: ${topStrength.current}/5.0`}
                </p>
              </div>
            </div>
          </div>

          {/* Domain Breakdown Chart / Comparison Bars */}
          <div className="bg-[#0f1422] rounded-3xl p-5 sm:p-6 border border-white/[0.08] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck size={17} className="text-blue-400" /> Domain Competency Levels (Current vs MoSPI Target)
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shadow-sm"></span> Current
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/30 inline-block"></span> Cadre Target
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
                  <div key={domainKey} className="space-y-1.5 bg-white/[0.03] p-3.5 rounded-2xl border border-white/[0.06]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{meta.name}</span>
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-400 text-[11px]">
                          Current: <strong className="text-white font-extrabold">{current.toFixed(1)}</strong> / 5.0
                        </span>
                        <span className="text-white/20">|</span>
                        <span className="text-slate-400 text-[11px]">
                          Target: <strong className="text-blue-400 font-extrabold">{target.toFixed(1)}</strong> / 5.0
                        </span>
                        {gap > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/25 text-[10px] font-extrabold">
                            Gap -{gap}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[10px] font-extrabold">
                            Met ✓
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Fill */}
                    <div className="relative w-full h-3 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-10"
                        style={{ left: `${targetPercent}%` }}
                        title={`Target: ${target}/5.0`}
                      />
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          current >= target ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-blue-600 to-indigo-500"
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
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-2 shadow-xl">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Bot size={16} className="text-amber-400" /> AI Executive Diagnostic Commentary
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {aiInsight}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white/[0.02] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Download size={14} /> Print / Export Official Report
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onStartCourse?.();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <BookOpen size={14} /> Bridge Gaps with iGOT / TPAC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
