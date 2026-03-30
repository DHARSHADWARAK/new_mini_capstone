import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function BookAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctor_id: "", appointment_time: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        setDoctors(res.data);
      } catch {
        setMsg("❌ Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await api.post("/appointments", form);
      setMsg("✅ Appointment booked!");
      setTimeout(() => navigate("/patient/appointments"), 1500);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.detail || "Booking failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate("/patient")}>← Back</button>
      <h2>📅 Book Appointment</h2>
      {msg && <div style={s.msg}>{msg}</div>}
      <form onSubmit={handleSubmit} style={s.form}>
        <label>Select Doctor</label>
        <select style={s.input} name="doctor_id" value={form.doctor_id} onChange={handleChange} required>
          <option value="">-- Choose a doctor --</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              Dr. {doc.name} — {doc.specialization} ({doc.experience} yrs)
            </option>
          ))}
        </select>

        <label>Appointment Date & Time</label>
        <input style={s.input} type="datetime-local" name="appointment_time"
          value={form.appointment_time} onChange={handleChange} required />

        <button style={s.btn} disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}

const s = {
  page: { padding: "32px", fontFamily: "sans-serif", maxWidth: "480px" },
  back: { background: "none", border: "none", cursor: "pointer", color: "#0ea5e9", marginBottom: "12px" },
  msg: { padding: "10px", background: "#dbeafe", borderRadius: "8px", marginBottom: "12px" },
  form: { display: "flex", flexDirection: "column", gap: "8px" },
  input: { padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.95rem" },
  btn: { marginTop: "12px", padding: "11px", background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
};