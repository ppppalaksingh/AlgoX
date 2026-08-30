import { useState } from "react";
import { Zap, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    // TODO (backend team): replace this block with a real API call, e.g.
    // const res = await fetch("https://your-api.com/api/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!res.ok) { setError("Invalid email or password."); return; }
    // const data = await res.json(); // e.g. { name, email, token }
    // onLogin(data);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const displayName = email.split("@")[0];
    onLogin({
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email,
    });

    setIsSubmitting(false);
  };

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
            <h2 className="font-semibold text-slate-800 text-lg">Welcome back</h2>
            <p className="text-sm text-slate-500">Log in to continue your learning journey.</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

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
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="rounded border-slate-300" />
              Remember me
            </label>
            <button type="button" className="text-blue-600 hover:underline">Forgot password?</button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <button type="button" className="text-blue-600 font-medium hover:underline">Sign up</button>
          </p>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Built on iGOT Karmayogi · Ministry of Statistics &amp; PI, Govt. of India
        </p>
      </div>
    </div>
  );
}