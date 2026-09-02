import { useState } from "react";
import { BookOpen, Clock, CheckCircle2, Search, Sparkles, ExternalLink, GraduationCap, Building } from "lucide-react";
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs outline-none text-slate-800"
          />
        </div>
      </div>

      {/* Source Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSelectedSource("all")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            selectedSource === "all"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <BookOpen size={15} /> All Offerings ({courses?.length || 0})
        </button>
        <button
          onClick={() => setSelectedSource("iGOT")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            selectedSource === "iGOT"
              ? "bg-orange-500 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white/20 text-[9px] flex items-center justify-center font-black">iG</span>
          iGOT Karmayogi Modules
        </button>
        <button
          onClick={() => setSelectedSource("TPAC")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
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
            onClick={() => setSelectedDomain(dom)}
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
        {filteredCourses.map((course) => {
          const color = getColor(course.color || "blue");
          const isTPAC = course.source_type === "TPAC" || course.id?.startsWith("tpac");
          const providerName = course.provider || course.institute || (isTPAC ? "NSSTA / MoSPI" : "iGOT Karmayogi");
          const matchPercent = course.matchPercent || (course.matchScore ? Math.round(course.matchScore * 100) : 85);

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
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl py-2.5 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer shadow-2xs"
                  >
                    {course.status === "Completed" ? (
                      <>
                        <CheckCircle2 size={14} /> View Certificate
                      </>
                    ) : (
                      <>
                        <Clock size={14} /> {isTPAC ? "Enroll in TPAC" : "Start Module"}
                      </>
                    )}
                  </button>

                  {course.igotLink && (
                    <a
                      href={course.igotLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center transition-colors text-xs"
                      title="Open on official iGOT portal"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}