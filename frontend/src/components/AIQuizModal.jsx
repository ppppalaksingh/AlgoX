import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, XCircle, Award, ArrowRight, RotateCcw, X, Loader2, BookOpen } from "lucide-react";

export default function AIQuizModal({ quiz, isOpen, onClose, onSubmitAnswers, isSubmitting, result, onRunAnalysis, onRetake }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);

  // Automatically reset selections when opening a fresh quiz
  useEffect(() => {
    if (isOpen && !result) {
      setSelectedAnswers({});
      setCurrentIdx(0);
    }
  }, [isOpen, quiz?._id, result]);

  if (!isOpen || !quiz) return null;

  const questions = quiz.questions || [];
  const total = questions.length;
  const currentQ = questions[currentIdx];

  const handleSelectOption = (opt) => {
    if (result) return; // Locked after submitting
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: opt,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const canSubmit = answeredCount === total;

  const handleSubmit = () => {
    const answersArray = questions.map((_, i) => selectedAnswers[i] || "");
    onSubmitAnswers?.(quiz._id, answersArray);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    onRetake?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0c101d] rounded-3xl border border-white/[0.12] shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/25 shadow-inner">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight text-white">AI Generated Assessment</h2>
              <p className="text-xs text-slate-400">
                Source: <span className="font-mono text-blue-300">{quiz.sourceFileName || "Uploaded Material"}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!result ? (
            <div>
              {/* Question Navigation Tabs */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Question {currentIdx + 1} of {total}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-500/15 text-blue-300 rounded-full border border-blue-500/20">
                  {answeredCount}/{total} Answered
                </span>
              </div>

              {/* Question pagination pills */}
              <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
                {questions.map((_, idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        isCurrent
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-500/40"
                          : isAnswered
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Question */}
              {currentQ && (
                <div className="space-y-4">
                  <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.08]">
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      {currentQ.question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentQ.options?.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentIdx] === opt;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(opt)}
                          className={`w-full text-left p-3.5 rounded-2xl border text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                            isSelected
                              ? "border-blue-500/60 bg-blue-500/15 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30"
                              : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] text-slate-300"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                              isSelected
                                ? "border-blue-400 bg-blue-600 text-white"
                                : "border-white/20 text-slate-400"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer controls */}
              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 rounded-xl transition cursor-pointer"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {currentIdx < total - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIdx((i) => Math.min(total - 1, i + 1))}
                      className="px-5 py-2.5 text-sm font-bold bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-white/[0.08]"
                    >
                      Next <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!canSubmit || isSubmitting}
                      onClick={handleSubmit}
                      className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} /> Submit Quiz
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6">
              <div className="text-center py-6 bg-white/[0.03] rounded-3xl border border-white/[0.08]">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 mb-3 border border-white/10">
                  <Award size={28} />
                </div>
                <h3 className="text-lg font-bold text-white">Quiz Completed!</h3>
                <p className="text-xs text-slate-400 mt-1">Here is how you performed</p>
                <div className="mt-4 flex items-center justify-center gap-8">
                  <div>
                    <span className="text-3xl font-extrabold text-blue-400">{result.score}</span>
                    <span className="text-slate-500 text-sm font-medium">/{result.total}</span>
                    <p className="text-xs text-slate-400 mt-0.5">Correct Answers</p>
                  </div>
                  <div className="w-px h-10 bg-white/[0.08]" />
                  <div>
                    <span className="text-3xl font-extrabold text-emerald-400">{result.percentage}%</span>
                    <p className="text-xs text-slate-400 mt-0.5">Overall Score</p>
                  </div>
                  {result?.recalibratedProfile?.overallReadiness != null && (
                    <>
                      <div className="w-px h-10 bg-white/[0.08]" />
                      <div>
                        <span className="text-3xl font-extrabold text-amber-400">
                          {Number(result.recalibratedProfile.overallReadiness) % 1 === 0
                            ? `${result.recalibratedProfile.overallReadiness}%`
                            : `${Number(result.recalibratedProfile.overallReadiness).toFixed(1)}%`}
                        </span>
                        <p className="text-xs text-slate-400 mt-0.5">Updated Readiness</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Question breakdown */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Review &amp; Explanations
                </h4>
                {questions.map((q, idx) => {
                  const evalItem = result?.evaluations?.find((e) => e.questionIndex === idx) || result?.evaluations?.[idx];
                  const userAns = evalItem?.userAnswer != null && evalItem?.userAnswer !== ""
                    ? evalItem.userAnswer
                    : (selectedAnswers[idx] || "Not answered");
                  
                  const cleanU = userAns ? userAns.toString().trim().toLowerCase().replace(/^[a-d][\.\)\:\-]\s*/i, "").replace(/\s+/g, " ") : "";
                  const cleanC = q.correctAnswer ? q.correctAnswer.toString().trim().toLowerCase().replace(/^[a-d][\.\)\:\-]\s*/i, "").replace(/\s+/g, " ") : "";
                  
                  const isCorrect = evalItem != null ? Boolean(evalItem.isCorrect) : Boolean(cleanU && cleanC && cleanU === cleanC);

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border text-sm space-y-1.5 transition-all ${
                        isCorrect
                          ? "border-emerald-500/30 bg-emerald-500/10"
                          : "border-rose-500/30 bg-rose-500/10"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {isCorrect ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 size={15} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                            <XCircle size={15} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-bold text-white text-xs">
                              Question {idx + 1}
                            </p>
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isCorrect
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              }`}
                            >
                              {isCorrect ? "Correct ✓" : "Incorrect ✗"}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-200 mt-1 leading-snug">
                            {q.question}
                          </p>

                          <div className="mt-2 text-xs space-y-1">
                            <p className="text-slate-400">
                              Your answer:{" "}
                              <span
                                className={`font-semibold ${
                                  isCorrect ? "text-emerald-300" : "text-rose-300 underline"
                                }`}
                              >
                                {userAns}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-slate-300">
                                Correct answer:{" "}
                                <span className="font-semibold text-emerald-300">
                                  {q.correctAnswer}
                                </span>
                              </p>
                            )}
                          </div>

                          {q.explanation && (
                            <p className="text-xs text-slate-400 bg-white/[0.03] border border-white/[0.06] p-2.5 rounded-xl mt-2 italic">
                              💡 {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RotateCcw size={16} /> Retake Quiz
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRunAnalysis?.();
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Sparkles size={16} /> Run Gap Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
