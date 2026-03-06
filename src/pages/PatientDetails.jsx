import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useNavigate, useParams } from "react-router-dom";

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const p = await apiFetch(`/api/patients/${id}`);
      const v = await apiFetch(`/api/visits?patientId=${id}`);
      setPatient(p);
      setPhone(p.phone || "");
      setVisits(v);
    };

    load().catch((err) => setError(err.message));
  }, [id]);

  const save = async () => {
    try {
      const updated = await apiFetch(`/api/patients/${id}`, {
        method: "PUT",
        body: JSON.stringify({ phone }),
      });
      setPatient(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this patient?")) return;
    try {
      await apiFetch(`/api/patients/${id}`, { method: "DELETE" });
      navigate("/patients");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!patient) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h1>{patient.firstName} {patient.lastName}</h1>
      {error && <p className="error">{error}</p>}

      <div className="grid2">
        <div className="card">
          <h3>Patient Info</h3>
          <p><b>Email:</b> {patient.email}</p>

          <label>Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />

          <div className="row">
            <button onClick={save}>Save</button>
            <button className="danger" onClick={remove}>Delete</button>
          </div>
        </div>

        <div className="card">
          <h3>Visit History</h3>
          {visits.length === 0 ? (
            <p>No visits yet.</p>
          ) : (
            <ul>
              {visits.map((v) => (
                <li key={v._id}>
                  {new Date(v.visitDate).toLocaleDateString()} — {v.reason} — <b>{v.status}</b>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}