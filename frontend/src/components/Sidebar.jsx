import {
  LayoutDashboard, PieChart, Target, Route, BookOpen, Sparkles,
  BarChart2, Award, FolderOpen, Bell, User, Settings, HelpCircle, Zap, X,
} from "lucide-react";
import { sidebarNavItems } from "../data/dashboardData";

const ICONS = {
  LayoutDashboard, PieChart, Target, Route, BookOpen, Sparkles,
  BarChart2, Award, FolderOpen, Bell, User, Settings, HelpCircle,
};

export default function Sidebar({ activeItem = "dashboard", onNavigate, isOpen, onClose }) {
  return (
    <>
      {/* Backdrop — only visible on mobile when sidebar is open */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-slate-900 text-white flex flex-col shrink-0 z-50
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="px-5 py-6 flex items-center justify-between gap-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-white">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight tracking-tight">AlgoX</p>
              <p className="text-[11px] text-slate-400 -mt-0.5">Learning Dashboard</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarNavItems.map((item) => {
            const Icon = ICONS[item.icon] || LayoutDashboard;
            const isActive = item.id === activeItem;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate?.(item.id);
                  onClose?.(); // auto-close drawer on mobile after picking a section
                }}
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
    </>
  );
}