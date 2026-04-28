import { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

const API_BASE = "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070511] text-white">
      {/* Gradient background layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.25),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.22),transparent_28%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2),transparent_30%),linear-gradient(135deg,#070511_0%,#120a2a_45%,#1a0f37_100%)]" />

      {/* Floating blurred blobs */}
      <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl animate-pulse [animation-delay:400ms]" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl animate-pulse [animation-delay:800ms]" />

      {/* Centered card */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-8 shadow-[0_20px_80px_rgba(31,12,73,0.65)] backdrop-blur-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-violet-200/80">
            Convene Hub
          </p>

          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-violet-100/75 sm:text-base">
            Sign in to manage and organize your events beautifully.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-violet-100/90"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-violet-100/45 outline-none transition duration-200 focus:border-fuchsia-400/70 focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(217,70,239,0.22)]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-violet-100/90"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-violet-100/45 outline-none transition duration-200 focus:border-fuchsia-400/70 focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(217,70,239,0.22)]"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-rose-300/30 bg-rose-500/20 px-3 py-2 text-sm text-rose-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-4 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(168,85,247,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_14px_35px_rgba(217,70,239,0.45)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">{loading ? "Signing in..." : "Login"}</span>
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-violet-100/75">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-fuchsia-300 transition hover:text-fuchsia-200"
            >
              Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}