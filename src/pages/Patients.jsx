import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { Link } from "react-router-dom";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const load = async () => {
    const data = await apiFetch("/api/patients");
    setPatients(data);
  };

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  const createPatient = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const created = await apiFetch("/api/patients", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email }),
      });

      setPatients((prev) => [created, ...prev]);
      setFirstName("");
      setLastName("");
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h1>Patients</h1>
      {error && <p className="error">{error}</p>}

      <div className="grid2">
        <form className="card" onSubmit={createPatient}>
          <h3>Add Patient</h3>

          <label>First Name</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />

          <label>Last Name</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} />

          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <button type="submit">Create</button>
        </form>

        <div className="card">
          <h3>Patient List</h3>
          <ul>
            {patients.map((p) => (
              <li key={p._id}>
                <Link to={`/patients/${p._id}`}>
                  {p.firstName} {p.lastName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}