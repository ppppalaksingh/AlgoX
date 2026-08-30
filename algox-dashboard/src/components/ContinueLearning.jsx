import { ArrowRight } from "lucide-react";
import { getColor } from "../data/colorMap";

function tagClasses(color) {
  const c = getColor(color);
  return `${c.badgeBg} ${c.badgeText}`;
}

function CourseCard({ course }) {
  const color = getColor(course.color);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className={`h-24 ${color.bg} flex items-center justify-center`}>
        <div className={`w-10 h-10 rounded-lg ${color.text} bg-white/70 flex items-center justify-center font-bold`}>
          {course.title.charAt(0)}
        </div>
      </div>
      <div className="p-4">
        <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-md mb-2 ${tagClasses(course.color)}`}>
          {course.tag}
        </span>
        <p className="text-sm font-medium text-slate-800 leading-snug mb-3">
          {course.title}
        </p>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
          <div className={`h-full ${color.bar} rounded-full`} style={{ width: `${course.percent}%` }} />
        </div>
        <p className="text-xs text-slate-400">{course.percent}% Completed</p>
      </div>
    </div>
  );
}

export default function ContinueLearning({ courses }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-slate-800">Continue Learning</h3>
        <button className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
          View All Courses <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
