import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Play,
  Clock,
  Award,
  X,
  Sparkles,
  FileText,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Layers,
  Zap,
} from "lucide-react";
import { getColor } from "../data/colorMap";

export default function CourseModal({ course, isOpen, onClose, onCompleteCourse }) {
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState([0]);

  if (!isOpen || !course) return null;

  const color = getColor(course.color || "blue");
  const isTPAC = course.source_type === "TPAC" || course.id?.startsWith("tpac") || course.institute?.includes("NSSTA");
  const provider = course.provider || course.institute || (isTPAC ? "NSSTA / MoSPI" : "iGOT Karmayogi");

  const modules = [
    {
      title: "Module 1: Foundations & Official Mandate",
      duration: "25 mins",
      type: "Interactive Lecture",
      summary: `Comprehensive institutional overview of ${course.title}. Covers MoSPI and NSO standard operational procedures, ISS cadre mandates, and UN Fundamental Principles of Official Statistics.`,
      keyTakeaways: [
        "Core governance protocols and data ownership standards under MoSPI.",
        "Integration with iGOT Karmayogi civil service capacity framework.",
        "Quality assurance benchmarks required for official survey dissemination."
      ],
    },
    {
      title: "Module 2: Methodologies, Sampling & Analytical Framework",
      duration: "40 mins",
      type: "Technical Guide",
      summary: `Mathematical formulations, stratified multi-stage sampling designs, Neyman allocation formulas, and data scrutiny protocols.`,
      keyTakeaways: [
        "Formula optimization: n_h = n * (N_h * S_h) / sum(N_i * S_i) for variance minimization.",
        "Computer Assisted Personal Interviewing (CAPI) real-time data validation.",
        "Weighting multipliers and post-stratification estimation."
      ],
    },
    {
      title: "Module 3: Hands-on Practical Case Studies & Data Labs",
      duration: "45 mins",
      type: "Practical Simulation",
      summary: `Real-world case studies using National Sample Survey (NSSO), Periodic Labour Force Survey (PLFS), and Annual Survey of Industries (ASI) microdata.`,
      keyTakeaways: [
        "Scrutiny and outlier removal across 10,000+ household schedules.",
        "Python and R automated tabulation scripts for official reports.",
        "Balancing Supply-Use Tables and GDP deflator adjustments."
      ],
    },
    {
      title: "Module 4: DPDP Compliance, Evaluation & Certification",
      duration: "20 mins",
      type: "Evaluation Assessment",
      summary: `Final knowledge evaluation on Digital Personal Data Protection (DPDP Act 2023), microdata anonymization, and civil service ethics.`,
      keyTakeaways: [
        "Mandatory k-anonymity (k >= 5) and differential privacy rules.",
        "MeghRaj GovCloud storage encryption at rest (AES-256).",
        "Official NSSTA competency accreditation and certificate issuance."
      ],
    },
  ];

  const toggleModule = (idx) => {
    if (completedModules.includes(idx)) {
      setCompletedModules((prev) => prev.filter((i) => i !== idx));
    } else {
      setCompletedModules((prev) => [...prev, idx]);
    }
  };

  const currentModule = modules[selectedModuleIndex] || modules[0];
  const progressPercent = Math.round((completedModules.length / modules.length) * 100);
  const isFullyComplete = completedModules.length === modules.length;

  const officialPortalLink = course.officialUrl || course.igotLink || (isTPAC ? "https://nssta.gov.in" : "https://portal.igotkarmayogi.gov.in/public/home");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Course Header Banner */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4 shrink-0 border-b border-slate-800">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              {isTPAC ? <GraduationCap size={24} /> : <BookOpen size={24} />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                  {isTPAC ? "NSSTA TPAC Programme" : "iGOT Karmayogi Module"}
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {course.domain || "Statistical Competency"}
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {course.level || "Level 3"}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug">{course.title}</h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Accredited Provider: <strong>{provider}</strong></span>
                <span>•</span>
                <span>{course.duration || "20 hours"}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress Bar Ribbon */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Course Mastery:</span>
            <span className="text-xs font-extrabold text-blue-600">{progressPercent}%</span>
            <span className="text-[11px] text-slate-400">({completedModules.length}/{modules.length} Chapters)</span>
          </div>

          <div className="w-48 sm:w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Body: Two Columns (Chapter List + Active Chapter Viewer) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Active Chapter Interactive Study Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white space-y-4 border border-slate-700 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Play size={13} className="fill-amber-400" /> Active Chapter: {selectedModuleIndex + 1}
              </span>
              <span className="text-xs text-slate-400 font-medium">{currentModule.duration}</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{currentModule.title}</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{currentModule.summary}</p>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-2">
              <p className="text-xs font-bold text-sky-300 uppercase tracking-wider">Key Takeaways &amp; Formulations:</p>
              <div className="space-y-1.5">
                {currentModule.keyTakeaways.map((item, kIdx) => (
                  <div key={kIdx} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter Outline Selection */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-blue-600" /> Course Syllabus &amp; Milestones
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {modules.map((m, idx) => {
                const isDone = completedModules.includes(idx);
                const isSelected = selectedModuleIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedModuleIndex(idx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-blue-50/70 border-blue-400 ring-2 ring-blue-300/40"
                        : isDone
                        ? "bg-emerald-50/40 border-emerald-200"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModule(idx);
                        }}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
                          isDone ? "bg-emerald-600 text-white" : "border border-slate-300 text-slate-400 hover:border-blue-500"
                        }`}
                      >
                        {isDone ? <Check size={14} /> : idx + 1}
                      </button>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold leading-tight truncate ${isSelected ? "text-blue-900" : "text-slate-800"}`}>
                          {m.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{m.type} • {m.duration}</p>
                      </div>
                    </div>

                    <ChevronRight size={14} className={isSelected ? "text-blue-600" : "text-slate-300"} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <a
            href={officialPortalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs w-full sm:w-auto justify-center"
            title="Open official government portal"
          >
            <ExternalLink size={14} /> Open Official Portal ({provider.split('/')[0].trim()})
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setCompletedModules([0, 1, 2, 3]);
                onCompleteCourse?.(course);
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Award size={15} /> Complete &amp; Issue Official Certificate
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
