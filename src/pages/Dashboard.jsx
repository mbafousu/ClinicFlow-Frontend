import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function Dashboard() {
  const [patientsCount, setPatientsCount] = useState(0);
  const [recentVisits, setRecentVisits] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const patients = await apiFetch("/api/patients");
      const visits = await apiFetch("/api/visits");
      setPatientsCount(patients.length);
      setRecentVisits(visits.slice(0, 5));
    };

    load().catch((err) => setError(err.message));
  }, []);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      {error && <p className="error">{error}</p>}

      <div className="grid">
        <div className="card">
          <h3>Total Patients</h3>
          <p className="big">{patientsCount}</p>
        </div>

        <div className="card">
          <h3>Recent Visits</h3>
          <ul>
            {recentVisits.map((v) => (
              <li key={v._id}>
                {v.patient?.firstName} {v.patient?.lastName} — <b>{v.status}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}