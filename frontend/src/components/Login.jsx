import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, Sparkles, ShieldCheck } from "lucide-react";

export default function Login() {
  const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();

  const [mode, setMode] = useState("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Please enter both email and password.");
    if (!signInLoaded) return;

    setIsSubmitting(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        setError("Additional verification required. Check your email.");
      }
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Please enter both email and password.");
    if (!signUpLoaded) return;

    setIsSubmitting(true);
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setMode("verify");
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Could not create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    if (!signUpLoaded) return;

    setIsSubmitting(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        setError("Invalid or expired code.");
      }
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = mode === "signIn" ? handleSignIn : mode === "signUp" ? handleSignUp : handleVerify;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Decorative subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 py-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.45)] border border-white/20">
              <Zap size={26} strokeWidth={2.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#07090e] flex items-center justify-center text-[10px] text-white font-black">
              ✓
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-semibold text-slate-300 mb-2">
            <Sparkles size={12} className="text-indigo-400" />
            <span>AI Cadre Intelligence Platform</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Algo<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">X</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs">
            Ministry of Statistics &amp; PI · iGOT Karmayogi Official Competency Suite
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="bg-[#0f141f]/80 backdrop-blur-2xl rounded-3xl border border-white/[0.09] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Subtle top edge border glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          {/* Segmented Mode Switcher (only if not verify) */}
          {mode !== "verify" && (
            <div className="grid grid-cols-2 p-1 bg-black/40 rounded-2xl border border-white/[0.06] mb-6">
              <button
                type="button"
                onClick={() => { setError(""); setMode("signIn"); }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === "signIn"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setError(""); setMode("signUp"); }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === "signUp"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 className="font-bold text-white text-lg tracking-tight">
                {mode === "signIn" && "Welcome back, Officer"}
                {mode === "signUp" && "Register Cadre Account"}
                {mode === "verify" && "Verify Your Official Email"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === "signIn" && "Access your AI statistical pathways and verified credentials."}
                {mode === "signUp" && "Build your profile for MoSPI & NSSTA competency calibration."}
                {mode === "verify" && `A single-use pass code was sent to ${email}.`}
              </p>
            </div>

            {error && (
              <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5 flex items-start gap-2">
                <span className="font-bold shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {mode !== "verify" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Official Email
                  </label>
                  <div className="flex items-center gap-2.5 bg-black/30 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <Mail size={16} className="text-slate-400 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@mospi.gov.in"
                      className="w-full bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-slate-500"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Password
                  </label>
                  <div className="flex items-center gap-2.5 bg-black/30 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <Lock size={16} className="text-slate-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-slate-500"
                      autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {mode === "verify" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-3.5 py-2.5 outline-none text-sm text-center tracking-widest font-mono text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            )}

            {mode === "signIn" && (
              <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-300">
                  <input type="checkbox" className="rounded border-white/20 bg-black/30 text-indigo-600 focus:ring-0" />
                  Remember this device
                </label>
                <button type="button" className="text-indigo-400 hover:text-indigo-300 hover:underline">
                  Need help?
                </button>
              </div>
            )}

            <div id="clerk-captcha" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 disabled:opacity-60 transition-all text-white text-xs sm:text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.35)] cursor-pointer"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {mode === "signIn" && (isSubmitting ? "Authenticating..." : "Sign In to AlgoX")}
              {mode === "signUp" && (isSubmitting ? "Creating Profile..." : "Create Official Account")}
              {mode === "verify" && (isSubmitting ? "Verifying..." : "Verify & Continue")}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>DPDP Act 2023 &amp; MeghRaj Cloud Security Compliant</span>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-6 leading-relaxed">
          National Statistical Systems Training Academy (NSSTA) &amp; iGOT Karmayogi Bharat<br />
          Ministry of Statistics and Programme Implementation, Government of India
        </p>
      </div>
    </div>
  );
}