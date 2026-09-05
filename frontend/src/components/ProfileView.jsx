import { useState, useEffect } from "react";
import { User, Building2, Briefcase, Award, Sparkles, CheckCircle2, Loader2, BookOpen, ShieldCheck, Layers, ChevronRight, Info, AlertCircle } from "lucide-react";

export const MOSPI_CADRES = [
  "DG",
  "ADG",
  "Director",
  "Joint Director",
  "Deputy Director",
  "Assistant Director",
  "SSO",
  "SO",
  "JSO",
];

export const MOSPI_POST_ROLES = [
  "Statistical Officer",
  "Data Analyst",
  "Survey Officer",
  "Research Officer",
  "IT Officer",
  "Data Governance Officer",
  "Training Officer",
  "Field Inspection Officer",
  "National Accounts Analyst",
  "Price Statistics Analyst",
];

export const SERVICE_CADRE_MAP = {
  "DG": "Indian Statistical Service (ISS)",
  "ADG": "Indian Statistical Service (ISS)",
  "Director": "Indian Statistical Service (ISS)",
  "Joint Director": "Indian Statistical Service (ISS)",
  "Deputy Director": "Indian Statistical Service (ISS)",
  "Assistant Director": "Indian Statistical Service (ISS)",
  "SSO": "Subordinate Statistical Service (SSS)",
  "SO": "Subordinate Statistical Service (SSS)",
  "JSO": "Subordinate Statistical Service (SSS)",
};

export const ROLE_PROFILES = {
  "JSO": {
    cadreTitle: "Junior Statistical Officer",
    service: "Subordinate Statistical Service (SSS)",
    grade: "Group 'B' (Non-Gazetted)",
    coreMandate: "Primary data collection, field enumeration (FOD), CAPI schedule completion, and preliminary scrutiny.",
    keyResponsibilities: [
      "Conducting primary field survey interviews using CAPI handheld devices",
      "Initial scrutiny and verification of NSS, PLFS, and ASI field schedules",
      "Field collection of wholesale and consumer price data",
    ],
  },
  "SO": {
    cadreTitle: "Statistical Officer",
    service: "Subordinate Statistical Service (SSS)",
    grade: "Group 'B' (Gazetted)",
    coreMandate: "Supervision of field teams, intermediate data inspection, validation checks, and sampling execution.",
    keyResponsibilities: [
      "Supervising primary field investigators across regional sample units",
      "Validating consistency of household and establishment survey responses",
      "Conducting re-interviews for survey quality control",
    ],
  },
  "SSO": {
    cadreTitle: "Senior Statistical Officer",
    service: "Subordinate Statistical Service (SSS)",
    grade: "Group 'B' (Gazetted)",
    coreMandate: "Senior supervisory role in regional FOD offices, multi-unit scrutiny, survey administration, and technical mentoring.",
    keyResponsibilities: [
      "Regional coordination and monitoring of sample survey schedules",
      "Computer scrutiny, error-table resolution, and validation of microdata",
      "Mentoring JSOs and SOs on revised survey concepts and classifications",
    ],
  },
  "Assistant Director": {
    cadreTitle: "Assistant Director",
    service: "Indian Statistical Service (ISS)",
    grade: "Junior Time Scale (JTS)",
    coreMandate: "Methodological compilation, statistical report preparation, survey design contribution, and unit leadership.",
    keyResponsibilities: [
      "Drafting survey questionnaires and sampling schemes under division guidance",
      "Compiling national statistics (CPI, IIP, National Accounts, Annual Survey of Industries)",
      "Statistical programming (R / Python / SQL) for microdata scrutiny",
    ],
  },
  "Deputy Director": {
    cadreTitle: "Deputy Director",
    service: "Indian Statistical Service (ISS)",
    grade: "Senior Time Scale (STS)",
    coreMandate: "Statistical analysis, division-level project coordination, econometric estimation, and state liaison.",
    keyResponsibilities: [
      "Overseeing compilation of macro-economic aggregates and sectoral indices",
      "Reviewing sampling errors and methodological consistency across divisions",
      "Liaison with State Directorates of Economics & Statistics (DES)",
    ],
  },
  "Joint Director": {
    cadreTitle: "Joint Director",
    service: "Indian Statistical Service (ISS)",
    grade: "Junior Administrative Grade (JAG)",
    coreMandate: "Division leadership, survey administration, dissemination strategy, and administrative management.",
    keyResponsibilities: [
      "Heading operational divisions in NSO (SDRD, FOD, DQAD, CPD, NAD)",
      "Managing budget, procurement via GeM, and compliance with administrative rules",
      "Overseeing public microdata releases and national statistical publications",
    ],
  },
  "Director": {
    cadreTitle: "Director",
    service: "Indian Statistical Service (ISS)",
    grade: "Selection Grade / Senior Administrative Grade (SAG)",
    coreMandate: "Statistical policy, inter-ministerial coordination, survey modernization, and national statistical standards.",
    keyResponsibilities: [
      "Formulating national statistical standards, classifications, and metadata frameworks",
      "Directing major national surveys (PLFS, Periodic Surveys, Economic Census)",
      "Inter-ministerial data sharing and collaboration with international agencies (UNSD, World Bank)",
    ],
  },
  "ADG": {
    cadreTitle: "Additional Director General",
    service: "Indian Statistical Service (ISS)",
    grade: "Higher Administrative Grade (HAG)",
    coreMandate: "Executive direction of entire functional wings (FOD, SDRD, NAD, DQAD), long-term strategy, and institutional modernization.",
    keyResponsibilities: [
      "Leading nationwide statistical operations across multiple states and regional offices",
      "Strategic direction on adopting modern technologies (AI/ML, big data, administrative registers)",
      "Advising the National Statistical Commission (NSC) on system-wide reforms",
    ],
  },
  "DG": {
    cadreTitle: "Director General",
    service: "Indian Statistical Service (ISS)",
    grade: "Apex Scale",
    coreMandate: "National Statistical Office leadership, chief statistical authority, overall government statistical governance.",
    keyResponsibilities: [
      "Apex stewardship of the Indian Official Statistical System",
      "High-level coordination with Union Ministries, NITI Aayog, and Reserve Bank of India",
      "Final authority on release of official national statistics and economic indicators",
    ],
  },
};

