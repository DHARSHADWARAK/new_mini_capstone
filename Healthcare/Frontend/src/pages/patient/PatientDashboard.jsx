import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={s.page}>
      <h2>🧑 Patient Dashboard — Welcome, {user?.name}</h2>
      <div style={s.grid}>
        <div style={s.card} onClick={() => navigate("/patient/book")}>📅 Book Appointment</div>
        <div style={s.card} onClick={() => navigate("/patient/appointments")}>🗂️ My Appointments</div>
      </div>
      <button style={s.logout} onClick={handleLogout}>🚪 Logout</button>
    </div>
  );
}

const s = {
  page: { padding: "32px", fontFamily: "sans-serif" },
  grid: { display: "flex", gap: "16px", margin: "24px 0" },
  card: { padding: "24px 32px", background: "#dcfce7", borderRadius: "10px", cursor: "pointer", fontWeight: "600" },
  logout: { padding: "10px 20px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", cursor: "pointer" },
};