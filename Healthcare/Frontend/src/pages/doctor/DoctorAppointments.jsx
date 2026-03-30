import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [msg, setMsg] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/doctor");
      setAppointments(res.data);
    } catch {
      setMsg("❌ Failed to load appointments");
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}?status=${status}`);
      setMsg(`✅ Status updated to ${status}`);
      fetchAppointments();
    } catch {
      setMsg("❌ Update failed");
    }
  };

  const statusColor = { booked: "#fef9c3", completed: "#dcfce7", cancelled: "#fee2e2" };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate("/doctor")}>← Back</button>
      <h2>📅 My Appointments</h2>
      {msg && <div style={s.msg}>{msg}</div>}
      {appointments.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No appointments yet.</p>
      ) : (
        appointments.map((apt) => (
          <div key={apt.id} style={{ ...s.card, background: statusColor[apt.status] || "#f8fafc" }}>
            <p><b>Patient:</b> {apt.patient_name || apt.patient_id}</p>
            <p><b>Time:</b> {new Date(apt.appointment_time).toLocaleString()}</p>
            <p><b>Status:</b> {apt.status}</p>
            <div style={s.actions}>
              {apt.status === "booked" && (
                <>
                  <button style={s.btnGreen} onClick={() => updateStatus(apt._id, "completed")}>
                    ✅ Mark Completed
                  </button>
                  <button style={s.btnRed} onClick={() => updateStatus(apt._id, "cancelled")}>
                    ❌ Cancel
                  </button>
                </>
              )}
              {apt.status === "completed" && (
                <button style={s.btnBlue}
                  onClick={() => navigate(`/doctor/prescriptions/add?appointment_id=${apt.id}`)}>
                  💊 Add Prescription
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const s = {
  page: { padding: "32px", fontFamily: "sans-serif" },
  back: { background: "none", border: "none", cursor: "pointer", color: "#0ea5e9", marginBottom: "12px" },
  msg: { padding: "10px", background: "#dbeafe", borderRadius: "8px", marginBottom: "12px" },
  card: { padding: "16px", borderRadius: "10px", marginBottom: "12px", border: "1px solid #e2e8f0" },
  actions: { display: "flex", gap: "10px", marginTop: "10px" },
  btnGreen: { padding: "7px 14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  btnRed: { padding: "7px 14px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
  btnBlue: { padding: "7px 14px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
};