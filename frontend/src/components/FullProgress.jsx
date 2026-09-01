export default function FullProgress({ history, summary }) {
  const max = 100;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-800">Progress</h1>
        <p className="text-sm text-slate-500">Your learning progress over the last 6 months.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-48">
          {history.map((point) => (
            <div key={point.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-medium text-slate-600">{point.percent}%</span>
              <div
                className="w-full max-w-10 bg-blue-500 rounded-t-lg transition-all"
                style={{ height: `${(point.percent / max) * 100}%` }}
              />
              <span className="text-xs text-slate-400">{point.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-slate-800">{summary.completed}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-slate-800">{summary.inProgress}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 mb-1">Not Started</p>
          <p className="text-2xl font-bold text-slate-800">{summary.notStarted}</p>
        </div>
      </div>
    </div>
  );
}