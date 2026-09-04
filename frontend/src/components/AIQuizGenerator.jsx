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
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center gap-1">
                <Sparkles size={12} className="text-purple-600" /> AI-Powered Question Generator
              </span>
              <span className="text-[11px] font-medium text-slate-400">Gemini 3.6 Flash &amp; MoSPI NLP</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Civil Services Assessment Generator
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Upload your PPT, PDF, or document. The AI extracts the exact concepts and builds challenging, randomized multiple-choice examination questions.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Bot size={24} />
          </div>
        </div>

        {/* Drag & Drop Zone */}
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
          className={`flex flex-col items-center justify-center text-center gap-3 border-2 border-dashed rounded-2xl p-8 sm:p-10 cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-50/80 scale-[0.99]"
              : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/70 bg-slate-50/30"
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
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : fileName ? (
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
              <UploadCloud size={30} />
            </div>
          )}

          <div>
            <p className="text-sm font-bold text-slate-800">
              {isGenerating
                ? "Extracting slides/text & generating AI questions..."
                : fileName
                ? fileName
                : "Click or drag your Presentation or Document here"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports PPT, PPTX, PDF, DOCX, TXT (Extracts exact slide content)
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-medium shadow-2xs">
              5 High-Impact MCQs
            </span>
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-medium shadow-2xs">
              MoSPI Cadre Standards
            </span>
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-medium shadow-2xs">
              Auto Saved to Database
            </span>
          </div>
        </label>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={isGenerating}
            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Analyzing Slide Content...
              </>
            ) : (
              <>
                <UploadCloud size={16} /> Choose File &amp; Generate Assessment
              </>
            )}
          </button>

          <button
            onClick={onGenerateSample}
            disabled={isGenerating}
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <Sparkles size={15} className="text-purple-600" /> Try Official MoSPI Sample
          </button>
        </div>
      </div>

      {/* Saved Assessments & Quiz History Section (Rendered only on dedicated AI Quiz page, not cluttered on main dashboard) */}
      {showHistory && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <FileCheck size={18} className="text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Assessment History &amp; Saved Quiz Records
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                All your attempted quizzes and results are permanently stored in the database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-xl">
                {attempts?.length || 0} Assessments Recorded
              </span>
            </div>
          </div>

          {/* List of Previous Quiz Attempts */}
          {filteredAttempts.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
                <HelpCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">No Assessment Records Yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-0.5">
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
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                          isPPT
                            ? "bg-orange-50 text-orange-600"
                            : isPDF
                            ? "bg-rose-50 text-rose-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        <FileText size={20} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {att.sourceFileName || "Official Statistics Document"}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                              isPassed
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
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
                          <span>{totalQ} Questions Evaluated</span>
                          <span>•</span>
                          <span className="text-blue-600 font-semibold">
                            {isPassed ? "+5% Competency Boost" : "Recalibrated in MongoDB"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Score & Action Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="flex items-baseline gap-1 justify-end">
                          <span className={`text-xl font-black ${isPassed ? "text-emerald-600" : "text-amber-600"}`}>
                            {score}
                          </span>
                          <span className="text-xs text-slate-400">/{totalQ}</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">
                          {pct}% Score
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onReviewAttempt?.(att)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                      >
                        <Eye size={14} /> Review Questions
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
