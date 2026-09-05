import { BarChart3, PieChart, Monitor, MessageSquare, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { getColor } from "../data/colorMap";

const ICONS = { BarChart3, PieChart, Monitor, MessageSquare };

function statusBadgeClasses(status) {
  if (status === "Strong" || status === "Excellent") {
    return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
  }
  if (status === "Average") {
    return "bg-amber-500/15 text-amber-300 border border-amber-500/30";
  }
  return "bg-rose-500/15 text-rose-300 border border-rose-500/30"; // Needs Improvement
}

export default function SkillGapOverview({ skills, onViewDetails, onRunAnalysis, isAnalyzing }) {
  return (
    <div className="bg-[#0f1422]/80 backdrop-blur-xl border border-white/[0.08] p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-between h-full">
      {/* Top edge glow sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Competency Benchmark</span>
            <h3 className="font-bold text-white text-base">Skill Gap Overview</h3>
          </div>
          <button
            onClick={onViewDetails}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>Details</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="space-y-4">
          {skills?.map((skill) => {
            const Icon = ICONS[skill.icon] || BarChart3;
            const color = getColor(skill.color);
            return (
              <div key={skill.id} className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-white/[0.03] transition-colors">
                <div className={`w-10 h-10 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0`}>
                  <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-slate-200 truncate">{skill.name}</p>
                    <span className="text-xs font-bold text-white shrink-0 ml-2">
                      {skill.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color.bar} rounded-full transition-all duration-700`}
                      style={{ width: `${skill.percent}%` }}
                    />
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${statusBadgeClasses(skill.status)}`}>
                  {skill.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11px] text-slate-400">
          MoSPI Sentence-Transformer ML Model
        </p>
        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-60 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Recalibrating...
            </>
          ) : (
            <>
              <Sparkles size={14} /> Run AI Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
}

