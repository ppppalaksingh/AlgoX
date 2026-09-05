import { ArrowRight, Play } from "lucide-react";
import { getColor } from "../data/colorMap";

function CourseCard({ course, onClick, isDarkMode = true }) {
  const color = getColor(course.color);
  return (
    <div
      onClick={() => onClick?.(course)}
      className={`rounded-2xl border overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between ${
        isDarkMode
          ? "bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.08] hover:border-[#e2ac52]/50 hover:shadow-[0_15px_30px_rgba(10,5,30,0.5),0_0_20px_rgba(226,172,82,0.1)]"
          : "bg-white hover:bg-[#faf7f2] border-[#e8ded2] hover:border-[#5925dc] hover:shadow-[0_12px_24px_-6px_rgba(89,37,220,0.12)]"
      }`}
    >
      <div>
        <div className={`h-24 ${color.bg} flex items-center justify-center relative overflow-hidden`}>
          <div className={`w-11 h-11 rounded-2xl ${color.text} ${
            isDarkMode ? "bg-[#100829]/80" : "bg-white"
          } backdrop-blur-md shadow-xs flex items-center justify-center font-black text-lg border ${
            isDarkMode ? "border-white/10" : "border-[#e8ded2]"
          } group-hover:scale-105 transition-transform`}>
            {course.title?.charAt(0)}
          </div>
          <div className="absolute inset-0 bg-[#5925dc]/20 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
            <div className="w-9 h-9 rounded-full bg-[#5925dc] text-white flex items-center justify-center shadow-md border border-white/20">
              <Play size={15} className="ml-0.5" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-2.5 ${color.badgeBg} ${color.badgeText}`}>
            {course.tag}
          </span>
          <p className={`text-xs sm:text-sm font-bold font-serif leading-snug line-clamp-2 mb-3 transition-colors ${
            isDarkMode ? "text-white group-hover:text-indigo-200" : "text-[#1e143e] group-hover:text-[#5925dc]"
          }`}>
            {course.title}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className={`w-full h-1.5 rounded-full overflow-hidden mb-2 ${
          isDarkMode ? "bg-white/[0.06]" : "bg-[#f1ebd8]"
        }`}>
          <div
            className={`h-full ${color.bar} rounded-full transition-all duration-500`}
            style={{ width: `${course.percent}%` }}
          />
        </div>
        <div className={`flex items-center justify-between text-xs ${
          isDarkMode ? "text-slate-400" : "text-[#7e7298]"
        }`}>
          <span>{course.percent}% Completed</span>
          <span className={`font-bold flex items-center gap-1 ${
            isDarkMode ? "text-[#e2ac52]" : "text-[#5925dc]"
          }`}>
            Resume <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ContinueLearning({ courses, onViewAll, onStartCourse, isDarkMode = true }) {
  return (
    <div className={`p-6 rounded-3xl relative overflow-hidden border transition-all duration-300 ${
      isDarkMode
        ? "bg-[#1b1242]/85 border-white/[0.08] shadow-[0_10px_30px_rgba(10,5,30,0.4)]"
        : "bg-white border-[#e8ded2] shadow-[0_8px_24px_-6px_rgba(30,20,60,0.05),0_1px_3px_rgba(0,0,0,0.03)]"
    }`}>
      {/* Top edge glow sheen */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] ${
        isDarkMode ? "bg-gradient-to-r from-transparent via-white/15 to-transparent" : "bg-gradient-to-r from-transparent via-[#e8ded2] to-transparent"
      }`} />

      <div className="flex items-center justify-between mb-5">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${
            isDarkMode ? "text-indigo-400" : "text-[#5925dc]"
          }`}>Quick Resume</span>
          <h3 className={`font-extrabold text-base font-serif tracking-tight ${
            isDarkMode ? "text-white" : "text-[#1e143e]"
          }`}>Continue Learning</h3>
        </div>
        <button
          onClick={onViewAll}
          className={`text-xs font-semibold flex items-center gap-1 cursor-pointer group ${
            isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-[#5925dc] hover:underline"
          }`}
        >
          <span>All Courses</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {courses?.map((course) => (
          <CourseCard key={course.id} course={course} onClick={onStartCourse} isDarkMode={isDarkMode} />
        ))}
      </div>
    </div>
  );
}
