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
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">
      <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-8 md:p-10 shadow-[0_20px_60px_rgba(20,10,60,0.45)]">
        <p className="text-xs uppercase tracking-[0.2em] text-violet-200/80 mb-3">
          Convene Hub
        </p>
        <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
        <p className="text-sm text-violet-100/70 mt-2 mb-8">
          Sign in to manage and organize your events beautifully.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm text-violet-100/90">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-300 outline-none transition focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-violet-100/90">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-300 outline-none transition focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {error && (
            <p className="text-sm rounded-lg bg-rose-500/20 border border-rose-300/30 px-3 py-2 text-rose-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3.5 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-7 text-sm text-violet-100/70 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-fuchsia-300 hover:text-fuchsia-200">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}