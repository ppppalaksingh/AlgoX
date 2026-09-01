import { BarChart3, PieChart, Monitor, MessageSquare } from "lucide-react";
import { getColor } from "../data/colorMap";

const ICONS = { BarChart3, PieChart, Monitor, MessageSquare };

function statusBadgeClasses(status) {
  if (status === "Strong" || status === "Excellent") return "bg-green-50 text-green-600";
  if (status === "Average") return "bg-orange-50 text-orange-600";
  return "bg-red-50 text-red-600";
}

export default function MyCompetencies({ domains }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-800">My Competencies</h1>
        <p className="text-sm text-slate-500">
          Your competency levels across all 4 domains of Official Statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {domains.map((domain) => {
          const Icon = ICONS[domain.icon] || BarChart3;
          const color = getColor(domain.color);
          return (
            <div key={domain.id} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-lg ${color.bg} ${color.text} flex items-center justify-center shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{domain.name}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap shrink-0 ${statusBadgeClasses(domain.status)}`}>
                  {domain.status}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                <div className={`h-full ${color.bar} rounded-full`} style={{ width: `${domain.percent}%` }} />
              </div>
              <p className="text-xs text-slate-500 mb-4">{domain.percent}% competency</p>

              <div className="flex flex-wrap gap-2">
                {domain.skills.map((skill) => (
                  <span key={skill} className={`text-xs px-2.5 py-1 rounded-full ${color.badgeBg} ${color.badgeText}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}