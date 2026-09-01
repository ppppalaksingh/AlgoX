import { BarChart3, PieChart, Monitor, MessageSquare, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { getColor } from "../data/colorMap";

const ICONS = { BarChart3, PieChart, Monitor, MessageSquare };

function statusBadgeClasses(status) {
  if (status === "Strong" || status === "Excellent") return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
  if (status === "Average") return "bg-amber-50 text-amber-700 border border-amber-200/60";
  return "bg-rose-50 text-rose-700 border border-rose-200/60"; // "Needs Improvement"
}

export default function SkillGapOverview({ skills, onViewDetails, onRunAnalysis, isAnalyzing }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-800">Your Skill Gap Overview</h3>
        <button
          onClick={onViewDetails}
          className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline cursor-pointer"
        >
          View Details <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-5">
        {skills?.map((skill) => {
          const Icon = ICONS[skill.icon] || BarChart3;
          const color = getColor(skill.color);
          return (
            <div key={skill.id} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${color.bg} ${color.text} flex items-center justify-center shrink-0`}>
                <Icon size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 mb-1.5">{skill.name}</p>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${skill.percent}%` }}
                  />
                </div>
              </div>

              <span className="text-sm font-semibold text-slate-700 w-10 text-right shrink-0">
                {skill.percent}%
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap shrink-0 ${statusBadgeClasses(skill.status)}`}>
                {skill.status}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          Assessment based on ML competency analysis
        </p>
        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="w-full sm:w-auto px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 disabled:opacity-60 text-blue-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={13} className="animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={13} /> Run AI Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
}
