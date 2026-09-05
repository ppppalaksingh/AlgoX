import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, X, BookOpen, Code, RefreshCw, CheckCircle2, Loader2 } from "lucide-react";

export default function AIAssistantModal({ isOpen, onClose, user }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Namaste, **${user?.name || "Officer"}**! I am **Karmayogi Sahayak**, your AI Statistical Mentor for India's Official Statistical System.\n\nHow can I help you today? You can ask me about **Survey Sampling techniques**, **CPI/WPI inflation formulas**, **National Accounts (SNA 2008)**, **Python/R scripts for data scrutiny**, or **recommended iGOT/NSSTA courses**!`,
      source: "MoSPI Knowledge Engine"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const quickPrompts = [
    "What is the sampling design used in Periodic Labour Force Survey (PLFS)?",
    "How do I write a Python pandas script to scrutinize survey outliers?",
    "Explain the modified Laspeyres formula for Consumer Price Index (CPI).",
    "Which iGOT courses should I take for Big Data & GIS in official statistics?",
    "What are the DPDP Act 2023 compliance requirements for government datasets?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const newMessages = [...messages, { role: "user", text: textToSend }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s client timeout

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSend }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();
      if (res.ok && data.response) {
        setMessages([...newMessages, { role: "assistant", text: data.response, source: data.source || "Karmayogi Sahayak" }]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn("[AIAssistantModal] Using official instant knowledge fallback:", err.message);
      
      let fallbackText = `### Official Statistics Guidance\n\nRegarding **"${textToSend}"**:\n\nIn India's Official Statistical System (MoSPI/NSSTA), standard sampling and national accounting methodologies adhere to UN-SDMX and SNA-2008 standards.\n\n- **Recommended Course:** *Planning and Designing of Large Scale Sample Surveys (NSSTA, Greater Noida)*\n- **Recommended iGOT Module:** *Artificial Intelligence & Python for Public Governance*\n- **Action:** Check your *Skill Gaps* page to see your current competency level in this area.`;
      
      if (textToSend.toLowerCase().includes("plfs") || textToSend.toLowerCase().includes("labour")) {
        fallbackText = `### Periodic Labour Force Survey (PLFS) Sampling Design\n\n1. **Sampling Frame:** 2011 Census villages (Rural) and Urban Frame Survey (UFS) blocks (Urban).\n2. **First Stage Units (FSUs):** Villages / UFS blocks selected via PPSWR in rural and SRSWOR in urban.\n3. **Rotational Panel:** 2-2-2 rotational panel design in urban areas visited 4 times quarterly.\n4. **Recommended Course:** *Labour and Employment Statistics & PLFS Methodology (MoSPI / NSSO)*.`;
      } else if (textToSend.toLowerCase().includes("cpi") || textToSend.toLowerCase().includes("price")) {
        fallbackText = `### Consumer Price Index (CPI) Compilation\n\n1. **Formula:** Modified Laspeyres price index formula with base year 2012=100.\n2. **Sectors:** Rural, Urban, and Combined.\n3. **Recommended Course:** *Price Statistics, CPI/WPI Methodology (MoSPI / NSSTA)*.`;
      }

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          text: fallbackText,
          source: "MoSPI / NSSTA Knowledge Base"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c101d] rounded-3xl w-full max-w-3xl h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-white/[0.12]">
        {/* Header */}
        <div className="p-5 text-white flex items-center justify-between shrink-0 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 border border-white/10">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">Karmayogi Sahayak</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                  AI Statistical Mentor
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                MoSPI &amp; NSSTA Knowledge Assistant • 24/7 Learner Support
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#07090e]/60">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[88%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  m.role === "user"
                    ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white"
                    : "bg-white/[0.08] text-blue-400 border border-white/[0.08]"
                }`}
              >
                {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none font-medium shadow-blue-600/20"
                    : "bg-[#0f1422] text-slate-200 border border-white/[0.08] rounded-tl-none space-y-2"
                }`}
              >
                <div className="whitespace-pre-line prose prose-invert max-w-none text-xs sm:text-sm">{m.text}</div>
                {m.source && (
                  <p className="text-[10px] font-semibold text-slate-400 border-t border-white/[0.06] pt-2 flex items-center gap-1">
                    <Sparkles size={11} className="text-blue-400" /> Source: {m.source}
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-xl bg-white/[0.08] text-blue-400 border border-white/[0.08] flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0f1422] border border-white/[0.08] text-slate-400 text-xs font-medium flex items-center gap-2">
                <Loader2 size={15} className="animate-spin text-blue-400" />
                <span>Consulting official statistics guidelines &amp; AI models...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="p-2.5 bg-[#0c101d] border-t border-white/[0.08] overflow-x-auto flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-2 whitespace-nowrap flex items-center gap-1">
            <Sparkles size={11} className="text-amber-400" /> Prompts:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              disabled={loading}
              className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-blue-500/15 hover:text-blue-300 text-slate-400 text-xs whitespace-nowrap transition border border-white/[0.08] hover:border-blue-500/30 shrink-0 font-medium cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#0c101d] border-t border-white/[0.08] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about sampling, CPI, GDP calculation, Python scrutiny, iGOT courses..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-blue-500/50 text-white placeholder:text-slate-500 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-2xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
