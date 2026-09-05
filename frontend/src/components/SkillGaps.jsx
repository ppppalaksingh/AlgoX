import { useState } from "react";
import { AlertTriangle, Sparkles, BookOpen, ArrowRight, Loader2, Layers, ChevronRight, Info } from "lucide-react";

const TAXONOMY_MAP = {
  statistical: { type: "Domain-specific", color: "text-blue-300 bg-blue-500/15 border-blue-500/25", nssta: "Official Statistics & Survey Methodologies" },
  technical: { type: "Functional", color: "text-indigo-300 bg-indigo-500/15 border-indigo-500/25", nssta: "Statistical Computing & Modern Analytics" },
  digitalgovernance: { type: "Functional", color: "text-purple-300 bg-purple-500/15 border-purple-500/25", nssta: "Digital Government & Data Security" },
  behavioural: { type: "Behavioural", color: "text-emerald-300 bg-emerald-500/15 border-emerald-500/25", nssta: "Management, Leadership & Workplace" },
};

function getCompetencyMeta(domain, rawType, rawNssta) {
  const norm = (domain || "").toLowerCase().replace(/[^a-z]/g, "");
  let match = TAXONOMY_MAP.statistical;
  if (norm.includes("tech")) match = TAXONOMY_MAP.technical;
  else if (norm.includes("digit") || norm.includes("gov")) match = TAXONOMY_MAP.digitalgovernance;
  else if (norm.includes("behav") || norm.includes("lead")) match = TAXONOMY_MAP.behavioural;

  return {
    type: rawType ? (rawType.includes("Domain") ? "Domain-specific" : rawType.includes("Behaviour") ? "Behavioural" : "Functional") : match.type,
    color: match.color,
    nssta: rawNssta || match.nssta,
  };
}

export default function SkillGaps({ gaps, onStartCourseForGap, onRunAnalysis, isAnalyzing }) {
  const [selectedDomain, setSelectedDomain] = useState("All");

  const domains = ["All", "Digital Governance", "Technical", "Statistical", "Behavioural"];

  const filteredGaps = (gaps || []).map((g) => {
    const meta = getCompetencyMeta(g.domain || g.skill, g.competencyType, g.nsstaCategory);
    return { ...g, ...meta };
  }).filter((g) => {
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

      {/* MoSPI & NSSTA Alignment Pipeline Ribbon */}
      <div className="bg-[#0c101d]/90 rounded-3xl p-5 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden shadow-lg space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
            <Layers size={12} className="text-indigo-400" /> MoSPI &amp; NSSTA Official Competency Architecture
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            5-Level Cadre Hierarchy Flow
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-300 pb-1 font-medium scrollbar-thin">
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white shrink-0 font-semibold">MoSPI (Ministry)</span>
          <ChevronRight size={13} className="text-indigo-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white shrink-0 font-semibold">NSO (Department)</span>
          <ChevronRight size={13} className="text-indigo-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-indigo-300 shrink-0">Cadre/Service</span>
          <ChevronRight size={13} className="text-indigo-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-indigo-300 shrink-0">Designation (Level)</span>
          <ChevronRight size={13} className="text-indigo-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 shrink-0 font-bold">Post / Job Role</span>
          <ChevronRight size={13} className="text-indigo-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 shrink-0 font-bold">Competency Gap</span>
          <ChevronRight size={13} className="text-indigo-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-emerald-300 shrink-0 font-semibold">NSSTA / iGOT Pathway</span>
          <ChevronRight size={13} className="text-indigo-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shrink-0 font-bold">Updated Competency</span>
        </div>
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
          <div className="col-span-5">Competency &amp; MoSPI Classification</div>
          <div className="col-span-2">Domain</div>
          <div className="col-span-2 text-center">Current Level</div>
          <div className="col-span-1 text-center">Required</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {filteredGaps.map((g) => (
            <div key={g.id} className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition-colors">
              <div className="col-span-2 sm:col-span-5 flex items-start gap-3 min-w-0">
                {g.gap >= 1.5 ? (
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle size={15} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle size={15} />
                  </div>
                )}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs sm:text-sm font-bold text-white truncate">{g.skill}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border whitespace-nowrap ${g.color}`}>
                      {g.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
                    <span className="text-slate-400">NSSTA: {g.nssta}</span>
                    <span className="text-rose-400 sm:hidden font-medium">Gap: -{g.gap}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <span className="text-[11px] px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-slate-300 font-medium">{g.domain}</span>
              </div>

              <div className="col-span-1 sm:col-span-2 text-left sm:text-center text-xs font-semibold text-slate-200">
                <span className="sm:hidden text-slate-400 mr-1">Current:</span>
                {g.currentLevel != null ? Number(g.currentLevel).toFixed(2) : "2.0"} / 5.0
              </div>

              <div className="col-span-1 sm:col-span-1 text-left sm:text-center text-xs font-semibold text-slate-200">
                <span className="sm:hidden text-slate-400 mr-1">Target:</span>
                {g.requiredLevel != null ? Number(g.requiredLevel).toFixed(2) : "4.0"} / 5.0
              </div>

              <div className="col-span-1 sm:col-span-2 flex justify-end">
                <button
                  onClick={() => onStartCourseForGap?.(g)}
                  className="px-3.5 py-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <BookOpen size={13} /> Bridge Gap
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prototype Calibration Benchmark Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
        <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200/90 leading-relaxed">
          <strong>Prototype Calibration Benchmarks:</strong> Numerical target values (1.0–5.0) are calibrated for algorithmic demonstration and prototype evaluation; they are not official statutory MoSPI numerical quotas.
        </p>
      </div>
    </div>
  );
}