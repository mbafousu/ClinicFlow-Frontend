import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/client";
import AppShell from "../ui/AppShell";
import PageHeader from "../ui/PageHeader";
import SearchBar from "../ui/SearchBar";
import DataTable from "../ui/DataTable";
import StatusChip from "../ui/StatusChip";
import FormCard from "../ui/FormCard";

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    patient: "",
    visitDate: "",
    reason: "",
    status: "scheduled",
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [visitsData, patientsData] = await Promise.all([
          apiFetch("/api/visits"),
          apiFetch("/api/patients"),
        ]);

        setVisits(Array.isArray(visitsData) ? visitsData : []);
        setPatients(Array.isArray(patientsData) ? patientsData : []);
      } catch (err) {
        console.error("Load visits error:", err);
        setError(err.message || "Unable to load visits.");
        setVisits([]);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredVisits = useMemo(() => {
    const value = searchTerm.toLowerCase().trim();

    return visits.filter((visit) => {
      const patientName = visit.patient
        ? `${visit.patient.firstName || ""} ${visit.patient.lastName || ""}`.trim()
        : "";

      const visitDate = visit.visitDate
        ? new Date(visit.visitDate).toLocaleDateString()
        : "";

      return (
        patientName.toLowerCase().includes(value) ||
        (visit.reason || "").toLowerCase().includes(value) ||
        (visit.status || "").toLowerCase().includes(value) ||
        visitDate.toLowerCase().includes(value)
      );
    });
  }, [visits, searchTerm]);

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

  async function handleAddVisit(event) {
    event.preventDefault();

    if (
      !formData.patient ||
      !formData.visitDate ||
      !formData.reason.trim()
    ) {
      alert("Please fill in all visit fields.");
      return;
    }

    try {
      const createdVisit = await apiFetch("/api/visits", {
        method: "POST",
        body: JSON.stringify({
          patient: formData.patient,
          visitDate: formData.visitDate,
          reason: formData.reason.trim(),
          status: formData.status,
        }),
      });

      const refreshedVisits = await apiFetch("/api/visits");
      setVisits(Array.isArray(refreshedVisits) ? refreshedVisits : []);

      setFormData({
        patient: "",
        visitDate: "",
        reason: "",
        status: "scheduled",
      });
    } catch (err) {
      console.error("Add visit error:", err);
      alert(err.message || "Unable to add visit.");
    }
  }

  async function handleDeleteVisit(id) {
    const confirmed = window.confirm("Delete this visit?");
    if (!confirmed) return;

    try {
      await apiFetch(`/api/visits/${id}`, {
        method: "DELETE",
      });

      setVisits((prev) => prev.filter((visit) => visit._id !== id));
    } catch (err) {
      console.error("Delete visit error:", err);
      alert(err.message || "Unable to delete visit.");
    }
  }

  async function handleEditVisit(id) {
    const visitToEdit = visits.find((visit) => visit._id === id);
    if (!visitToEdit) return;

    const updatedReason = prompt("Edit visit reason:", visitToEdit.reason || "");
    if (!updatedReason || !updatedReason.trim()) return;

    try {
      const updatedVisit = await apiFetch(`/api/visits/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          patient: visitToEdit.patient?._id || visitToEdit.patient,
          visitDate: visitToEdit.visitDate,
          reason: updatedReason.trim(),
          status: visitToEdit.status,
          vitals: visitToEdit.vitals || {},
          notes: visitToEdit.notes || "",
        }),
      });

      const refreshedVisits = await apiFetch("/api/visits");
      setVisits(Array.isArray(refreshedVisits) ? refreshedVisits : []);
    } catch (err) {
      console.error("Edit visit error:", err);
      alert(err.message || "Unable to update visit.");
    }
  }

  const columns = ["Patient", "Date", "Reason", "Status", "Actions"];

  const tableRows = filteredVisits.map((visit) => {
    const patientName = visit.patient
      ? `${visit.patient.firstName || ""} ${visit.patient.lastName || ""}`.trim()
      : "Unknown Patient";

    return {
      Patient: patientName,
      Date: visit.visitDate
        ? new Date(visit.visitDate).toLocaleDateString()
        : "N/A",
      Reason: visit.reason || "N/A",
      Status: <StatusChip status={visit.status || "scheduled"} />,
      Actions: (
        <div className="table-actions">
          <button
            type="button"
            className="table-btn edit-btn"
            onClick={() => handleEditVisit(visit._id)}
          >
            Edit
          </button>

          <button
            type="button"
            className="table-btn delete-btn"
            onClick={() => handleDeleteVisit(visit._id)}
          >
            Delete
          </button>
        </div>
      ),
    };
  });

  return (
    <AppShell>
      <PageHeader title="Visits" />

      <div className="visits-page">
        <FormCard>
          <div className="visits-toolbar">
            <SearchBar
              placeholder="Search visits by patient, reason, status, or date..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </FormCard>

        <FormCard>
          <h2 className="section-title">Add New Visit</h2>

          <form className="visit-form" onSubmit={handleAddVisit}>
            <select
              name="patient"
              value={formData.patient}
              onChange={handleFormChange}
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {`${patient.firstName || ""} ${patient.lastName || ""}`.trim()}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleFormChange}
            />

            <input
              type="text"
              name="reason"
              placeholder="Reason for Visit"
              value={formData.reason}
              onChange={handleFormChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
            >
              <option value="scheduled">Scheduled</option>
              <option value="checked_in">Checked In</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button type="submit" className="primary-btn">
              Add Visit
            </button>
          </form>
        </FormCard>

        <FormCard>
          <div className="visits-table-header">
            <h2 className="section-title">Visit Records</h2>
            <p className="section-subtitle">
              Total Results: {filteredVisits.length}
            </p>
          </div>

          {loading ? (
            <p className="info-text">Loading visits...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : filteredVisits.length > 0 ? (
            <DataTable columns={columns} data={tableRows} />
          ) : (
            <p className="info-text">No visits found.</p>
          )}
        </FormCard>
      </div>
    </AppShell>
  );
}