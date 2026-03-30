import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/appointments/my");
        setAppointments(res.data);
      } catch {
        setMsg("❌ Failed to load");
      }
    };
    fetch();
  }, []);

  const statusColor = { booked: "#fef9c3", completed: "#dcfce7", cancelled: "#fee2e2" };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate("/patient")}>← Back</button>
      <h2>🗂️ My Appointments</h2>
      {msg && <div style={s.msg}>{msg}</div>}
      {appointments.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No appointments yet.</p>
      ) : (
        appointments.map((apt) => (
          <div key={apt.id} style={{ ...s.card, background: statusColor[apt.status] || "#f8fafc" }}>
            <p><b>Doctor:</b> {apt.doctor_name || apt.doctor_id}</p>
            <p><b>Time:</b> {new Date(apt.appointment_time).toLocaleString()}</p>
            <p><b>Status:</b> {apt.status}</p>
            {apt.status === "completed" && (
              <button style={s.btn}
                onClick={() => navigate(`/patient/prescription/${apt.id}`)}>
                💊 View Prescription
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const s = {
  page: { padding: "32px", fontFamily: "sans-serif" },
  back: { background: "none", border: "none", cursor: "pointer", color: "#0ea5e9", marginBottom: "12px" },
  msg: { padding: "10px", background: "#fee2e2", borderRadius: "8px", marginBottom: "12px" },
  card: { padding: "16px", borderRadius: "10px", marginBottom: "12px", border: "1px solid #e2e8f0" },
  btn: { marginTop: "8px", padding: "8px 16px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
};