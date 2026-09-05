import {
  LayoutDashboard, PieChart, Target, Route, BookOpen, Sparkles,
  BarChart2, Award, FolderOpen, Bell, User, Settings, HelpCircle,
  Building2, FlaskConical, Bot, Zap, X, ShieldCheck
} from "lucide-react";
import { sidebarNavItems } from "../data/dashboardData";

const ICONS = {
  LayoutDashboard, PieChart, Target, Route, BookOpen, Sparkles,
  BarChart2, Award, FolderOpen, Bell, User, Settings, HelpCircle,
  Building2, FlaskConical, Bot
};

export default function Sidebar({
  activeItem = "dashboard",
  onNavigate,
  isOpen,
  onClose,
  currentRole = "learner",
  isAdminInDB = false,
}) {
  const visibleNavItems = sidebarNavItems.filter((item) => {
    // If currently in learner role, hide admin-dashboard
    if (currentRole === "learner" && item.id === "admin-dashboard") {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0b0e17]/95 backdrop-blur-2xl text-slate-200 flex flex-col shrink-0 z-40 border-r border-white/[0.08]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Brand & Logo */}
        <div className="px-5 py-5 flex items-center justify-between gap-2 border-b border-white/[0.08] relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-white/20 shrink-0">
              <Zap size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-black text-lg leading-tight tracking-tight text-white">
                  Algo<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">X</span>
                </p>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  AI v2.4
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
                {currentRole === "admin" ? "MoSPI Cadre Admin" : "Official Statistics AI"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active Role Status Pill */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${currentRole === "admin" ? "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"}`} />
            <span className="text-[11px] font-semibold text-slate-300">
              {currentRole === "admin" ? "Admin Command View" : "Official Cadre View"}
            </span>
          </div>
          <span className="text-[9px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.06]">
            {currentRole === "admin" ? "Org Wide" : "Personal"}
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = ICONS[item.icon] || LayoutDashboard;
            const isActive = item.id === activeItem;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate?.(item.id);
                  onClose?.();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-400/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Institutional Accreditation Footer */}
        <div className="p-3.5 border-t border-white/[0.08] bg-[#07090e]/60">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-400/30 flex items-center justify-center text-[11px] font-black text-orange-400 shrink-0">
              iG
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">iGOT &amp; NSSTA Cadre</p>
              <p className="text-[10px] text-slate-400 truncate">
                Ministry of Statistics &amp; PI
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}