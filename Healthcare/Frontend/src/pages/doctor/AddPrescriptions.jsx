import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";

export default function AddPrescription() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ appointment_id: "", notes: "" });
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", days: "" }]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const aptId = searchParams.get("appointment_id");
    if (aptId) setForm((f) => ({ ...f, appointment_id: aptId }));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMedChange = (i, e) => {
    const updated = [...medicines];
    updated[i][e.target.name] = e.target.value;
    setMedicines(updated);
  };

  const addMedicine = () => setMedicines([...medicines, { name: "", dosage: "", days: "" }]);
  const removeMedicine = (i) => setMedicines(medicines.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await api.post("/prescriptions", {
        ...form,
        medicines: medicines.map((m) => ({ ...m, days: parseInt(m.days) })),
      });
      setMsg("✅ Prescription created!");
      setTimeout(() => navigate("/doctor/appointments"), 1500);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.detail || "Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <button style={s.back} onClick={() => navigate("/doctor/appointments")}>← Back</button>
      <h2>💊 Add Prescription</h2>
      {msg && <div style={s.msg}>{msg}</div>}
      <form onSubmit={handleSubmit} style={s.form}>
        <label>Appointment ID</label>
        <input style={s.input} name="appointment_id" value={form.appointment_id}
          onChange={handleChange} required placeholder="appointment_id" />

        <label>Doctor Notes</label>
        <textarea style={{ ...s.input, height: "80px" }} name="notes"
          value={form.notes} onChange={handleChange} placeholder="Notes..." />

        <h3 style={{ margin: "16px 0 8px" }}>Medicines</h3>
        {medicines.map((med, i) => (
          <div key={i} style={s.medRow}>
            <input style={s.input} name="name" placeholder="Medicine name"
              value={med.name} onChange={(e) => handleMedChange(i, e)} required />
            <input style={s.input} name="dosage" placeholder="Dosage (e.g. 500mg)"
              value={med.dosage} onChange={(e) => handleMedChange(i, e)} required />
            <input style={s.input} name="days" type="number" placeholder="Days"
              value={med.days} onChange={(e) => handleMedChange(i, e)} required />
            {medicines.length > 1 && (
              <button type="button" style={s.removeBtn} onClick={() => removeMedicine(i)}>✕</button>
            )}
          </div>
        ))}

        <button type="button" style={s.addMedBtn} onClick={addMedicine}>+ Add Medicine</button>
        <button style={s.btn} disabled={loading}>{loading ? "Saving..." : "Submit Prescription"}</button>
      </form>
    </div>
  );
}

const s = {
  page: { padding: "32px", fontFamily: "sans-serif", maxWidth: "600px" },
  back: { background: "none", border: "none", cursor: "pointer", color: "#0ea5e9", marginBottom: "12px" },
  msg: { padding: "10px", background: "#dbeafe", borderRadius: "8px", marginBottom: "12px" },
  form: { display: "flex", flexDirection: "column", gap: "8px" },
  input: { padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "0.9rem", width: "100%", boxSizing: "border-box" },
  medRow: { display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" },
  removeBtn: { background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer" },
  addMedBtn: { padding: "8px", background: "#f1f5f9", border: "1px dashed #94a3b8", borderRadius: "8px", cursor: "pointer", marginTop: "4px" },
  btn: { marginTop: "16px", padding: "11px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
};