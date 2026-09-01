import { useState } from "react";
import { FolderOpen, FileText, Download, Eye, Sparkles, UploadCloud, Trash2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ResourceLibrary({ documents = [], onUploadDoc, onGenerateQuizFromDoc, onDeleteDoc }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const defaultResources = [
    {
      _id: "res-1",
      originalName: "National_Statistical_Framework_MoSPI_2026.pdf",
      fileUrl: "#",
      size: 2450000,
      createdAt: new Date().toISOString(),
      category: "Official Framework",
      summary: "Official governance principles, census sampling standards, and national indicator metadata framework.",
    },
    {
      _id: "res-2",
      originalName: "DPDP_Act_Government_Data_Privacy_Standards.pdf",
      fileUrl: "#",
      size: 1820000,
      createdAt: new Date().toISOString(),
      category: "Digital Governance",
      summary: "Guidelines on data handling, anonymization, encryption, and citizen data protection for civil servants.",
    },
    {
      _id: "res-3",
      originalName: "Survey_Sampling_Methodology_NSO_Vol4.pdf",
      fileUrl: "#",
      size: 3100000,
      createdAt: new Date().toISOString(),
      category: "Survey Guidelines",
      summary: "Stratified multi-stage sampling design, cluster weighting, and error estimation formulas.",
    },
  ];

  const allDocs = [...documents, ...defaultResources];

  const formatSize = (bytes) => {
    if (!bytes) return "1.2 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800">Resource &amp; Document Library</h1>
          <p className="text-sm text-slate-500">
            Stored study materials, uploaded policy PDFs, and official reference documents.
          </p>
        </div>

        <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs self-start sm:self-auto">
          <UploadCloud size={16} /> Upload New Material
          <input
            type="file"
            accept=".pdf,.docx,.pptx,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) onUploadDoc?.(e.target.files[0]);
            }}
          />
        </label>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {allDocs.map((doc) => {
          const isUploaded = Boolean(doc.filename);
          return (
            <div
              key={doc._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0">
                    <FileText size={20} />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {doc.category || "Uploaded Document"}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-800 line-clamp-1 leading-snug" title={doc.originalName}>
                  {doc.originalName}
                </p>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {doc.summary || "Official civil service document stored in repository."}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-3 font-medium">
                  <span>{formatSize(doc.size)}</span>
                  <span>•</span>
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                {doc.fileUrl && doc.fileUrl !== "#" ? (
                  <a
                    href={`http://localhost:5000${doc.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye size={13} /> View File
                  </a>
                ) : (
                  <button
                    onClick={() => alert(`Opening ${doc.originalName}...`)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye size={13} /> View File
                  </button>
                )}

                <button
                  onClick={() => onGenerateQuizFromDoc?.(doc)}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                  title="Generate AI Assessment from this doc"
                >
                  <Sparkles size={13} /> Quiz
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
