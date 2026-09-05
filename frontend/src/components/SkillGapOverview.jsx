import { BarChart3, PieChart, Monitor, MessageSquare, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { getColor } from "../data/colorMap";

const ICONS = { BarChart3, PieChart, Monitor, MessageSquare };

function statusBadgeClasses(status) {
  if (status === "Strong" || status === "Excellent") {
    return "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30";
  }
  if (status === "Average") {
    return "bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30";
  }
  return "bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30"; // Needs Improvement
}

export default function SkillGapOverview({ skills, onViewDetails, onRunAnalysis, isAnalyzing, isDarkMode = true }) {
  return (
    <div className={`p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between h-full border transition-all duration-300 ${
      isDarkMode
        ? "bg-[#1b1242]/85 border-white/[0.08] shadow-[0_10px_30px_rgba(10,5,30,0.4)]"
        : "bg-white border-[#e8ded2] shadow-[0_8px_24px_-6px_rgba(30,20,60,0.05),0_1px_3px_rgba(0,0,0,0.03)]"
    }`}>
      {/* Top edge glow sheen */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] ${
        isDarkMode ? "bg-gradient-to-r from-transparent via-white/15 to-transparent" : "bg-gradient-to-r from-transparent via-[#e8ded2] to-transparent"
      }`} />

      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] font-bold text-[#de7a58] uppercase tracking-widest block mb-0.5">Competency Benchmark</span>
            <h3 className={`font-extrabold text-lg font-serif tracking-tight ${
              isDarkMode ? "text-white" : "text-[#1e143e]"
            }`}>Skill Gap Overview</h3>
          </div>
          <button
            onClick={onViewDetails}
            className="text-xs text-[#de7a58] hover:opacity-80 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer group"
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
              <div key={skill.id} className={`flex items-center gap-3.5 p-2 rounded-2xl transition-colors ${
                isDarkMode ? "hover:bg-white/[0.03]" : "hover:bg-[#faf7f2]"
              }`}>
                <div className={`w-10 h-10 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0`}>
                  <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className={`text-xs font-semibold truncate ${
                      isDarkMode ? "text-slate-200" : "text-[#1e143e]"
                    }`}>{skill.name}</p>
                    <span className={`text-xs font-bold shrink-0 ml-2 font-mono ${
                      isDarkMode ? "text-white" : "text-[#1e143e]"
                    }`}>
                      {skill.percent}%
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${
                    isDarkMode ? "bg-white/[0.06]" : "bg-[#f1ebd8]"
                  }`}>
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

      <button
        onClick={onRunAnalysis}
        disabled={isAnalyzing}
        className={`mt-5 w-full py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 ${
          isDarkMode
            ? "btn-najaba-gold"
            : "btn-najaba-purple"
        }`}
      >
        {isAnalyzing ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Analyzing MoSPI Standards...</span>
          </>
        ) : (
          <>
            <Sparkles size={14} />
            <span>Recalibrate Competency Gap</span>
          </>
        )}
      </button>
    </div>
  );
}
