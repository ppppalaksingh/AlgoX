import { ArrowRight, CheckCircle2, Clock, CircleDot } from "lucide-react";

export default function ProgressWidget({ summary, onViewDetails, isDarkMode = true }) {
  const {
    percent = 0,
    completed = 0,
    inProgress = 0,
    notStarted = 0,
    month = "This Quarter",
  } = summary || {};

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className={`p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between border transition-all duration-300 ${
      isDarkMode
        ? "bg-[#1b1242]/85 border-white/[0.08] shadow-[0_10px_30px_rgba(10,5,30,0.4)]"
        : "bg-white border-[#e8ded2] shadow-[0_8px_24px_-6px_rgba(30,20,60,0.05),0_1px_3px_rgba(0,0,0,0.03)]"
    }`}>
      {/* Top edge glow sheen */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] ${
        isDarkMode ? "bg-gradient-to-r from-transparent via-white/15 to-transparent" : "bg-gradient-to-r from-transparent via-[#e8ded2] to-transparent"
      }`} />

      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${
              isDarkMode ? "text-indigo-400" : "text-[#5925dc]"
            }`}>Live Analytics</span>
            <h3 className={`font-extrabold text-base font-serif tracking-tight ${
              isDarkMode ? "text-white" : "text-[#1e143e]"
            }`}>Real-time Progress</h3>
          </div>
          <span className={`text-[11px] font-bold rounded-full px-3 py-0.5 border ${
            isDarkMode
              ? "text-indigo-300 bg-indigo-500/15 border-indigo-500/30"
              : "text-[#5925dc] bg-[#5925dc]/10 border-[#5925dc]/25"
          }`}>
            {month}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-32 h-32 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <defs>
                <linearGradient id="najabaProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#5925DC" />
                  <stop offset="100%" stopColor="#E2AC52" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#efe8de"}
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="url(#najabaProgressGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black font-serif tracking-tight ${
                isDarkMode ? "text-white" : "text-[#1e143e]"
              }`}>{percent}%</span>
              <span className={`text-[9px] uppercase font-bold tracking-widest ${
                isDarkMode ? "text-slate-400" : "text-[#7e7298]"
              }`}>Mastery</span>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs flex-1 w-full">
            <li className={`flex items-center justify-between p-2.5 rounded-xl border ${
              isDarkMode ? "bg-white/[0.03] border-white/[0.06]" : "bg-[#faf7f2] border-[#e8ded2]"
            }`}>
              <span className={`flex items-center gap-2.5 font-medium ${
                isDarkMode ? "text-slate-300" : "text-[#4a3e65]"
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
                Completed Modules
              </span>
              <span className="font-bold text-emerald-500">{completed}</span>
            </li>
            <li className={`flex items-center justify-between p-2.5 rounded-xl border ${
              isDarkMode ? "bg-white/[0.03] border-white/[0.06]" : "bg-[#faf7f2] border-[#e8ded2]"
            }`}>
              <span className={`flex items-center gap-2.5 font-medium ${
                isDarkMode ? "text-slate-300" : "text-[#4a3e65]"
              }`}>
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs" />
                In Progress
              </span>
              <span className="font-bold text-amber-500">{inProgress}</span>
            </li>
            <li className={`flex items-center justify-between p-2.5 rounded-xl border ${
              isDarkMode ? "bg-white/[0.03] border-white/[0.06]" : "bg-[#faf7f2] border-[#e8ded2]"
            }`}>
              <span className={`flex items-center gap-2.5 font-medium ${
                isDarkMode ? "text-slate-300" : "text-[#4a3e65]"
              }`}>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Available in iGOT
              </span>
              <span className={`font-bold ${isDarkMode ? "text-slate-300" : "text-[#1e143e]"}`}>{notStarted}</span>
            </li>
          </ul>
        </div>
      </div>

      <button
        onClick={onViewDetails}
        className={`mt-5 w-full py-2.5 rounded-full border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer group ${
          isDarkMode
            ? "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] hover:border-indigo-500/40 text-indigo-300 hover:text-white"
            : "bg-white hover:bg-[#faf7f2] border-[#e8ded2] hover:border-[#5925dc] text-[#5925dc]"
        }`}
      >
        <span>View Detailed Progress Analytics</span>
        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
