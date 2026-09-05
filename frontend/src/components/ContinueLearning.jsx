import { ArrowRight, Play } from "lucide-react";
import { getColor } from "../data/colorMap";

function CourseCard({ course, onClick }) {
  const color = getColor(course.color);
  return (
    <div
      onClick={() => onClick?.(course)}
      className="bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/[0.08] hover:border-indigo-500/40 overflow-hidden shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className={`h-24 ${color.bg} flex items-center justify-center relative overflow-hidden`}>
          <div className={`w-11 h-11 rounded-2xl ${color.text} bg-[#0b0e17]/80 backdrop-blur-md shadow-inner flex items-center justify-center font-black text-lg border border-white/10 group-hover:scale-105 transition-transform`}>
            {course.title?.charAt(0)}
          </div>
          <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-white/20">
              <Play size={15} className="ml-0.5" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-2.5 ${color.badgeBg} ${color.badgeText}`}>
            {course.tag}
          </span>
          <p className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 mb-3 group-hover:text-indigo-300 transition-colors">
            {course.title}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-2">
          <div
            className={`h-full ${color.bar} rounded-full transition-all duration-500`}
            style={{ width: `${course.percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{course.percent}% Completed</span>
          <span className="text-indigo-400 font-bold group-hover:text-indigo-300 flex items-center gap-1">
            Resume <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ContinueLearning({ courses, onViewAll, onStartCourse }) {
  return (
    <div className="bg-[#0f1422]/80 backdrop-blur-xl border border-white/[0.08] p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
      {/* Top edge glow sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">Quick Resume</span>
          <h3 className="font-bold text-white text-base">Continue Learning</h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer group"
        >
          <span>All Courses</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {courses?.map((course) => (
          <CourseCard key={course.id} course={course} onClick={onStartCourse} />
        ))}
      </div>
    </div>
  );
}

