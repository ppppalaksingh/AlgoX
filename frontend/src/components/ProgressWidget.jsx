import { ArrowRight, CheckCircle2, Clock, CircleDot } from "lucide-react";

export default function ProgressWidget({ summary, onViewDetails }) {
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
    <div className="bg-[#0f1422]/80 backdrop-blur-xl border border-white/[0.08] p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-between">
      {/* Top edge glow sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Live Analytics</span>
            <h3 className="font-bold text-white text-base">Real-time Progress</h3>
          </div>
          <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-3 py-0.5">
            {month}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-32 h-32 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="rgba(255, 255, 255, 0.07)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="url(#progressGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
                style={{ filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white tracking-tight">{percent}%</span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Mastery</span>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs flex-1 w-full">
            <li className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="flex items-center gap-2.5 font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                Completed Modules
              </span>
              <span className="font-bold text-emerald-400">{completed}</span>
            </li>
            <li className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="flex items-center gap-2.5 font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                In Progress
              </span>
              <span className="font-bold text-amber-400">{inProgress}</span>
            </li>
            <li className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="flex items-center gap-2.5 font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                Available in iGOT
              </span>
              <span className="font-bold text-slate-300">{notStarted}</span>
            </li>
          </ul>
        </div>
      </div>

      <button
        onClick={onViewDetails}
        className="mt-5 w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-indigo-500/40 text-xs text-indigo-300 hover:text-white font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
      >
        <span>View Detailed Progress Analytics</span>
        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

