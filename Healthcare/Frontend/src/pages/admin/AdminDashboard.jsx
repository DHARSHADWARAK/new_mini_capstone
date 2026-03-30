import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      setMsg("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const approveDoctor = async (userId) => {
    try {
      await api.put(`/admin/doctors/${userId}/approve`);
      setMsg("✅ Doctor approved!");
      fetchDoctors();
    } catch (err) {
      setMsg("❌ Approval failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>🏥 HealthAdmin</div>
        <nav style={styles.nav}>
          <div style={styles.navItemActive}>👑 Dashboard</div>
          <div style={styles.navItem} onClick={() => navigate("/admin/users")}>
            👥 Manage Users
          </div>
        </nav>
        <div style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          <h2 style={styles.pageTitle}>Admin Dashboard</h2>
          <div style={styles.userBadge}>👑 {user?.name}</div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👨‍⚕️</div>
            <div style={styles.statNum}>{doctors.length}</div>
            <div style={styles.statLabel}>Total Doctors</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statNum}>
              {doctors.filter((d) => d.is_approved).length}
            </div>
            <div style={styles.statLabel}>Approved</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏳</div>
            <div style={styles.statNum}>
              {doctors.filter((d) => !d.is_approved).length}
            </div>
            <div style={styles.statLabel}>Pending</div>
          </div>
        </div>

        {msg && <div style={styles.msg}>{msg}</div>}

        {/* Doctors Table */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Doctor Approval Requests</h3>
          {loading ? (
            <p style={styles.loading}>Loading...</p>
          ) : doctors.length === 0 ? (
            <p style={styles.empty}>No doctors registered yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id} style={styles.tr}>
                    <td style={styles.td}>{doc.name}</td>
                    <td style={styles.td}>{doc.email}</td>
                    <td style={styles.td}>
                      <span
                        style={
                          doc.is_approved
                            ? styles.badgeGreen
                            : styles.badgeYellow
                        }
                      >
                        {doc.is_approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {!doc.is_approved && (
                        <button
                          style={styles.approveBtn}
                          onClick={() => approveDoctor(doc.id)}
                        >
                          ✅ Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#f1f5f9",
  },
  sidebar: {
    width: "220px",
    background: "linear-gradient(180deg, #0f172a, #1e3a5f)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    position: "fixed",
    height: "100vh",
  },
  sidebarLogo: {
    fontSize: "1.2rem",
    fontWeight: "700",
    padding: "0 20px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  nav: {
    marginTop: "16px",
    flex: 1,
  },
  navItem: {
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#94a3b8",
    transition: "all 0.2s",
  },
  navItemActive: {
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "0.9rem",
    background: "rgba(14,165,233,0.2)",
    color: "#38bdf8",
    borderLeft: "3px solid #38bdf8",
  },
  logoutBtn: {
    padding: "20px 20px",
    marginBottom:"15px",
    cursor: "pointer",
    color: "#f87171",
    fontSize: "2rem",
  },
  main: {
    marginLeft: "220px",
    flex: 1,
    padding: "32px",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  pageTitle: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  userBadge: {
    background: "#0f172a",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.85rem",
  },
  statsRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    flex: 1,
    textAlign: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  statIcon: { fontSize: "1.8rem", marginBottom: "8px" },
  statNum: { fontSize: "2rem", fontWeight: "700", color: "#0f172a" },
  statLabel: { fontSize: "0.8rem", color: "#64748b", marginTop: "4px" },
  msg: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "10px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "0.875rem",
  },
  section: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    margin: "0 0 16px",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#0f172a",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "10px 14px",
    background: "#f8fafc",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 14px", fontSize: "0.9rem", color: "#334155" },
  badgeGreen: {
    background: "#dcfce7",
    color: "#16a34a",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "0.78rem",
    fontWeight: "600",
  },
  badgeYellow: {
    background: "#fef9c3",
    color: "#ca8a04",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "0.78rem",
    fontWeight: "600",
  },
  approveBtn: {
    background: "#dcfce7",
    color: "#16a34a",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.82rem",
  },
  loading: { color: "#64748b" },
  empty: { color: "#94a3b8", textAlign: "center", padding: "20px" },
};