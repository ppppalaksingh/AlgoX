import { Award, Download, Printer, X, CheckCircle2, ShieldCheck } from "lucide-react";

export default function CertificateModal({ cert, userName = "Palak Singh", userDesignation = "Assistant Director", isOpen, onClose }) {
  if (!isOpen || !cert) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0c101d] rounded-3xl border border-white/[0.12] shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center justify-center">
              <Award size={18} />
            </div>
            <span className="text-sm font-bold text-white">Official Certificate of Completion</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Certificate Frame Container */}
        <div className="p-6 sm:p-8 bg-[#07090e] flex justify-center">
          <div className="bg-gradient-to-b from-[#141a2e] to-[#0d1222] border-4 border-amber-500/30 rounded-3xl p-8 sm:p-12 w-full text-center relative shadow-2xl border-double">
            
            {/* Ambient Lighting */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Emblems */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6 relative z-10">
              <div className="text-left">
                <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">Govt. of India</span>
                <p className="text-xs font-semibold text-slate-300">Ministry of Statistics &amp; PI</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 border border-white/10">
                <Award size={26} />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">AlgoX / iGOT</span>
                <p className="text-xs font-semibold text-slate-300">Karmayogi Bharat</p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide mb-1 relative z-10">
              Certificate of Competency
            </h1>
            <p className="text-xs text-amber-400 font-semibold tracking-widest uppercase mb-6 relative z-10">
              This is proudly presented to
            </p>

            {/* Recipient Name & Cadre Designation */}
            <div className="my-4 pb-2 border-b border-white/[0.1] max-w-md mx-auto relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-amber-200 tracking-wide">
                {(() => {
                  const cleaned = String(userName || "").trim();
                  if (!cleaned || cleaned === "Assistant Director" || cleaned === "Director" || cleaned.toLowerCase() === String(userDesignation || "").toLowerCase()) {
                    const localStored = localStorage.getItem("algox_user_name");
                    return localStored && localStored !== "Assistant Director" ? localStored : "Tarun Gupta";
                  }
                  return cleaned;
                })()}
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                {userDesignation || "Assistant Director"} · MoSPI Cadre
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mt-4 mb-6 relative z-10">
              for successfully mastering and completing the accredited competency course in
            </p>

            <h3 className="text-base sm:text-lg font-bold text-white bg-white/[0.04] border border-white/[0.1] rounded-2xl py-2 px-4 inline-block mb-6 shadow-inner relative z-10">
              {cert.title}
            </h3>

            {/* Footer details */}
            <div className="flex items-end justify-between pt-6 border-t border-white/[0.08] text-xs text-slate-400 relative z-10">
              <div className="text-left">
                <p className="font-semibold text-slate-300">Issued On</p>
                <p className="text-slate-400">{cert.issuedDate || "Today"}</p>
              </div>

              <div className="flex items-center gap-1 text-emerald-300 font-semibold bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/25">
                <ShieldCheck size={16} /> Verified Credential
              </div>

              <div className="text-right">
                <p className="font-semibold text-slate-300">Credential ID</p>
                <p className="font-mono text-[11px] text-slate-400">{cert.regNumber || `ALGOX-${(cert._id || cert.title || "CERT").toString().slice(-8).toUpperCase()}`}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-bold rounded-xl flex items-center gap-2 transition cursor-pointer"
          >
            <Printer size={15} /> Print / Save as PDF
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
