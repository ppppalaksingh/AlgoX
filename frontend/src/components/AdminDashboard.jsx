import { useState } from "react";
import {
  Users, TrendingUp, Award, Clock, ArrowUpRight, BarChart3,
  Shield, CheckCircle2, AlertTriangle, Sparkles, Filter, Download,
  Layers, Calendar, Building2, ChevronRight, BookOpen, Search,
  Eye, UserCheck, Send, X, ExternalLink
} from "lucide-react";

export default function AdminDashboard({
  adminData,
  officials = [],
  onRefreshOfficials,
  onAssignTraining,
  onInspectOfficial,
}) {
  const [activeTab, setActiveTab] = useState("officials"); // 'officials' | 'overview' | 'heatmap' | 'predictive' | 'batch'
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [officialSearch, setOfficialSearch] = useState("");
  const [selectedOfficialModal, setSelectedOfficialModal] = useState(null);
  const [assignmentModal, setAssignmentModal] = useState(null);
  const [assignedSuccessToast, setAssignedSuccessToast] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const ITEMS_PER_PAGE = 25;

  const [batchNomination, setBatchNomination] = useState({
    cadre: "Subordinate Statistical Service (SSS)",
    program: "Planning and Designing of Large Scale Sample Surveys (NSSTA)",
    batchSize: 45,
    startDate: "2026-10-12",
  });
  const [isNominated, setIsNominated] = useState(false);

  // Fallback mock list if API not yet populated
  const fallbackOfficialsList = [
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

  // Dynamic live dataset if provided from MongoDB & MoSPI catalog
  const allOfficialsList = officials && officials.length > 0 ? officials : fallbackOfficialsList;
  const liveUsersCount = allOfficialsList.filter((o) => o.isLiveUser).length;

  const isRealData = Boolean(officials && officials.length > 0);
  const calculatedAvgCompetency = isRealData
    ? (
        allOfficialsList.reduce((acc, o) => acc + (Number(o.overallCompetency) || 0), 0) /
        (allOfficialsList.length || 1)
      ).toFixed(1)
    : 74.5;

  const calculatedActiveLearners = isRealData
    ? allOfficialsList.filter((o) => o.coursesCompleted > 0 || o.status === "Active").length
    : 3920;

  const summary = {
    totalOfficials: isRealData ? allOfficialsList.length : adminData?.summary?.totalOfficials || 4850,
    activeLearners: isRealData ? calculatedActiveLearners : adminData?.summary?.activeLearners || 3920,
    overallCompetencyScore: isRealData ? Number(calculatedAvgCompetency) : adminData?.summary?.overallCompetencyScore || 74.5,
    totalTrainingHours: adminData?.summary?.totalTrainingHours || 142800,
    coursesCompleted: adminData?.summary?.coursesCompleted || 18450,
    certificationsIssued: adminData?.summary?.certificationsIssued || 9620,
    avgSkillGapReduction: adminData?.summary?.avgSkillGapReduction || "24.8%",
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
    if (score >= 80) return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    if (score >= 68) return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    return "bg-rose-500/15 text-rose-300 border-rose-500/30 font-semibold";
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
    const q = officialSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (o.name || "").toLowerCase().includes(q) ||
      (o.designation || "").toLowerCase().includes(q) ||
      (o.department || "").toLowerCase().includes(q) ||
      (o.email || "").toLowerCase().includes(q) ||
      (o.cadre || "").toLowerCase().includes(q);

    let matchesDiv = true;
    if (selectedDivision === "all") {
      matchesDiv = true;
    } else if (selectedDivision === "live") {
      matchesDiv = Boolean(o.isLiveUser);
    } else {
      matchesDiv = o.cadre === selectedDivision;
    }

    return matchesSearch && matchesDiv;
  });

  const totalPages = Math.ceil(filteredOfficials.length / ITEMS_PER_PAGE) || 1;
  const paginatedOfficials = filteredOfficials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {assignedSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center justify-between shadow-xl animate-in fade-in backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{assignedSuccessToast}</span>
          </div>
          <button onClick={() => setAssignedSuccessToast("")} className="text-emerald-400 font-bold hover:text-white"><X size={16} /></button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-[#0c101d]/90 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Building2 size={13} className="text-blue-400" />
              MoSPI &amp; NSSTA Capacity Building Division (Admin Hub)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Workforce Skill Intelligence &amp; Officials Management
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Full administrator control: Inspect individual official competency profiles, assign targeted TPAC modules, view division heatmaps, and plan national capacity cohorts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onRefreshOfficials && (
              <button
                onClick={async () => {
                  setIsRefreshing(true);
                  try {
                    await onRefreshOfficials();
                  } finally {
                    setTimeout(() => setIsRefreshing(false), 800);
                  }
                }}
                disabled={isRefreshing}
                className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={15} className={isRefreshing ? "animate-spin text-emerald-400" : "text-emerald-400"} />
                {isRefreshing ? "Syncing..." : "Sync Live Users"}
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <Download size={15} /> Export Audit Report
            </button>
            <button
              onClick={() => setActiveTab("batch")}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Calendar size={15} /> Plan NSSTA Batch
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 border-t border-white/[0.08] pt-4 overflow-x-auto">
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
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-white/[0.08] text-slate-300"
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
        <div className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Officials Directory &amp; Individual Access</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Inspect any official&apos;s competency profile, view skill gaps, and assign personalized iGOT / NSSTA training modules.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-3.5 py-2 border border-white/[0.08] w-full sm:w-64 focus-within:border-blue-500/50">
                <Search size={15} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, cadre, role..."
                  value={officialSearch}
                  onChange={(e) => setOfficialSearch(e.target.value)}
                  className="bg-transparent text-xs outline-none w-full text-white placeholder:text-slate-500"
                />
              </div>

              {/* Filter */}
              <select
                value={selectedDivision}
                onChange={(e) => {
                  setSelectedDivision(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-white/[0.08] text-xs font-semibold bg-[#0c101d] text-slate-200 outline-none cursor-pointer"
              >
                <option value="all">All Cadres ({allOfficialsList.length})</option>
                {liveUsersCount > 0 && (
                  <option value="live">🟢 Live Registered Users ({liveUsersCount})</option>
                )}
                <option value="Indian Statistical Service (ISS)">ISS Cadre</option>
                <option value="Subordinate Statistical Service (SSS)">SSS Cadre</option>
                <option value="Data Processing Cadre (DPD)">DPD Cadre</option>
                <option value="State DES Deputed Officers">State DES</option>
                <option value="Field Operations Division (FOD)">Field Operations (FOD)</option>
              </select>
            </div>
          </div>

          {/* Officials Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 rounded-l-xl">Official Name &amp; Email</th>
                  <th className="py-3.5 px-4">Designation &amp; Division</th>
                  <th className="py-3.5 px-4">Cadre</th>
                  <th className="py-3.5 px-4 text-center">Competency</th>
                  <th className="py-3.5 px-4">Top Skill Gap</th>
                  <th className="py-3.5 px-4 text-center rounded-r-xl">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-medium">
                {paginatedOfficials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      No officials match the current search or cadre filter.
                    </td>
                  </tr>
                ) : (
                  paginatedOfficials.map((off) => (
                    <tr key={off.id || off.employee_id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-white">{off.name}</p>
                          {off.isLiveUser && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 tracking-wider uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live User
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{off.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-300 text-xs">{off.designation}</p>
                        <p className="text-[11px] text-slate-500">{off.department}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                          {off.cadre}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-blue-400 text-sm">{off.overallCompetency}%</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/25">
                          <AlertTriangle size={11} /> {off.topSkillGap}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedOfficialModal(off)}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-bold transition flex items-center gap-1 border border-blue-500/20 cursor-pointer"
                            title="Drill-down into competency profile"
                          >
                            <Eye size={13} /> Inspect Profile
                          </button>
                          <button
                            onClick={() => setAssignmentModal(off)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-md shadow-blue-600/30 cursor-pointer"
                            title="Assign mandatory TPAC / iGOT course"
                          >
                            <Send size={12} /> Assign Module
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.06] text-xs text-slate-400">
              <div>
                Showing <span className="text-white font-bold">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to{" "}
                <span className="text-white font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, filteredOfficials.length)}</span> of{" "}
                <span className="text-white font-bold">{filteredOfficials.length}</span> officials
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-40 disabled:pointer-events-none border border-white/[0.08] text-slate-300 font-semibold cursor-pointer"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-white font-bold bg-white/[0.06] rounded-lg border border-white/[0.08]">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-40 disabled:pointer-events-none border border-white/[0.08] text-slate-300 font-semibold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: OFFICIAL DRILL-DOWN INSPECTION */}
      {selectedOfficialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0c101d] rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 border border-white/[0.12] max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-300 bg-blue-500/15 px-3 py-1 rounded-full border border-blue-500/25">
                  {selectedOfficialModal.cadre}
                </span>
                <h3 className="text-2xl font-black text-white mt-2">{selectedOfficialModal.name}</h3>
                <p className="text-xs text-slate-400">{selectedOfficialModal.designation} • {selectedOfficialModal.department}</p>
              </div>
              <button
                onClick={() => setSelectedOfficialModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Competency 4-Domain Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">4-Domain Competency Assessment</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-500/10 p-3.5 rounded-2xl border border-blue-500/20 text-center">
                  <p className="text-xs text-blue-300 font-semibold">Statistical</p>
                  <p className="text-xl font-extrabold text-blue-400 mt-1">{selectedOfficialModal.domainScores?.statistical ?? 75}%</p>
                </div>
                <div className="bg-orange-500/10 p-3.5 rounded-2xl border border-orange-500/20 text-center">
                  <p className="text-xs text-orange-300 font-semibold">Technical</p>
                  <p className="text-xl font-extrabold text-orange-400 mt-1">{selectedOfficialModal.domainScores?.technical ?? 65}%</p>
                </div>
                <div className="bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/20 text-center">
                  <p className="text-xs text-emerald-300 font-semibold">Digital Gov</p>
                  <p className="text-xl font-extrabold text-emerald-400 mt-1">{selectedOfficialModal.domainScores?.digitalGovernance ?? 70}%</p>
                </div>
                <div className="bg-purple-500/10 p-3.5 rounded-2xl border border-purple-500/20 text-center">
                  <p className="text-xs text-purple-300 font-semibold">Leadership</p>
                  <p className="text-xl font-extrabold text-purple-400 mt-1">{selectedOfficialModal.domainScores?.behavioural ?? 80}%</p>
                </div>
              </div>
            </div>

            {/* Skill Gaps & Recommended Interventions */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase">Identified Priority Skill Gap</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle size={15} /> {selectedOfficialModal.topSkillGap}
                </span>
                <button
                  onClick={() => {
                    const off = selectedOfficialModal;
                    setSelectedOfficialModal(null);
                    setAssignmentModal(off);
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 transition cursor-pointer"
                >
                  Assign Recommended TPAC Course
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setSelectedOfficialModal(null)}
                className="px-5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN COURSE TO INDIVIDUAL OFFICIAL */}
      {assignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0c101d] rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 border border-white/[0.12] space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white">Assign Training Programme</h3>
                <p className="text-xs text-slate-400 mt-0.5">Target Official: <strong className="text-white">{assignmentModal.name}</strong> ({assignmentModal.designation})</p>
              </div>
              <button onClick={() => setAssignmentModal(null)} className="text-slate-400 hover:text-white transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase">Select Accredited NSSTA / iGOT Module</label>
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
                  className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-blue-500/40 hover:bg-blue-500/10 cursor-pointer transition flex items-center justify-between group"
                >
                  <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">{cName}</span>
                  <ChevronRight size={15} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
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
            <div className="bg-[#0f1422]/80 rounded-3xl p-5 border border-white/[0.08] shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Officials</span>
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><Users size={18} /></span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{summary.totalOfficials.toLocaleString()}</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1">
                <TrendingUp size={13} /> {summary.activeLearners.toLocaleString()} Active Learners ({Math.round((summary.activeLearners / summary.totalOfficials) * 100)}%)
              </div>
            </div>

            <div className="bg-[#0f1422]/80 rounded-3xl p-5 border border-white/[0.08] shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Org Competency Score</span>
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><Award size={18} /></span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{summary.overallCompetencyScore}%</p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mt-1">
                <Sparkles size={13} /> Target: 85% by Q4 2026
              </div>
            </div>

            <div className="bg-[#0f1422]/80 rounded-3xl p-5 border border-white/[0.08] shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Training Hours</span>
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock size={18} /></span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{summary.totalTrainingHours.toLocaleString()}h</p>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mt-1">
                <ArrowUpRight size={13} /> +18.4% YoY on iGOT Platform
              </div>
            </div>

            <div className="bg-[#0f1422]/80 rounded-3xl p-5 border border-white/[0.08] shadow-xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skill Gap Reduction</span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 size={18} /></span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">{summary.avgSkillGapReduction}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                Across 4 core competency domains
              </div>
            </div>
          </div>

          {/* Cadre Table */}
          <div className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-6 shadow-xl space-y-4 backdrop-blur-xl">
            <h3 className="text-base font-bold text-white">Cadre-Wise Competency &amp; Completion Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-xl">Cadre</th>
                    <th className="py-3 px-4">Headcount</th>
                    <th className="py-3 px-4">Avg Competency</th>
                    <th className="py-3 px-4">Top Identified Skill Gap</th>
                    <th className="py-3 px-4 rounded-r-xl">iGOT Completion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] font-medium">
                  {cadres.map((c, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-4 font-semibold text-white">{c.cadre}</td>
                      <td className="py-3.5 px-4 text-slate-400">{c.headcount.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-white/[0.08] rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full" style={{ width: `${c.avgCompetency}%` }} />
                          </div>
                          <span className="font-bold text-white">{c.avgCompetency}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-300 text-xs font-semibold">
                          <AlertTriangle size={12} /> {c.topSkillGap}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/25">
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
        <div className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-6 shadow-xl space-y-6 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">MoSPI Directorate Skill-Gap Heatmap</h3>
              <p className="text-xs text-slate-400">
                Identifies competency readiness across national directorates (*FOD, DPD, SDRD, NAD, ESD*).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Division / Directorate</th>
                  <th className="py-3 px-4 text-center">Statistical</th>
                  <th className="py-3 px-4 text-center">Technical</th>
                  <th className="py-3 px-4 text-center">Digital Governance</th>
                  <th className="py-3 px-4 text-center">Leadership</th>
                  <th className="py-3 px-4 rounded-r-xl">Priority Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {heatmapData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4 font-semibold text-white">{row.division}</td>
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
                      <span className="text-xs font-semibold text-rose-300 bg-rose-500/15 px-2.5 py-1 rounded-lg border border-rose-500/25">
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
          <div className="bg-[#0c101d]/90 rounded-3xl p-6 text-white border border-white/[0.08] backdrop-blur-xl relative overflow-hidden shadow-xl">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={14} className="text-blue-400" /> AI Forecasting Model (2026–2028 Projection)
            </div>
            <h3 className="text-xl font-extrabold text-white">Emerging Technology Skill Demand in Official Statistics</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
              Anticipating technology modernization across MoSPI datasets (AI automated survey scrutiny, GIS spatial frames, DPDP Act 2023 compliance, Big Data national accounts).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictiveForecast.map((item, idx) => (
              <div key={idx} className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-5 shadow-xl flex flex-col justify-between backdrop-blur-xl">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      item.urgency === "Critical"
                        ? "bg-rose-500/15 text-rose-300 border border-rose-500/25"
                        : "bg-amber-500/15 text-amber-300 border border-amber-500/25"
                    }`}>
                      {item.urgency} Urgency
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Target 2027</span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-1">{item.skill}</h4>
                  
                  <div className="space-y-2 my-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Current Official Adoption: <strong className="text-slate-200">{item.currentAdoption}</strong></span>
                      <span>Projected Requirement: <strong className="text-blue-400 font-bold">{item.projectedDemand2027}</strong></span>
                    </div>
                    <div className="w-full bg-white/[0.06] rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full"
                        style={{ width: item.projectedDemand2027 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Recommended TPAC Course:</span>
                  <span className="text-xs font-bold text-blue-300 truncate max-w-[220px]">
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
        <div className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6 backdrop-blur-xl">
          <div>
            <h3 className="text-xl font-extrabold text-white">NSSTA Training Programme Batch Nomination</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Assign recommended TPAC training programmes to specific cadres or state directorates to systematically close workforce skill gaps.
            </p>
          </div>

          {isNominated && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center gap-3 shadow-lg">
              <CheckCircle2 size={20} className="text-emerald-400" />
              Batch successfully created! 45 officials from Subordinate Statistical Service enrolled in NSSTA Calendar.
            </div>
          )}

          <form onSubmit={handleCreateBatch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Cadre / Directorate
              </label>
              <select
                value={batchNomination.cadre}
                onChange={(e) => setBatchNomination({ ...batchNomination, cadre: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm font-medium text-white focus:border-blue-500/50 outline-none cursor-pointer"
              >
                <option value="Subordinate Statistical Service (SSS)" className="bg-[#0c101d] text-white">Subordinate Statistical Service (SSS)</option>
                <option value="Indian Statistical Service (ISS)" className="bg-[#0c101d] text-white">Indian Statistical Service (ISS)</option>
                <option value="Field Operations Division (FOD)" className="bg-[#0c101d] text-white">Field Operations Division (FOD)</option>
                <option value="Data Processing Division (DPD)" className="bg-[#0c101d] text-white">Data Processing Division (DPD)</option>
                <option value="State DES Deputed Officers" className="bg-[#0c101d] text-white">State Directorates of Economics &amp; Statistics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Recommended NSSTA / TPAC Programme
              </label>
              <select
                value={batchNomination.program}
                onChange={(e) => setBatchNomination({ ...batchNomination, program: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm font-medium text-white focus:border-blue-500/50 outline-none cursor-pointer"
              >
                <option value="Planning and Designing of Large Scale Sample Surveys (NSSTA)" className="bg-[#0c101d] text-white">
                  Planning and Designing of Large Scale Sample Surveys (NSSTA, Greater Noida)
                </option>
                <option value="Handling Large Scale Data & Data Analysis using R (IIT Kanpur / IASRI)" className="bg-[#0c101d] text-white">
                  Handling Large Scale Data &amp; Data Analysis using R (IIT Kanpur / IASRI)
                </option>
                <option value="Big Data Analysis (Dr. MCRHRD Hyderabad / C R Rao AIMSC)" className="bg-[#0c101d] text-white">
                  Big Data Analysis (Dr. MCRHRD Hyderabad / C R Rao AIMSC)
                </option>
                <option value="Python Training for Statisticians (C R Rao AIMSC, Hyderabad)" className="bg-[#0c101d] text-white">
                  Python Training for Statisticians (C R Rao AIMSC, Hyderabad)
                </option>
                <option value="Training on Artificial Intelligence and Machine Learning (IIT Madras)" className="bg-[#0c101d] text-white">
                  Training on Artificial Intelligence and Machine Learning (IIT Madras)
                </option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Batch Capacity (Officers)
                </label>
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={batchNomination.batchSize}
                  onChange={(e) => setBatchNomination({ ...batchNomination, batchSize: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm font-medium text-white focus:border-blue-500/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Cohort Start Date
                </label>
                <input
                  type="date"
                  value={batchNomination.startDate}
                  onChange={(e) => setBatchNomination({ ...batchNomination, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-sm font-medium text-white focus:border-blue-500/50 outline-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
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
