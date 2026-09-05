import { TrendingUp, BookOpen, Zap, Trophy, ArrowUpRight } from "lucide-react";
import { getColor } from "../data/colorMap";

const ICONS = { TrendingUp, BookOpen, Zap, Trophy };

function StatCard({ stat }) {
  const Icon = ICONS[stat.icon] || TrendingUp;
  const color = getColor(stat.color);

  return (
    <div className="bg-[#0f1422]/80 backdrop-blur-xl border border-white/[0.08] hover:border-indigo-500/40 rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(99,102,241,0.15)] relative overflow-hidden group">
      {/* Subtle top edge glow sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${color.bg} ${color.text} flex items-center justify-center shadow-inner relative`}>
          <Icon size={22} strokeWidth={2.2} />
        </div>
        <span className="p-1.5 rounded-xl bg-white/[0.03] text-slate-400 group-hover:text-white transition-colors">
          <ArrowUpRight size={15} />
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
        <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stat.value}</p>
      </div>

      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">{stat.caption}</p>

      {/* Optional mini progress bar */}
      {typeof stat.progress === "number" && (
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden mt-3">
          <div
            className={`h-full ${color.bar} rounded-full transition-all duration-700`}
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

