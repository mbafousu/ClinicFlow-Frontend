import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/client";
import DataTable from "../ui/DataTable";
import FormCard from "../ui/FormCard";
import SearchBar from "../ui/SearchBar";
import StatusChip from "../ui/StatusChip";
import EditModal from "../ui/EditModal";

const initialFormData = {
  patient: "",
  visitDate: "",
  reason: "",
  status: "scheduled",
  notes: "",
  vitals: {
    temperatureC: "",
    pulse: "",
    respRate: "",
    bpSystolic: "",
    bpDiastolic: "",
    spo2: "",
    weightKg: "",
  },
};

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editingVisitId, setEditingVisitId] = useState(null);

  const [addFormData, setAddFormData] = useState(initialFormData);
  const [editFormData, setEditFormData] = useState(initialFormData);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setError("");

      const [visitsData, patientsData] = await Promise.all([
        apiFetch("/api/visits"),
        apiFetch("/api/patients"),
      ]);

      setVisits(Array.isArray(visitsData) ? visitsData : []);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError(err.message || "Failed to load visits");
    }
  }

  const filteredVisits = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return visits.filter((visit) => {
      const patientName =
        `${visit.patient?.firstName || ""} ${visit.patient?.lastName || ""}`.toLowerCase();

      const reason = visit.reason?.toLowerCase() || "";
      const status = visit.status?.toLowerCase() || "";
      const notes = visit.notes?.toLowerCase() || "";

      return (
        patientName.includes(term) ||
        reason.includes(term) ||
        status.includes(term) ||
        notes.includes(term)
      );
    });
  }, [visits, searchTerm]);

  function openAddModal() {
    setAddFormData({
      ...initialFormData,
      patient: patients[0]?._id || "",
      visitDate: new Date().toISOString().split("T")[0],
    });
    setIsAddModalOpen(true);
  }

  function handleEdit(id) {
    const visit = visits.find((v) => v._id === id);
    if (!visit) return;

    setEditingVisitId(id);
    setEditFormData({
      patient: visit.patient?._id || "",
      visitDate: visit.visitDate ? visit.visitDate.split("T")[0] : "",
      reason: visit.reason || "",
      status: visit.status || "scheduled",
      notes: visit.notes || "",
      vitals: {
        temperatureC: visit.vitals?.temperatureC ?? "",
        pulse: visit.vitals?.pulse ?? "",
        respRate: visit.vitals?.respRate ?? "",
        bpSystolic: visit.vitals?.bpSystolic ?? "",
        bpDiastolic: visit.vitals?.bpDiastolic ?? "",
        spo2: visit.vitals?.spo2 ?? "",
        weightKg: visit.vitals?.weightKg ?? "",
      },
    });

    setIsEditModalOpen(true);
  }

  function handleAddChange(e) {
    const { name, value } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleAddVitalsChange(e) {
    const { name, value } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [name]: value,
      },
    }));
  }

  function handleEditVitalsChange(e) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [name]: value,
      },
    }));
  }

  function cleanVisitPayload(formData) {
    return {
      patient: formData.patient,
      visitDate: formData.visitDate,
      reason: formData.reason,
      status: formData.status,
      notes: formData.notes,
      vitals: {
        temperatureC:
          formData.vitals.temperatureC === ""
            ? undefined
            : Number(formData.vitals.temperatureC),
        pulse:
          formData.vitals.pulse === "" ? undefined : Number(formData.vitals.pulse),
        respRate:
          formData.vitals.respRate === ""
            ? undefined
            : Number(formData.vitals.respRate),
        bpSystolic:
          formData.vitals.bpSystolic === ""
            ? undefined
            : Number(formData.vitals.bpSystolic),
        bpDiastolic:
          formData.vitals.bpDiastolic === ""
            ? undefined
            : Number(formData.vitals.bpDiastolic),
        spo2:
          formData.vitals.spo2 === "" ? undefined : Number(formData.vitals.spo2),
        weightKg:
          formData.vitals.weightKg === ""
            ? undefined
            : Number(formData.vitals.weightKg),
      },
    };
  }

  async function handleAddSubmit(e) {
    e.preventDefault();

    try {
      setError("");

      await apiFetch("/api/visits", {
        method: "POST",
        body: JSON.stringify(cleanVisitPayload(addFormData)),
      });

      await loadData();
      setIsAddModalOpen(false);
      setAddFormData(initialFormData);
    } catch (err) {
      console.error("Failed to create visit:", err);
      setError(err.message || "Failed to create visit");
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();

    try {
      setError("");

      await apiFetch(`/api/visits/${editingVisitId}`, {
        method: "PUT",
        body: JSON.stringify(cleanVisitPayload(editFormData)),
      });

      await loadData();
      setIsEditModalOpen(false);
      setEditingVisitId(null);
      setEditFormData(initialFormData);
    } catch (err) {
      console.error("Failed to update visit:", err);
      setError(err.message || "Failed to update visit");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this visit?");
    if (!confirmed) return;

    try {
      setError("");

      await apiFetch(`/api/visits/${id}`, {
        method: "DELETE",
      });

      await loadData();
    } catch (err) {
      console.error("Failed to delete visit:", err);
      setError(err.message || "Failed to delete visit");
    }
  }

  const columns = ["Patient", "Date", "Reason", "Status", "Notes", "Actions"];

  const rows = filteredVisits.map((visit) => ({
    Patient: `${visit.patient?.firstName || ""} ${visit.patient?.lastName || ""}`.trim(),
    Date: visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : "",
    Reason: visit.reason || "",
    Status: <StatusChip status={visit.status} />,
    Notes: visit.notes || "-",
    Actions: (
      <div className="table-actions">
        <button
          className="table-btn edit-btn"
          onClick={() => handleEdit(visit._id)}
        >
          Edit
        </button>
        <button
          className="table-btn delete-btn"
          onClick={() => handleDelete(visit._id)}
        >
          Delete
        </button>
      </div>
    ),
  }));

  return (
    <div className="page-section">
      <div className="page-header-block">
        <h1 className="page-title">Visits</h1>
        <button className="table-btn add-btn" onClick={openAddModal}>
          Add Visit
        </button>
      </div>

      {error && (
        <FormCard>
          <p style={{ color: "red", margin: 0 }}>{error}</p>
        </FormCard>
      )}

      <FormCard>
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FormCard>

      <FormCard>
        <DataTable columns={columns} data={rows} />
      </FormCard>

      <EditModal
        title="Add Visit"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        submitLabel="Create Visit"
      >
        <select
          name="patient"
          value={addFormData.patient}
          onChange={handleAddChange}
          required
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="visitDate"
          value={addFormData.visitDate}
          onChange={handleAddChange}
          required
        />

        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={addFormData.reason}
          onChange={handleAddChange}
          required
        />

        <select
          name="status"
          value={addFormData.status}
          onChange={handleAddChange}
          required
        >
          <option value="scheduled">Scheduled</option>
          <option value="checked_in">Checked In</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <textarea
          name="notes"
          placeholder="Notes"
          value={addFormData.notes}
          onChange={handleAddChange}
          rows="3"
        />

        <input
          type="number"
          step="0.1"
          name="temperatureC"
          placeholder="Temperature (°C)"
          value={addFormData.vitals.temperatureC}
          onChange={handleAddVitalsChange}
        />

        <input
          type="number"
          name="pulse"
          placeholder="Pulse"
          value={addFormData.vitals.pulse}
          onChange={handleAddVitalsChange}
        />

        <input
          type="number"
          name="respRate"
          placeholder="Respiratory Rate"
          value={addFormData.vitals.respRate}
          onChange={handleAddVitalsChange}
        />

        <input
          type="number"
          name="bpSystolic"
          placeholder="BP Systolic"
          value={addFormData.vitals.bpSystolic}
          onChange={handleAddVitalsChange}
        />

        <input
          type="number"
          name="bpDiastolic"
          placeholder="BP Diastolic"
          value={addFormData.vitals.bpDiastolic}
          onChange={handleAddVitalsChange}
        />

        <input
          type="number"
          name="spo2"
          placeholder="SpO2"
          value={addFormData.vitals.spo2}
          onChange={handleAddVitalsChange}
        />

        <input
          type="number"
          step="0.1"
          name="weightKg"
          placeholder="Weight (kg)"
          value={addFormData.vitals.weightKg}
          onChange={handleAddVitalsChange}
        />
      </EditModal>

      <EditModal
        title="Edit Visit"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        submitLabel="Update Visit"
      >
        <select
          name="patient"
          value={editFormData.patient}
          onChange={handleEditChange}
          required
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="visitDate"
          value={editFormData.visitDate}
          onChange={handleEditChange}
          required
        />

        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={editFormData.reason}
          onChange={handleEditChange}
          required
        />

        <select
          name="status"
          value={editFormData.status}
          onChange={handleEditChange}
          required
        >
          <option value="scheduled">Scheduled</option>
          <option value="checked_in">Checked In</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <textarea
          name="notes"
          placeholder="Notes"
          value={editFormData.notes}
          onChange={handleEditChange}
          rows="3"
        />

        <input
          type="number"
          step="0.1"
          name="temperatureC"
          placeholder="Temperature (°C)"
          value={editFormData.vitals.temperatureC}
          onChange={handleEditVitalsChange}
        />

        <input
          type="number"
          name="pulse"
          placeholder="Pulse"
          value={editFormData.vitals.pulse}
          onChange={handleEditVitalsChange}
        />

        <input
          type="number"
          name="respRate"
          placeholder="Respiratory Rate"
          value={editFormData.vitals.respRate}
          onChange={handleEditVitalsChange}
        />

        <input
          type="number"
          name="bpSystolic"
          placeholder="BP Systolic"
          value={editFormData.vitals.bpSystolic}
          onChange={handleEditVitalsChange}
        />

        <input
          type="number"
          name="bpDiastolic"
          placeholder="BP Diastolic"
          value={editFormData.vitals.bpDiastolic}
          onChange={handleEditVitalsChange}
        />

        <input
          type="number"
          name="spo2"
          placeholder="SpO2"
          value={editFormData.vitals.spo2}
          onChange={handleEditVitalsChange}
        />

        <input
          type="number"
          step="0.1"
          name="weightKg"
          placeholder="Weight (kg)"
          value={editFormData.vitals.weightKg}
          onChange={handleEditVitalsChange}
        />
      </EditModal>
    </div>
  );
}