import { Menu, Search, Bell, ChevronDown, Globe } from "lucide-react";

export default function Header({ user }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <button className="text-slate-500 hover:text-slate-700 lg:hidden">
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 leading-tight truncate">
            Smart Learning. <span className="text-orange-500">Stronger India.</span>
          </p>
          <p className="text-xs text-slate-500 truncate">
            AI-Powered Personalized Learning Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search — hidden on small screens to keep it simple/responsive */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 w-72">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
          />
        </div>

        {/* Language */}
        <button className="hidden sm:flex items-center gap-1 text-sm text-slate-600 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50">
          <Globe size={14} />
          English
          <ChevronDown size={14} />
        </button>

        {/* Notifications */}
        <button className="relative text-slate-500 hover:text-slate-700">
          <Bell size={20} />
          {user?.notificationsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
              {user.notificationsCount}
            </span>
          )}
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
            {user?.name?.charAt(0) ?? "U"}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">Welcome back!</p>
          </div>
        </div>
      </div>
    </header>
  );
}
