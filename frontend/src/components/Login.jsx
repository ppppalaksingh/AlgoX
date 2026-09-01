import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { Zap, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white mb-3">
            <Zap size={22} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">AlgoX</h1>
          <p className="text-sm text-slate-500">Smart Learning. Stronger India.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-slate-800 text-lg">
              {mode === "signIn" && "Welcome back"}
              {mode === "signUp" && "Create your account"}
              {mode === "verify" && "Verify your email"}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === "signIn" && "Log in to continue your learning journey."}
              {mode === "signUp" && "Sign up to start your personalized learning journey."}
              {mode === "verify" && `We sent a code to ${email}.`}
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          {mode !== "verify" && (
            <>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                  <Mail size={16} className="text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full outline-none text-sm"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                  <Lock size={16} className="text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full outline-none text-sm"
                    autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {mode === "verify" && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Verification code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {mode === "signIn" && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>
              <button type="button" className="text-blue-600 hover:underline">Forgot password?</button>
            </div>
          )}

          <div id="clerk-captcha" />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {mode === "signIn" && (isSubmitting ? "Logging in..." : "Log in")}
            {mode === "signUp" && (isSubmitting ? "Creating account..." : "Sign up")}
            {mode === "verify" && (isSubmitting ? "Verifying..." : "Verify & continue")}
          </button>

          {mode !== "verify" && (
            <p className="text-center text-sm text-slate-500">
              {mode === "signIn" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => { setError(""); setMode(mode === "signIn" ? "signUp" : "signIn"); }}
                className="text-blue-600 font-medium hover:underline"
              >
                {mode === "signIn" ? "Sign up" : "Log in"}
              </button>
            </p>
          )}
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Built on iGOT Karmayogi · Ministry of Statistics &amp; PI, Govt. of India
        </p>
      </div>
    </div>
  );
}