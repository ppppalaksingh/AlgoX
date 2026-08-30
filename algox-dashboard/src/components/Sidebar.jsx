import {
  LayoutDashboard, PieChart, Target, Route, BookOpen, Sparkles,
  BarChart2, Award, FolderOpen, Bell, User, Settings, HelpCircle, Zap,
} from "lucide-react";
import { sidebarNavItems } from "../data/dashboardData";

// Map icon name (string, from data file) -> actual lucide component.
// Keeping this map here means the data file stays plain JSON-like data,
// with no framework imports inside it.
const ICONS = {
  LayoutDashboard, PieChart, Target, Route, BookOpen, Sparkles,
  BarChart2, Award, FolderOpen, Bell, User, Settings, HelpCircle,
};

export default function Sidebar({ activeItem = "dashboard", onNavigate }) {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-5 py-6 flex items-center gap-2 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-white">
          <Zap size={18} strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-bold text-lg leading-tight tracking-tight">AlgoX</p>
          <p className="text-[11px] text-slate-400 -mt-0.5">Learning Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {sidebarNavItems.map((item) => {
          const Icon = ICONS[item.icon] || LayoutDashboard;
          const isActive = item.id === activeItem;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${isActive
                  ? "bg-blue-600 text-white font-medium"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Small iGOT Karmayogi promotional credit */}
      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">
          Built on
        </p>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold text-orange-400">
            iG
          </div>
          <div className="leading-tight">
            <p className="text-xs font-medium text-slate-200">iGOT Karmayogi</p>
            <p className="text-[10px] text-slate-500">
              Ministry of Statistics &amp; PI, Govt. of India
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
