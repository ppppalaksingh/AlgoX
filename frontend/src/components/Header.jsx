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
}) {
  const { signOut } = useClerk();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("algox_theme") !== "light";
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
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
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("algox_theme");
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

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
    <header className="h-20 bg-[#090b10]/85 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4 sticky top-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      {/* Left Title & Status */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={onMenuClick}
          className="text-slate-400 hover:text-white lg:hidden p-2 rounded-xl hover:bg-white/[0.05] cursor-pointer transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-extrabold text-white leading-tight truncate text-sm sm:text-base tracking-tight">
              Algo<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">X</span>
              <span className="text-slate-300 font-semibold ml-1.5">Intelligence Hub</span>
            </p>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MoSPI &amp; iGOT Active
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate hidden sm:block mt-0.5">
            Capacity Building &amp; AI Personalized Pathways for Official Statistics
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Pill (Official ↔ Admin Toggle) */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => onToggleRole?.("learner")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentRole === "learner"
                ? "bg-white/[0.1] text-white shadow-xs border border-white/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <User size={13} /> Official
          </button>
          <button
            onClick={() => onToggleRole?.("admin")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentRole === "admin"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 size={13} /> Admin
          </button>
        </div>

        {/* Karmayogi Sahayak AI Assistant Quick Button */}
        <button
          onClick={onOpenAIAssistant}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-[0_0_18px_rgba(99,102,241,0.35)] transition-all cursor-pointer border border-white/10"
          title="Open Karmayogi Sahayak AI Statistical Mentor"
        >
          <Bot size={15} />
          <span>AI Sahayak</span>
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-2 sm:px-2.5 rounded-xl text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-all border border-white/[0.08] flex items-center gap-1.5 shadow-2xs"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <>
              <Moon size={16} className="text-indigo-400" />
              <span className="text-[11px] font-bold hidden md:inline">Dark</span>
            </>
          ) : (
            <>
              <Sun size={16} className="text-amber-400" />
              <span className="text-[11px] font-bold hidden md:inline">Light</span>
            </>
          )}
        </button>

        {/* Global Search with Real-time Dropdown */}
        <div ref={searchRef} className="relative hidden xl:block">
          <div className="flex items-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.06] rounded-full px-4 py-2 w-64 border border-white/[0.08] focus-within:border-indigo-500/50 focus-within:bg-[#0f1422] focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search courses, skills, paths..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="bg-transparent outline-none text-xs w-full text-white placeholder:text-slate-500"
            />
          </div>

          {searchOpen && searchQuery.trim().length > 1 && (
            <div className="absolute top-12 left-0 right-0 bg-[#0f1420]/95 backdrop-blur-2xl rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2.5 border-b border-white/[0.06] text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                Matching Catalog Items
              </div>
              {searchResults.length === 0 ? (
                <div className="p-4 text-xs text-slate-400 text-center">No results found</div>
              ) : (
                <div className="divide-y divide-white/[0.05]">
                  {searchResults.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => {
                        onSelectSearchResult?.(course);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="p-3 hover:bg-white/[0.05] cursor-pointer transition-colors"
                    >
                      <p className="text-xs font-semibold text-white leading-tight">{course.title}</p>
                      <p className="text-[11px] text-indigo-300 mt-0.5">{course.domain} · {course.level || "Official"}</p>
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
            className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors border border-transparent hover:border-white/[0.08]"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-gradient-to-tr from-amber-500 to-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                {notifications.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-80 bg-[#0f1422]/95 backdrop-blur-2xl rounded-2xl border border-white/[0.1] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Official Alerts</span>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.05]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No new notifications</div>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className="p-3 hover:bg-white/[0.04] transition-colors">
                      <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.description}</p>
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
            className="flex items-center gap-2.5 p-1.5 sm:px-2.5 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-[0_0_12px_rgba(99,102,241,0.3)] border border-white/20 shrink-0">
              {user?.name?.charAt(0) ?? "O"}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-bold text-white truncate max-w-32">{user?.name || "Officer"}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-32">
                {isAdminInDB ? `👑 Admin · ${user?.designation || "Assistant Director"}` : (user?.designation || "Assistant Director")}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 top-12 w-64 bg-[#0f1422]/95 backdrop-blur-2xl rounded-2xl border border-white/[0.1] shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3 border-b border-white/[0.08] mb-1 bg-white/[0.03] rounded-xl">
                <p className="text-xs font-bold text-white">{user?.name || "Officer"}</p>
                <p className="text-[11px] font-semibold text-indigo-300 mt-0.5">{user?.designation || "Assistant Director"}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email || "officer@mospi.gov.in"}</p>
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
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
              >
                <User size={15} className="text-slate-400" />
                Officer Profile &amp; Cadre
              </button>

              <button
                onClick={() => {
                  onNavigate?.("competencies");
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
              >
                <ShieldCheck size={15} className="text-slate-400" />
                My Competencies
              </button>

              <div className="border-t border-white/[0.06] my-1" />

              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
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