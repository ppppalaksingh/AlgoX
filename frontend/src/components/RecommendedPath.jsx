import { Target, CheckCircle2, ChevronRight, PlayCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function RecommendedPath({ path, onStart, onViewFullPath, isStarting }) {
  const steps = path?.steps || [];
  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length || 4;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800 text-sm">Recommended Cadre Roadmap</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
            {progressPct}% Completed
          </span>
        </div>
        <button
          onClick={onViewFullPath}
          className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline cursor-pointer group"
        >
          Full Roadmap <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Title banner */}
      <div className="flex items-start gap-3 bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl p-4 mb-4 border border-blue-100/80">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Target size={20} />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">{path?.title || "Python & Microdata Scrutiny Track"}</p>
          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{path?.description || "Curated based on your active competency evaluation."}</p>
        </div>
      </div>

      {/* Dynamic progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2 flex-1">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            onClick={onViewFullPath}
            className="group relative flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {/* connecting line */}
            {idx < steps.length - 1 && (
              <span className="absolute left-[19px] top-8 w-px h-6 bg-slate-200" />
            )}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-colors
                ${step.completed ? "bg-emerald-500 text-white shadow-xs" : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700"}`}
            >
              {step.completed ? <CheckCircle2 size={15} /> : step.id}
            </div>
            <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0">
                <p className={`text-xs font-semibold truncate ${step.completed ? "text-slate-800 line-through decoration-emerald-500/50" : "text-slate-700"}`}>
                  {step.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{step.description}</p>
              </div>
              {step.completed ? (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">Done</span>
              ) : (
                <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        disabled={isStarting}
        className="mt-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-md cursor-pointer"
      >
        {isStarting ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Loading Roadmap...
          </>
        ) : (
          <>
            <PlayCircle size={15} />
            {progressPct > 0 ? "Continue Learning Path" : "Start Learning Path"}
          </>
        )}
      </button>
    </div>
  );
}
