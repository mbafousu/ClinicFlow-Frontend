import { useMemo, useState } from "react";
import AppShell from "../ui/AppShell";
import PageHeader from "../ui/PageHeader";
import SearchBar from "../ui/SearchBar";
import DataTable from "../ui/DataTable";
import StatusChip from "../ui/StatusChip";
import FormCard from "../ui/FormCard";

const initialVisits = [
  {
    id: 1,
    patientName: "John Doe",
    date: "2026-03-01",
    reason: "Routine Checkup",
    provider: "Dr. Williams",
    status: "Completed",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    date: "2026-03-03",
    reason: "Follow-up Visit",
    provider: "Dr. Brown",
    status: "Pending",
  },
  {
    id: 3,
    patientName: "Sarah Johnson",
    date: "2026-03-05",
    reason: "Blood Pressure Review",
    provider: "Dr. Lee",
    status: "Completed",
  },
];

export default function Visits() {
  const [visits, setVisits] = useState(initialVisits);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    patientName: "",
    date: "",
    reason: "",
    provider: "",
    status: "Pending",
  });

  const filteredVisits = useMemo(() => {
    const value = searchTerm.toLowerCase();

    return visits.filter((visit) => {
      return (
        visit.patientName.toLowerCase().includes(value) ||
        visit.reason.toLowerCase().includes(value) ||
        visit.provider.toLowerCase().includes(value) ||
        visit.status.toLowerCase().includes(value) ||
        visit.date.toLowerCase().includes(value)
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

  function handleAddVisit(event) {
    event.preventDefault();

    if (
      !formData.patientName.trim() ||
      !formData.date.trim() ||
      !formData.reason.trim() ||
      !formData.provider.trim()
    ) {
      alert("Please fill in all visit fields.");
      return;
    }

    const newVisit = {
      id: Date.now(),
      patientName: formData.patientName.trim(),
      date: formData.date,
      reason: formData.reason.trim(),
      provider: formData.provider.trim(),
      status: formData.status,
    };

    setVisits((prev) => [newVisit, ...prev]);

    setFormData({
      patientName: "",
      date: "",
      reason: "",
      provider: "",
      status: "Pending",
    });
  }

  function handleDeleteVisit(id) {
    const confirmed = window.confirm("Delete this visit?");
    if (!confirmed) return;

    setVisits((prev) => prev.filter((visit) => visit.id !== id));
  }

  function handleEditVisit(id) {
    const visitToEdit = visits.find((visit) => visit.id === id);
    if (!visitToEdit) return;

    const updatedReason = prompt("Edit visit reason:", visitToEdit.reason);
    if (!updatedReason) return;

    setVisits((prev) =>
      prev.map((visit) =>
        visit.id === id
          ? { ...visit, reason: updatedReason.trim() || visit.reason }
          : visit
      )
    );
  }

  const columns = ["Patient", "Date", "Reason", "Provider", "Status", "Actions"];

  const tableRows = filteredVisits.map((visit) => ({
    Patient: visit.patientName,
    Date: visit.date,
    Reason: visit.reason,
    Provider: visit.provider,
    Status: <StatusChip status={visit.status} />,
    Actions: (
      <div className="table-actions">
        <button
          className="table-btn edit-btn"
          onClick={() => handleEditVisit(visit.id)}
        >
          Edit
        </button>
        <button
          className="table-btn delete-btn"
          onClick={() => handleDeleteVisit(visit.id)}
        >
          Delete
        </button>
      </div>
    ),
  }));

  return (
    <AppShell>
      <PageHeader title="Visits" />

      <div className="visits-page">
        <FormCard>
          <div className="visits-toolbar">
            <SearchBar
              placeholder="Search visits by patient, reason, provider, status, or date..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </FormCard>

        <FormCard>
          <h2 className="section-title">Add New Visit</h2>

          <form className="visit-form" onSubmit={handleAddVisit}>
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={formData.patientName}
              onChange={handleFormChange}
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
            />

            <input
              type="text"
              name="reason"
              placeholder="Reason for Visit"
              value={formData.reason}
              onChange={handleFormChange}
            />

            <input
              type="text"
              name="provider"
              placeholder="Provider Name"
              value={formData.provider}
              onChange={handleFormChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
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

          <DataTable columns={columns} data={tableRows} />
        </FormCard>
      </div>
    </AppShell>
  );
}