import './ui.css';

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
    <main className="page auth-page">
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <section className="auth-card">
        <p className="brand-label">CONVENE HUB</p>
        <h1>Create Account</h1>
        <p className="subtitle">Join and start managing events beautifully.</p>

        <form onSubmit={onSubmit} className="form-stack">
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={onChange}
            required
          />
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
            placeholder="Create password"
            value={formData.password}
            onChange={onChange}
            required
          />

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="footer-text">
          Already have an account?{" "}
          <Link to="/login" className="link-accent">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}