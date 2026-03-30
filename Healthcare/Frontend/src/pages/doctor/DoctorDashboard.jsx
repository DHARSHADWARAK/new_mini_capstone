import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={s.page}>
      <h2>👨‍⚕️ Doctor Dashboard — Welcome, {user?.name}</h2>
      <div style={s.grid}>
        <div style={s.card} onClick={() => navigate("/doctor/profile")}>📋 My Profile</div>
        <div style={s.card} onClick={() => navigate("/doctor/appointments")}>📅 Appointments</div>
        <div style={s.card} onClick={() => navigate("/doctor/prescriptions/add")}>💊 Add Prescription</div>
      </div>
      <button style={s.logout} onClick={handleLogout}>🚪 Logout</button>
    </div>
  );
}

const s = {
  page: { padding: "32px", fontFamily: "sans-serif" },
  grid: { display: "flex", gap: "16px", margin: "24px 0" },
  card: {
    padding: "24px 32px", background: "#e0f2fe", borderRadius: "10px",
    cursor: "pointer", fontWeight: "600", fontSize: "1rem",
  },
  logout: {
    marginTop: "12px", padding: "10px 20px", background: "#fee2e2",
    color: "#dc2626", border: "none", borderRadius: "8px", cursor: "pointer",
  },
};