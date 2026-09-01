import { useState, useEffect } from "react";
import { User, Building2, Briefcase, Award, Sparkles, CheckCircle2, Loader2, BookOpen, ShieldCheck } from "lucide-react";

export default function ProfileView({ user, profileData, onSaveProfile, isSaving, onRunAnalysis, isAnalyzing }) {
  const [formData, setFormData] = useState({
    name: user?.name || "Learner",
    email: user?.email || "learner@mospi.gov.in",
    designation: profileData?.designation || "Assistant Director",
    department: profileData?.department || "National Statistical Office (NSO)",
    experienceYears: profileData?.experienceYears || 4,
    qualifications: profileData?.qualifications?.join(", ") || "B.Tech Computer Science, PG Diploma in Data Analytics",
    pastTrainings: profileData?.pastTrainings?.join(", ") || "iGOT Digital Governance, Statistical Sampling Methods",
  });

  useEffect(() => {
    if (profileData) {
      setFormData((prev) => ({
        ...prev,
        designation: profileData.designation || prev.designation,
        department: profileData.department || prev.department,
        experienceYears: profileData.experienceYears ?? prev.experienceYears,
        qualifications: profileData.qualifications?.join(", ") || prev.qualifications,
        pastTrainings: profileData.pastTrainings?.join(", ") || prev.pastTrainings,
      }));
    }
  }, [profileData]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      email: formData.email,
      designation: formData.designation,
      department: formData.department,
      experienceYears: Number(formData.experienceYears) || 0,
      qualifications: formData.qualifications.split(",").map((s) => s.trim()).filter(Boolean),
      pastTrainings: formData.pastTrainings.split(",").map((s) => s.trim()).filter(Boolean),
    };
    onSaveProfile?.(payload);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            {formData.name?.charAt(0) || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">{formData.name}</h1>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck size={12} /> Verified Officer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{formData.designation} · {formData.department}</p>
            <p className="text-xs text-slate-400 mt-1">{formData.email}</p>
          </div>
        </div>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 disabled:opacity-60 text-blue-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
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
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-800">Official Profile &amp; Role Parameters</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            AlgoX ML recommendation engine uses these parameters to customize your learning pathway and skill gap metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Official Name</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-blue-500">
              <User size={16} className="text-slate-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full text-sm outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Email Address</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 text-slate-500">
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full text-sm outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Designation / Role</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-blue-500">
              <Briefcase size={16} className="text-slate-400" />
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
                placeholder="e.g. Assistant Director, Statistical Officer"
                className="w-full text-sm outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Ministry / Department</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-blue-500">
              <Building2 size={16} className="text-slate-400" />
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleChange("department", e.target.value)}
                placeholder="e.g. Ministry of Statistics & PI"
                className="w-full text-sm outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Years of Experience</label>
            <input
              type="number"
              min="0"
              max="40"
              value={formData.experienceYears}
              onChange={(e) => handleChange("experienceYears", e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Academic Qualifications (comma separated)</label>
            <input
              type="text"
              value={formData.qualifications}
              onChange={(e) => handleChange("qualifications", e.target.value)}
              placeholder="e.g. Master in Statistics, B.Sc Mathematics"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">Past Completed Trainings &amp; Certifications</label>
          <textarea
            rows="3"
            value={formData.pastTrainings}
            onChange={(e) => handleChange("pastTrainings", e.target.value)}
            placeholder="e.g. iGOT Data Governance, NSO Survey Sampling 2024"
            className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
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
