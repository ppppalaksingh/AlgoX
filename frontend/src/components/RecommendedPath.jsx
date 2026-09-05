import { Target, CheckCircle2, ChevronRight, PlayCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function RecommendedPath({ path, onStart, onViewFullPath, isStarting }) {
  const steps = path?.steps || [];
  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length || 4;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-[#0f1422]/80 backdrop-blur-xl border border-white/[0.08] p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Top edge glow sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Target Roadmap</span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {progressPct}% Completed
            </span>
          </div>
          <button
            onClick={onViewFullPath}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer group"
          >
            <span>Roadmap</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Title banner */}
        <div className="flex items-start gap-3 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-purple-500/10 rounded-2xl p-4 mb-4 border border-indigo-500/20">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-white/20">
            <Target size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white text-xs sm:text-sm truncate">
              {path?.title || "Python & Microdata Scrutiny Track"}
            </p>
            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
              {path?.description || "Curated based on your active competency evaluation."}
            </p>
          </div>
        </div>

        {/* Dynamic progress bar */}
        <div className="w-full bg-white/[0.06] rounded-full h-1.5 mb-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-1.5">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              onClick={onViewFullPath}
              className="group/step relative flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              {/* connecting line */}
              {idx < steps.length - 1 && (
                <span className="absolute left-[19px] top-8 w-px h-6 bg-white/10" />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-all
                  ${step.completed
                    ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    : "bg-white/[0.06] text-slate-400 border border-white/10 group-hover/step:bg-indigo-500/20 group-hover/step:text-indigo-300"}`}
              >
                {step.completed ? <CheckCircle2 size={15} /> : step.id}
              </div>
              <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${step.completed ? "text-slate-400 line-through decoration-emerald-400/50" : "text-slate-200"}`}>
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{step.description}</p>
                </div>
                {step.completed ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md shrink-0">
                    Done
                  </span>
                ) : (
                  <ChevronRight size={14} className="text-slate-500 group-hover/step:text-indigo-400 transition-colors shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onStart}
        disabled={isStarting}
        className="mt-4 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-60 transition-all text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(99,102,241,0.35)] cursor-pointer"
      >
        {isStarting ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Loading Pathway...
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

