import { ChevronDown, ArrowRight } from "lucide-react";

export default function ProgressWidget({ summary }) {
  const { percent, completed, inProgress, notStarted, month } = summary;

  // Simple SVG donut, driven entirely by `percent` — no chart library needed.
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-800">Your Progress</h3>
        <button className="text-xs text-slate-500 flex items-center gap-1 border border-slate-200 rounded-full px-2 py-1">
          {month} <ChevronDown size={12} />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="10" />
            <circle
              cx="50" cy="50" r={radius} fill="none"
              stroke="#2563EB" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-800">{percent}%</span>
            <span className="text-[11px] text-slate-400">Progress</span>
          </div>
        </div>

        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Completed <span className="ml-auto font-semibold">{completed}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
            In Progress <span className="ml-auto font-semibold">{inProgress}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            Not Started <span className="ml-auto font-semibold">{notStarted}</span>
          </li>
        </ul>
      </div>

      <button className="mt-5 text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
        View Detailed Progress <ArrowRight size={14} />
      </button>
    </div>
  );
}
