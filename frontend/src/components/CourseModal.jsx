import { useState } from "react";
import { BookOpen, CheckCircle2, Play, Clock, Award, X, Sparkles, FileText, Check } from "lucide-react";
import { getColor } from "../data/colorMap";

export default function CourseModal({ course, isOpen, onClose, onCompleteCourse }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [completedModules, setCompletedModules] = useState([0]);

  if (!isOpen || !course) return null;

  const color = getColor(course.color);

  const modules = [
    { title: "Module 1: Foundations & Overview", duration: "25 mins", type: "Video Lecture" },
    { title: "Module 2: Methodologies & Government Frameworks", duration: "40 mins", type: "Interactive Guide" },
    { title: "Module 3: Hands-on Practical Case Studies", duration: "45 mins", type: "Practical Lab" },
    { title: "Module 4: Final Assessment & Certification", duration: "20 mins", type: "Evaluation Quiz" },
  ];

  const toggleModule = (idx) => {
    if (completedModules.includes(idx)) {
      setCompletedModules((prev) => prev.filter((i) => i !== idx));
    } else {
      setCompletedModules((prev) => [...prev, idx]);
    }
  };

  const progressPercent = Math.round((completedModules.length / modules.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Course Header Banner */}
        <div className={`p-6 ${color.bg} border-b border-slate-200 flex items-start justify-between gap-4`}>
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-white/80 ${color.text} flex items-center justify-center font-bold text-xl shadow-xs shrink-0`}>
              <BookOpen size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70 text-slate-700">
                  {course.domain || "Official Statistics"}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70 text-slate-700">
                  {course.level || "Beginner"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">{course.title}</h2>
              <p className="text-xs text-slate-600 mt-1">{course.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/5 hover:bg-black/10 text-slate-600 flex items-center justify-center shrink-0 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Tabs & Body */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Course Progress</p>
              <p className="text-sm font-bold text-slate-800">{progressPercent}% Completed</p>
            </div>
            <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${color.bar} rounded-full transition-all duration-300`} style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {/* Module List */}
          <div className="space-y-2.5 mb-6">
            {modules.map((m, idx) => {
              const isDone = completedModules.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleModule(idx)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isDone ? "bg-emerald-50/50 border-emerald-200 text-slate-800" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                        isDone ? "bg-emerald-600 text-white" : "border border-slate-300 text-slate-400"
                      }`}
                    >
                      {isDone ? <Check size={14} /> : idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">{m.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{m.type} · {m.duration}</p>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-blue-600 shrink-0 flex items-center gap-1">
                    {isDone ? "Completed" : "Start"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setCompletedModules([0, 1, 2, 3]);
                onCompleteCourse?.(course);
              }}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCircle2 size={16} /> Mark Entire Course as Completed
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
