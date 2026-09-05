import { useState } from "react";
import {
  FlaskConical, Play, CheckCircle2, AlertCircle, RefreshCw,
  BarChart2, FileSpreadsheet, Sparkles, Sliders, ArrowRight
} from "lucide-react";

export default function VirtualLab() {
  const [activeLab, setActiveLab] = useState("sampling"); // 'sampling' | 'scrutiny' | 'sdg'

  // --- LAB 1: Stratified Sampling Simulation State ---
  const [sampleSizeN, setSampleSizeN] = useState(1000);
  const [strata, setStrata] = useState([
    { name: "Rural Agricultural (Stratum 1)", population: 50000, sd: 12 },
    { name: "Semi-Urban Informal (Stratum 2)", population: 30000, sd: 24 },
    { name: "Urban Industrial (Stratum 3)", population: 20000, sd: 38 },
  ]);
  const [allocationMethod, setAllocationMethod] = useState("neyman"); // 'proportional' | 'neyman'

  // Calculations for Lab 1
  const totalPop = strata.reduce((acc, s) => acc + s.population, 0);
  const sumNsigma = strata.reduce((acc, s) => acc + (s.population * s.sd), 0);

  const calculatedAllocations = strata.map((s) => {
    let allocated = 0;
    if (allocationMethod === "proportional") {
      allocated = Math.round(sampleSizeN * (s.population / totalPop));
    } else {
      // Neyman Optimal Allocation: n_h = n * (N_h * S_h) / sum(N_h * S_h)
      allocated = Math.round(sampleSizeN * ((s.population * s.sd) / sumNsigma));
    }
    const samplingFraction = ((allocated / s.population) * 100).toFixed(2);
    return { ...s, allocated, samplingFraction };
  });

  // --- LAB 2: Survey Data Scrutiny State ---
  const initialSurveyRecords = [
    { id: "HH-101", sector: "Rural", members: 5, headAge: 46, monthlyExp: 14200, monthlyInc: 16000, status: "Clean" },
    { id: "HH-102", sector: "Urban", members: 3, headAge: 12, monthlyExp: 45000, monthlyInc: 50000, status: "Flagged: Head age < 18" },
    { id: "HH-103", sector: "Rural", members: 4, headAge: 52, monthlyExp: 95000, monthlyInc: 12000, status: "Flagged: Exp > 7x Income Anomaly" },
    { id: "HH-104", sector: "Urban", members: 2, headAge: 38, monthlyExp: 32000, monthlyInc: 35000, status: "Clean" },
    { id: "HH-105", sector: "Rural", members: 6, headAge: 61, monthlyExp: 0, monthlyInc: 22000, status: "Flagged: Zero Monthly Exp" },
  ];
  const [surveyRecords, setSurveyRecords] = useState(initialSurveyRecords);
  const [isScrutinizing, setIsScrutinizing] = useState(false);
  const [scrutinySummary, setScrutinySummary] = useState(null);

  const handleRunScrutiny = () => {
    setIsScrutinizing(true);
    setTimeout(() => {
      setIsScrutinizing(false);
      setScrutinySummary({
        totalChecked: 5,
        flaggedAnomalies: 3,
        suggestedCorrections: 3,
        accuracyScore: "98.2%",
      });
    }, 700);
  };

  // --- LAB 3: SDG Indicator Calculator State ---
  const [baselinePoverty, setBaselinePoverty] = useState(14.9);
  const [annualReductionRate, setAnnualReductionRate] = useState(1.2);
  const targetYear = 2030;
  const currentYear = 2026;
  const projectedPoverty = Math.max(0, (baselinePoverty - ((targetYear - currentYear) * annualReductionRate))).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0c101d]/90 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3 w-fit">
            <FlaskConical size={14} className="text-blue-400" /> Virtual Statistical Laboratory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hands-On Official Statistics &amp; Analytics Simulator
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mt-1 leading-relaxed">
            Interactive simulation environments for sample allocation, automated survey data scrutiny, and National Indicator Framework calculations.
          </p>

          {/* Lab Switcher */}
          <div className="flex items-center gap-2 mt-6 border-t border-white/[0.08] pt-4 overflow-x-auto">
            {[
              { id: "sampling", label: "Stratified Sampling Allocator", icon: Sliders },
              { id: "scrutiny", label: "Survey Microdata Scrutiny", icon: FileSpreadsheet },
              { id: "sdg", label: "SDG 2030 National Indicator Lab", icon: BarChart2 },
            ].map((lab) => {
              const Icon = lab.icon;
              const isActive = activeLab === lab.id;
              return (
                <button
                  key={lab.id}
                  onClick={() => setActiveLab(lab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {lab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* LAB 1: SAMPLING SIMULATOR */}
      {activeLab === "sampling" && (
        <div className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                Neyman vs Proportional Stratified Allocation Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Calculates optimum sample allocation $n_h$ across heterogeneous population strata to minimize survey variance.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setAllocationMethod("neyman")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  allocationMethod === "neyman" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Neyman Optimal
              </button>
              <button
                onClick={() => setAllocationMethod("proportional")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  allocationMethod === "proportional" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Proportional
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/[0.06]">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Total Target Sample Size ($n$)
              </label>
              <input
                type="number"
                min="100"
                max="10000"
                step="50"
                value={sampleSizeN}
                onChange={(e) => setSampleSizeN(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] font-bold text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Total population ($N$): {totalPop.toLocaleString()}</p>
            </div>

            <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 md:col-span-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-300 uppercase">Selected Formula</p>
                <p className="text-xs text-blue-200 mt-0.5 font-mono">
                  {allocationMethod === "neyman"
                    ? "n_h = n × (N_h · S_h) / Σ(N_h · S_h)"
                    : "n_h = n × (N_h / N)"}
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-blue-600 text-white rounded-lg shadow-md shadow-blue-600/30">
                Design Effect: {allocationMethod === "neyman" ? "1.12 (Optimal)" : "1.45"}
              </span>
            </div>
          </div>

          {/* Strata Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-xs font-semibold text-slate-400 uppercase">
                  <th className="py-3 px-4 rounded-l-xl">Stratum</th>
                  <th className="py-3 px-4">Population ($N_h$)</th>
                  <th className="py-3 px-4">Std Deviation ($S_h$)</th>
                  <th className="py-3 px-4 text-blue-400 font-bold">Allocated Sample ($n_h$)</th>
                  <th className="py-3 px-4 rounded-r-xl">Sampling Fraction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-medium">
                {calculatedAllocations.map((st, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4 font-semibold text-white">{st.name}</td>
                    <td className="py-3.5 px-4 text-slate-300">{st.population.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={st.sd}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setStrata(strata.map((item, idx) => idx === i ? { ...item, sd: val } : item));
                        }}
                        className="w-20 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.1] text-xs font-bold text-white focus:border-blue-500/50 outline-none"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-blue-400 text-base">{st.allocated}</td>
                    <td className="py-3.5 px-4 text-slate-400">{st.samplingFraction}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LAB 2: SURVEY MICRODATA SCRUTINY */}
      {activeLab === "scrutiny" && (
        <div className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Automated Survey Microdata Scrutiny &amp; Validation</h3>
              <p className="text-xs text-slate-400">
                Rule-based and AI-assisted validation for NSSO/MoSPI household survey schedules.
              </p>
            </div>
            <button
              onClick={handleRunScrutiny}
              disabled={isScrutinizing}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              {isScrutinizing ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
              Run Automated Scrutiny
            </button>
          </div>

          {scrutinySummary && (
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-200 text-xs sm:text-sm font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-400 shrink-0" />
                <span>Scrutiny completed: <strong className="text-white">{scrutinySummary.flaggedAnomalies} anomalies</strong> flagged across {scrutinySummary.totalChecked} records.</span>
              </div>
              <span className="font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-lg">Accuracy: {scrutinySummary.accuracyScore}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-xs font-semibold text-slate-400 uppercase">
                  <th className="py-3 px-4 rounded-l-xl">Sample HH ID</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">Members</th>
                  <th className="py-3 px-4">Head Age</th>
                  <th className="py-3 px-4">Monthly Exp (₹)</th>
                  <th className="py-3 px-4">Monthly Inc (₹)</th>
                  <th className="py-3 px-4 rounded-r-xl">Scrutiny Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-medium">
                {surveyRecords.map((r, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{r.id}</td>
                    <td className="py-3.5 px-4 text-slate-300">{r.sector}</td>
                    <td className="py-3.5 px-4 text-slate-300">{r.members}</td>
                    <td className="py-3.5 px-4 text-slate-300">{r.headAge}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-200">₹{r.monthlyExp.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-200">₹{r.monthlyInc.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      {r.status === "Clean" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/25">
                          <CheckCircle2 size={12} /> Validated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300 bg-rose-500/15 px-2.5 py-1 rounded-lg border border-rose-500/25">
                          <AlertCircle size={12} /> {r.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LAB 3: SDG 2030 LAB */}
      {activeLab === "sdg" && (
        <div className="bg-[#0f1422]/80 rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
          <div>
            <h3 className="text-lg font-bold text-white">SDG National Indicator Framework (NIF) Trajectory Calculator</h3>
            <p className="text-xs text-slate-400">
              Model target achievement timelines for Goal 1 (No Poverty) and Goal 8 (Decent Work) indicators based on annual decline rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <h4 className="font-bold text-sm text-white">Simulation Parameters (SDG Indicator 1.1.1)</h4>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Baseline Multidimensional Poverty Ratio (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={baselinePoverty}
                  onChange={(e) => setBaselinePoverty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] font-bold text-white focus:border-blue-500/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Projected Annual Reduction (% pts / year)</label>
                <input
                  type="number"
                  step="0.1"
                  value={annualReductionRate}
                  onChange={(e) => setAnnualReductionRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] font-bold text-white focus:border-blue-500/50 outline-none"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121829] to-[#0a0d17] border border-white/[0.08] text-white flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-xs uppercase font-bold text-blue-300">2030 National Target Forecast</span>
                <p className="text-3xl sm:text-4xl font-extrabold mt-2 text-emerald-400">{projectedPoverty}%</p>
                <p className="text-xs text-slate-400 mt-1">
                  Estimated Multidimensional Poverty rate by 2030 at the current rate of capacity building and social transfers.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] text-xs text-slate-400 flex items-center justify-between">
                <span>Target SDG 2030: &lt; 5.0%</span>
                <span className="font-bold text-emerald-300">
                  {Number(projectedPoverty) <= 5.0 ? "Target Achievable ✓" : "Acceleration Required ⚠️"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
