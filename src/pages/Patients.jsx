import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import AppShell from "../ui/AppShell";
import PageHeader from "../ui/PageHeader";
import SearchBar from "../ui/SearchBar";
import DataTable from "../ui/DataTable";
import StatusChip from "../ui/StatusChip";
import FormCard from "../ui/FormCard";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/api/patients");
        setPatients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Load patients error:", err);
        setError(err.message || "Unable to load patients.");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const value = searchTerm.toLowerCase().trim();

    return patients.filter((patient) => {
      const fullName =
        `${patient.firstName || ""} ${patient.lastName || ""}`.trim();

      return (
        fullName.toLowerCase().includes(value) ||
        (patient.email || "").toLowerCase().includes(value) ||
        (patient.phone || "").toLowerCase().includes(value)
      );
    });
  }, [patients, searchTerm]);

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleAddPatient(event) {
    event.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      alert("Please fill in all patient fields.");
      return;
    }

    try {
      const newPatient = await apiFetch("/api/patients", {
        method: "POST",
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        }),
      });

      setPatients((prev) => [newPatient, ...prev]);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      console.error("Add patient error:", err);
      alert(err.message || "Unable to add patient.");
    }
  }

  async function handleDeletePatient(id) {
    const confirmed = window.confirm("Delete this patient?");
    if (!confirmed) return;

    try {
      await apiFetch(`/api/patients/${id}`, {
        method: "DELETE",
      });

      setPatients((prev) => prev.filter((patient) => patient._id !== id));
    } catch (err) {
      console.error("Delete patient error:", err);
      alert(err.message || "Unable to delete patient.");
    }
  }

  async function handleEditPatient(id) {
    const patientToEdit = patients.find((patient) => patient._id === id);
    if (!patientToEdit) return;

    const currentFullName =
      `${patientToEdit.firstName || ""} ${patientToEdit.lastName || ""}`.trim();

    const updatedName = prompt("Edit patient full name:", currentFullName);
    if (!updatedName || !updatedName.trim()) return;

    const nameParts = updatedName.trim().split(" ");
    const firstName = nameParts[0] || patientToEdit.firstName;
    const lastName = nameParts.slice(1).join(" ") || patientToEdit.lastName;

    try {
      const updatedPatient = await apiFetch(`/api/patients/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          firstName,
          lastName,
          email: patientToEdit.email,
          phone: patientToEdit.phone,
        }),
      });

      setPatients((prev) =>
        prev.map((patient) => (patient._id === id ? updatedPatient : patient))
      );
    } catch (err) {
      console.error("Edit patient error:", err);
      alert(err.message || "Unable to update patient.");
    }
  }

  const columns = ["Name", "Email", "Phone", "Actions"];

  const tableRows = filteredPatients.map((patient) => ({
    Name: `${patient.firstName || ""} ${patient.lastName || ""}`.trim(),
    Email: patient.email || "N/A",
    Phone: patient.phone || "N/A",
    Actions: (
      <div className="table-actions">
        <Link to={`/patients/${patient._id}`} className="table-btn view-btn">
          View Details
        </Link>

        <button
          type="button"
          className="table-btn edit-btn"
          onClick={() => handleEditPatient(patient._id)}
        >
          Edit
        </button>

        <button
          type="button"
          className="table-btn delete-btn"
          onClick={() => handleDeletePatient(patient._id)}
        >
          Delete
        </button>
      </div>
    ),
  }));

  return (
    <AppShell>
      <PageHeader title="Patients" />

      <div className="patients-page">
        <FormCard>
          <div className="patients-toolbar">
            <SearchBar
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </FormCard>

        <FormCard>
          <h2 className="section-title">Add New Patient</h2>

          <form className="patient-form" onSubmit={handleAddPatient}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleFormChange}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleFormChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleFormChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleFormChange}
            />

            <button type="submit" className="primary-btn">
              Add Patient
            </button>
          </form>
        </FormCard>

        <FormCard>
          <div className="patients-table-header">
            <h2 className="section-title">Patient Records</h2>
            <p className="section-subtitle">
              Total Results: {filteredPatients.length}
            </p>
          </div>

          {loading ? (
            <p className="info-text">Loading patients...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : filteredPatients.length > 0 ? (
            <DataTable columns={columns} data={tableRows} />
          ) : (
            <p className="info-text">No patients found.</p>
          )}
        </FormCard>
      </div>
    </AppShell>
  );
}