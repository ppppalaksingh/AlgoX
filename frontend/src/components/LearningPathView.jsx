import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Route,
  CheckCircle2,
  PlayCircle,
  Clock,
  Award,
  Sparkles,
  ChevronRight,
  Lock,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";

const PRESET_PATHWAYS = {
  digitalGovernance: {
    id: "path-digital-gov",
    title: "Digital Governance, DPDP Act 2023 & MeghRaj GovCloud",
    domain: "Digital Governance",
    subtitle: "AI-Recommended based on your highest competency gap in Digital Governance & Compliance.",
    targetRole: "Assistant Director / Statistical Officer (Data Governance Track)",
    stages: [
      {
        id: 1,
        title: "Stage 1: DPDP Act 2023 & Citizen Data Privacy Legalities",
        description: "Master Data Principal rights, Data Fiduciary obligations, and consent management frameworks under Indian law.",
        duration: "4 hours",
        competency: "Digital Governance",
        modules: [
          { id: "dg-m1", title: "DPDP Act 2023 Statutory Overview & Penalties", done: false },
          { id: "dg-m2", title: "Citizen Consent Architecture & Data Fiduciary Audits", done: false },
          { id: "dg-m3", title: "Microdata Anonymization Protocols (k-anonymity >= 5)", done: false },
        ],
      },
      {
        id: 2,
        title: "Stage 2: MeghRaj Government Cloud & Storage Security",
        description: "Deploy and manage secure administrative statistical databases on NIC MeghRaj GovCloud.",
        duration: "6 hours",
        competency: "Digital Governance",
        modules: [
          { id: "dg-m4", title: "MeghRaj Infrastructure Security & AES-256 Encryption", done: false },
          { id: "dg-m5", title: "Role-Based Access Control (RBAC) in Ministry Portals", done: false },
          { id: "dg-m6", title: "Automated Backup & Disaster Recovery Standards", done: false },
        ],
      },
      {
        id: 3,
        title: "Stage 3: UN-SDMX Metadata Standards & Open Data Interoperability",
        description: "Standardize national datasets using international Statistical Data and Metadata Exchange protocols.",
        duration: "5 hours",
        competency: "Digital Governance",
        modules: [
          { id: "dg-m7", title: "UN-SDMX Standard Guidelines & Data Structure Definitions", done: false },
          { id: "dg-m8", title: "API-driven Data Exchange with State Statistical Bureaus", done: false },
          { id: "dg-m9", title: "Open Government Data (data.gov.in) Cataloging", done: false },
        ],
      },
      {
        id: 4,
        title: "Stage 4: Civil Service Ethics & Public Trust in Statistical AI",
        description: "Implement transparent governance, algorithmic fairness, and accountability in administrative data pipelines.",
        duration: "8 hours",
        competency: "Digital Governance",
        modules: [
          { id: "dg-m10", title: "Ethical Guidelines for Public Sector AI & Machine Learning", done: false },
          { id: "dg-m11", title: "Mitigating Sampling & Selection Bias in Automated Reports", done: false },
          { id: "dg-m12", title: "Capstone: Ministry Microdata Governance Simulation", done: false },
        ],
      },
    ],
  },
  technical: {
    id: "path-technical",
    title: "Python, R & Spatial Big Data Analytics for Civil Services",
    domain: "Technical",
    subtitle: "AI-Curated based on your Technical & Data Science competency profile.",
    targetRole: "Deputy Director / Senior Statistical Officer (Analytics Specialization)",
    stages: [
      {
        id: 1,
        title: "Stage 1: Python & Pandas for Large-Scale Microdata",
        description: "Automate national survey cleaning, validation checks, and vector calculations on NSSO/PLFS schedules.",
        duration: "5 hours",
        competency: "Technical",
        modules: [
          { id: "tech-m1", title: "Vectorized Operations with Pandas & NumPy on Survey Schedules", done: false },
          { id: "tech-m2", title: "Automated Data Scrutiny & Multiplier Computation", done: false },
          { id: "tech-m3", title: "Handling Missing & Outlier Values in Administrative Records", done: false },
        ],
      },
      {
        id: 2,
        title: "Stage 2: R Programming for Inferential Statistics & Econometrics",
        description: "Conduct hypothesis testing, regression models, and sampling error estimations.",
        duration: "6 hours",
        competency: "Technical",
        modules: [
          { id: "tech-m4", title: "Complex Survey Designs with R 'survey' Package", done: false },
          { id: "tech-m5", title: "Econometric Modeling & General Equilibrium Analysis", done: false },
          { id: "tech-m6", title: "Automated PDF Report Generation using R Markdown / Quarto", done: false },
        ],
      },
      {
        id: 3,
        title: "Stage 3: GIS & Spatial Sampling Frames (Bharat Maps)",
        description: "Integrate cadastral maps and satellite imagery into urban and rural statistical frames.",
        duration: "5 hours",
        competency: "Technical",
        modules: [
          { id: "tech-m7", title: "QGIS Fundamentals & Shapefile Integration for Enumerators", done: false },
          { id: "tech-m8", title: "Spatial Stratification & Primary Sampling Unit (PSU) Delineation", done: false },
          { id: "tech-m9", title: "Thematic Choropleth Mapping for District Collectors", done: false },
        ],
      },
      {
        id: 4,
        title: "Stage 4: Machine Learning & Predictive Policy Simulation",
        description: "Deploy gradient boosted models and neural networks for early economic indicator estimation.",
        duration: "8 hours",
        competency: "Technical",
        modules: [
          { id: "tech-m10", title: "Time-Series Forecasting for Industrial Production (IIP)", done: false },
          { id: "tech-m11", title: "Automated Quality Anomaly Flagging via Unsupervised Clustering", done: false },
          { id: "tech-m12", title: "Capstone: State GDP Nowcasting Engine Deployment", done: false },
        ],
      },
    ],
  },
  statistical: {
    id: "path-statistical",
    title: "Official Statistical Sampling & National Accounts (SNA 2008)",
    domain: "Statistical",
    subtitle: "AI-Formulated based on MoSPI Cadre core statistical evaluation benchmarks.",
    targetRole: "Indian Statistical Service (ISS) Cadre Officer",
    stages: [
      {
        id: 1,
        title: "Stage 1: Stratified Multi-Stage Sampling & Design Effects",
        description: "Master probability proportional to size (PPS) selection, cluster sampling, and design effect formulas.",
        duration: "4 hours",
        competency: "Statistical",
        modules: [
          { id: "stat-m1", title: "Multi-stage Stratified Sampling & Neyman Allocation", done: false },
          { id: "stat-m2", title: "Calculation of Sampling Variance, Standard Error & CV%", done: false },
          { id: "stat-m3", title: "Non-sampling Error Minimization & Field Scrutiny Protocols", done: false },
        ],
      },
      {
        id: 2,
        title: "Stage 2: National Accounts Compilation & Base Year Revisions",
        description: "Implement UN System of National Accounts 2008 guidelines for GDP and GVA computation.",
        duration: "6 hours",
        competency: "Statistical",
        modules: [
          { id: "stat-m4", title: "Gross Value Added (GVA) by Economic Activity & Production Boundary", done: false },
          { id: "stat-m5", title: "Supply and Use Tables (SUT) Reconciliation", done: false },
          { id: "stat-m6", title: "Base Year Revision Methodologies & Deflator Indexing", done: false },
        ],
      },
      {
        id: 3,
        title: "Stage 3: Consumer Price Index (CPI) & Inflation Metrics",
        description: "Compute headline CPI, core inflation, and rural/urban market weighting schemes.",
        duration: "5 hours",
        competency: "Statistical",
        modules: [
          { id: "stat-m7", title: "Modified Laspeyres Aggregation & Price Quotation Scrutiny", done: false },
          { id: "stat-m8", title: "Item Basket Substitution & Quality Adjustment Techniques", done: false },
          { id: "stat-m9", title: "Wholesale Price Index (WPI) & Producer Price Index (PPI) Bridges", done: false },
        ],
      },
      {
        id: 4,
        title: "Stage 4: SDG National Indicator Framework (NIF) Monitoring",
        description: "Standardize multi-sectoral development metrics aligned with UN 2030 targets.",
        duration: "8 hours",
        competency: "Statistical",
        modules: [
          { id: "stat-m10", title: "MoSPI NIF Baseline & Target Formulation Guidelines", done: false },
          { id: "stat-m11", title: "Inter-Ministerial Data Synchronization Protocols", done: false },
          { id: "stat-m12", title: "Capstone: National Statistical Assessment Presentation", done: false },
        ],
      },
    ],
  },
};

