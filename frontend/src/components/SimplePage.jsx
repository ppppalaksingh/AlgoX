export default function SimplePage({ title, description, icon: Icon }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-10 flex flex-col items-center justify-center text-center">
        {Icon && <Icon size={32} className="text-slate-300 mb-3" />}
        <p className="text-sm text-slate-500">This section is coming soon.</p>
      </div>
    </div>
  );
}