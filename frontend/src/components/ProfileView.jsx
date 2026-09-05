import { useState, useEffect } from "react";
import { User, Building2, Briefcase, Award, Sparkles, CheckCircle2, Loader2, BookOpen, ShieldCheck } from "lucide-react";

export const MOSPI_CADRES = [
  "Junior Statistical Officer (JSO)",
  "Statistical Officer (SO)",
  "Senior Statistical Officer (SSO)",
  "Assistant Director",
  "Deputy Director",
  "Joint Director",
  "Director",
  "Additional Director General",
  "Director General",
];

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
    department: profileData?.department || "National Statistical Office (NSO)",
    experienceYears: profileData?.experienceYears != null ? profileData.experienceYears : 0,
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
        department: profileData.department || prev.department,
        experienceYears: profileData.experienceYears != null ? profileData.experienceYears : (prev.experienceYears ?? 0),
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
            <p className="text-xs text-slate-400 mt-0.5">{formData.designation} · {formData.department}</p>
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
              Select cadre to recalibrate competency benchmarks (Problem Statement 101).
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