export default function LearningPathView({
  onStartCourse,
  competencyList = [],
  detailedGaps = [],
  profileData = {},
  onRecalibrate,
  onPathProgressUpdate,
  onCompletePathway,
}) {
  // Determine primary gap domain
  const lowestDomain = useMemo(() => {
    if (!competencyList || competencyList.length === 0) return "digitalGovernance";
    const sorted = [...competencyList].sort((a, b) => (a.percent || 0) - (b.percent || 0));
    const lowestId = sorted[0]?.id || "digitalGovernance";
    if (lowestId.includes("digital")) return "digitalGovernance";
    if (lowestId.includes("tech")) return "technical";
    return "statistical";
  }, [competencyList]);

  const [selectedPathKey, setSelectedPathKey] = useState(lowestDomain);
  const [pathwayLevel, setPathwayLevel] = useState(1);
  const [stages, setStages] = useState([]);
  const [isAwarded, setIsAwarded] = useState(false);

  // Load or initialize stages for the selected pathway
  useEffect(() => {
    const template = PRESET_PATHWAYS[selectedPathKey] || PRESET_PATHWAYS.digitalGovernance;
    const storageKey = `learning_path_${template.id}_lvl${pathwayLevel}`;
    const awardedKey = `learning_path_awarded_${template.id}_lvl${pathwayLevel}`;
    
    try {
      const awardedSaved = localStorage.getItem(awardedKey);
      setIsAwarded(awardedSaved === "true");

      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setStages(JSON.parse(saved));
        return;
      }
    } catch (e) {}

    // Initial state: Stage 1 active, others upcoming/locked
    setStages(
      template.stages.map((stg, sIdx) => ({
        ...stg,
        status: sIdx === 0 ? "In Progress" : sIdx === 1 ? "Upcoming" : "Locked",
        modules: stg.modules.map((m) => ({ ...m, done: false })),
      }))
    );
  }, [selectedPathKey, pathwayLevel]);

  // Sync with parent whenever stages or pathway change
  useEffect(() => {
    if (stages && stages.length > 0 && onPathProgressUpdate) {
      const template = PRESET_PATHWAYS[selectedPathKey] || PRESET_PATHWAYS.digitalGovernance;
      onPathProgressUpdate({
        title: template.title,
        subtitle: template.subtitle,
        stages: stages,
      });
    }
  }, [stages, selectedPathKey]);

  // Save changes to localStorage whenever stages change
  const saveStages = (newStages) => {
    setStages(newStages);
    const template = PRESET_PATHWAYS[selectedPathKey] || PRESET_PATHWAYS.digitalGovernance;
    const storageKey = `learning_path_${template.id}_lvl${pathwayLevel}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(newStages));
    } catch (e) {}
  };

  // Toggle module done status
  const handleToggleModule = (stageIdx, modIdx) => {
    const updated = stages.map((stg, sIdx) => {
      if (sIdx !== stageIdx) return stg;
      const newMods = stg.modules.map((m, mIdx) =>
        mIdx === modIdx ? { ...m, done: !m.done } : m
      );
      const allDone = newMods.every((m) => m.done);
      const someDone = newMods.some((m) => m.done);

      return {
        ...stg,
        modules: newMods,
        status: allDone ? "Completed" : someDone ? "In Progress" : stg.status,
      };
    });

    // Auto-unlock next stages
    for (let i = 0; i < updated.length - 1; i++) {
      if (updated[i].modules.every((m) => m.done)) {
        if (updated[i + 1].status === "Locked" || updated[i + 1].status === "Upcoming") {
          updated[i + 1].status = "In Progress";
        }
      }
    }

    saveStages(updated);
  };

  // Dynamic progress calculation
  const totalModulesCount = useMemo(() => {
    return stages.reduce((acc, stg) => acc + (stg.modules?.length || 0), 0) || 1;
  }, [stages]);

  const completedModulesCount = useMemo(() => {
    return stages.reduce((acc, stg) => acc + (stg.modules?.filter((m) => m.done).length || 0), 0);
  }, [stages]);

  const pathProgress = Math.round((completedModulesCount / totalModulesCount) * 100);
  const isFullyMastered = pathProgress === 100;

  const claimPathwayCompetency = useCallback(() => {
    const template = PRESET_PATHWAYS[selectedPathKey] || PRESET_PATHWAYS.digitalGovernance;
    const currentAwardedKey = `learning_path_awarded_${template.id}_lvl${pathwayLevel}`;
    try {
      localStorage.setItem(currentAwardedKey, "true");
    } catch (e) {}
    setIsAwarded(true);
    onCompletePathway?.({
      pathId: template.id,
      title: template.title,
      domain: template.domain,
      level: pathwayLevel,
    });
  }, [selectedPathKey, pathwayLevel, onCompletePathway]);

  // Automatically trigger claim when pathway reaches 100% mastery if not already awarded
  useEffect(() => {
    if (isFullyMastered && !isAwarded && stages.length > 0) {
      claimPathwayCompetency();
    }
  }, [isFullyMastered, isAwarded, stages.length, claimPathwayCompetency]);

  // Handle generating advanced pathway
  const handleGenerateNextLevel = () => {
    if (!isAwarded) {
      claimPathwayCompetency();
    }
    setPathwayLevel((prev) => prev + 1);
  };

  // Handle pathway reset
  const handleResetPathway = () => {
    const template = PRESET_PATHWAYS[selectedPathKey] || PRESET_PATHWAYS.digitalGovernance;
    const storageKey = `learning_path_${template.id}_lvl${pathwayLevel}`;
    const currentAwardedKey = `learning_path_awarded_${template.id}_lvl${pathwayLevel}`;
    localStorage.removeItem(storageKey);
    localStorage.removeItem(currentAwardedKey);
    setIsAwarded(false);

    setStages(
      template.stages.map((stg, sIdx) => ({
        ...stg,
        status: sIdx === 0 ? "In Progress" : sIdx === 1 ? "Upcoming" : "Locked",
        modules: stg.modules.map((m) => ({ ...m, done: false })),
      }))
    );
  };

  const activeTemplate = PRESET_PATHWAYS[selectedPathKey] || PRESET_PATHWAYS.digitalGovernance;

  return (
    <div className="space-y-6">
      {/* Top Banner with Pathway Selector */}
      <div className="bg-[#0f1422]/90 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)] border border-white/[0.08] relative overflow-hidden">
        {/* Top edge glow sheen */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles size={12} className="text-indigo-400" /> AI-Recommended Cadre Pathway
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                Milestone Level {pathwayLevel}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              {activeTemplate.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {activeTemplate.subtitle}
            </p>

            <div className="pt-2 flex items-center gap-2 flex-wrap text-xs text-slate-400">
              <span>Target Cadre: <strong className="text-slate-200">{activeTemplate.targetRole}</strong></span>
              <span>•</span>
              <span>Total Curriculum: <strong className="text-slate-200">{stages.length} Stages ({totalModulesCount} Key Modules)</strong></span>
            </div>
          </div>

          {/* Dynamic Progress Indicator Box */}
          <div className="bg-white/[0.04] backdrop-blur-md rounded-2xl p-5 border border-white/10 min-w-56 text-center shrink-0 shadow-inner">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Path Completion</span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">{pathProgress}%</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {completedModulesCount} of {totalModulesCount} Milestones Mastered
            </p>

            <div className="w-full h-2 bg-white/[0.06] rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.5)] ${
                  isFullyMastered
                    ? "bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                }`}
                style={{ width: `${pathProgress}%` }}
              />
            </div>

            {isFullyMastered && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-2">
                <Award size={13} /> Milestone Achieved!
              </span>
            )}
          </div>
        </div>

        {/* Pathway Switching Filter Tabs */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 mr-1">Focus Track:</span>
            {Object.entries(PRESET_PATHWAYS).map(([key, item]) => {
              const isSelected = selectedPathKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPathKey(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)] border border-indigo-400/30"
                      : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.08]"
                  }`}
                >
                  {item.domain} Track
                </button>
              );
            })}
          </div>

          <button
            onClick={handleResetPathway}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            title="Reset progress for this pathway"
          >
            <RotateCcw size={13} /> Reset Progress
          </button>
        </div>
      </div>

      {/* 100% Mastery Celebration Banner */}
      {isFullyMastered && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-[#0f1422] border border-emerald-500/40 text-white shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] shrink-0">
                <Award size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-300">
                  🎉 Pathway Mastered! Level {pathwayLevel} Specialization Completed!
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  You have successfully demonstrated all competency standards for this track. An official cadre achievement seal has been awarded.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={claimPathwayCompetency}
                disabled={isAwarded}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                  isAwarded
                    ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 cursor-default"
                    : "bg-white text-slate-900 hover:bg-emerald-50 shadow-md cursor-pointer"
                }`}
              >
                <CheckCircle2 size={15} className="text-emerald-500" />
                {isAwarded ? "Cadre Competency & +3% Readiness Awarded ✓" : "Claim +3% Readiness & Competency Boost"}
              </button>

              <button
                onClick={handleGenerateNextLevel}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 transition shadow-[0_0_20px_rgba(16,185,129,0.35)] shrink-0 cursor-pointer"
              >
                <Zap size={15} /> Unlock Level {pathwayLevel + 1} Advanced Pathway <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stages List */}
      <div className="space-y-4">
        {stages.map((stage, sIdx) => {
          const isCompleted = stage.status === "Completed";
          const isInProgress = stage.status === "In Progress";
          const isLocked = stage.status === "Locked";

          const stageDoneCount = stage.modules?.filter((m) => m.done).length || 0;
          const stageTotalCount = stage.modules?.length || 3;

          return (
            <div
              key={stage.id}
              className={`rounded-3xl border transition-all p-6 backdrop-blur-xl ${
                isInProgress
                  ? "bg-[#0f1422]/90 border-indigo-500/50 ring-1 ring-indigo-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_25px_rgba(99,102,241,0.15)]"
                  : isCompleted
                  ? "bg-emerald-950/15 border-emerald-500/30 shadow-sm"
                  : "bg-[#0c0e17]/60 border-white/[0.05] opacity-75"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                      isCompleted
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        : isInProgress
                        ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                        : isLocked
                        ? "bg-white/[0.03] text-slate-500 border-white/5"
                        : "bg-white/[0.05] text-slate-400 border-white/10"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={18} /> : stage.id}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-base">{stage.title}</h3>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                          isCompleted
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : isInProgress
                            ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                            : "bg-white/[0.04] text-slate-400 border-white/10"
                        }`}
                      >
                        {stage.status}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        ({stageDoneCount}/{stageTotalCount} Modules Mastered)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{stage.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg">
                    <Clock size={13} /> {stage.duration}
                  </span>
                </div>
              </div>

              {/* Interactive Modules Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-white/[0.06]">
                {stage.modules.map((m, mIdx) => (
                  <button
                    key={m.id}
                    onClick={() => handleToggleModule(sIdx, mIdx)}
                    className={`p-3.5 rounded-2xl border text-left text-xs font-medium flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                      m.done
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold"
                        : "bg-white/[0.03] border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="truncate leading-snug">{m.title}</span>
                    {m.done ? (
                      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20 shrink-0 hover:border-indigo-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              {isInProgress && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() =>
                      onStartCourse?.({
                        id: `path-course-${stage.id}`,
                        title: stage.title,
                        domain: stage.competency,
                        color: "blue",
                        provider: "iGOT Karmayogi / MoSPI",
                        duration: stage.duration,
                      })
                    }
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  >
                    <PlayCircle size={15} /> Study Stage in Interactive Viewer
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
