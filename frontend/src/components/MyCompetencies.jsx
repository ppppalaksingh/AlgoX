import { BarChart3, PieChart, Monitor, MessageSquare, Sparkles, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
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

function statusBadgeClasses(status) {
  if (status === "Strong" || status === "Excellent") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "Average") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
}

export default function MyCompetencies({ domains = [], onRunAnalysis, isAnalyzing }) {
  const safeDomains = (domains && domains.length > 0) ? domains : [
    { id: "statistical", name: "Statistical Competencies", percent: 82, status: "Strong", icon: "BarChart3", color: "blue" },
    { id: "technical", name: "Technical Competencies", percent: 64, status: "Needs Improvement", icon: "Monitor", color: "orange" },
    { id: "digitalGovernance", name: "Digital Governance", percent: 70, status: "Average", icon: "PieChart", color: "green" },
    { id: "behavioural", name: "Behavioural & Leadership", percent: 88, status: "Strong", icon: "MessageSquare", color: "purple" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Official Competency Framework</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Your evaluated proficiency across India&apos;s 4 Official Statistical System domains (MoSPI &amp; iGOT Karmayogi).
          </p>
        </div>

        {onRunAnalysis && (
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-md self-start sm:self-auto"
          >
            <Sparkles size={15} />
            {isAnalyzing ? "Recalculating ML Scores..." : "Run AI Recalibration"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {safeDomains.map((domain) => {
          const Icon = ICONS[domain.icon] || BarChart3;
          const color = getColor(domain.color || "blue");
          const skillTags = domain.skills || DEFAULT_DOMAIN_SKILLS[domain.id] || DEFAULT_DOMAIN_SKILLS.statistical;

          return (
            <div key={domain.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl ${color.bg} ${color.text} flex items-center justify-center shrink-0 shadow-2xs`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-800">{domain.name}</p>
                    <p className="text-xs text-slate-400">MoSPI Cadre Benchmark</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border whitespace-nowrap shrink-0 ${statusBadgeClasses(domain.status)}`}>
                  {domain.status}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-600">Demonstrated Proficiency</span>
                  <span className="text-blue-600 font-extrabold">{domain.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${domain.percent}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Key Cadre Competencies Mapped
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skillTags.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className={`text-xs px-2.5 py-1 rounded-xl font-semibold border ${color.badgeBg} ${color.badgeText} border-slate-200/60`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}