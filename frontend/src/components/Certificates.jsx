import { Award, Download, Eye, BookOpen } from "lucide-react";

export default function Certificates({ certificates, onViewCertificate, onBrowseCourses }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800">Earned Official Credentials</h1>
          <p className="text-sm text-slate-500">
            Ministry of Statistics &amp; PI accredited certificates earned on the AlgoX / iGOT Karmayogi platform.
          </p>
        </div>

        <button
          onClick={onBrowseCourses}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <BookOpen size={14} /> Earn More Certificates
        </button>
      </div>

      {(!certificates || certificates.length === 0) ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Award size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Certificates Earned Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
            Complete your recommended courses and pass assessments to earn accredited certificates of competency.
          </p>
          <button
            onClick={onBrowseCourses}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Explore Available Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between gap-4 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-sm shrink-0">
                  <Award size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider text-amber-700 uppercase">
                    Verified Credential
                  </span>
                  <p className="text-sm font-bold text-slate-800 truncate mt-0.5">{cert.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {cert.domain} · Issued {cert.issuedDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onViewCertificate?.(cert)}
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye size={14} /> View Certificate
                </button>
                <button
                  onClick={() => onViewCertificate?.(cert)}
                  className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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