import './ui.css';

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
    <main className="page auth-page">
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <section className="auth-card">
        <p className="brand-label">CONVENE HUB</p>
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to continue managing your events.</p>

        <form onSubmit={onSubmit} className="form-stack">
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={onChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={onChange}
            required
          />

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="footer-text">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="link-accent">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}