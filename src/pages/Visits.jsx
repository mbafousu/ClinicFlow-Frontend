import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");

  const [patientId, setPatientId] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("checked_in");

  const [filterStatus, setFilterStatus] = useState("");

  // Load patients + visits
  const load = async () => {
    const v = await apiFetch("/api/visits");
    const p = await apiFetch("/api/patients");

    setVisits(v);
    setPatients(p);
  };

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  // Create visit
  const createVisit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const newVisit = await apiFetch("/api/visits", {
        method: "POST",
        body: JSON.stringify({
          patient: patientId,
          reason,
          status,
          vitals: {
            temperatureC: 37,
            pulse: 80,
            respRate: 16,
            bpSystolic: 120,
            bpDiastolic: 80,
            spo2: 98,
            weightKg: 75,
          },
        }),
      });

      setVisits((prev) => [newVisit, ...prev]);
      setReason("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Update visit status
  const updateStatus = async (id, newStatus) => {
    try {
      const updated = await apiFetch(`/api/visits/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      setVisits((prev) =>
        prev.map((v) => (v._id === id ? updated : v))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete visit
  const deleteVisit = async (id) => {
    if (!confirm("Delete this visit?")) return;

    try {
      await apiFetch(`/api/visits/${id}`, { method: "DELETE" });

      setVisits((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredVisits = filterStatus
    ? visits.filter((v) => v.status === filterStatus)
    : visits;

  return (
    <div className="page">
      <h1>Visits</h1>

      {error && <p className="error">{error}</p>}

      <div className="grid2">
        {/* Create Visit */}
        <form className="card" onSubmit={createVisit}>
          <h3>Create Visit</h3>

          <label>Patient</label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>

          <label>Reason</label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="checked_in">Checked In</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button type="submit">Create Visit</button>
        </form>

        {/* Visit List */}
        <div className="card">
          <h3>Visit List</h3>

          <label>Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="checked_in">Checked In</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <ul>
            {filteredVisits.map((v) => (
              <li key={v._id}>
                <b>
                  {v.patient?.firstName} {v.patient?.lastName}
                </b>{" "}
                — {v.reason} — <b>{v.status}</b>

                <div className="row">
                  <button onClick={() => updateStatus(v._id, "completed")}>
                    Complete
                  </button>

                  <button
                    className="danger"
                    onClick={() => deleteVisit(v._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}