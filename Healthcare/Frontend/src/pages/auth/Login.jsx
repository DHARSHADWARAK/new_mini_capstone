import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const { access_token, user } = res.data;
      login(access_token, user);

      // Redirect based on role
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "doctor") navigate("/doctor");
      else navigate("/patient");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>🏥</div>
        <h2 style={styles.title}>HealthCare Login</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="john@mail.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={styles.footer}>
          No account?{" "}
          <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  iconWrap: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "8px",
  },
  title: {
    textAlign: "center",
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 4px",
  },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.9rem",
    marginBottom: "24px",
  },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "0.875rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#374151",
    marginTop: "10px",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border 0.2s",
  },
  btn: {
    marginTop: "20px",
    padding: "12px",
    background: "linear-gradient(135deg, #0ea5e9, #0369a1)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnDisabled: {
    marginTop: "20px",
    padding: "12px",
    background: "#94a3b8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "not-allowed",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "0.875rem",
    color: "#64748b",
  },
  link: {
    color: "#0ea5e9",
    fontWeight: "600",
    textDecoration: "none",
  },
};