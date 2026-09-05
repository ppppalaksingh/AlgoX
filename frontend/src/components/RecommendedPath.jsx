import { Target, CheckCircle2, ChevronRight, PlayCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function RecommendedPath({ path, onStart, onViewFullPath, isStarting, isDarkMode = true }) {
  const steps = path?.steps || [];
  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length || 4;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className={`p-6 rounded-3xl flex flex-col justify-between h-full relative overflow-hidden group border transition-all duration-300 ${
      isDarkMode
        ? "bg-[#1b1242]/85 border-white/[0.08] shadow-[0_10px_30px_rgba(10,5,30,0.4)]"
        : "bg-white border-[#e8ded2] shadow-[0_8px_24px_-6px_rgba(30,20,60,0.05),0_1px_3px_rgba(0,0,0,0.03)]"
    }`}>
      {/* Top edge glow sheen */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] ${
        isDarkMode ? "bg-gradient-to-r from-transparent via-white/15 to-transparent" : "bg-gradient-to-r from-transparent via-[#e8ded2] to-transparent"
      }`} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${
              isDarkMode ? "text-indigo-400" : "text-[#5925dc]"
            }`}>NSSTA &amp; iGOT Roadmap</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
              isDarkMode
                ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                : "bg-[#5925dc]/10 text-[#5925dc] border-[#5925dc]/25"
            }`}>
              {progressPct}% Completed
            </span>
          </div>
          <button
            onClick={onViewFullPath}
            className={`text-xs font-semibold flex items-center gap-1 cursor-pointer group ${
              isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-[#5925dc] hover:underline"
            }`}
          >
            <span>Roadmap</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Title banner */}
        <div className={`flex items-start gap-3 rounded-2xl p-4 mb-4 border ${
          isDarkMode
            ? "bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border-indigo-500/20"
            : "bg-[#faf7f2] border-[#e8ded2]"
        }`}>
          <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-sm border border-white/20 ${
            isDarkMode ? "bg-gradient-to-br from-[#7c3aed] to-[#5925dc]" : "bg-[#5925dc]"
          }`}>
            <Target size={20} />
          </div>
          <div className="min-w-0">
            <p className={`font-bold text-xs sm:text-sm truncate font-serif ${
              isDarkMode ? "text-white" : "text-[#1e143e]"
            }`}>
              {path?.title || "Python & Microdata Scrutiny Track"}
            </p>
            <p className={`text-[11px] line-clamp-2 mt-0.5 leading-relaxed ${
              isDarkMode ? "text-slate-400" : "text-[#635777]"
            }`}>
              {path?.description || "Curated based on your active competency evaluation."}
            </p>
          </div>
        </div>

        {/* Dynamic progress bar */}
        <div className={`w-full rounded-full h-1.5 mb-4 overflow-hidden ${
          isDarkMode ? "bg-white/[0.06]" : "bg-[#f1ebd8]"
        }`}>
          <div
            className="bg-gradient-to-r from-[#7c3aed] via-[#5925dc] to-[#e2ac52] h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-1.5">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              onClick={onViewFullPath}
              className={`group/step relative flex items-start gap-3 p-2 rounded-xl transition-colors cursor-pointer ${
                isDarkMode ? "hover:bg-white/[0.04]" : "hover:bg-[#faf7f2]"
              }`}
            >
              {/* connecting line */}
              {idx < steps.length - 1 && (
                <span className={`absolute left-[19px] top-8 w-px h-6 ${
                  isDarkMode ? "bg-white/10" : "bg-[#e8ded2]"
                }`} />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-all ${
                  step.completed
                    ? "bg-emerald-500 text-white shadow-xs"
                    : isDarkMode
                      ? "bg-white/[0.06] text-slate-400 border border-white/10 group-hover/step:bg-indigo-500/20 group-hover/step:text-indigo-300"
                      : "bg-[#f6f1e9] text-[#7e7298] border border-[#e8ded2] group-hover/step:bg-[#5925dc]/10 group-hover/step:text-[#5925dc]"
                }`}
              >
                {step.completed ? <CheckCircle2 size={15} /> : step.id}
              </div>
              <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${
                    step.completed
                      ? isDarkMode ? "text-slate-400 line-through decoration-emerald-400/50" : "text-[#7e7298] line-through decoration-emerald-500"
                      : isDarkMode ? "text-slate-200" : "text-[#1e143e]"
                  }`}>
                    {step.title}
                  </p>
                  <p className={`text-[11px] truncate ${
                    isDarkMode ? "text-slate-400" : "text-[#635777]"
                  }`}>{step.description}</p>
                </div>
                {step.completed ? (
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md shrink-0">
                    Done
                  </span>
                ) : (
                  <ChevronRight size={14} className={`${
                    isDarkMode ? "text-slate-500 group-hover/step:text-indigo-400" : "text-[#7e7298] group-hover/step:text-[#5925dc]"
                  } transition-colors shrink-0`} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onStart}
        disabled={isStarting}
        className={`mt-4 w-full text-xs font-bold py-2.5 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60 ${
          isDarkMode
            ? "btn-najaba-gold"
            : "btn-najaba-purple"
        }`}
      >
        {isStarting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Enrolling in Path...</span>
          </>
        ) : (
          <>
            <PlayCircle size={15} />
            <span>Resume Recommended Path</span>
          </>
        )}
      </button>
    </div>
  );
}
