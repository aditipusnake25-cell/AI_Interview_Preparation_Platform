import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const data = await api.register(form);
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
        <div className="auth-icon"><UserPlus size={27} /></div>
        <p className="eyebrow">START YOUR JOURNEY</p>
        <h1>Create your account</h1>
        <p className="muted">Prepare smarter for your next interview.</p>

        {error && <div className="error-message">{error}</div>}

        <label htmlFor="name">Full name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />

        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 8 characters" minLength={8} required />

        <button className="primary-button full-width" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;