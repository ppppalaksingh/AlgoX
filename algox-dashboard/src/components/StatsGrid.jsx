import { TrendingUp, BookOpen, Zap, Trophy } from "lucide-react";
import { getColor } from "../data/colorMap";

const ICONS = { TrendingUp, BookOpen, Zap, Trophy };

function StatCard({ stat }) {
  const Icon = ICONS[stat.icon] || TrendingUp;
  const color = getColor(stat.color);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3">
      <div className={`w-11 h-11 rounded-xl ${color.bg} ${color.text} flex items-center justify-center`}>
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{stat.label}</p>
        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
      </div>
      <p className="text-xs text-slate-400 -mt-2">{stat.caption}</p>

      {/* Optional mini progress bar (only shown when stat.progress is set) */}
      {typeof stat.progress === "number" && (
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${color.bar} rounded-full`}
            style={{ width: `${stat.progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
