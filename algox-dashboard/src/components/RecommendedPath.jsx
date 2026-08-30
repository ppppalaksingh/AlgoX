import { Target, CheckCircle2, ChevronRight, PlayCircle, ArrowRight } from "lucide-react";

export default function RecommendedPath({ path, onStart }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-800">Recommended Learning Path</h3>
        <button className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
          View Full Path <ArrowRight size={14} />
        </button>
      </div>

      {/* Title banner */}
      <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 mb-5">
        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
          <Target size={18} />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">{path.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{path.description}</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-1 flex-1">
        {path.steps.map((step, idx) => (
          <div key={step.id} className="relative flex items-start gap-3 pb-4">
            {/* connecting line */}
            {idx < path.steps.length - 1 && (
              <span className="absolute left-[13px] top-7 w-px h-full bg-slate-200" />
            )}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 z-10
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
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
              ) : (
                <ChevronRight size={18} className="text-slate-300 shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-2"
      >
        <PlayCircle size={16} />
        Start Learning Path
      </button>
    </div>
  );
}
