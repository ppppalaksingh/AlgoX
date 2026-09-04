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
          <h1 className="text-lg sm:text-xl font-bold text-slate-800">Identified Competency Gaps</h1>
          <p className="text-sm text-slate-500">
            Skills ranked by deficiency gap — prioritised for your official development roadmap.
          </p>
        </div>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
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
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedDomain === dom
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-4">Skill &amp; Competency</div>
          <div className="col-span-3">Domain</div>
          <div className="col-span-2 text-center">Current Level</div>
          <div className="col-span-1 text-center">Required</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredGaps.map((g) => (
            <div key={g.id} className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
              <div className="col-span-2 sm:col-span-4 flex items-center gap-2.5 min-w-0">
                {g.gap >= 2 ? (
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertTriangle size={15} />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertTriangle size={15} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{g.skill}</p>
                  <span className="text-[11px] font-medium text-rose-600 sm:hidden">Gap: -{g.gap}</span>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-3">
                <span className="text-xs px-2.5 py-1 bg-slate-100 rounded-full text-slate-600 font-medium">{g.domain}</span>
              </div>

              <div className="col-span-1 sm:col-span-2 text-left sm:text-center text-xs font-semibold text-slate-700">
                <span className="sm:hidden text-slate-400 mr-1">Current:</span>
                {g.currentLevel} / 5.0
              </div>

              <div className="col-span-1 sm:col-span-1 text-left sm:text-center text-xs font-semibold text-slate-700">
                <span className="sm:hidden text-slate-400 mr-1">Target:</span>
                {g.requiredLevel} / 5.0
              </div>

              <div className="col-span-1 sm:col-span-2 flex justify-end">
                <button
                  onClick={() => onStartCourseForGap?.(g)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
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