import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.login(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-icon"><LogIn size={27} /></div>
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Sign in to InterviewMate</h1>
        <p className="muted">Your next opportunity starts with practice.</p>

        {error && <div className="error-message">{error}</div>}

        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required />

        <button className="primary-button full-width" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;