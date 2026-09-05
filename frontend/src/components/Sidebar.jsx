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
  isDarkMode = true,
}) {
  const visibleNavItems = sidebarNavItems.filter((item) => {
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
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 backdrop-blur-2xl flex flex-col shrink-0 z-40 border-r
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          ${isDarkMode ? "bg-[#100829]/95 text-slate-200 border-white/[0.08]" : "bg-[#faf7f2]/98 text-[#1e143e] border-[#e8ded2]"}`}
      >
        {/* Brand & Logo */}
        <div className={`px-5 py-5 flex items-center justify-between gap-2 border-b relative ${
          isDarkMode ? "border-white/[0.08]" : "border-[#e8ded2]"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5925dc] flex items-center justify-center font-black text-xl text-white shadow-[0_4px_16px_rgba(89,37,220,0.4)] border border-white/20 shrink-0">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className={`font-extrabold text-lg font-serif leading-tight tracking-tight ${
                  isDarkMode ? "text-white" : "text-[#1e143e]"
                }`}>
                  Algo<span className={isDarkMode ? "text-[#e2ac52]" : "text-[#5925dc]"}>X</span>
                </p>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  isDarkMode ? "bg-[#5925dc]/20 text-indigo-300 border border-[#5925dc]/30" : "bg-[#5925dc]/10 text-[#5925dc] border border-[#5925dc]/25"
                }`}>
                  AI v2.4
                </span>
              </div>
              <p className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${
                isDarkMode ? "text-slate-400" : "text-[#7e7298]"
              }`}>
                {currentRole === "admin" ? "MoSPI Cadre Admin" : "Official Statistics AI"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`lg:hidden p-1 rounded-lg ${
              isDarkMode ? "text-slate-400 hover:text-white hover:bg-white/[0.05]" : "text-[#7e7298] hover:text-[#1e143e] hover:bg-[#ede6da]"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active Role Status Pill */}
        <div className={`px-4 py-2.5 border-b flex items-center justify-between text-xs ${
          isDarkMode ? "bg-white/[0.02] border-white/[0.05]" : "bg-[#f6f1e9] border-[#e8ded2]"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${currentRole === "admin" ? "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"}`} />
            <span className={`text-[11px] font-semibold ${isDarkMode ? "text-slate-300" : "text-[#4a3e65]"}`}>
              {currentRole === "admin" ? "Admin Command View" : "Official Cadre View"}
            </span>
          </div>
          <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
            isDarkMode ? "text-slate-400 bg-white/[0.06] border-white/[0.06]" : "text-[#7e7298] bg-white border-[#e8ded2]"
          }`}>
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
                    ? isDarkMode
                      ? "bg-gradient-to-r from-[#7c3aed] to-[#5925dc] text-white font-bold shadow-[0_4px_20px_rgba(89,37,220,0.4)] border border-indigo-400/30"
                      : "bg-[#5925dc] text-white font-bold shadow-[0_4px_16px_rgba(89,37,220,0.3)]"
                    : isDarkMode
                      ? "text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]"
                      : "text-[#635777] hover:text-[#1e143e] hover:bg-[#ede6da]/60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`shrink-0 transition-colors ${
                      isActive
                        ? "text-white"
                        : isDarkMode
                          ? "text-slate-400 group-hover:text-indigo-400"
                          : "text-[#7e7298] group-hover:text-[#5925dc]"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isDarkMode
                          ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                          : "bg-[#5925dc]/10 text-[#5925dc] border border-[#5925dc]/20"
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
        <div className={`p-3.5 border-t ${
          isDarkMode ? "border-white/[0.08] bg-[#120a2e]/70" : "border-[#e8ded2] bg-[#f6f1e9]"
        }`}>
          <div className={`flex items-center gap-2.5 p-2 rounded-xl border ${
            isDarkMode ? "bg-white/[0.03] border-white/[0.05]" : "bg-white border-[#e8ded2]"
          }`}>
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-400/30 flex items-center justify-center text-[11px] font-black text-orange-500 shrink-0">
              iG
            </div>
            <div className="leading-tight min-w-0">
              <p className={`text-xs font-bold truncate ${isDarkMode ? "text-slate-200" : "text-[#1e143e]"}`}>iGOT &amp; NSSTA Cadre</p>
              <p className={`text-[10px] truncate ${isDarkMode ? "text-slate-400" : "text-[#7e7298]"}`}>
                Ministry of Statistics &amp; PI
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}