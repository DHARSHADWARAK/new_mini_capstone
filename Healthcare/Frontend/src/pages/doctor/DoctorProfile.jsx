import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function DoctorProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ specialization: "", experience: "", availability: "" });
  const [doctorId, setDoctorId] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Try to load existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/doctors/me");
        const d = res.data;
        setDoctorId(d.id);
        setForm({
          specialization: d.specialization,
          experience: d.experience,
          availability: d.availability.join(", "),
        });
      } catch {
        // No profile yet
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const payload = {
      ...form,
      experience: parseInt(form.experience),
      availability: form.availability.split(",").map((a) => a.trim()),
    };
    try {
      if (doctorId) {
        await api.put(`/doctors/${doctorId}`, payload);
        setMsg("✅ Profile updated!");
      } else {
        await api.post("/doctors", payload);
        setMsg("✅ Profile created!");
      }
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.detail || "Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate("/doctor")}>← Back</button>
      <h2>📋 Doctor Profile</h2>
      {msg && <div style={s.msg}>{msg}</div>}
      <form onSubmit={handleSubmit} style={s.form}>
        <label>Specialization</label>
        <input style={s.input} name="specialization" value={form.specialization}
          onChange={handleChange} placeholder="e.g. Cardiology" required />

        <label>Experience (years)</label>
        <input style={s.input} name="experience" type="number" value={form.experience}
          onChange={handleChange} placeholder="e.g. 5" required />

        <label>Availability (comma separated)</label>
        <input style={s.input} name="availability" value={form.availability}
          onChange={handleChange} placeholder="e.g. Mon, Tue, Wed" required />

        <button style={s.btn} disabled={loading}>
          {loading ? "Saving..." : doctorId ? "Update Profile" : "Create Profile"}
        </button>
      </form>
    </div>
  );
}

const s = {
  page: { padding: "32px", fontFamily: "sans-serif", maxWidth: "500px" },
  back: { background: "none", border: "none", cursor: "pointer", color: "#0ea5e9", marginBottom: "12px" },
  msg: { padding: "10px", background: "#dbeafe", borderRadius: "8px", marginBottom: "12px" },
  form: { display: "flex", flexDirection: "column", gap: "8px" },
  input: { padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.95rem" },
  btn: {
    marginTop: "12px", padding: "10px", background: "#0ea5e9",
    color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600",
  },
};