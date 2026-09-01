import { ArrowRight, Play } from "lucide-react";
import { getColor } from "../data/colorMap";

function tagClasses(color) {
  const c = getColor(color);
  return `${c.badgeBg} ${c.badgeText}`;
}

function CourseCard({ course, onClick }) {
  const color = getColor(course.color);
  return (
    <div
      onClick={() => onClick?.(course)}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className={`h-24 ${color.bg} flex items-center justify-center relative overflow-hidden`}>
          <div className={`w-10 h-10 rounded-xl ${color.text} bg-white/80 shadow-xs flex items-center justify-center font-bold text-base`}>
            {course.title?.charAt(0)}
          </div>
          <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Play size={14} className="ml-0.5" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md mb-2 ${tagClasses(course.color)}`}>
            {course.tag}
          </span>
          <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 mb-3">
            {course.title}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
          <div className={`h-full ${color.bar} rounded-full transition-all duration-300`} style={{ width: `${course.percent}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{course.percent}% Completed</span>
          <span className="text-blue-600 font-medium group-hover:underline">Resume</span>
        </div>
      </div>
    </div>
  );
}

export default function ContinueLearning({ courses, onViewAll, onStartCourse }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-800">Continue Learning</h3>
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline cursor-pointer"
        >
          View All Courses <ArrowRight size={14} />
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
