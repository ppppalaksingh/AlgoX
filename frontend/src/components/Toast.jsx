import { CheckCircle2, AlertCircle, Info, Loader2, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { type = "info", message } = toast;

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
    error: <AlertCircle size={18} className="text-rose-500 shrink-0" />,
    loading: <Loader2 size={18} className="text-blue-500 animate-spin shrink-0" />,
    info: <Info size={18} className="text-sky-500 shrink-0" />,
  };

  const bgStyles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    error: "bg-rose-50 border-rose-200 text-rose-900",
    loading: "bg-blue-50 border-blue-200 text-blue-900",
    info: "bg-sky-50 border-sky-200 text-sky-900",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-sm w-full">
      <div
        className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${
          bgStyles[type] || bgStyles.info
        }`}
      >
        {icons[type] || icons.info}
        <div className="flex-1 text-sm font-medium leading-snug">{message}</div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
