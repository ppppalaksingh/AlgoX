import { useState, useRef, useEffect } from "react";
import { Menu, Search, Bell, ChevronDown, User, LogOut, ShieldCheck, Sparkles, Bot, Building2, ExternalLink, Sun, Moon } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";

export default function Header({
  user,
  currentRole = "learner", // 'learner' | 'admin'
  isAdminInDB = false,
  onToggleRole,
  onOpenAIAssistant,
  onMenuClick,
  onNavigate,
  courses = [],
  onSelectSearchResult,
  notifications = [],
  onClearNotifications,
  isDarkMode: propIsDarkMode,
  onToggleTheme: propOnToggleTheme,
}) {
  const { signOut } = useClerk();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const [internalDarkMode, setInternalDarkMode] = useState(() => {
    return localStorage.getItem("algox_theme") !== "light";
  });

  const isDark = propIsDarkMode !== undefined ? propIsDarkMode : internalDarkMode;

  const handleToggle = () => {
    if (propOnToggleTheme) {
      propOnToggleTheme();
    } else {
      setInternalDarkMode((prev) => {
        const next = !prev;
        if (next) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("algox_theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("algox_theme", "light");
        }
        return next;
      });
    }
  };

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim().length > 1
    ? courses.filter((c) =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.domain?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className={`h-20 border-b flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4 sticky top-0 z-30 transition-all duration-300 backdrop-blur-2xl ${
      isDark
        ? "bg-[#120a2e]/90 border-white/[0.08] text-white"
        : "bg-[#faf7f2]/95 border-[#e8ded2] text-[#1e143e] shadow-[0_4px_20px_rgba(30,20,60,0.03)]"
    }`}>
      {/* Left: Najaba-style Brand & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
            isDark ? "text-slate-400 hover:text-white hover:bg-white/[0.05]" : "text-[#635777] hover:text-[#1e143e] hover:bg-[#ede6da]"
          }`}
        >
          <Menu size={20} />
        </button>

        <div
          onClick={() => onNavigate?.("dashboard")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#5925dc] text-white flex items-center justify-center font-black text-lg shadow-[0_4px_16px_rgba(89,37,220,0.4)] border border-white/20 shrink-0 group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-extrabold text-lg font-serif tracking-tight transition-colors ${
                isDark ? "text-white group-hover:text-indigo-200" : "text-[#1e143e] group-hover:text-[#5925dc]"
              }`}>
                AlgoX
              </span>
              <span className={`hidden sm:inline-flex text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                isDark ? "bg-[#5925dc]/20 text-indigo-300 border border-[#5925dc]/30" : "bg-[#5925dc]/10 text-[#5925dc] border border-[#5925dc]/25"
              }`}>
                AI Cadre
              </span>
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-widest block -mt-0.5 ${
              isDark ? "text-slate-400" : "text-[#7e7298]"
            }`}>
              ASSESS · DEVELOP · EXCEL
            </span>
          </div>
        </div>
      </div>

      {/* Center: Editorial Nav Links (Najaba signature style) */}
      <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold">
        <button
          onClick={() => onNavigate?.("dashboard")}
          className={`transition-colors relative py-1 cursor-pointer ${
            isDark ? "text-white" : "text-[#1e143e] font-bold"
          }`}
        >
          <span>The Tri-Factor</span>
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#de7a58] rounded-full" />
        </button>
        <button
          onClick={() => onNavigate?.("competencies")}
          className={`transition-colors cursor-pointer ${
            isDark ? "text-slate-400 hover:text-white" : "text-[#635777] hover:text-[#1e143e]"
          }`}
        >
          What We Assess
        </button>
        <button
          onClick={() => onNavigate?.("courses")}
          className={`transition-colors cursor-pointer ${
            isDark ? "text-slate-400 hover:text-white" : "text-[#635777] hover:text-[#1e143e]"
          }`}
        >
          Official Courses
        </button>
        <button
          onClick={() => onNavigate?.("virtual-lab")}
          className={`transition-colors cursor-pointer ${
            isDark ? "text-slate-400 hover:text-white" : "text-[#635777] hover:text-[#1e143e]"
          }`}
        >
          Simulations &amp; Lab
        </button>
      </nav>

      {/* Right: Role Switcher, Language, Najaba Theme Toggle & CTA */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Role Switcher Pill */}
        <div className={`flex items-center p-1 rounded-full border ${
          isDark
            ? "bg-black/30 border-white/[0.08]"
            : "bg-[#ede6da]/70 border-[#e8ded2]"
        }`}>
          <button
            onClick={() => onToggleRole?.("learner")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentRole === "learner"
                ? "bg-[#5925dc] text-white shadow-xs"
                : isDark ? "text-slate-400 hover:text-slate-200" : "text-[#7e7298] hover:text-[#1e143e]"
            }`}
          >
            <User size={12} /> Official
          </button>
          <button
            onClick={() => onToggleRole?.("admin")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentRole === "admin"
                ? "bg-[#e2ac52] text-[#19103c] font-black shadow-xs"
                : isDark ? "text-slate-400 hover:text-slate-200" : "text-[#7e7298] hover:text-[#1e143e]"
            }`}
          >
            <Building2 size={12} /> Admin
          </button>
        </div>

        {/* Language / Region Badge (Najaba style: EN · हिन्दी) */}
        <div className={`hidden sm:flex items-center text-xs font-semibold gap-1 px-1 ${
          isDark ? "text-slate-400" : "text-[#7e7298]"
        }`}>
          <span className={`font-bold ${isDark ? "text-white" : "text-[#1e143e]"}`}>EN</span>
          <span>·</span>
          <span className={`cursor-pointer ${isDark ? "hover:text-slate-200" : "hover:text-[#1e143e]"}`}>हिन्दी</span>
        </div>

        {/* The Najaba Theme Toggle Switcher (Crescent Moon ☾ in Light ↔ Radiant Sun ☼ in Dark) */}
        <button
          onClick={handleToggle}
          className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-xs border ${
            isDark
              ? "bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.1] text-amber-300"
              : "bg-white hover:bg-[#f6f1e9] border-[#e8ded2] text-[#5925dc] shadow-sm"
          }`}
          title={isDark ? "Switch to Najaba Warm Ivory Light Mode" : "Switch to Najaba Royal Velvet Dark Mode"}
        >
          {isDark ? (
            <Sun size={17} className="text-[#e2ac52] animate-pulse" />
          ) : (
            <Moon size={17} className="text-[#5925dc]" />
          )}
        </button>

        {/* Najaba Signature Rounded-Full Pill CTA Button */}
        <button
          onClick={onOpenAIAssistant}
          className={`hidden sm:flex items-center gap-2 px-5 py-2 text-xs transition-all duration-200 cursor-pointer ${
            isDark ? "btn-najaba-gold" : "btn-najaba-purple"
          }`}
          title="Open Karmayogi Sahayak AI Mentor"
        >
          <Bot size={15} />
          <span>AI Sahayak</span>
        </button>

        {/* Global Search with Real-time Dropdown */}
        <div ref={searchRef} className="relative hidden xl:block">
          <div className={`flex items-center gap-2.5 rounded-full px-4 py-2 w-64 border transition-all ${
            isDark
              ? "bg-white/[0.04] hover:bg-white/[0.06] border-white/[0.08] focus-within:border-indigo-500/50 focus-within:bg-[#1b1242] focus-within:ring-2 focus-within:ring-indigo-500/20"
              : "bg-white hover:bg-[#faf7f2] border-[#e8ded2] focus-within:border-[#5925dc] focus-within:ring-2 focus-within:ring-[#5925dc]/20 shadow-xs"
          }`}>
            <Search size={15} className={`shrink-0 ${isDark ? "text-slate-400" : "text-[#7e7298]"}`} />
            <input
              type="text"
              placeholder="Search courses, skills, paths..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className={`bg-transparent outline-none text-xs w-full ${
                isDark ? "text-white placeholder:text-slate-500" : "text-[#1e143e] placeholder:text-[#9d94b8]"
              }`}
            />
          </div>

          {searchOpen && searchQuery.trim().length > 1 && (
            <div className={`absolute top-12 left-0 right-0 rounded-2xl border shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 ${
              isDark ? "bg-[#1b1242]/95 backdrop-blur-2xl border-white/[0.1]" : "bg-white border-[#e8ded2]"
            }`}>
              <div className={`p-2.5 border-b text-[10px] font-bold uppercase tracking-wider px-3 ${
                isDark ? "border-white/[0.06] text-slate-400 bg-white/[0.02]" : "border-[#e8ded2] text-[#7e7298] bg-[#faf7f2]"
              }`}>
                Matching Catalog Items
              </div>
              {searchResults.length === 0 ? (
                <div className={`p-4 text-xs text-center ${isDark ? "text-slate-400" : "text-[#7e7298]"}`}>No results found</div>
              ) : (
                <div className={`divide-y ${isDark ? "divide-white/[0.05]" : "divide-[#e8ded2]"}`}>
                  {searchResults.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => {
                        onSelectSearchResult?.(course);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className={`p-3 cursor-pointer transition-colors ${
                        isDark ? "hover:bg-white/[0.05]" : "hover:bg-[#faf7f2]"
                      }`}
                    >
                      <p className={`text-xs font-semibold leading-tight ${isDark ? "text-white" : "text-[#1e143e]"}`}>{course.title}</p>
                      <p className={`text-[11px] mt-0.5 ${isDark ? "text-indigo-300" : "text-[#5925dc]"}`}>{course.domain} · {course.level || "Official"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotificationsOpen((s) => !s)}
            className={`relative p-2.5 rounded-xl cursor-pointer transition-colors border ${
              isDark
                ? "text-slate-400 hover:text-white hover:bg-white/[0.06] border-transparent hover:border-white/[0.08]"
                : "text-[#635777] hover:text-[#1e143e] hover:bg-[#ede6da] border-transparent hover:border-[#e8ded2]"
            }`}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-gradient-to-tr from-amber-500 to-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                {notifications.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className={`absolute right-0 top-12 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${
              isDark ? "bg-[#1b1242]/95 backdrop-blur-2xl border-white/[0.1]" : "bg-white border-[#e8ded2]"
            }`}>
              <div className={`p-3.5 border-b flex items-center justify-between ${
                isDark ? "border-white/[0.08]" : "border-[#e8ded2] bg-[#faf7f2]"
              }`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white" : "text-[#1e143e]"}`}>Official Alerts</span>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] text-[#5925dc] hover:underline cursor-pointer font-semibold"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className={`max-h-72 overflow-y-auto divide-y ${isDark ? "divide-white/[0.05]" : "divide-[#e8ded2]"}`}>
                {notifications.length === 0 ? (
                  <div className={`p-6 text-center text-xs ${isDark ? "text-slate-400" : "text-[#7e7298]"}`}>No new notifications</div>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className={`p-3 transition-colors ${isDark ? "hover:bg-white/[0.04]" : "hover:bg-[#faf7f2]"}`}>
                      <p className={`text-xs font-semibold ${isDark ? "text-slate-200" : "text-[#1e143e]"}`}>{n.title}</p>
                      <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-400" : "text-[#635777]"}`}>{n.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileDropdownOpen((s) => !s)}
            className={`flex items-center gap-2.5 p-1.5 sm:px-2.5 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? "hover:bg-white/[0.06] border-transparent hover:border-white/[0.08]"
                : "hover:bg-[#ede6da] border-transparent hover:border-[#e8ded2]"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5925dc] to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-[0_0_12px_rgba(89,37,220,0.35)] border border-white/20 shrink-0">
              {user?.name?.charAt(0) ?? "O"}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className={`text-xs font-bold truncate max-w-32 ${isDark ? "text-white" : "text-[#1e143e]"}`}>{user?.name || "Officer"}</p>
              <p className={`text-[10px] font-medium truncate max-w-32 ${isDark ? "text-slate-400" : "text-[#7e7298]"}`}>
                {isAdminInDB ? `👑 Admin · ${user?.designation || "Assistant Director"}` : (user?.designation || "Assistant Director")}
              </p>
            </div>
            <ChevronDown size={14} className={isDark ? "text-slate-400 hidden sm:block" : "text-[#7e7298] hidden sm:block"} />
          </button>

          {profileDropdownOpen && (
            <div className={`absolute right-0 top-12 w-64 rounded-2xl border shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${
              isDark ? "bg-[#1b1242]/95 backdrop-blur-2xl border-white/[0.1]" : "bg-white border-[#e8ded2]"
            }`}>
              <div className={`p-3 border-b mb-1 rounded-xl ${
                isDark ? "border-white/[0.08] bg-white/[0.03]" : "border-[#e8ded2] bg-[#faf7f2]"
              }`}>
                <p className={`text-xs font-bold ${isDark ? "text-white" : "text-[#1e143e]"}`}>{user?.name || "Officer"}</p>
                <p className="text-[11px] font-semibold text-[#5925dc] mt-0.5">{user?.designation || "Assistant Director"}</p>
                <p className={`text-[10px] truncate mt-0.5 ${isDark ? "text-slate-400" : "text-[#7e7298]"}`}>{user?.email || "officer@mospi.gov.in"}</p>
                {isAdminInDB && (
                  <span className="inline-block mt-1.5 text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    👑 Verified Database Admin
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  onNavigate?.("profile");
                  setProfileDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                  isDark ? "text-slate-300 hover:text-white hover:bg-white/[0.06]" : "text-[#4a3e65] hover:text-[#1e143e] hover:bg-[#faf7f2]"
                }`}
              >
                <User size={15} className={isDark ? "text-slate-400" : "text-[#7e7298]"} />
                Officer Profile &amp; Cadre
              </button>

              <button
                onClick={() => {
                  onNavigate?.("competencies");
                  setProfileDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                  isDark ? "text-slate-300 hover:text-white hover:bg-white/[0.06]" : "text-[#4a3e65] hover:text-[#1e143e] hover:bg-[#faf7f2]"
                }`}
              >
                <ShieldCheck size={15} className={isDark ? "text-slate-400" : "text-[#7e7298]"} />
                My Competencies
              </button>

              <div className={`border-t my-1 ${isDark ? "border-white/[0.06]" : "border-[#e8ded2]"}`} />

              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}