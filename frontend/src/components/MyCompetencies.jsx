import { useState } from "react";
import {
  BarChart3,
  PieChart,
  Monitor,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Award,
  Zap,
  BookOpen,
  ArrowUpRight,
  Info,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { getColor } from "../data/colorMap";

const ICONS = { BarChart3, PieChart, Monitor, MessageSquare };

const DEFAULT_DOMAIN_SKILLS = {
  statistical: [
    "Stratified Multi-stage Sampling",
    "National Accounts (SNA 2008 / GVA)",
    "CPI / WPI Index Compilation",
    "PLFS Labour Statistics",
    "SDG National Indicator Framework (NIF)"
  ],
  technical: [
    "Python for Survey Data Scrutiny",
    "Handling Large Scale Data in R",
    "Relational SQL Databases",
    "GIS & Spatial Frame Sampling",
    "Big Data & AI Predictive Modeling"
  ],
  digitalGovernance: [
    "DPDP Act 2023 Compliance",
    "MeghRaj Government Cloud",
    "Survey Microdata Anonymization",
    "UN-SDMX Metadata Standards",
    "Digital Public Infrastructure (DPI)"
  ],
  behavioural: [
    "Leadership in Civil Services",
    "Evidence-Based Policy Communication",
    "Survey Field Team Management (FOD)",
    "UN Fundamental Principles of Statistics",
    "Public Administration Ethics"
  ]
};

const DOMAIN_DESCRIPTIONS = {
  statistical: "Core quantitative mandate of MoSPI: survey sampling design, GDP compilation, price index calculation, and official statistical validation.",
  technical: "Modern digital tools & data science: automated Python/R pipelines, database query optimization, spatial GIS frame mapping, and predictive machine learning.",
  digitalGovernance: "Legal statutory & security frameworks: citizen data protection under DPDP Act 2023, government cloud storage protocols, and microdata privacy.",
  behavioural: "Administrative leadership & civil service integrity: evidence-based policy formulation, field team supervision, ethics, and stakeholder communication.",
};

function statusBadgeClasses(status) {
  if (status === "Strong" || status === "Excellent") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "Average") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
}

function getProficiencyTier(percent) {
  if (percent >= 75) return { label: "Level 3: Expert Specialist", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (percent >= 50) return { label: "Level 2: Working Practitioner", color: "text-blue-700 bg-blue-50 border-blue-200" };
  return { label: "Level 1: Foundational Cadre", color: "text-amber-700 bg-amber-50 border-amber-200" };
}

export default function MyCompetencies({
  domains = [],
  onRunAnalysis,
  isAnalyzing,
  onOpenQuiz,
  onViewCourses,
}) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const safeDomains = (domains && domains.length > 0) ? domains : [
    { id: "statistical", name: "Statistical Competencies", percent: 82, status: "Strong", icon: "BarChart3", color: "blue" },
    { id: "technical", name: "Technical Competencies", percent: 64, status: "Average", icon: "Monitor", color: "orange" },
    { id: "digitalGovernance", name: "Digital Governance", percent: 70, status: "Average", icon: "PieChart", color: "green" },
    { id: "behavioural", name: "Behavioural & Leadership", percent: 88, status: "Strong", icon: "MessageSquare", color: "purple" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header & Action Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center gap-1">
              <ShieldCheck size={12} className="text-blue-600" /> MoSPI &amp; iGOT Karmayogi
            </span>
            <span className="text-[11px] font-medium text-slate-400">4 Cadre Competency Pillars</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Official Competency Framework
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time evaluated proficiency dynamically synced with your AI Quizzes, completed courses, and verified certifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setShowInfoModal(!showInfoModal)}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <HelpCircle size={15} className="text-blue-600" /> What is Demonstrated Proficiency?
          </button>

          {onRunAnalysis && (
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-md cursor-pointer"
            >
              <Sparkles size={15} />
              {isAnalyzing ? "Recalculating ML Scores..." : "Run AI Recalibration"}
            </button>
          )}
        </div>
      </div>

      {/* Explanatory Banner (Collapsible / Dynamic) */}
      {(showInfoModal || true) && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-800 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Info size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Understanding &quot;Demonstrated Proficiency&quot; &amp; The 4 MoSPI Pillars
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  <strong>Demonstrated Proficiency</strong> represents your live capability score (0–100%) in the official Indian Statistical System. Unlike static self-assessments, it is <strong>dynamically calculated and updated</strong> across your activities:
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0"
            >
              Hide Guide
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                <Zap size={14} /> 1. Dynamic Quizzes
              </div>
              <p className="text-[11px] text-slate-300">
                Scoring high (&ge;70%) in domain quizzes raises proficiency. Low scores decrease it, reflecting true readiness.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <BookOpen size={14} /> 2. Courses Completed
              </div>
              <p className="text-[11px] text-slate-300">
                Completing iGOT and NSSTA TPAC modules awards +5% to +8% permanent mastery boost to that domain.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Award size={14} /> 3. Verified Certifications
              </div>
              <p className="text-[11px] text-slate-300">
                Accredited certificates directly bridge skill gaps and advance your promotion eligibility benchmark.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                <ShieldCheck size={14} /> 4. Profile &amp; Experience
              </div>
              <p className="text-[11px] text-slate-300">
                Years of service in NSO, qualifications, and cadre rank establish your foundational baseline score.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4 Domain Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {safeDomains.map((domain) => {
          const Icon = ICONS[domain.icon] || BarChart3;
          const color = getColor(domain.color || "blue");
          const skillTags = domain.skills || DEFAULT_DOMAIN_SKILLS[domain.id] || DEFAULT_DOMAIN_SKILLS.statistical;
          const tier = getProficiencyTier(domain.percent || 50);
          const description = DOMAIN_DESCRIPTIONS[domain.id] || DOMAIN_DESCRIPTIONS.statistical;

          return (
            <div
              key={domain.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Domain Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl ${color.bg} ${color.text} flex items-center justify-center shrink-0 shadow-2xs`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">{domain.name}</h3>
                      <p className="text-xs text-slate-400">MoSPI Cadre Benchmark: 85%</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border whitespace-nowrap ${statusBadgeClasses(domain.status)}`}>
                      {domain.status}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border whitespace-nowrap ${tier.color}`}>
                      {tier.label}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {description}
                </p>

                {/* Progress Bar & Numerical Score */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <Zap size={14} className="text-blue-600" /> Demonstrated Proficiency
                    </span>
                    <span className="text-blue-700 font-black text-sm">{domain.percent}%</span>
                  </div>

                  <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color.bar} rounded-full transition-all duration-700 shadow-xs`}
                      style={{ width: `${Math.max(6, domain.percent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>Cadre Gap: {Math.max(0, 85 - domain.percent)}% to Benchmark</span>
                    <span>Verified via AI &amp; NSO</span>
                  </div>
                </div>

                {/* Mapped Key Competencies */}
                <div className="space-y-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Key Cadre Competencies Mapped
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillTags.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className={`text-xs px-2.5 py-1 rounded-xl font-semibold border ${color.badgeBg} ${color.badgeText} border-slate-200/70`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Boost With Quiz or Course */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenQuiz?.(domain.id)}
                  className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer border border-blue-200/80 shadow-2xs"
                >
                  <Zap size={13} /> Boost with AI Quiz
                </button>

                <button
                  type="button"
                  onClick={() => onViewCourses?.(domain.id)}
                  className="flex-1 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-200 shadow-2xs"
                >
                  <BookOpen size={13} /> View Mapped Courses
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}