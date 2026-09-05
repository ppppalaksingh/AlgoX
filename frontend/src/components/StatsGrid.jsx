import { TrendingUp, BookOpen, Zap, Trophy, ArrowUpRight } from "lucide-react";
import { getColor } from "../data/colorMap";

const ICONS = { TrendingUp, BookOpen, Zap, Trophy };

function StatCard({ stat, isDarkMode = true }) {
  const Icon = ICONS[stat.icon] || TrendingUp;
  const color = getColor(stat.color);

  return (
    <div className={`p-5 sm:p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group border ${
      isDarkMode
        ? "bg-[#1b1242]/85 border-white/[0.08] hover:border-[#e2ac52]/50 shadow-[0_10px_30px_rgba(10,5,30,0.4)] hover:shadow-[0_20px_40px_rgba(10,5,30,0.6),0_0_25px_rgba(226,172,82,0.15)]"
        : "bg-white border-[#e8ded2] hover:border-[#5925dc] shadow-[0_8px_24px_-6px_rgba(30,20,60,0.05),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_32px_-8px_rgba(89,37,220,0.15)]"
    }`}>
      {/* Subtle top edge glow sheen */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] ${
        isDarkMode ? "bg-gradient-to-r from-transparent via-white/20 to-transparent" : "bg-gradient-to-r from-transparent via-[#e8ded2] to-transparent"
      }`} />

      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${color.bg} ${color.text} flex items-center justify-center shadow-inner relative`}>
          <Icon size={22} strokeWidth={2.2} />
        </div>
        <span className={`p-1.5 rounded-xl transition-colors ${
          isDarkMode ? "bg-white/[0.03] text-slate-400 group-hover:text-white" : "bg-[#f6f1e9] text-[#7e7298] group-hover:text-[#1e143e]"
        }`}>
          <ArrowUpRight size={15} />
        </span>
      </div>

      <div className="space-y-1">
        <p className={`text-[11px] font-bold uppercase tracking-wider ${
          isDarkMode ? "text-slate-400" : "text-[#7e7298]"
        }`}>{stat.label}</p>
        <p className={`text-2xl sm:text-3xl font-extrabold font-serif tracking-tight ${
          isDarkMode ? "text-white" : "text-[#1e143e]"
        }`}>{stat.value}</p>
      </div>

      <p className={`text-xs mt-2 flex items-center gap-1.5 ${
        isDarkMode ? "text-slate-400" : "text-[#635777]"
      }`}>{stat.caption}</p>

      {/* Optional mini progress bar */}
      {typeof stat.progress === "number" && (
        <div className={`w-full h-1.5 rounded-full overflow-hidden mt-3 ${
          isDarkMode ? "bg-white/[0.06]" : "bg-[#f1ebd8]"
        }`}>
          <div
            className={`h-full ${color.bar} rounded-full transition-all duration-700`}
            style={{ width: `${stat.progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function StatsGrid({ stats, isDarkMode = true }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} isDarkMode={isDarkMode} />
      ))}
    </div>
  );
}
