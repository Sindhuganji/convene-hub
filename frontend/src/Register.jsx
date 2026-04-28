import { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

const API_BASE = "http://localhost:5000/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">
      <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl float-slow" />
      <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl float-slow" />

      <div className="glass glow-ring w-full max-w-md rounded-2xl p-8 md:p-10 fade-up">
        <p className="text-xs uppercase tracking-[0.2em] text-violet-200/80 mb-3">
          Convene Hub
        </p>
        <h1 className="text-3xl font-extrabold glow-text">Create Account</h1>
        <p className="text-sm text-violet-100/70 mt-2 mb-8">
          Join now and build amazing event experiences.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm text-violet-100/90">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Ajay"
              value={formData.name}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-violet-100/45 outline-none transition focus:border-fuchsia-400/80 focus:shadow-[0_0_0_3px_rgba(217,70,239,0.25)]"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-violet-100/90">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-violet-100/45 outline-none transition focus:border-fuchsia-400/80 focus:shadow-[0_0_0_3px_rgba(217,70,239,0.25)]"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-violet-100/90">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-violet-100/45 outline-none transition focus:border-fuchsia-400/80 focus:shadow-[0_0_0_3px_rgba(217,70,239,0.25)]"
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
            className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3.5 font-semibold text-white shadow-lg shadow-fuchsia-900/30 transition hover:scale-[1.02] hover:from-pink-400 hover:to-indigo-400 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-7 text-sm text-violet-100/70 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-fuchsia-300 hover:text-fuchsia-200 transition"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}