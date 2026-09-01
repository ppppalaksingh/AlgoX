import { useState } from "react";
import { Sparkles, CheckCircle2, XCircle, Award, ArrowRight, RotateCcw, X, Loader2, BookOpen } from "lucide-react";

export default function AIQuizModal({ quiz, isOpen, onClose, onSubmitAnswers, isSubmitting, result, onRunAnalysis }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);

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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">AI Generated Assessment</h2>
              <p className="text-xs text-slate-300">
                Source: <span className="font-mono text-blue-300">{quiz.sourceFileName || "Uploaded Material"}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!result ? (
            <div>
              {/* Question Navigation Tabs */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Question {currentIdx + 1} of {total}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
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
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                        isCurrent
                          ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-offset-2"
                          : isAnswered
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
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
                          className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/60 text-blue-900 shadow-xs"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 transition-colors ${
                              isSelected
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-300 text-slate-500"
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
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 rounded-xl transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {currentIdx < total - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIdx((i) => Math.min(total - 1, i + 1))}
                      className="px-5 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      Next <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!canSubmit || isSubmitting}
                      onClick={handleSubmit}
                      className="px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2"
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
              <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md mb-3">
                  <Award size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Quiz Completed!</h3>
                <p className="text-xs text-slate-500 mt-1">Here is how you performed</p>
                <div className="mt-4 flex items-center justify-center gap-6">
                  <div>
                    <span className="text-3xl font-extrabold text-blue-600">{result.score}</span>
                    <span className="text-slate-400 text-sm font-medium">/{result.total}</span>
                    <p className="text-xs text-slate-500">Correct Answers</p>
                  </div>
                  <div className="w-px h-10 bg-slate-200" />
                  <div>
                    <span className="text-3xl font-extrabold text-emerald-600">{result.percentage}%</span>
                    <p className="text-xs text-slate-500">Overall Score</p>
                  </div>
                </div>
              </div>

              {/* Question breakdown */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Review &amp; Explanations
                </h4>
                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 text-sm space-y-1.5 bg-white">
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800">{idx + 1}. {q.question}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Your answer: <span className={isCorrect ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>{userAns || "None"}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-xs text-slate-600">
                              Correct answer: <span className="text-emerald-600 font-semibold">{q.correctAnswer}</span>
                            </p>
                          )}
                          {q.explanation && (
                            <p className="text-xs text-slate-400 bg-slate-50 p-2 rounded-lg mt-1 italic">
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
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw size={16} /> Retake Quiz
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRunAnalysis?.();
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
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
