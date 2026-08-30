import { useState, useRef } from "react";
import { Sparkles, UploadCloud, Bot } from "lucide-react";

export default function AIQuizGenerator({ onUpload, onGenerateSample }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    setFileName(file.name);
    onUpload?.(file); // hook for the backend team to wire up an actual upload
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
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
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center text-center gap-2 border-2 border-dashed rounded-xl px-4 py-8 cursor-pointer transition-colors
          ${isDragging ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.ppt,.pptx,.docx,.txt"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <UploadCloud size={26} className="text-blue-500" />
        <p className="text-sm font-medium text-slate-700">
          {fileName ? fileName : "Drag & drop your file here"}
        </p>
        <p className="text-xs text-slate-400">PDF, PPT, DOCX, TXT (Max 20MB)</p>
      </label>

      <button
        onClick={() => inputRef.current?.click()}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2.5 rounded-xl"
      >
        Upload Material
      </button>

      <button
        onClick={onGenerateSample}
        className="w-full mt-2 text-sm text-blue-600 font-medium flex items-center justify-center gap-1 hover:underline"
      >
        <Sparkles size={14} /> Generate Sample Quiz
      </button>
    </div>
  );
}
