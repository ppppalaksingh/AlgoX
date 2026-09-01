import { useState } from "react";
import { BookOpen, Clock, CheckCircle2, Search, Sparkles, ExternalLink } from "lucide-react";
import { getColor } from "../data/colorMap";

function statusBadgeClasses(status) {
  if (status === "Completed") return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
  if (status === "In Progress") return "bg-amber-50 text-amber-700 border border-amber-200/60";
  return "bg-slate-100 text-slate-600 border border-slate-200/60"; // Not Started
}

export default function Courses({ courses, onStartCourse, onViewCertificate }) {
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const domains = ["All", "Statistical", "Technical", "Digital Governance", "Behavioural"];

  const filteredCourses = (courses || []).filter((course) => {
    const matchesDomain =
      selectedDomain === "All" ||
      course.domain?.toLowerCase() === selectedDomain.toLowerCase() ||
      (selectedDomain === "Digital Governance" && course.domain?.toLowerCase() === "digitalgovernance");

    const matchesSearch =
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.provider && course.provider.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.institute && course.institute.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDomain && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800">
            iGOT Karmayogi &amp; TPAC Courses
          </h1>
          <p className="text-sm text-slate-500">
            Real courses loaded from iGOT &amp; NSSTA catalogs, ranked by Python sentence embedding recommendation engine.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 w-full sm:w-72 shadow-2xs">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search catalog, provider, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs outline-none text-slate-800"
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedDomain === dom
                ? "bg-blue-600 text-white shadow-xs"
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
          const providerName = course.provider || course.institute || "iGOT Karmayogi";
          const matchPercent = course.matchScore ? Math.round(course.matchScore * 100) : null;

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all duration-150 relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0`}>
                    <BookOpen size={18} />
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {matchPercent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1">
                        <Sparkles size={11} /> {matchPercent}% Match
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap ${statusBadgeClasses(course.status || "Not Started")}`}>
                      {course.status || (course.source_type ? `${course.source_type}` : "Available")}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{course.title}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {course.description || `Provided by ${providerName}. Designed for civil servants.`}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium flex-wrap">
                  <span className="px-2.5 py-0.5 bg-slate-100 rounded-md font-semibold text-slate-700">{providerName}</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded-md">{course.domain || "Statistical"}</span>
                  {course.duration && (
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md">{course.duration}</span>
                  )}
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color.bar} rounded-full transition-all duration-300`}
                    style={{ width: `${course.percent || 15}%` }}
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
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 border border-blue-200/80 rounded-xl py-2 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer shadow-2xs"
                  >
                    {course.status === "Completed" ? (
                      <>
                        <CheckCircle2 size={14} /> View Certificate
                      </>
                    ) : (
                      <>
                        <Clock size={14} /> Start Module
                      </>
                    )}
                  </button>

                  {course.igotLink && (
                    <a
                      href={course.igotLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center transition-colors text-xs"
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