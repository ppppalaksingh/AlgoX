import { useState } from "react";
import { AlertTriangle, Sparkles, BookOpen, ArrowRight, Loader2 } from "lucide-react";

export default function SkillGaps({ gaps, onStartCourseForGap, onRunAnalysis, isAnalyzing }) {
  const [selectedDomain, setSelectedDomain] = useState("All");

  const domains = ["All", "Digital Governance", "Technical", "Statistical", "Behavioural"];

  const filteredGaps = (gaps || []).filter((g) => {
    if (selectedDomain === "All") return true;
    const gDom = (g.domain || "").toLowerCase();
    const selDom = selectedDomain.toLowerCase();
    return gDom.includes(selDom) || selDom.includes(gDom);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Cadre Diagnostic</span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Identified Competency Gaps</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Skills ranked by deficiency gap — prioritised for your official development roadmap.
          </p>
        </div>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-60 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_18px_rgba(99,102,241,0.35)] self-start sm:self-auto"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Analyzing via ML...
            </>
          ) : (
            <>
              <Sparkles size={15} /> Run Fresh AI Analysis
            </>
          )}
        </button>
      </div>

      {/* Domain Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDomain === dom
                ? "bg-white text-slate-900 shadow-md font-bold"
                : "bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]"
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0f1422]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative">
        {/* Top edge glow sheen */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-white/[0.02] border-b border-white/[0.08] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-4">Skill &amp; Competency</div>
          <div className="col-span-3">Domain</div>
          <div className="col-span-2 text-center">Current Level</div>
          <div className="col-span-1 text-center">Required</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {filteredGaps.map((g) => (
            <div key={g.id} className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition-colors">
              <div className="col-span-2 sm:col-span-4 flex items-center gap-3 min-w-0">
                {g.gap >= 2 ? (
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                    <AlertTriangle size={15} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <AlertTriangle size={15} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-white truncate">{g.skill}</p>
                  <span className="text-[11px] font-medium text-rose-400 sm:hidden">Gap: -{g.gap}</span>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-3">
                <span className="text-[11px] px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-slate-300 font-medium">{g.domain}</span>
              </div>

              <div className="col-span-1 sm:col-span-2 text-left sm:text-center text-xs font-semibold text-slate-200">
                <span className="sm:hidden text-slate-400 mr-1">Current:</span>
                {g.currentLevel} / 5.0
              </div>

              <div className="col-span-1 sm:col-span-1 text-left sm:text-center text-xs font-semibold text-slate-200">
                <span className="sm:hidden text-slate-400 mr-1">Target:</span>
                {g.requiredLevel} / 5.0
              </div>

              <div className="col-span-1 sm:col-span-2 flex justify-end">
                <button
                  onClick={() => onStartCourseForGap?.(g)}
                  className="px-3.5 py-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                >
                  <BookOpen size={13} /> Bridge Gap
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}