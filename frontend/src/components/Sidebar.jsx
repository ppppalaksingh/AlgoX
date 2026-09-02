import {
  LayoutDashboard, PieChart, Target, Route, BookOpen, Sparkles,
  BarChart2, Award, FolderOpen, Bell, User, Settings, HelpCircle,
  Building2, FlaskConical, Bot, Zap, X, Lock
} from "lucide-react";
import { sidebarNavItems } from "../data/dashboardData";

const ICONS = {
  LayoutDashboard, PieChart, Target, Route, BookOpen, Sparkles,
  BarChart2, Award, FolderOpen, Bell, User, Settings, HelpCircle,
  Building2, FlaskConical, Bot
};

export default function Sidebar({ activeItem = "dashboard", onNavigate, isOpen, onClose, currentRole = "learner", isAdminInDB = false }) {
  const visibleNavItems = sidebarNavItems.filter((item) => {
    // If not a database-verified admin OR in learner role, hide admin-dashboard
    if ((!isAdminInDB || currentRole === "learner") && item.id === "admin-dashboard") {
      return false;
    }
    return true;
  });

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
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 via-indigo-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-black text-lg leading-tight tracking-tight">AlgoX</p>
              <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                {currentRole === "admin" ? "MoSPI Admin Hub" : "Official Statistics AI"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Current Role Banner */}
        <div className="px-4 py-2.5 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${currentRole === "admin" ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
            <span className="text-[11px] font-bold text-slate-300">
              {currentRole === "admin" ? "Administrator Access" : "Official (Learner)"}
            </span>
          </div>
          <span className="text-[9px] uppercase font-black text-slate-400 px-1.5 py-0.5 rounded bg-white/10">
            {currentRole === "admin" ? "Org Wide" : "Self"}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-all ${
                  isActive
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                    isActive ? "bg-white/20 text-white" : "bg-blue-500/20 text-blue-300"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* iGOT Karmayogi & MoSPI accreditation credit */}
        <div className="px-4 py-4 border-t border-white/10 bg-slate-950/40">
          <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-1.5">
            Integrated With
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-[10px] font-black text-orange-400">
              iG
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-slate-200">iGOT &amp; NSSTA</p>
              <p className="text-[10px] text-slate-400">
                MoSPI, Government of India
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}