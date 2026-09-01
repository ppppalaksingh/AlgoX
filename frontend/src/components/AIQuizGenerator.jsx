import { useState, useRef } from "react";
import { Sparkles, UploadCloud, Bot, Loader2, CheckCircle2 } from "lucide-react";

export default function AIQuizGenerator({ onUpload, onGenerateSample, isGenerating }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    setFileName(file.name);
    onUpload?.(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-purple-600" />
          <h3 className="font-semibold text-slate-800">AI Quiz Generator</h3>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
          <Bot size={18} className="text-blue-600" />
        </div>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Upload your study material and get AI-generated quizzes, MCQs and assessments.
      </p>

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
        className={`flex flex-col items-center justify-center text-center gap-2 border-2 border-dashed rounded-xl px-4 py-8 cursor-pointer transition-all duration-150
          ${
            isDragging
              ? "border-blue-500 bg-blue-50/80 scale-[0.99]"
              : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/60"
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.ppt,.pptx,.docx,.txt"
          className="hidden"
          disabled={isGenerating}
          onChange={(e) => handleFiles(e.target.files)}
        />
        {isGenerating ? (
          <Loader2 size={28} className="text-blue-600 animate-spin" />
        ) : fileName ? (
          <CheckCircle2 size={28} className="text-emerald-500" />
        ) : (
          <UploadCloud size={28} className="text-blue-500" />
        )}

        <p className="text-sm font-medium text-slate-700">
          {isGenerating
            ? "Analyzing document & generating quiz..."
            : fileName
            ? fileName
            : "Drag & drop your file here"}
        </p>
        <p className="text-xs text-slate-400">PDF, PPTX, DOCX, TXT (Max 20MB)</p>
      </label>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={isGenerating}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
      >
        {isGenerating ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            <UploadCloud size={16} /> Upload Material
          </>
        )}
      </button>

      <button
        onClick={onGenerateSample}
        disabled={isGenerating}
        className="w-full mt-2 text-sm text-blue-600 font-medium flex items-center justify-center gap-1.5 hover:underline disabled:opacity-50 py-1 cursor-pointer transition-colors"
      >
        <Sparkles size={14} /> Generate Sample Quiz
      </button>
    </div>
  );
}
