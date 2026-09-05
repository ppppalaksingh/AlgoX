import { Award, Download, Eye, BookOpen, ShieldCheck } from "lucide-react";

export default function Certificates({ certificates, onViewCertificate, onBrowseCourses }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20 flex items-center gap-1">
              <Award size={12} className="text-amber-400" /> Verified Credentials
            </span>
            <span className="text-[11px] font-medium text-slate-400">MoSPI &amp; iGOT Karmayogi</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">Earned Official Credentials</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Ministry of Statistics &amp; PI accredited certificates earned on the AlgoX / iGOT Karmayogi platform.
          </p>
        </div>

        <button
          onClick={onBrowseCourses}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer self-start sm:self-auto"
        >
          <BookOpen size={14} /> Earn More Certificates
        </button>
      </div>

      {(!certificates || certificates.length === 0) ? (
        <div className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-12 text-center shadow-xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Award size={32} />
          </div>
          <h3 className="text-base font-bold text-white">No Certificates Earned Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
            Complete your recommended courses and pass assessments to earn accredited certificates of competency.
          </p>
          <button
            onClick={onBrowseCourses}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            Explore Available Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {certificates.map((cert, index) => (
            <div
              key={cert._id || cert.id || `${cert.title}-${index}`}
              className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-6 flex flex-col justify-between gap-5 shadow-xl hover:border-amber-500/30 transition-all backdrop-blur-xl group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
                  <Award size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1">
                    <ShieldCheck size={11} /> Verified Credential
                  </span>
                  <p className="text-sm font-bold text-white truncate mt-0.5" title={cert.title}>{cert.title}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {cert.domain} · Issued {cert.issuedDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => onViewCertificate?.(cert)}
                  className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-blue-500/20"
                >
                  <Eye size={14} /> View Certificate
                </button>
                <button
                  onClick={() => onViewCertificate?.(cert)}
                  className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}