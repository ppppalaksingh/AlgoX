import { useState } from "react";
import { BookOpen, Clock, CheckCircle2, Search, Sparkles, ExternalLink, GraduationCap, Building, ShieldCheck, Play } from "lucide-react";
import { getColor } from "../data/colorMap";

function statusBadgeClasses(status) {
  if (status === "Completed") return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
  if (status === "In Progress") return "bg-amber-50 text-amber-700 border border-amber-200/60";
  return "bg-slate-100 text-slate-600 border border-slate-200/60";
}

export default function Courses({ courses, onStartCourse, onViewCertificate }) {
  const [selectedSource, setSelectedSource] = useState("all"); // 'all' | 'iGOT' | 'TPAC'
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(18);

  const domains = ["All", "Statistical", "Technical", "Digital Governance", "Behavioural"];

  const filteredCourses = (courses || []).filter((course) => {
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
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Integrated Course &amp; Training Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            iGOT Karmayogi modules &amp; NSSTA TPAC recommended programmes, ranked with Python Sentence-Transformer embeddings.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 w-full md:w-80 shadow-2xs">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search statistical models, iGOT, NSSTA..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(18);
            }}
            className="w-full text-xs outline-none text-slate-800"
          />
        </div>
      </div>

      {/* Source Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 flex-wrap sm:flex-nowrap">
        <button
          onClick={() => {
            setSelectedSource("all");
            setVisibleCount(18);
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            selectedSource === "all"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <BookOpen size={15} /> All Offerings ({courses?.length || 0})
        </button>
        <button
          onClick={() => {
            setSelectedSource("iGOT");
            setVisibleCount(18);
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            selectedSource === "iGOT"
              ? "bg-orange-500 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
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
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            selectedSource === "TPAC"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <GraduationCap size={15} /> NSSTA TPAC Programmes
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => {
              setSelectedDomain(dom);
              setVisibleCount(18);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedDomain === dom
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Course Grid */}
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
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-200 relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-11 h-11 rounded-2xl ${isTPAC ? "bg-indigo-50 text-indigo-700" : color.bg + " " + color.text} flex items-center justify-center shrink-0 shadow-2xs`}>
                    {isTPAC ? <GraduationCap size={20} /> : <BookOpen size={20} />}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {matchPercent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1">
                        <Sparkles size={11} /> {matchPercent}% AI Match
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wide ${
                      isTPAC ? "bg-indigo-100 text-indigo-800" : "bg-orange-100 text-orange-800"
                    }`}>
                      {isTPAC ? "NSSTA TPAC" : "iGOT Module"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{course.title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {course.description || `Accredited capacity building module by ${providerName}.`}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium flex-wrap">
                  <span className="px-2.5 py-0.5 bg-slate-100 rounded-md font-semibold text-slate-700 flex items-center gap-1">
                    <Building size={11} /> {providerName}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded-md capitalize">{course.domain || "Statistical"}</span>
                  {course.duration && (
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md flex items-center gap-1">
                      <Clock size={11} /> {course.duration}
                    </span>
                  )}
                </div>

                {/* Direct Clickable Official Portal URL Chip */}
                <div className="pt-1">
                  <a
                    href={officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-700 hover:text-blue-900 hover:underline flex items-center justify-between font-semibold bg-blue-50/80 hover:bg-blue-100 border border-blue-200/90 rounded-xl px-3 py-1.5 transition-all shadow-2xs group/link"
                    title={`Open official government portal: ${officialLink}`}
                  >
                    <span className="flex items-center gap-1.5 truncate min-w-0">
                      <ExternalLink size={12} className="shrink-0 text-blue-600 group-hover/link:translate-x-0.5 transition-transform" />
                      <span className="truncate">{officialLink.replace(/^https?:\/\//, '')}</span>
                    </span>
                    <span className="text-[10px] font-bold bg-blue-200/70 text-blue-800 px-1.5 py-0.5 rounded-md shrink-0 ml-1.5">
                      {isTPAC ? "NSSTA Portal ↗" : "iGOT Portal ↗"}
                    </span>
                  </a>
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isTPAC ? "bg-indigo-600" : color.bar} rounded-full transition-all duration-300`}
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
                    className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl py-2.5 transition-all cursor-pointer shadow-2xs ${
                      isTPAC
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
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
                    className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition-all text-xs font-semibold shadow-2xs gap-1 cursor-pointer"
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

      {/* Load More Button if more courses available */}
      {filteredCourses.length > displayedCourses.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 18)}
            className="px-6 py-2.5 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-2xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
          >
            Load More Courses ({filteredCourses.length - displayedCourses.length} Remaining)
          </button>
        </div>
      )}
    </div>
  );
}