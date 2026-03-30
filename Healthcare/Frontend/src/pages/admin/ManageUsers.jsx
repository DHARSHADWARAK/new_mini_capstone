import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function ManageUsers() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch {
      setMsg("❌ Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setMsg("🗑️ User deleted");
      fetchUsers();
    } catch {
      setMsg("❌ Delete failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleBadge = (role) => {
    const map = {
      admin: { bg: "#ede9fe", color: "#7c3aed", label: "👑 Admin" },
      doctor: { bg: "#dbeafe", color: "#1d4ed8", label: "👨‍⚕️ Doctor" },
      patient: { bg: "#dcfce7", color: "#16a34a", label: "🧑 Patient" },
    };
    const s = map[role] || { bg: "#f1f5f9", color: "#64748b", label: role };
    return (
      <span
        style={{
          background: s.bg,
          color: s.color,
          padding: "3px 10px",
          borderRadius: "20px",
          fontSize: "0.78rem",
          fontWeight: "600",
        }}
      >
        {s.label}
      </span>
    );
  };

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>🏥 HealthAdmin</div>
        <nav style={styles.nav}>
          <div style={styles.navItem} onClick={() => navigate("/admin")}>
            👑 Dashboard
          </div>
          <div style={styles.navItemActive}>👥 Manage Users</div>
        </nav>
        <div style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          <h2 style={styles.pageTitle}>Manage Users</h2>
          <div style={styles.userBadge}>👑 {user?.name}</div>
        </div>

        {msg && <div style={styles.msg}>{msg}</div>}

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            All Registered Users ({users.length})
          </h3>

          {loading ? (
            <p style={styles.loading}>Loading...</p>
          ) : users.length === 0 ? (
            <p style={styles.empty}>No users found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Approved</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={styles.tr}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{roleBadge(u.role)}</td>
                    <td style={styles.td}>
                      {u.is_approved ? (
                        <span style={styles.yes}>✅ Yes</span>
                      ) : (
                        <span style={styles.no}>❌ No</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {u._id !== user?.id && (
                        <button
                          style={styles.deleteBtn}
                          onClick={() => deleteUser(u.id)}
                        >
                          🗑️ Delete
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
  nav: { marginTop: "16px", flex: 1 },
  navItem: {
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#94a3b8",
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
    padding: "12px 20px",
    cursor: "pointer",
    color: "#f87171",
    fontSize: "0.9rem",
  },
  main: { marginLeft: "220px", flex: 1, padding: "32px" },
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
  table: { width: "100%", borderCollapse: "collapse" },
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
  yes: { color: "#16a34a", fontWeight: "600", fontSize: "0.85rem" },
  no: { color: "#dc2626", fontWeight: "600", fontSize: "0.85rem" },
  deleteBtn: {
    background: "#fee2e2",
    color: "#dc2626",
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