import { useState, useRef } from "react";
import {
  Sparkles,
  UploadCloud,
  Bot,
  Loader2,
  CheckCircle2,
  FileText,
  Clock,
  Award,
  ChevronRight,
  RotateCcw,
  Eye,
  AlertCircle,
  HelpCircle,
  FileSpreadsheet,
  Layers,
  FileCheck
} from "lucide-react";

export default function AIQuizGenerator({
  onUpload,
  onGenerateSample,
  isGenerating,
  attempts = [],
  onReviewAttempt,
  showHistory = true,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    setFileName(file.name);
    onUpload?.(file);
  };

  const filteredAttempts = (attempts || []).filter((att) => {
    const name = (att.sourceFileName || "").toLowerCase();
    return name.includes(searchFilter.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Upload Box Card */}
      <div className="bg-[#0f1422]/80 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-7 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-5 relative overflow-hidden">
        {/* Top edge glow sheen */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles size={11} className="text-purple-400" /> AI Question Generator
              </span>
              <span className="text-[11px] text-slate-400">Gemini 3.6 Flash &amp; MoSPI NLP</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white font-serif tracking-tight">
              Civil Services Assessment Generator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              Upload your PPT, PDF, or document. The AI extracts concepts and synthesizes randomized, official-standard examination questions.
            </p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-[#5925dc] text-white flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(89,37,220,0.4)] border border-white/20">
            <Bot size={20} />
          </div>
        </div>

        {/* 2-Column Responsive Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Drag & Drop Zone */}
          <div className="lg:col-span-7">
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFiles(e.dataTransfer.files);
              }}
              className={`flex items-center gap-3.5 border-2 border-dashed rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-indigo-500 bg-indigo-500/10 scale-[0.99]"
                  : "border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.02] bg-black/25"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.ppt,.pptx,.docx,.txt,.csv"
                className="hidden"
                disabled={isGenerating}
                onChange={(e) => handleFiles(e.target.files)}
              />

              {isGenerating ? (
                <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <Loader2 size={22} className="animate-spin" />
                </div>
              ) : fileName ? (
                <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 size={22} />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 text-indigo-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  <UploadCloud size={22} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  {isGenerating
                    ? "Extracting concepts & synthesizing questions..."
                    : fileName
                    ? fileName
                    : "Click or drag your Presentation / Document here"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports PPT, PPTX, PDF, DOCX, TXT (Extracts slide content)
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons & Features */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
              <span className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-lg font-medium">
                5 MCQs
              </span>
              <span className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-lg font-medium">
                MoSPI Standards
              </span>
              <span className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-lg font-medium">
                Auto Saved
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => inputRef.current?.click()}
                disabled={isGenerating}
                className="w-full sm:flex-1 btn-najaba-purple disabled:opacity-60 transition-all text-xs font-bold py-2.5 px-5 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Analyzing Slide Content...
                  </>
                ) : (
                  <>
                    <UploadCloud size={14} /> Upload &amp; Generate Quiz
                  </>
                )}
              </button>

              <button
                onClick={onGenerateSample}
                disabled={isGenerating}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Sparkles size={14} className="text-[#e2ac52]" /> MoSPI Sample
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Assessments & Quiz History Section */}
      {showHistory && (
        <div className="bg-[#0f1422]/80 backdrop-blur-xl border border-white/[0.08] p-6 sm:p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <FileCheck size={18} className="text-emerald-400" />
                <h3 className="text-lg font-bold text-white">
                  Assessment History &amp; Saved Records
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                All attempted quizzes and results are permanently stored in the database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 bg-white/[0.05] border border-white/10 text-slate-300 rounded-xl">
                {attempts?.length || 0} Assessments Recorded
              </span>
            </div>
          </div>

          {/* List of Previous Quiz Attempts */}
          {filteredAttempts.length === 0 ? (
            <div className="text-center py-10 px-4 bg-black/20 rounded-2xl border border-dashed border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
                <HelpCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">No Assessment Records Yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                  Upload your presentation or document above and submit the quiz. Your scores and review rubrics will be automatically saved here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAttempts.map((att, idx) => {
                const totalQ = att.totalQuestions || att.questions?.length || 5;
                const score = att.score ?? 0;
                const pct = Math.round((score / totalQ) * 100);
                const isPassed = pct >= 70;
                const dateStr = att.createdAt
                  ? new Date(att.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Recent Attempt";

                const isPPT = (att.sourceFileName || "").toLowerCase().includes("ppt");
                const isPDF = (att.sourceFileName || "").toLowerCase().includes("pdf");

                return (
                  <div
                    key={att._id || idx}
                    className="p-4 sm:p-5 rounded-2xl border border-white/[0.07] hover:border-indigo-500/40 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                          isPPT
                            ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                            : isPDF
                            ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                            : "bg-blue-500/15 border-blue-500/30 text-blue-400"
                        }`}
                      >
                        <FileText size={20} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-sm font-bold text-white truncate">
                            {att.sourceFileName || "Official Statistics Document"}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                              isPassed
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {isPassed ? "Passed (Proficient)" : "Needs Review"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {dateStr}
                          </span>
                          <span>•</span>
                          <span>{totalQ} Questions</span>
                          <span>•</span>
                          <span className="text-indigo-400 font-semibold">
                            {isPassed ? "+3% Competency Boost" : "Recalibrated in MongoDB"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Score & Action Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
                      <div className="text-right">
                        <div className="flex items-baseline gap-1 justify-end">
                          <span className={`text-xl font-black ${isPassed ? "text-emerald-400" : "text-amber-400"}`}>
                            {score}
                          </span>
                          <span className="text-xs text-slate-400">/{totalQ}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {pct}% Score
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onReviewAttempt?.(att)}
                        className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye size={14} /> Review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

