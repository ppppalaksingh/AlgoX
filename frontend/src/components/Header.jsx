import { useState, useRef, useEffect } from "react";
import { Menu, Search, Bell, ChevronDown, User, LogOut, ShieldCheck, Sparkles, Bot, Building2, Lock } from "lucide-react";
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
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 gap-4 sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="text-slate-500 hover:text-slate-700 lg:hidden p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-extrabold text-slate-800 leading-tight truncate text-sm sm:text-base tracking-tight">
              AlgoX <span className="text-orange-500">Skill Intelligence</span>
            </p>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              MoSPI &amp; iGOT Ecosystem
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate hidden sm:block">
            Capacity Building &amp; AI Personalized Pathways for Official Statistics
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Pill — Strictly protected by Database Admin Verification */}
        {isAdminInDB ? (
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onToggleRole?.("learner")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                currentRole === "learner"
                  ? "bg-white text-blue-600 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <User size={13} /> Official View
            </button>
            <button
              onClick={() => onToggleRole?.("admin")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                currentRole === "admin"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Building2 size={13} /> 👑 Admin View
            </button>
          </div>
        ) : (
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold">
            <User size={13} className="text-blue-600" />
            <span>Official (Learner View)</span>
          </div>
        )}

        {/* Karmayogi Sahayak AI Assistant Quick Button */}
        <button
          onClick={onOpenAIAssistant}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs transition"
          title="Open Karmayogi Sahayak AI Statistical Mentor"
        >
          <Bot size={15} />
          <span>AI Sahayak</span>
        </button>

        {/* Global Search with Real-time Dropdown */}
        <div ref={searchRef} className="relative hidden xl:block">
          <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-50 rounded-full px-4 py-2 w-60 border border-slate-200/80 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
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
              className="bg-transparent outline-none text-xs w-full text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {searchOpen && searchQuery.trim().length > 1 && (
            <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                Matching Catalog Items
              </div>
              {searchResults.length === 0 ? (
                <div className="p-4 text-xs text-slate-500 text-center">No results found</div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {searchResults.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => {
                        onSelectSearchResult?.(course);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="p-3 hover:bg-blue-50/60 cursor-pointer transition-colors"
                    >
                      <p className="text-xs font-semibold text-slate-800 leading-tight">{course.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{course.domain} · {course.level || "Official"}</p>
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
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <Bell size={19} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {notifications.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Official Alerts</span>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No new notifications</div>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className="p-3 hover:bg-slate-50 transition-colors">
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{n.description}</p>
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
            className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              {user?.name?.charAt(0) ?? "O"}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-bold text-slate-800 truncate max-w-28">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize">
                {isAdminInDB ? "👑 MoSPI Admin" : "Officer"}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || "officer@mospi.gov.in"}</p>
                {isAdminInDB && (
                  <span className="inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    👑 Verified Database Admin
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  onNavigate?.("profile");
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <User size={15} className="text-slate-400" />
                Officer Profile &amp; Cadre
              </button>

              <button
                onClick={() => {
                  onNavigate?.("competencies");
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <ShieldCheck size={15} className="text-slate-400" />
                My Competencies
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
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