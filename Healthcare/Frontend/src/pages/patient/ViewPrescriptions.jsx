import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function ViewPrescription() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/prescriptions/appointment/${appointmentId}`);
        setPrescription(res.data);
      } catch {
        setMsg("❌ No prescription found for this appointment.");
      }
    };
    fetch();
  }, [appointmentId]);

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate("/patient/appointments")}>← Back</button>
      <h2>💊 Prescription</h2>
      {msg && <div style={s.msg}>{msg}</div>}
      {prescription && (
        <div style={s.card}>
          <p><b>Doctor Notes:</b> {prescription.notes || "—"}</p>
          <h3 style={{ margin: "16px 0 8px" }}>Medicines</h3>
          {prescription.medicines?.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No medicines prescribed.</p>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Medicine</th>
                  <th style={s.th}>Dosage</th>
                  <th style={s.th}>Days</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines?.map((med, i) => (
                  <tr key={i} style={s.tr}>
                    <td style={s.td}>{med.name}</td>
                    <td style={s.td}>{med.dosage}</td>
                    <td style={s.td}>{med.days} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: "32px", fontFamily: "sans-serif", maxWidth: "600px" },
  back: { background: "none", border: "none", cursor: "pointer", color: "#0ea5e9", marginBottom: "12px" },
  msg: { padding: "10px", background: "#fee2e2", borderRadius: "8px", marginBottom: "12px" },
  card: { background: "#f8fafc", padding: "24px", borderRadius: "10px", border: "1px solid #e2e8f0" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "8px 12px", background: "#e2e8f0", fontSize: "0.8rem", fontWeight: "600" },
  tr: { borderBottom: "1px solid #e2e8f0" },
  td: { padding: "10px 12px", fontSize: "0.9rem" },
};