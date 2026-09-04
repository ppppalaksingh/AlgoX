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
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Your Real-time Progress</h3>
          <p className="text-[11px] text-slate-400">Live synced with active courses &amp; quizzes</p>
        </div>
        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 rounded-full px-2.5 py-0.5">
          {month}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="9"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="url(#progressGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{percent}%</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Mastery</span>
          </div>
        </div>

        <ul className="space-y-2.5 text-xs flex-1 w-full">
          <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              Completed Courses
            </span>
            <span className="font-bold text-emerald-700">{completed}</span>
          </li>
          <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-100" />
              In Progress
            </span>
            <span className="font-bold text-amber-700">{inProgress}</span>
          </li>
          <li className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-400 ring-4 ring-slate-100" />
              Available
            </span>
            <span className="font-bold text-slate-600">{notStarted}</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onViewDetails}
        className="mt-5 w-full py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-xs text-blue-600 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
      >
        View Detailed Progress Analytics
        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
