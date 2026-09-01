import { Target, CheckCircle2, ChevronRight, PlayCircle, ArrowRight, Loader2 } from "lucide-react";

export default function RecommendedPath({ path, onStart, onViewFullPath, isStarting }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-800">Recommended Learning Path</h3>
        <button
          onClick={onViewFullPath}
          className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline cursor-pointer"
        >
          View Full Path <ArrowRight size={14} />
        </button>
      </div>

      {/* Title banner */}
      <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 mb-5 border border-blue-100/70">
        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
          <Target size={18} />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">{path?.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{path?.description}</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-1 flex-1">
        {path?.steps?.map((step, idx) => (
          <div key={step.id} className="relative flex items-start gap-3 pb-4">
            {/* connecting line */}
            {idx < path.steps.length - 1 && (
              <span className="absolute left-[13px] top-7 w-px h-full bg-slate-200" />
            )}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 z-10 transition-colors
                ${step.completed ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              {step.id}
            </div>
            <div className="flex-1 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-800">{step.title}</p>
                <p className="text-xs text-slate-500">{step.description}</p>
              </div>
              {step.completed ? (
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              ) : (
                <ChevronRight size={18} className="text-slate-300 shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        disabled={isStarting}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
      >
        {isStarting ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Starting Path...
          </>
        ) : (
          <>
            <PlayCircle size={16} />
            Start Learning Path
          </>
        )}
      </button>
    </div>
  );
}
