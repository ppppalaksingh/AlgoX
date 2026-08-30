import { BarChart3, PieChart, Monitor, MessageSquare, ArrowRight } from "lucide-react";
import { getColor } from "../data/colorMap";

const ICONS = { BarChart3, PieChart, Monitor, MessageSquare };

function statusBadgeClasses(status) {
  if (status === "Strong" || status === "Excellent") return "bg-green-50 text-green-600";
  if (status === "Average") return "bg-orange-50 text-orange-600";
  return "bg-red-50 text-red-600"; // "Needs Improvement"
}

export default function SkillGapOverview({ skills }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-800">Your Skill Gap Overview</h3>
        <button className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
          View Details <ArrowRight size={14} />
        </button>
      </div>

      <div className="space-y-5">
        {skills.map((skill) => {
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
                    className={`h-full ${color.bar} rounded-full`}
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

      <p className="text-xs text-slate-400 mt-5">
        Assessment based on your recent quiz and activities
      </p>
    </div>
  );
}
