import { useState } from "react";
import { BookOpen, Clock, CheckCircle2, Search, Sparkles, ExternalLink, GraduationCap, Building, ShieldCheck, Play, LayoutGrid, ListFilter, SlidersHorizontal } from "lucide-react";
import { getColor } from "../data/colorMap";

export default function Courses({ courses, onStartCourse, onViewCertificate }) {
  const [selectedSource, setSelectedSource] = useState("all"); // 'all' | 'iGOT' | 'TPAC'
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(18);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [enrolledOnly, setEnrolledOnly] = useState(false);

  const domains = ["All", "Statistical", "Technical", "Digital Governance", "Behavioural"];

  const filteredCourses = (courses || []).filter((course) => {
    // Enrolled / In Progress filter toggle
    if (enrolledOnly && !(course.percent > 0 || course.status === "Completed" || course.status === "In Progress")) {
      return false;
    }

    // Source filter
    const matchesSource =
      selectedSource === "all" ||
      (selectedSource === "iGOT" && (course.source_type === "iGOT" || course.source?.includes("iGOT"))) ||
      (selectedSource === "TPAC" && (course.source_type === "TPAC" || course.source?.includes("NSSTA") || course.id?.startsWith("tpac")));

    // Domain filter
    const matchesDomain =
      selectedDomain === "All" ||
      course.domain?.toLowerCase() === selectedDomain.toLowerCase() ||
      (selectedDomain === "Digital Governance" && course.domain?.toLowerCase() === "digitalgovernance");

    // Search filter
    const matchesSearch =
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.provider && course.provider.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.institute && course.institute.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSource && matchesDomain && matchesSearch;
  });

  const displayedCourses = filteredCourses.slice(0, visibleCount);

  const getOfficialLink = (course) => {
    if (course.officialUrl && !course.officialUrl.includes("/CRS")) return course.officialUrl;
    if (course.igotLink && !course.igotLink.includes("/CRS")) return course.igotLink;
    const isTPAC = course.source_type === "TPAC" || course.id?.startsWith("tpac") || course.institute?.includes("NSSTA") || course.provider?.includes("NSSTA");
    if (isTPAC) return "https://nssta.gov.in";
    return "https://portal.igotkarmayogi.gov.in/public/home";
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Official Knowledge Base</span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Integrated Course &amp; Training Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            iGOT Karmayogi modules &amp; NSSTA TPAC recommended programmes, ranked with Python Sentence-Transformer embeddings.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl px-4 py-2.5 w-full md:w-80 shadow-inner transition-all">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search statistical models, iGOT, NSSTA..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(18);
            }}
            className="w-full text-xs outline-none bg-transparent text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Source Category Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 flex-wrap sm:flex-nowrap">
        <button
          onClick={() => {
            setSelectedSource("all");
            setVisibleCount(18);
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            selectedSource === "all"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)] border border-indigo-400/30"
              : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.08]"
          }`}
        >
          <BookOpen size={15} /> All Offerings ({courses?.length || 0})
        </button>
        <button
          onClick={() => {
            setSelectedSource("iGOT");
            setVisibleCount(18);
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            selectedSource === "iGOT"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.35)] border border-amber-400/30"
              : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.08]"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 text-[9px] flex items-center justify-center font-black">iG</span>
          iGOT Karmayogi Modules
        </button>
        <button
          onClick={() => {
            setSelectedSource("TPAC");
            setVisibleCount(18);
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            selectedSource === "TPAC"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)] border border-purple-400/30"
              : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.08]"
          }`}
        >
          <GraduationCap size={15} /> NSSTA TPAC Programmes
        </button>
      </div>

      {/* Filter & View Mode Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        {/* Domain Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => {
                setSelectedDomain(dom);
                setVisibleCount(18);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDomain === dom
                  ? "bg-white text-slate-900 shadow-md font-bold"
                  : "bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Toggles: Enrolled Filter & Grid/List View Mode */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Enrolled Only Toggle Button */}
          <button
            onClick={() => setEnrolledOnly((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              enrolledOnly
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs"
                : "bg-white/[0.04] text-slate-400 border-white/[0.08] hover:text-slate-200"
            }`}
            title="Toggle between all courses and your active/enrolled modules"
          >
            <span className={`w-2 h-2 rounded-full ${enrolledOnly ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
            <span>Enrolled Only</span>
          </button>

          {/* Grid / List View Toggle Switch */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white/[0.12] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Grid View (Cards)"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white/[0.12] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
              title="List View (Compact Rows)"
            >
              <ListFilter size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Display: Grid Mode vs List Mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayedCourses.map((course) => {
            const color = getColor(course.color || "blue");
            const isTPAC = course.source_type === "TPAC" || course.id?.startsWith("tpac") || course.institute?.includes("NSSTA");
            const providerName = course.provider || course.institute || (isTPAC ? "NSSTA / MoSPI" : "iGOT Karmayogi");
            const matchPercent = course.matchPercent || (course.matchScore ? Math.round(course.matchScore * 100) : 85);
            const officialLink = getOfficialLink(course);

            return (
              <div
                key={course.id}
                className="bg-[#0f1422]/80 backdrop-blur-xl border border-white/[0.08] hover:border-indigo-500/40 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-1 relative group"
              >
                {/* Top edge glow sheen */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-11 h-11 rounded-2xl ${isTPAC ? "bg-indigo-500/15 border border-indigo-500/30 text-indigo-400" : color.bg + " " + color.text} flex items-center justify-center shrink-0 shadow-inner`}>
                      {isTPAC ? <GraduationCap size={20} /> : <BookOpen size={20} />}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {matchPercent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                          <Sparkles size={11} className="text-purple-400" /> {matchPercent}% AI Match
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wide border ${
                        isTPAC ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" : "bg-orange-500/15 text-orange-300 border-orange-500/30"
                      }`}>
                        {isTPAC ? "NSSTA TPAC" : "iGOT Module"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {course.description || `Accredited capacity building module by ${providerName}.`}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium flex-wrap">
                    <span className="px-2.5 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded-md font-semibold text-slate-300 flex items-center gap-1">
                      <Building size={11} /> {providerName}
                    </span>
                    <span className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded-md capitalize text-slate-400">
                      {course.domain || "Statistical"}
                    </span>
                    {course.duration && (
                      <span className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded-md flex items-center gap-1 text-slate-400">
                        <Clock size={11} /> {course.duration}
                      </span>
                    )}
                  </div>

                  {/* Direct Clickable Official Portal URL Chip */}
                  <div className="pt-0.5">
                    <a
                      href={officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-indigo-300 hover:text-white flex items-center justify-between font-semibold bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl px-3 py-1.5 transition-all group/link"
                      title={`Open official government portal: ${officialLink}`}
                    >
                      <span className="flex items-center gap-1.5 truncate min-w-0">
                        <ExternalLink size={12} className="shrink-0 text-indigo-400 group-hover/link:translate-x-0.5 transition-transform" />
                        <span className="truncate">{officialLink.replace(/^https?:\/\//, '')}</span>
                      </span>
                      <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded-md shrink-0 ml-1.5">
                        {isTPAC ? "NSSTA ↗" : "iGOT ↗"}
                      </span>
                    </a>
                  </div>

                  <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isTPAC ? "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" : color.bar} rounded-full transition-all duration-300`}
                      style={{ width: `${course.percent || (course.status === "Completed" ? 100 : 25)}%` }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (course.status === "Completed") {
                          onViewCertificate?.(course);
                        } else {
                          onStartCourse?.(course);
                        }
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl py-2.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.25)] ${
                        course.status === "Completed"
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                          : isTPAC
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                      }`}
                    >
                      {course.status === "Completed" ? (
                        <>
                          <CheckCircle2 size={14} /> View Certificate
                        </>
                      ) : (
                        <>
                          <Play size={14} className="fill-white" /> {isTPAC ? "Study TPAC Module" : "Start iGOT Module"}
                        </>
                      )}
                    </button>

                    <a
                      href={officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white rounded-xl flex items-center justify-center transition-all text-xs font-semibold gap-1 cursor-pointer"
                      title={`Open ${isTPAC ? 'NSSTA' : 'iGOT'} Portal`}
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact List View Mode */
        <div className="space-y-3">
          {displayedCourses.map((course) => {
            const color = getColor(course.color || "blue");
            const isTPAC = course.source_type === "TPAC" || course.id?.startsWith("tpac") || course.institute?.includes("NSSTA");
            const providerName = course.provider || course.institute || (isTPAC ? "NSSTA / MoSPI" : "iGOT Karmayogi");
            const matchPercent = course.matchPercent || (course.matchScore ? Math.round(course.matchScore * 100) : 85);
            const officialLink = getOfficialLink(course);

            return (
              <div
                key={course.id}
                className="bg-[#0f1422]/80 backdrop-blur-xl border border-white/[0.08] hover:border-indigo-500/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl ${isTPAC ? "bg-indigo-500/15 border border-indigo-500/30 text-indigo-400" : color.bg + " " + color.text} flex items-center justify-center shrink-0 shadow-inner`}>
                    {isTPAC ? <GraduationCap size={18} /> : <BookOpen size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-white text-sm truncate group-hover:text-indigo-300 transition-colors">
                        {course.title}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border ${
                        isTPAC ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" : "bg-orange-500/15 text-orange-300 border-orange-500/30"
                      }`}>
                        {isTPAC ? "NSSTA TPAC" : "iGOT"}
                      </span>
                      {course.status === "Completed" && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Certified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="truncate max-w-[200px] text-slate-300 font-medium">{providerName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 shrink-0"><Clock size={11} /> {course.duration || "15h"}</span>
                      <span>•</span>
                      <span className="text-indigo-300 font-semibold">{matchPercent}% Match</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => (course.status === "Completed" ? onViewCertificate?.(course) : onStartCourse?.(course))}
                    className={`py-2 px-4 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      course.status === "Completed"
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                        : isTPAC
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                    }`}
                  >
                    {course.status === "Completed" ? (
                      <>
                        <CheckCircle2 size={13} /> Certificate
                      </>
                    ) : (
                      <>
                        <Play size={13} className="fill-white" /> {isTPAC ? "Study" : "Start"}
                      </>
                    )}
                  </button>

                  <a
                    href={officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white rounded-xl flex items-center justify-center transition-all"
                    title={`Open ${isTPAC ? 'NSSTA' : 'iGOT'} Portal`}
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More Button */}
      {filteredCourses.length > displayedCourses.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 18)}
            className="px-6 py-2.5 bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/40 hover:bg-white/[0.08] text-indigo-300 hover:text-white text-xs font-bold rounded-2xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
          >
            Load More Courses ({filteredCourses.length - displayedCourses.length} Remaining)
          </button>
        </div>
      )}
    </div>
  );
}