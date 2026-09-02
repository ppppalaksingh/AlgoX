import { useState } from "react";
import {
  Users, TrendingUp, Award, Clock, ArrowUpRight, BarChart3,
  Shield, CheckCircle2, AlertTriangle, Sparkles, Filter, Download,
  Layers, Calendar, Building2, ChevronRight, BookOpen, Search,
  Eye, UserCheck, Send, X, ExternalLink
} from "lucide-react";

export default function AdminDashboard({ adminData, onAssignTraining, onInspectOfficial }) {
  const [activeTab, setActiveTab] = useState("officials"); // 'officials' | 'overview' | 'heatmap' | 'predictive' | 'batch'
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [officialSearch, setOfficialSearch] = useState("");
  const [selectedOfficialModal, setSelectedOfficialModal] = useState(null);
  const [assignmentModal, setAssignmentModal] = useState(null);
  const [assignedSuccessToast, setAssignedSuccessToast] = useState("");

  const [batchNomination, setBatchNomination] = useState({
    cadre: "Subordinate Statistical Service (SSS)",
    program: "Planning and Designing of Large Scale Sample Surveys (NSSTA)",
    batchSize: 45,
    startDate: "2026-10-12",
  });
  const [isNominated, setIsNominated] = useState(false);

  // Mock list of all officials across Indian Statistical System
  const allOfficialsList = [
    {
      id: "off-001",
      name: "Dr. Rajesh K. Sharma",
      email: "rajesh.sharma@mospi.gov.in",
      designation: "Director General (DG)",
      department: "National Statistical Office (NSO)",
      cadre: "Indian Statistical Service (ISS)",
      experienceYears: 18,
      overallCompetency: 88,
      domainScores: { statistical: 92, technical: 78, digitalGovernance: 86, behavioural: 95 },
      topSkillGap: "AI/ML in Governance",
      coursesCompleted: 14,
      status: "Active",
    },
    {
      id: "off-002",
      name: "Amit Kumar",
      email: "amit.kumar@mospi.gov.in",
      designation: "Assistant Director",
      department: "Field Operations Division (FOD)",
      cadre: "Indian Statistical Service (ISS)",
      experienceYears: 4,
      overallCompetency: 74,
      domainScores: { statistical: 82, technical: 64, digitalGovernance: 70, behavioural: 88 },
      topSkillGap: "Python for Survey Scrutiny",
      coursesCompleted: 8,
      status: "Active",
    },
    {
      id: "off-003",
      name: "Priya V. Verma",
      email: "priya.verma@mospi.gov.in",
      designation: "Deputy Director",
      department: "National Accounts Division (NAD)",
      cadre: "Indian Statistical Service (ISS)",
      experienceYears: 8,
      overallCompetency: 82,
      domainScores: { statistical: 90, technical: 74, digitalGovernance: 78, behavioural: 86 },
      topSkillGap: "Big Data SNA Integration",
      coursesCompleted: 11,
      status: "Active",
    },
    {
      id: "off-004",
      name: "Sunita Rao",
      email: "sunita.rao@mospi.gov.in",
      designation: "Senior Statistical Officer (SSO)",
      department: "Data Processing Division (DPD)",
      cadre: "Subordinate Statistical Service (SSS)",
      experienceYears: 6,
      overallCompetency: 71,
      domainScores: { statistical: 76, technical: 68, digitalGovernance: 65, behavioural: 75 },
      topSkillGap: "DPDP Act 2023 Compliance",
      coursesCompleted: 6,
      status: "In Training",
    },
    {
      id: "off-005",
      name: "Vikramaditya Singh",
      email: "vikram.singh@mospi.gov.in",
      designation: "Junior Statistical Officer (JSO)",
      department: "Survey Design and Research (SDRD)",
      cadre: "Subordinate Statistical Service (SSS)",
      experienceYears: 2,
      overallCompetency: 64,
      domainScores: { statistical: 70, technical: 58, digitalGovernance: 60, behavioural: 68 },
      topSkillGap: "Stratified Sampling & Multipliers",
      coursesCompleted: 4,
      status: "Action Required",
    },
    {
      id: "off-006",
      name: "Ananya Das",
      email: "ananya.das@mospi.gov.in",
      designation: "Data Processing Assistant (DPA)",
      department: "Computer Centre / DIID",
      cadre: "Data Processing Cadre (DPD)",
      experienceYears: 5,
      overallCompetency: 76,
      domainScores: { statistical: 68, technical: 88, digitalGovernance: 76, behavioural: 72 },
      topSkillGap: "Cloud Security (MeghRaj)",
      coursesCompleted: 9,
      status: "Active",
    },
    {
      id: "off-007",
      name: "Manoj R. Patil",
      email: "manoj.patil@mahades.gov.in",
      designation: "Statistical Officer",
      department: "Maharashtra State DES",
      cadre: "State DES Deputed Officers",
      experienceYears: 7,
      overallCompetency: 67,
      domainScores: { statistical: 72, technical: 56, digitalGovernance: 62, behavioural: 78 },
      topSkillGap: "Survey Data Scrutiny in R",
      coursesCompleted: 5,
      status: "Action Required",
    },
  ];

  const summary = adminData?.summary || {
    totalOfficials: 4850,
    activeLearners: 3920,
    overallCompetencyScore: 74.5,
    totalTrainingHours: 142800,
    coursesCompleted: 18450,
    certificationsIssued: 9620,
    avgSkillGapReduction: "24.8%",
  };

  const cadres = adminData?.cadres || [
    { cadre: "Indian Statistical Service (ISS)", headcount: 820, avgCompetency: 82.4, topSkillGap: "AI/ML in Governance", completionRate: 88 },
    { cadre: "Subordinate Statistical Service (SSS)", headcount: 2450, avgCompetency: 71.8, topSkillGap: "Python for Data Scrutiny", completionRate: 79 },
    { cadre: "Data Processing Cadre (DPD)", headcount: 680, avgCompetency: 76.5, topSkillGap: "Government Cloud (MeghRaj)", completionRate: 84 },
    { cadre: "State DES Deputed Officers", headcount: 900, avgCompetency: 67.2, topSkillGap: "Survey Sampling & Multipliers", completionRate: 72 },
  ];

  const heatmapData = adminData?.heatmapData || [
    { division: "Field Operations Division (FOD)", statistical: 84, technical: 58, digitalGovernance: 64, behavioural: 80, criticalGap: "Mobile CAPI & Python" },
    { division: "Data Processing Division (DPD)", statistical: 72, technical: 82, digitalGovernance: 78, behavioural: 74, criticalGap: "Cloud Security" },
    { division: "Survey Design & Research (SDRD)", statistical: 91, technical: 70, digitalGovernance: 68, behavioural: 82, criticalGap: "AI Predictive Modeling" },
    { division: "National Accounts Division (NAD)", statistical: 89, technical: 66, digitalGovernance: 72, behavioural: 85, criticalGap: "Big Data SNA Integration" },
    { division: "Economic Statistics Division (ESD)", statistical: 86, technical: 68, digitalGovernance: 70, behavioural: 81, criticalGap: "Web-Scraping for CPI" },
  ];

  const predictiveForecast = adminData?.predictiveForecast || [
    { skill: "Generative AI & LLMs in Official Reports", currentAdoption: "18%", projectedDemand2027: "82%", urgency: "High", recommendedTPACProgram: "Training on Artificial Intelligence and Machine Learning (IIT Madras)" },
    { skill: "GIS & Satellite Spatial Sampling", currentAdoption: "32%", projectedDemand2027: "78%", urgency: "High", recommendedTPACProgram: "GIS and Spatial Data Analysis (NSSTA)" },
    { skill: "DPDP Act 2023 & Microdata Privacy", currentAdoption: "45%", projectedDemand2027: "95%", urgency: "Critical", recommendedTPACProgram: "Cybersecurity & Data Privacy (DSCI & iGOT)" },
    { skill: "Automated Survey Scrutiny with Python/R", currentAdoption: "40%", projectedDemand2027: "88%", urgency: "High", recommendedTPACProgram: "Python Training for Statisticians (C R Rao AIMSC)" },
  ];

  const getHeatmapColor = (score) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 68) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-rose-100 text-rose-800 border-rose-200 font-semibold";
  };

  const handleCreateBatch = (e) => {
    e.preventDefault();
    setIsNominated(true);
    setTimeout(() => setIsNominated(false), 4000);
  };

  const handleAssignIndividualCourse = (official, courseName) => {
    setAssignedSuccessToast(`Assigned "${courseName}" to ${official.name} (${official.designation})!`);
    setAssignmentModal(null);
    setTimeout(() => setAssignedSuccessToast(""), 4500);
  };

  const filteredOfficials = allOfficialsList.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(officialSearch.toLowerCase()) ||
      o.designation.toLowerCase().includes(officialSearch.toLowerCase()) ||
      o.department.toLowerCase().includes(officialSearch.toLowerCase()) ||
      o.email.toLowerCase().includes(officialSearch.toLowerCase());
    const matchesDiv = selectedDivision === "all" || o.cadre === selectedDivision;
    return matchesSearch && matchesDiv;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {assignedSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>{assignedSuccessToast}</span>
          </div>
          <button onClick={() => setAssignedSuccessToast("")} className="text-emerald-700 font-bold"><X size={16} /></button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
              <Building2 size={13} />
              MoSPI &amp; NSSTA Capacity Building Division (Admin Hub)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Workforce Skill Intelligence &amp; Officials Management
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl mt-1 leading-relaxed">
              Full administrator control: Inspect individual official competency profiles, assign targeted TPAC modules, view division heatmaps, and plan national capacity cohorts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-2"
            >
              <Download size={15} /> Export Audit Report
            </button>
            <button
              onClick={() => setActiveTab("batch")}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition flex items-center gap-2"
            >
              <Calendar size={15} /> Plan NSSTA Batch
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 border-t border-white/10 pt-4 overflow-x-auto">
          {[
            { id: "officials", label: "All Officials Directory & Drill-Down", icon: Users, count: allOfficialsList.length },
            { id: "overview", label: "Executive Analytics", icon: BarChart3 },
            { id: "heatmap", label: "Cadre & Division Heatmap", icon: Layers },
            { id: "predictive", label: "Predictive Capacity Forecast", icon: Sparkles },
            { id: "batch", label: "NSSTA Batch Nomination", icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "bg-white text-slate-900 shadow-md font-bold"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? "bg-blue-600 text-white" : "bg-white/20 text-slate-200"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 0: ALL OFFICIALS DIRECTORY & DRILL-DOWN ACCESS */}
      {activeTab === "officials" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Officials Directory &amp; Individual Access</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Inspect any official&apos;s competency profile, view skill gaps, and assign personalized iGOT / NSSTA training modules.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3.5 py-2 border border-slate-200 w-full sm:w-64">
                <Search size={15} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, cadre, role..."
                  value={officialSearch}
                  onChange={(e) => setOfficialSearch(e.target.value)}
                  className="bg-transparent text-xs outline-none w-full text-slate-800"
                />
              </div>

              {/* Filter */}
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-700 outline-none"
              >
                <option value="all">All Cadres</option>
                <option value="Indian Statistical Service (ISS)">ISS Cadre</option>
                <option value="Subordinate Statistical Service (SSS)">SSS Cadre</option>
                <option value="Data Processing Cadre (DPD)">DPD Cadre</option>
                <option value="State DES Deputed Officers">State DES</option>
              </select>
            </div>
          </div>

          {/* Officials Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 rounded-l-xl">Official Name &amp; Email</th>
                  <th className="py-3.5 px-4">Designation &amp; Division</th>
                  <th className="py-3.5 px-4">Cadre</th>
                  <th className="py-3.5 px-4 text-center">Competency</th>
                  <th className="py-3.5 px-4">Top Skill Gap</th>
                  <th className="py-3.5 px-4 text-center rounded-r-xl">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOfficials.map((off) => (
                  <tr key={off.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{off.name}</p>
                      <p className="text-xs text-slate-400">{off.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-700 text-xs">{off.designation}</p>
                      <p className="text-[11px] text-slate-400">{off.department}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {off.cadre}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-blue-600 text-sm">{off.overallCompetency}%</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                        <AlertTriangle size={11} /> {off.topSkillGap}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedOfficialModal(off)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center gap-1"
                          title="Drill-down into competency profile"
                        >
                          <Eye size={13} /> Inspect Profile
                        </button>
                        <button
                          onClick={() => setAssignmentModal(off)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                          title="Assign mandatory TPAC / iGOT course"
                        >
                          <Send size={12} /> Assign Module
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: OFFICIAL DRILL-DOWN INSPECTION */}
      {selectedOfficialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  {selectedOfficialModal.cadre}
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-2">{selectedOfficialModal.name}</h3>
                <p className="text-xs text-slate-500">{selectedOfficialModal.designation} • {selectedOfficialModal.department}</p>
              </div>
              <button
                onClick={() => setSelectedOfficialModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Competency 4-Domain Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">4-Domain Competency Assessment</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-50/80 p-3 rounded-2xl border border-blue-200 text-center">
                  <p className="text-xs text-blue-700 font-semibold">Statistical</p>
                  <p className="text-xl font-black text-blue-900 mt-1">{selectedOfficialModal.domainScores.statistical}%</p>
                </div>
                <div className="bg-orange-50/80 p-3 rounded-2xl border border-orange-200 text-center">
                  <p className="text-xs text-orange-700 font-semibold">Technical</p>
                  <p className="text-xl font-black text-orange-900 mt-1">{selectedOfficialModal.domainScores.technical}%</p>
                </div>
                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-center">
                  <p className="text-xs text-emerald-700 font-semibold">Digital Gov</p>
                  <p className="text-xl font-black text-emerald-900 mt-1">{selectedOfficialModal.domainScores.digitalGovernance}%</p>
                </div>
                <div className="bg-purple-50/80 p-3 rounded-2xl border border-purple-200 text-center">
                  <p className="text-xs text-purple-700 font-semibold">Leadership</p>
                  <p className="text-xl font-black text-purple-900 mt-1">{selectedOfficialModal.domainScores.behavioural}%</p>
                </div>
              </div>
            </div>

            {/* Skill Gaps & Recommended Interventions */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-700 uppercase">Identified Priority Skill Gap</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle size={15} /> {selectedOfficialModal.topSkillGap}
                </span>
                <button
                  onClick={() => {
                    const off = selectedOfficialModal;
                    setSelectedOfficialModal(null);
                    setAssignmentModal(off);
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                >
                  Assign Recommended TPAC Course
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedOfficialModal(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN COURSE TO INDIVIDUAL OFFICIAL */}
      {assignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 border border-slate-200 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800">Assign Training Programme</h3>
                <p className="text-xs text-slate-500 mt-0.5">Target Official: <strong className="text-slate-800">{assignmentModal.name}</strong> ({assignmentModal.designation})</p>
              </div>
              <button onClick={() => setAssignmentModal(null)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase">Select Accredited NSSTA / iGOT Module</label>
              {[
                "Planning and Designing of Large Scale Sample Surveys (NSSTA)",
                "Python Training for Statisticians (C R Rao AIMSC, Hyderabad)",
                "Data Privacy and DPDP Act in Governance (DSCI & iGOT)",
                "Handling Large Scale Data & Data Analysis using R (IIT Kanpur)",
                "National Accounts Statistics & SNA 2008 Guidelines (NSSTA)",
              ].map((cName, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAssignIndividualCourse(assignmentModal, cName)}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-800">{cName}</span>
                  <ChevronRight size={15} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Officials</span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><Users size={18} /></span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">{summary.totalOfficials.toLocaleString()}</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
                <TrendingUp size={13} /> {summary.activeLearners.toLocaleString()} Active Learners ({Math.round((summary.activeLearners / summary.totalOfficials) * 100)}%)
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Org Competency Score</span>
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600"><Award size={18} /></span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">{summary.overallCompetencyScore}%</p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold mt-1">
                <Sparkles size={13} /> Target: 85% by Q4 2026
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Training Hours</span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600"><Clock size={18} /></span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">{summary.totalTrainingHours.toLocaleString()}h</p>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mt-1">
                <ArrowUpRight size={13} /> +18.4% YoY on iGOT Platform
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill Gap Reduction</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={18} /></span>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{summary.avgSkillGapReduction}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                Across 4 core competency domains
              </div>
            </div>
          </div>

          {/* Cadre Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800">Cadre-Wise Competency &amp; Completion Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-xl">Cadre</th>
                    <th className="py-3 px-4">Headcount</th>
                    <th className="py-3 px-4">Avg Competency</th>
                    <th className="py-3 px-4">Top Identified Skill Gap</th>
                    <th className="py-3 px-4 rounded-r-xl">iGOT Completion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {cadres.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{c.cadre}</td>
                      <td className="py-3.5 px-4 text-slate-600">{c.headcount.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${c.avgCompetency}%` }} />
                          </div>
                          <span className="font-bold text-slate-800">{c.avgCompetency}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
                          <AlertTriangle size={12} /> {c.topSkillGap}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 size={12} /> {c.completionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIVISION & CADRE HEATMAP */}
      {activeTab === "heatmap" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">MoSPI Directorate Skill-Gap Heatmap</h3>
              <p className="text-xs text-slate-500">
                Identifies competency readiness across national directorates (*FOD, DPD, SDRD, NAD, ESD*).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Division / Directorate</th>
                  <th className="py-3 px-4 text-center">Statistical</th>
                  <th className="py-3 px-4 text-center">Technical</th>
                  <th className="py-3 px-4 text-center">Digital Governance</th>
                  <th className="py-3 px-4 text-center">Leadership</th>
                  <th className="py-3 px-4 rounded-r-xl">Priority Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {heatmapData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{row.division}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg border text-xs ${getHeatmapColor(row.statistical)}`}>
                        {row.statistical}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg border text-xs ${getHeatmapColor(row.technical)}`}>
                        {row.technical}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg border text-xs ${getHeatmapColor(row.digitalGovernance)}`}>
                        {row.digitalGovernance}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg border text-xs ${getHeatmapColor(row.behavioural)}`}>
                        {row.behavioural}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                        {row.criticalGap}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PREDICTIVE CAPACITY FORECAST */}
      {activeTab === "predictive" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={14} /> AI Forecasting Model (2026–2028 Projection)
            </div>
            <h3 className="text-xl font-extrabold">Emerging Technology Skill Demand in Official Statistics</h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl">
              Anticipating technology modernization across MoSPI datasets (AI automated survey scrutiny, GIS spatial frames, DPDP Act 2023 compliance, Big Data national accounts).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictiveForecast.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      item.urgency === "Critical"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                      {item.urgency} Urgency
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Target 2027</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-800 mb-1">{item.skill}</h4>
                  
                  <div className="space-y-2 my-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Current Official Adoption: <strong className="text-slate-700">{item.currentAdoption}</strong></span>
                      <span>Projected Requirement: <strong className="text-blue-600 font-bold">{item.projectedDemand2027}</strong></span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                        style={{ width: item.projectedDemand2027 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Recommended TPAC Course:</span>
                  <span className="text-xs font-bold text-blue-700 truncate max-w-[220px]">
                    {item.recommendedTPACProgram}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BATCH NOMINATION PLANNER */}
      {activeTab === "batch" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800">NSSTA Training Programme Batch Nomination</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Assign recommended TPAC training programmes to specific cadres or state directorates to systematically close workforce skill gaps.
            </p>
          </div>

          {isNominated && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-600" />
              Batch successfully created! 45 officials from Subordinate Statistical Service enrolled in NSSTA Calendar.
            </div>
          )}

          <form onSubmit={handleCreateBatch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Cadre / Directorate
              </label>
              <select
                value={batchNomination.cadre}
                onChange={(e) => setBatchNomination({ ...batchNomination, cadre: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Subordinate Statistical Service (SSS)">Subordinate Statistical Service (SSS)</option>
                <option value="Indian Statistical Service (ISS)">Indian Statistical Service (ISS)</option>
                <option value="Field Operations Division (FOD)">Field Operations Division (FOD)</option>
                <option value="Data Processing Division (DPD)">Data Processing Division (DPD)</option>
                <option value="State DES Deputed Officers">State Directorates of Economics &amp; Statistics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Recommended NSSTA / TPAC Programme
              </label>
              <select
                value={batchNomination.program}
                onChange={(e) => setBatchNomination({ ...batchNomination, program: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Planning and Designing of Large Scale Sample Surveys (NSSTA)">
                  Planning and Designing of Large Scale Sample Surveys (NSSTA, Greater Noida)
                </option>
                <option value="Handling Large Scale Data & Data Analysis using R (IIT Kanpur / IASRI)">
                  Handling Large Scale Data &amp; Data Analysis using R (IIT Kanpur / IASRI)
                </option>
                <option value="Big Data Analysis (Dr. MCRHRD Hyderabad / C R Rao AIMSC)">
                  Big Data Analysis (Dr. MCRHRD Hyderabad / C R Rao AIMSC)
                </option>
                <option value="Python Training for Statisticians (C R Rao AIMSC, Hyderabad)">
                  Python Training for Statisticians (C R Rao AIMSC, Hyderabad)
                </option>
                <option value="Training on Artificial Intelligence and Machine Learning (IIT Madras)">
                  Training on Artificial Intelligence and Machine Learning (IIT Madras)
                </option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Batch Capacity (Officers)
                </label>
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={batchNomination.batchSize}
                  onChange={(e) => setBatchNomination({ ...batchNomination, batchSize: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cohort Start Date
                </label>
                <input
                  type="date"
                  value={batchNomination.startDate}
                  onChange={(e) => setBatchNomination({ ...batchNomination, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> Confirm Batch Nomination &amp; Sync with iGOT
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
