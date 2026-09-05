import { useState } from "react";
import { FileText, Eye, Sparkles, UploadCloud, ShieldCheck, X, Presentation, ChevronLeft, ChevronRight, Layers, CheckCircle2, Download, ExternalLink, BookOpen, Trash2 } from "lucide-react";

export default function ResourceLibrary({ documents = [], onUploadDoc, onGenerateQuizFromDoc, onDeleteDoc }) {
  const [activeDoc, setActiveDoc] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [docToDelete, setDocToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const defaultResources = [
    {
      _id: "res-1",
      originalName: "National_Statistical_Framework_MoSPI_2026.pdf",
      fileUrl: "https://res.cloudinary.com/dn3zxpqof/image/upload/v1788457857/algox_learning_docs/National_Statistical_Framework_MoSPI_2026.png",
      size: 2450000,
      createdAt: new Date().toISOString(),
      category: "Official Framework",
      type: "pdf",
      summary: "Official governance principles, census sampling standards, and national indicator metadata framework.",
      sections: [
        {
          heading: "1. Executive Summary & National Mandate",
          content: "The Ministry of Statistics and Programme Implementation (MoSPI) and NSSTA establish the 2026 National Statistical Framework for all Indian Statistical Service (ISS) and SSS cadre officials.",
        },
        {
          heading: "2. UN Fundamental Principles of Official Statistics",
          points: [
            "Professional Independence: Official statistical agencies must produce statistics with complete scientific objectivity without political interference.",
            "Impartiality & Equal Access: Data must be published simultaneously to all citizens, ministries, and researchers.",
            "Confidentiality of Citizen Records: Individual microdata collected for statistical purposes must remain strictly confidential.",
          ],
        },
        {
          heading: "3. National Quality Assurance Framework (NQAF)",
          points: [
            "Mandatory automated scrutiny rules for NSSO and Periodic Labour Force Survey (PLFS) schedules.",
            "Standardized post-stratification multiplier weighting to ensure accurate nationwide aggregations.",
            "SDMX Metadata Compliance: Datasets must follow international Statistical Data and Metadata e-Exchange standards.",
          ],
        },
      ],
    },
    {
      _id: "res-2",
      originalName: "MoSPI_Survey_Methodology_Training_Deck.pptx",
      fileUrl: "https://res.cloudinary.com/dn3zxpqof/image/upload/v1788457856/algox_learning_docs/MoSPI_Survey_Methodology_Training_Deck.png",
      size: 4200000,
      createdAt: new Date().toISOString(),
      category: "Presentation Slides",
      type: "pptx",
      summary: "Comprehensive 6-Slide PPT Training Deck: Stratified Sampling, Neyman Allocation, CPI Indexing, GDP/GVA, and DPDP Compliance.",
      slides: [
        {
          slideNumber: 1,
          title: "Introduction to Official Statistical Systems",
          subtitle: "Institutional Architecture & National Mandate",
          points: [
            "Ministry of Statistics and Programme Implementation (MoSPI) coordinates official data standards across India.",
            "National Statistical Office (NSO) conducts pan-India household and enterprise surveys (PLFS, ASI, TUS).",
            "National Statistical Systems Training Academy (NSSTA) trains ISS & SSS cadre officers in modern analytics.",
            "UN Fundamental Principles of Official Statistics guarantee scientific objectivity and equal citizen access."
          ]
        },
        {
          slideNumber: 2,
          title: "Stratified Multi-Stage Sampling Design",
          subtitle: "Frame Construction & First Stage Selection",
          points: [
            "Rural Frame: Census Villages mapped by population size and agrarian characteristics.",
            "Urban Frame: Urban Frame Survey (UFS) blocks stratified by commercial and residential strata.",
            "First Stage Units (FSUs): Selected using Probability Proportional to Size with Replacement (PPSWR).",
            "Ultimate Stage Units (USUs): Households selected using Simple Random Sampling Without Replacement (SRSWOR)."
          ]
        },
        {
          slideNumber: 3,
          title: "Neyman vs Proportional Sample Allocation",
          subtitle: "Mathematical Optimization for Minimum Survey Variance",
          points: [
            "Neyman Allocation Formula: n_h = n * (N_h * S_h) / sum(N_i * S_i), minimizing variance for heterogeneous strata.",
            "Proportional Allocation: n_h = n * (N_h / N), allocating samples based solely on population proportion.",
            "Design Effect (Deff): Ratio of sampling variance under multi-stage design to simple random sampling.",
            "Sample Multipliers: Weighting factors (w_i) applied during data tabulation to reflect true national totals."
          ]
        },
        {
          slideNumber: 4,
          title: "Price Statistics & Inflation Compilation",
          subtitle: "Consumer Price Index (CPI) & WPI Methodology",
          points: [
            "Consumer Price Index (CPI) compiled using the Modified Laspeyres Price Index Formula (base year 2012=100).",
            "Monthly field price collection across 1,181 rural villages and 1,114 urban markets across all States & UTs.",
            "Item weighting: Food and Beverages (45.86%), Housing (10.07%), Fuel & Light (6.84%), Miscellaneous (28.32%).",
            "Automated scrutiny protocols for seasonal substitutions and geometric mean price aggregation."
          ]
        },
        {
          slideNumber: 5,
          title: "National Accounts Compilation (SNA 2008)",
          subtitle: "Gross Domestic Product (GDP) & Gross Value Added (GVA)",
          points: [
            "Gross Value Added (GVA at basic prices) = Total Output - Intermediate Consumption.",
            "GDP at Market Prices = GVA at basic prices + Product Taxes - Product Subsidies.",
            "Supply and Use Tables (SUT): Balancing production and consumption across economic industries.",
            "Deflator Methodology: Converting nominal macroeconomic metrics into constant-price real growth rates."
          ]
        },
        {
          slideNumber: 6,
          title: "DPDP Act 2023 & Microdata Dissemination",
          subtitle: "Data Privacy Standards for Official Statistics",
          points: [
            "Mandatory de-identification and k-anonymity (k >= 5) before public microdata release.",
            "All direct identifiers (citizen names, Aadhaar numbers, phone numbers, exact GPS) are strictly suppressed.",
            "MeghRaj GovCloud Hosting: AES-256 encryption at rest and TLS 1.3 encryption in transit.",
            "Purpose Limitation: Data collected for statistical purposes cannot be used for legal or punitive actions."
          ]
        },
      ]
    },
    {
      _id: "res-3",
      originalName: "DPDP_Act_Government_Data_Privacy_Standards.pdf",
      fileUrl: "https://res.cloudinary.com/dn3zxpqof/image/upload/v1788457858/algox_learning_docs/DPDP_Act_Government_Data_Privacy_Standards.png",
      size: 1820000,
      createdAt: new Date().toISOString(),
      category: "Digital Governance",
      type: "pdf",
      summary: "Guidelines on data handling, anonymization, encryption, and citizen data protection for civil servants.",
      sections: [
        {
          heading: "1. Digital Personal Data Protection (DPDP) Act 2023 Mandate",
          content: "Governs how government statistical agencies process, store, and publish survey schedules and administrative registries.",
        },
        {
          heading: "2. Mandatory Compliance Protocols",
          points: [
            "Purpose Limitation: Statistical survey data cannot be used for unauthorized administrative surveillance.",
            "MeghRaj GovCloud Storage: Data encrypted using AES-256 at rest and TLS 1.3 in transit.",
            "Security Audits: Annual vulnerability and penetration tests by CERT-In empaneled auditors.",
          ],
        },
      ],
    },
    {
      _id: "res-4",
      originalName: "Survey_Sampling_Methodology_NSO_Vol4.pdf",
      fileUrl: "https://res.cloudinary.com/dn3zxpqof/image/upload/v1788457859/algox_learning_docs/Survey_Sampling_Methodology_NSO_Vol4.png",
      size: 3100000,
      createdAt: new Date().toISOString(),
      category: "Survey Guidelines",
      type: "pdf",
      summary: "Stratified multi-stage sampling design, cluster weighting, and error estimation formulas.",
      sections: [
        {
          heading: "1. Survey Design & Field Scrutiny Framework",
          content: "Operational handbook for field officers conducting household surveys across National Statistical Office regional hubs.",
        },
        {
          heading: "2. Key Mathematical Formulations",
          points: [
            "Neyman Optimal Allocation: Calculates sample size per stratum to minimize variance under budget constraints.",
            "Design Effect (Deff): Ratio of variance under complex design versus simple random sampling.",
            "Computer Assisted Personal Interviewing (CAPI): Real-time field validation on tablet computers.",
          ],
        },
      ],
    },
  ];

  const userDocs = (documents || []).map((d) => ({ ...d, isUserUploaded: true }));
  const systemDocs = defaultResources.map((d) => ({ ...d, isUserUploaded: false }));
  const allDocs = [...userDocs, ...systemDocs];

  const formatSize = (bytes) => {
    if (!bytes) return "1.2 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const isPPT = (name = "") => {
    const lower = name.toLowerCase();
    return lower.endsWith(".pptx") || lower.endsWith(".ppt");
  };

  const getCleanSummary = (summary, docName = "") => {
    if (!summary || typeof summary !== "string") {
      return `Official study material from ${docName}. Ingested into AlgoX repository for competency tracking, evaluation, and AI quiz generation.`;
    }
    if (summary.includes('"config"') || (summary.startsWith("{") && summary.includes("newlineDelimiter"))) {
      return `Official study material from ${docName}. Ingested into AlgoX repository for competency tracking, evaluation, and AI quiz generation.`;
    }
    return summary;
  };

  const handleOpenDoc = (doc) => {
    setActiveDoc(doc);
    setCurrentSlideIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20 flex items-center gap-1">
              <BookOpen size={12} className="text-blue-400" /> Digital Knowledge Repository
            </span>
            <span className="text-[11px] font-medium text-slate-400">MoSPI &amp; NSSTA</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">Resource &amp; Document Library</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Stored official policy PDFs, interactive PowerPoint training slide decks, and reference guides.
          </p>
        </div>

        <label className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/20 self-start sm:self-auto">
          <UploadCloud size={16} /> Upload New Material (PDF/PPTX)
          <input
            type="file"
            accept=".pdf,.docx,.pptx,.ppt,.txt"
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
          const isPresentation = isPPT(doc.originalName) || doc.type === "pptx";
          const displaySummary = getCleanSummary(doc.summary, doc.originalName);
          return (
            <div
              key={doc._id}
              className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-5 flex flex-col justify-between shadow-xl hover:border-blue-500/30 transition-all gap-4 backdrop-blur-xl group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${isPresentation ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" : "bg-rose-500/15 text-rose-400 border border-rose-500/25"} flex items-center justify-center font-bold shrink-0 shadow-inner`}>
                    {isPresentation ? <Presentation size={20} /> : <FileText size={20} />}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {doc.isUserUploaded ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20">
                        Your Upload
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                        Official
                      </span>
                    )}
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${isPresentation ? "bg-amber-500/15 text-amber-300 border-amber-500/25" : "bg-white/[0.04] text-slate-300 border-white/[0.06]"}`}>
                      {isPresentation ? "PPT Slide Deck" : doc.category || "PDF Document"}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-bold text-white line-clamp-1 leading-snug group-hover:text-blue-300 transition-colors" title={doc.originalName}>
                  {doc.originalName}
                </p>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {displaySummary}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-3 font-medium">
                  <span>{formatSize(doc.size)}</span>
                  <span>•</span>
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => handleOpenDoc(doc)}
                  className="flex-1 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/[0.08]"
                >
                  <Eye size={13} /> {isPresentation ? "Present Slides" : "Read Document"}
                </button>

                <button
                  onClick={() => onGenerateQuizFromDoc?.(doc)}
                  className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors cursor-pointer border border-blue-500/20"
                  title="Generate AI Assessment from this doc"
                >
                  <Sparkles size={13} /> Quiz
                </button>

                {/* Delete Button: Exclusively visible for user-uploaded materials */}
                {doc.isUserUploaded && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDocToDelete(doc);
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/30 transition-colors cursor-pointer"
                    title="Delete this uploaded document"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern In-App Document / Presentation Viewer Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0c101d] w-full max-w-3xl rounded-3xl shadow-2xl border border-white/[0.12] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-2xl ${isPPT(activeDoc.originalName) || activeDoc.type === "pptx" ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" : "bg-rose-500/15 text-rose-400 border border-rose-500/25"} flex items-center justify-center font-bold shrink-0`}>
                  {isPPT(activeDoc.originalName) || activeDoc.type === "pptx" ? <Presentation size={20} /> : <FileText size={20} />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{activeDoc.originalName}</h3>
                  <p className="text-xs text-slate-400">{activeDoc.category || "Official Material"} • {formatSize(activeDoc.size)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeDoc.isUserUploaded && (
                  <button
                    type="button"
                    onClick={() => setDocToDelete(activeDoc)}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer border border-rose-500/20"
                    title="Delete your uploaded document"
                  >
                    <Trash2 size={13} /> Delete Material
                  </button>
                )}
                <button
                  onClick={() => setActiveDoc(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* Accredited Badge */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3.5 flex items-center gap-3">
                <ShieldCheck size={18} className="text-blue-400 shrink-0" />
                <p className="text-xs text-blue-200 font-medium leading-relaxed">
                  {getCleanSummary(activeDoc.summary, activeDoc.originalName)}
                </p>
              </div>

              {/* Case A: PPT Presentation Mode */}
              {activeDoc.slides && activeDoc.slides.length > 0 ? (
                <div className="space-y-4">
                  {/* Active Slide Display */}
                  <div className="bg-gradient-to-br from-[#121829] to-[#0a0d17] rounded-3xl p-6 text-white shadow-xl space-y-4 min-h-[260px] flex flex-col justify-between border border-white/[0.08]">
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-3 mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Slide {currentSlideIndex + 1} of {activeDoc.slides.length}
                        </span>
                        <span className="text-xs text-slate-400">MoSPI Training Deck</span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {activeDoc.slides[currentSlideIndex].title}
                      </h2>
                      {activeDoc.slides[currentSlideIndex].subtitle && (
                        <p className="text-xs text-amber-400 font-medium mt-0.5">
                          {activeDoc.slides[currentSlideIndex].subtitle}
                        </p>
                      )}

                      <div className="mt-4 space-y-2.5">
                        {activeDoc.slides[currentSlideIndex].points.map((pt, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Slide Controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                      <button
                        onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentSlideIndex === 0}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-semibold text-white flex items-center gap-1 transition cursor-pointer"
                      >
                        <ChevronLeft size={14} /> Previous Slide
                      </button>

                      <div className="flex items-center gap-1.5">
                        {activeDoc.slides.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentSlideIndex(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                              currentSlideIndex === i ? "bg-amber-400 w-6" : "bg-slate-700 hover:bg-slate-500"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentSlideIndex((prev) => Math.min(activeDoc.slides.length - 1, prev + 1))}
                        disabled={currentSlideIndex === activeDoc.slides.length - 1}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-xs font-bold text-slate-950 flex items-center gap-1 transition cursor-pointer shadow-md shadow-amber-500/20"
                      >
                        Next Slide <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeDoc.sections && activeDoc.sections.length > 0 ? (
                /* Case B: Structured PDF / Document Reader */
                <div className="space-y-4">
                  {activeDoc.sections.map((sec, idx) => (
                    <div key={idx} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4.5 space-y-2.5">
                      <h4 className="text-sm font-bold text-white">{sec.heading}</h4>
                      {sec.content && (
                        <p className="text-xs text-slate-300 leading-relaxed">{sec.content}</p>
                      )}
                      {sec.points && (
                        <div className="space-y-2 mt-2">
                          {sec.points.map((pt, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                              <span className="leading-relaxed">{pt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Case C: Generic Fallback */
                <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.06] text-xs text-slate-300 leading-relaxed">
                  {getCleanSummary(activeDoc.summary, activeDoc.originalName)}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveDoc(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Close Viewer
                </button>

                {activeDoc.fileUrl && activeDoc.fileUrl !== "#" && (
                  <a
                    href={activeDoc.fileUrl.startsWith("http") ? activeDoc.fileUrl : `http://localhost:5000${activeDoc.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <ExternalLink size={13} /> Open Cloud File
                  </a>
                )}
              </div>

              <button
                onClick={() => {
                  const doc = activeDoc;
                  setActiveDoc(null);
                  onGenerateQuizFromDoc?.(doc);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition cursor-pointer"
              >
                <Sparkles size={14} /> Generate AI Quiz from this Material
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0c101d] max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-white/[0.12] space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/25 flex items-center justify-center">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Uploaded Material?</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-white">"{docToDelete.originalName}"</span>? Only this file that you uploaded will be permanently removed from your library.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDocToDelete(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await onDeleteDoc?.(docToDelete._id, docToDelete.originalName);
                    if (activeDoc?._id === docToDelete._id) {
                      setActiveDoc(null);
                    }
                    setDocToDelete(null);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="flex-1 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
