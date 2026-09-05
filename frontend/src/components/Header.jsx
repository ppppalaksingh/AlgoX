import { useState, useRef, useEffect } from "react";
import { 
  Menu, Search, Bell, ChevronDown, User, LogOut, ShieldCheck, Sparkles, 
  Bot, Building2, ExternalLink, Sun, Moon, X 
} from "lucide-react";
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
    <header className={`w-full h-20 border-b flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4 sticky top-0 z-30 transition-all duration-300 backdrop-blur-2xl ${
      isDark
        ? "bg-[#120a2e]/92 border-white/[0.08] text-white"
        : "bg-[#faf7f2]/96 border-[#e8ded2] text-[#1e143e] shadow-[0_4px_20px_rgba(30,20,60,0.03)]"
    }`}>
      {/* Left: Menu Drawer Trigger & Signature Najaba Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onMenuClick}
          className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
            isDark 
              ? "text-slate-300 hover:text-white hover:bg-white/[0.08] border-white/10" 
              : "text-[#1e143e] hover:bg-[#ede6da] border-[#e8ded2]"
          }`}
          title="Open All Modules & Official Directory"
        >
          <Menu size={19} />
        </button>

        <div
          onClick={() => onNavigate?.("dashboard")}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#5925dc] text-white flex items-center justify-center font-black text-lg shadow-[0_4px_16px_rgba(89,37,220,0.4)] border border-white/20 shrink-0 group-hover:scale-105 transition-transform">
            A
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className={`font-extrabold text-lg font-serif tracking-tight ${
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
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold shrink-0 whitespace-nowrap">
        <button
          onClick={() => onNavigate?.("dashboard")}
          className={`transition-colors relative py-1 cursor-pointer shrink-0 ${
            isDark ? "text-white" : "text-[#1e143e] font-bold"
          }`}
        >
          <span>The Tri-Factor</span>
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#de7a58] rounded-full" />
        </button>
        <button
          onClick={() => onNavigate?.("competencies")}
          className={`transition-colors cursor-pointer shrink-0 ${
            isDark ? "text-slate-300 hover:text-white" : "text-[#635777] hover:text-[#1e143e]"
          }`}
        >
          What We Assess
        </button>
        <button
          onClick={() => onNavigate?.("courses")}
          className={`transition-colors cursor-pointer shrink-0 ${
            isDark ? "text-slate-300 hover:text-white" : "text-[#635777] hover:text-[#1e143e]"
          }`}
        >
          Official Courses
        </button>
        <button
          onClick={() => onNavigate?.("virtual-lab")}
          className={`transition-colors cursor-pointer shrink-0 ${
            isDark ? "text-slate-300 hover:text-white" : "text-[#635777] hover:text-[#1e143e]"
          }`}
        >
          Simulations &amp; Lab
        </button>
      </nav>

      {/* Right: Role Switcher, Language, Najaba Theme Toggle, Search & CTA */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Role Switcher Pill */}
        <div className={`flex items-center p-0.5 rounded-full border shrink-0 ${
          isDark
            ? "bg-black/30 border-white/[0.08]"
            : "bg-[#ede6da]/70 border-[#e8ded2]"
        }`}>
          <button
            onClick={() => onToggleRole?.("learner")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              currentRole === "learner"
                ? "bg-[#5925dc] text-white shadow-xs"
                : isDark ? "text-slate-400 hover:text-slate-200" : "text-[#7e7298] hover:text-[#1e143e]"
            }`}
          >
            <User size={12} /> Official
          </button>
          <button
            onClick={() => onToggleRole?.("admin")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              currentRole === "admin"
                ? "bg-[#e2ac52] text-[#19103c] font-black shadow-xs"
                : isDark ? "text-slate-400 hover:text-slate-200" : "text-[#7e7298] hover:text-[#1e143e]"
            }`}
          >
            <Building2 size={12} /> Admin
          </button>
        </div>

        {/* Language / Region Badge (Najaba style: EN · हिन्दी) */}
        <div className={`hidden md:flex items-center text-xs font-semibold gap-1 px-1 shrink-0 ${
          isDark ? "text-slate-400" : "text-[#7e7298]"
        }`}>
          <span className={`font-bold ${isDark ? "text-white" : "text-[#1e143e]"}`}>EN</span>
          <span>·</span>
          <span className={`cursor-pointer ${isDark ? "hover:text-slate-200" : "hover:text-[#1e143e]"}`}>हिन्दी</span>
        </div>

        {/* The Najaba Theme Toggle Switcher (Crescent Moon ☾ in Light ↔ Radiant Sun ☼ in Dark) */}
        <button
          onClick={handleToggle}
          className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-xs border shrink-0 ${
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
          className={`hidden sm:flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs transition-all duration-200 cursor-pointer shrink-0 ${
            isDark ? "btn-najaba-gold" : "btn-najaba-purple"
          }`}
          title="Open Karmayogi Sahayak AI Mentor"
        >
          <Bot size={14} />
          <span>AI Sahayak</span>
        </button>

        {/* Global Search Button & Dropdown */}
        <div ref={searchRef} className="relative shrink-0">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              isDark 
                ? "text-slate-300 hover:text-white hover:bg-white/[0.06] border-white/10" 
                : "text-[#1e143e] hover:bg-[#ede6da] border-[#e8ded2]"
            }`}
            title="Search courses, skills, and materials"
          >
            <Search size={16} />
          </button>

          {searchOpen && (
            <div className={`absolute right-0 top-12 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 ${
              isDark ? "bg-[#1b1242]/98 backdrop-blur-2xl border-white/[0.12]" : "bg-white border-[#e8ded2]"
            }`}>
              <div className="p-3 border-b border-white/[0.06] flex items-center gap-2">
                <Search size={15} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search courses, skills, paths..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent outline-none text-xs w-full ${
                    isDark ? "text-white placeholder:text-slate-500" : "text-[#1e143e] placeholder:text-[#9d94b8]"
                  }`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-white p-0.5">
                    <X size={13} />
                  </button>
                )}
              </div>

              {searchQuery.trim().length > 1 && (
                <div className="max-h-64 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className={`p-4 text-xs text-center ${isDark ? "text-slate-400" : "text-[#7e7298]"}`}>No matching catalog items</div>
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
          )}
        </div>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative shrink-0">
          <button
            onClick={() => setNotificationsOpen((s) => !s)}
            className={`relative p-2 rounded-xl cursor-pointer transition-colors border shrink-0 ${
              isDark
                ? "text-slate-300 hover:text-white hover:bg-white/[0.06] border-white/10"
                : "text-[#635777] hover:text-[#1e143e] hover:bg-[#ede6da] border-[#e8ded2]"
            }`}
          >
            <Bell size={17} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 bg-gradient-to-tr from-amber-500 to-orange-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold shadow-xs">
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
        <div ref={profileRef} className="relative shrink-0">
          <button
            onClick={() => setProfileDropdownOpen((s) => !s)}
            className={`flex items-center gap-2 p-1.5 sm:px-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
              isDark
                ? "hover:bg-white/[0.06] border-white/10"
                : "hover:bg-[#ede6da] border-[#e8ded2]"
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#5925dc] to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-white/20 shrink-0">
              {user?.name?.charAt(0) ?? "O"}
            </div>
            <div className="hidden xl:block text-left leading-tight">
              <p className={`text-xs font-bold truncate max-w-28 ${isDark ? "text-white" : "text-[#1e143e]"}`}>{user?.name || "Officer"}</p>
              <p className={`text-[10px] font-medium truncate max-w-28 ${isDark ? "text-slate-400" : "text-[#7e7298]"}`}>
                {user?.designation || "Officer"}
              </p>
            </div>
            <ChevronDown size={13} className={isDark ? "text-slate-400 hidden xl:block" : "text-[#7e7298] hidden xl:block"} />
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
                <User size={15} className={isDark ? "text-slate-400" : "text-[#7e7298]" } />
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
                <ShieldCheck size={15} className={isDark ? "text-slate-400" : "text-[#7e7298]" } />
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