export const BENCHMARK_DISCLAIMER =
  "Prototype calibration benchmarks: Numerical target values (1.0–5.0) are calibrated for algorithmic demonstration and prototype evaluation; they are not official statutory MoSPI numerical quotas.";

const getCleanOfficerName = (raw, desig) => {
  if (!raw) return "";
  const trimmed = String(raw).trim();
  if (
    trimmed === "Assistant Director" ||
    trimmed === "Director" ||
    trimmed === "Deputy Director" ||
    trimmed.toLowerCase() === String(desig || "").toLowerCase()
  ) {
    return "";
  }
  return trimmed;
};

export default function ProfileView({ user, profileData, onSaveProfile, isSaving, onRunAnalysis, isAnalyzing }) {
  const currentDesig = profileData?.designation || localStorage.getItem("algox_user_designation") || user?.designation || "Assistant Director";
  const initialCleanName =
    getCleanOfficerName(profileData?.name, currentDesig) ||
    getCleanOfficerName(localStorage.getItem("algox_user_name"), currentDesig) ||
    getCleanOfficerName(user?.name, currentDesig) ||
    "Tarun Gupta";

  const [formData, setFormData] = useState({
    name: initialCleanName,
    email: profileData?.email || user?.email || "officer@mospi.gov.in",
    designation: currentDesig,
    post: profileData?.post || localStorage.getItem("algox_user_post") || user?.post || "Statistical Officer",
    department: profileData?.department || "National Statistical Office (NSO)",
    experienceYears: profileData?.experienceYears != null 
      ? profileData.experienceYears 
      : (localStorage.getItem("algox_user_experience_years") != null ? Number(localStorage.getItem("algox_user_experience_years")) : 0),
    qualifications: Array.isArray(profileData?.qualifications)
      ? profileData.qualifications.join(", ")
      : profileData?.qualifications || "",
    pastTrainings: Array.isArray(profileData?.pastTrainings)
      ? profileData.pastTrainings.join(", ")
      : profileData?.pastTrainings || "",
  });

  useEffect(() => {
    if (profileData) {
      const cleanIncomingName = getCleanOfficerName(profileData.name, profileData.designation);
      setFormData((prev) => ({
        ...prev,
        name: cleanIncomingName || prev.name,
        email: profileData.email || prev.email,
        designation: profileData.designation || prev.designation,
        post: profileData.post || prev.post || "Statistical Officer",
        department: profileData.department || prev.department,
        experienceYears: profileData.experienceYears != null 
          ? profileData.experienceYears 
          : (localStorage.getItem("algox_user_experience_years") != null ? Number(localStorage.getItem("algox_user_experience_years")) : (prev.experienceYears ?? 0)),
        qualifications: Array.isArray(profileData.qualifications)
          ? profileData.qualifications.join(", ")
          : (profileData.qualifications != null ? profileData.qualifications : prev.qualifications),
        pastTrainings: Array.isArray(profileData.pastTrainings)
          ? profileData.pastTrainings.join(", ")
          : (profileData.pastTrainings != null ? profileData.pastTrainings : prev.pastTrainings),
      }));
    }
  }, [profileData]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const getPayload = () => ({
    name: formData.name,
    email: formData.email,
    designation: formData.designation,
    post: formData.post || "Statistical Officer",
    department: formData.department,
    experienceYears: formData.experienceYears !== "" && !isNaN(Number(formData.experienceYears)) ? Number(formData.experienceYears) : 0,
    qualifications: typeof formData.qualifications === "string"
      ? formData.qualifications.split(",").map((s) => s.trim()).filter(Boolean)
      : (formData.qualifications || []),
    pastTrainings: typeof formData.pastTrainings === "string"
      ? formData.pastTrainings.split(",").map((s) => s.trim()).filter(Boolean)
      : (formData.pastTrainings || []),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile?.(getPayload());
  };

  const handleRunAnalysisWithProfile = () => {
    onRunAnalysis?.(getPayload());
  };

  const activeService = SERVICE_CADRE_MAP[formData.designation] || "Indian Statistical Service (ISS)";
  const activeRoleProfile = ROLE_PROFILES[formData.designation] || ROLE_PROFILES["Assistant Director"];

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top Profile Card */}
      <div className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-blue-600/30 shrink-0 border border-white/10">
            {formData.name?.charAt(0) || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{formData.name}</h1>
              <span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck size={12} /> Verified Officer
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{formData.designation} ({activeService}) · {formData.department}</p>
            <p className="text-xs text-slate-500 mt-0.5">{formData.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRunAnalysisWithProfile}
          disabled={isAnalyzing}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Running ML Gap Analysis...
            </>
          ) : (
            <>
              <Sparkles size={15} /> Run AI Gap Analysis
            </>
          )}
        </button>
      </div>

      {/* MoSPI / NSSTA Alignment Pipeline Ribbon */}
      <div className="bg-[#0c101d]/90 rounded-3xl p-5 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden shadow-lg space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
            <Layers size={12} className="text-indigo-400" /> MoSPI &amp; NSSTA Official Alignment Flow
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {activeService} · {formData.designation} · {formData.post || "Statistical Officer"}
          </span>
        </div>

        {/* 5-Level Hierarchy Flow */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-300 pb-1 font-medium scrollbar-thin">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-white shrink-0 font-bold">MoSPI (Ministry)</span>
          <ChevronRight size={13} className="text-indigo-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/25 text-indigo-200 shrink-0 font-semibold">NSO (Department)</span>
          <ChevronRight size={13} className="text-indigo-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-indigo-300 shrink-0">{activeService.includes('SSS') ? 'SSS Cadre' : 'ISS Cadre'}</span>
          <ChevronRight size={13} className="text-indigo-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white shrink-0 font-semibold">{formData.designation}</span>
          <ChevronRight size={13} className="text-indigo-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 shrink-0 font-bold">{formData.post || "Statistical Officer"}</span>
        </div>
      </div>

      {/* Form Details */}
      <form onSubmit={handleSubmit} className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
        <div>
          <h2 className="text-base font-bold text-white">Official Profile &amp; Role Parameters</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            AlgoX ML recommendation engine uses these parameters to customize your learning pathway and skill gap metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Official Name</label>
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition">
              <User size={16} className="text-slate-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full text-sm outline-none text-white bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.04] rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed">
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full text-sm outline-none bg-transparent cursor-not-allowed text-slate-400"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Designation / MoSPI Cadre</label>
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition">
                  <Briefcase size={16} className="text-slate-400 shrink-0" />
                  <select
                    value={formData.designation}
                    onChange={(e) => handleChange("designation", e.target.value)}
                    className="w-full text-sm outline-none text-white bg-transparent cursor-pointer [&>option]:bg-[#0f1422] [&>option]:text-white"
                  >
                    {MOSPI_CADRES.map((cadre) => (
                      <option key={cadre} value={cadre}>
                        {cadre}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Cadre rank benchmark (Highest: DG → Lowest: JSO).
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Post / Job Role</label>
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/50 transition">
                  <Briefcase size={16} className="text-amber-400 shrink-0" />
                  <select
                    value={MOSPI_POST_ROLES.includes(formData.post) ? formData.post : "Other"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "Other") {
                        if (MOSPI_POST_ROLES.includes(formData.post)) {
                          handleChange("post", "");
                        }
                      } else {
                        handleChange("post", val);
                      }
                    }}
                    className="w-full text-sm outline-none text-white bg-transparent cursor-pointer [&>option]:bg-[#0f1422] [&>option]:text-white"
                  >
                    {MOSPI_POST_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                    <option value="Other">+ Other (Custom Post / Role)...</option>
                  </select>
                </div>
                {(!MOSPI_POST_ROLES.includes(formData.post) || formData.post === "") && (
                  <div className="mt-2 flex items-center gap-2 bg-white/[0.03] border border-amber-500/40 rounded-xl px-3 py-2 animate-in fade-in duration-150">
                    <input
                      type="text"
                      value={formData.post}
                      onChange={(e) => handleChange("post", e.target.value)}
                      placeholder="Type custom post / role (e.g. Survey In-Charge)"
                      className="w-full text-xs outline-none text-amber-200 bg-transparent placeholder:text-slate-500"
                      autoFocus
                    />
                  </div>
                )}
                <p className="text-[11px] text-slate-500 mt-1">
                  Context for AI &amp; recommendations (does not alter rank targets).
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Ministry / Department</label>
                <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition">
                  <Building2 size={16} className="text-slate-400" />
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    placeholder="e.g. Ministry of Statistics & PI"
                    className="w-full text-sm outline-none text-white bg-transparent placeholder:text-slate-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Official department / statutory wing.
                </p>
              </div>
            </div>

            {/* Live Role Profile Information Card */}
            {activeRoleProfile && (
              <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-indigo-500/20 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{activeRoleProfile.cadreTitle}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                      {activeRoleProfile.service}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Grade: <span className="text-slate-200">{activeRoleProfile.grade}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-200">Mandate:</strong> {activeRoleProfile.coreMandate}
                </p>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Key Role Responsibilities:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeRoleProfile.keyResponsibilities.map((resp, idx) => (
                      <li key={idx} className="text-[11px] text-slate-300 bg-white/[0.03] border border-white/[0.05] rounded-xl p-2 flex items-start gap-1.5">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Years of Experience</label>
            <input
              type="number"
              min="0"
              max="40"
              value={formData.experienceYears}
              onChange={(e) => handleChange("experienceYears", e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-white transition"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Foundational service experience (0 yrs = cadre entry baseline, scales with years of service).
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Academic Qualifications (comma separated)</label>
            <input
              type="text"
              value={formData.qualifications}
              onChange={(e) => handleChange("qualifications", e.target.value)}
              placeholder="e.g. Master in Statistics, B.Sc Mathematics"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-white transition placeholder:text-slate-600"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Past Completed Trainings &amp; Certifications</label>
          <textarea
            rows="3"
            value={formData.pastTrainings}
            onChange={(e) => handleChange("pastTrainings", e.target.value)}
            placeholder="e.g. iGOT Data Governance, NSO Survey Sampling 2024"
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-white transition placeholder:text-slate-600"
          />
        </div>

        {/* Calibration Benchmark Disclaimer Alert */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
          <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            {BENCHMARK_DISCLAIMER}
          </p>
        </div>

        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving Profile...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} /> Save Profile &amp; Sync ML
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
