import { Award, Download, Printer, X, CheckCircle2, ShieldCheck } from "lucide-react";

export default function CertificateModal({ cert, userName = "Palak Singh", userDesignation = "Assistant Director", isOpen, onClose }) {
  if (!isOpen || !cert) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-400" />
            <span className="text-sm font-semibold">Official Certificate of Completion</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Certificate Frame Container */}
        <div className="p-6 sm:p-8 bg-slate-100 flex justify-center">
          <div className="bg-white border-8 border-double border-amber-600/30 rounded-xl p-8 sm:p-12 w-full text-center relative shadow-md">
            
            {/* Header Emblems */}
            <div className="flex items-center justify-between border-b border-amber-200 pb-4 mb-6">
              <div className="text-left">
                <span className="text-[10px] font-bold tracking-widest text-amber-700 uppercase">Govt. of India</span>
                <p className="text-xs font-semibold text-slate-800">Ministry of Statistics &amp; PI</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-linear-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md">
                <Award size={26} />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold tracking-widest text-blue-700 uppercase">AlgoX / iGOT</span>
                <p className="text-xs font-semibold text-slate-800">Karmayogi Bharat</p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 tracking-wide mb-1">
              Certificate of Competency
            </h1>
            <p className="text-xs text-amber-700 font-medium tracking-widest uppercase mb-6">
              This is proudly presented to
            </p>

            {/* Recipient Name & Cadre Designation */}
            <div className="my-4 pb-2 border-b-2 border-slate-300 max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 tracking-wide">
                {(() => {
                  const cleaned = String(userName || "").trim();
                  if (!cleaned || cleaned === "Assistant Director" || cleaned === "Director" || cleaned.toLowerCase() === String(userDesignation || "").toLowerCase()) {
                    const localStored = localStorage.getItem("algox_user_name");
                    return localStored && localStored !== "Assistant Director" ? localStored : "Tarun Gupta";
                  }
                  return cleaned;
                })()}
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                {userDesignation || "Assistant Director"} · MoSPI Cadre
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mt-4 mb-6">
              for successfully mastering and completing the accredited competency course in
            </p>

            <h3 className="text-base sm:text-lg font-bold text-slate-800 bg-amber-50/70 border border-amber-200/60 rounded-xl py-2 px-4 inline-block mb-6">
              {cert.title}
            </h3>

            {/* Footer details */}
            <div className="flex items-end justify-between pt-6 border-t border-slate-200 text-xs text-slate-500">
              <div className="text-left">
                <p className="font-semibold text-slate-700">Issued On</p>
                <p>{cert.issuedDate || "Today"}</p>
              </div>

              <div className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <ShieldCheck size={16} /> Verified Credential
              </div>

              <div className="text-right">
                <p className="font-semibold text-slate-700">Credential ID</p>
                <p className="font-mono text-[11px]">{cert.regNumber || `ALGOX-${(cert._id || cert.title || "CERT").toString().slice(-8).toUpperCase()}`}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer size={16} /> Print / Save as PDF
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
