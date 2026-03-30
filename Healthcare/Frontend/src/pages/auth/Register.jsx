import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      setSuccess("✅ Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>🩺</div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join the HealthCare platform</p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
          />

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
            placeholder="Min 6 characters"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Register As</label>
          <select
            style={styles.input}
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="patient">🧑 Patient</option>
            <option value="doctor">👨‍⚕️ Doctor</option>
            <option value="admin">👑 Admin</option>
          </select>

          <button style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
            {loading ? "Registering..." : "Create Account →"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Login here</Link>
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
    maxWidth: "420px",
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
  success: {
    background: "#dcfce7",
    color: "#16a34a",
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
    background: "#fff",
  },
  btn: {
    marginTop: "20px",
    padding: "12px",
    background: "linear-gradient(135deg, #10b981, #059669)",
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
    color: "#10b981",
    fontWeight: "600",
    textDecoration: "none",
  },
};