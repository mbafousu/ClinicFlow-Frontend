import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaCalendarPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { apiFetch } from "../api/client";
import EditModal from "../ui/EditModal";
import ConfirmModal from "../ui/ConfirmModal";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    patient: "",
    provider: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: "Scheduled",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [appointmentsData, patientsData] = await Promise.all([
        apiFetch("/api/appointments"),
        apiFetch("/api/patients"),
      ]);

      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (err) {
      console.error("Failed to load appointments:", err);
      setError(err.message || "Unable to load appointments.");
      setAppointments([]);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredAppointments = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return appointments.filter((appointment) => {
      const patientName = appointment.patient
        ? `${appointment.patient.firstName || ""} ${
            appointment.patient.lastName || ""
          }`.toLowerCase()
        : "";

      return (
        patientName.includes(query) ||
        (appointment.provider || "").toLowerCase().includes(query) ||
        (appointment.reason || "").toLowerCase().includes(query) ||
        (appointment.status || "").toLowerCase().includes(query)
      );
    });
  }, [appointments, searchTerm]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setFormData({
      patient: "",
      provider: "",
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
      status: "Scheduled",
      notes: "",
    });
    setEditingId(null);
  }

  async function handleCreateAppointment(event) {
    event.preventDefault();

    if (
      !formData.patient ||
      !formData.provider.trim() ||
      !formData.appointmentDate ||
      !formData.appointmentTime ||
      !formData.reason.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await apiFetch("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          patient: formData.patient,
          provider: formData.provider.trim(),
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          reason: formData.reason.trim(),
          status: formData.status,
          notes: formData.notes.trim(),
        }),
      });

      toast.success("Appointment created successfully");
      resetForm();
      loadData();
    } catch (err) {
      console.error("Failed to create appointment:", err);
      toast.error(err.message || "Failed to create appointment");
    }
  }

  function handleEdit(appointment) {
    setEditingId(appointment._id);
    setFormData({
      patient: appointment.patient?._id || "",
      provider: appointment.provider || "",
      appointmentDate: appointment.appointmentDate || "",
      appointmentTime: appointment.appointmentTime || "",
      reason: appointment.reason || "",
      status: appointment.status || "Scheduled",
      notes: appointment.notes || "",
    });
    setIsEditModalOpen(true);
  }

  async function handleEditSubmit(event) {
    event.preventDefault();

    if (
      !formData.patient ||
      !formData.provider.trim() ||
      !formData.appointmentDate ||
      !formData.appointmentTime ||
      !formData.reason.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await apiFetch(`/api/appointments/${editingId}`, {
        method: "PUT",
        body: JSON.stringify({
          patient: formData.patient,
          provider: formData.provider.trim(),
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          reason: formData.reason.trim(),
          status: formData.status,
          notes: formData.notes.trim(),
        }),
      });

      toast.success("Appointment updated successfully");
      resetForm();
      setIsEditModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Failed to update appointment:", err);
      toast.error(err.message || "Failed to update appointment");
    }
  }

  function handleDeleteClick(id) {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    try {
      await apiFetch(`/api/appointments/${deleteId}`, {
        method: "DELETE",
      });

      toast.success("Appointment deleted successfully");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
      loadData();
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      toast.error(err.message || "Failed to delete appointment");
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "Scheduled":
        return "status-scheduled";
      case "Confirmed":
        return "status-confirmed";
      case "Checked In":
        return "status-checkedin";
      case "Completed":
        return "status-completed";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "status-pending";
    }
  }

  return (
    <div className="page-section">
      <div className="page-header-block">
        <h1 className="page-title">Appointments</h1>
        <p className="page-subtitle">
          Schedule, update, and manage patient appointments
        </p>
      </div>

      <div className="patients-overview-grid">
        <div className="summary-card">
          <span className="summary-label">Total Appointments</span>
          <strong className="summary-value">{appointments.length}</strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">Search Results</span>
          <strong className="summary-value">
            {filteredAppointments.length}
          </strong>
        </div>

        <div className="summary-card">
          <span className="summary-label">Scheduled Today</span>
          <strong className="summary-value">
            {
              appointments.filter(
                (appointment) =>
                  appointment.appointmentDate ===
                  new Date().toISOString().split("T")[0]
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="content-card">
        <div className="premium-toolbar">
          <div className="toolbar-left">
            <h2 className="section-title">Appointment Directory</h2>
            <p className="section-subtitle">
              Search by patient, provider, reason, or status
            </p>
          </div>

          <div className="toolbar-right">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="form-card-header">
          <div>
            <h2 className="section-title">Add New Appointment</h2>
            <p className="section-subtitle">
              Create a real appointment linked to a patient record
            </p>
          </div>

          <div className="hero-badge">
            <FaCalendarPlus />
            Appointment Form
          </div>
        </div>

        <form className="premium-visit-form" onSubmit={handleCreateAppointment}>
          <div className="form-group">
            <label>Patient</label>
            <select
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Provider</label>
            <input
              type="text"
              name="provider"
              placeholder="Provider Name"
              value={formData.provider}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Appointment Time</label>
            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason</label>
            <input
              type="text"
              name="reason"
              placeholder="Reason for Appointment"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label>Notes</label>
            <textarea
              name="notes"
              placeholder="Optional notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="notes-field"
            />
          </div>

          <div className="patient-form-actions">
            <button type="submit" className="primary-btn">
              Add Appointment
            </button>
          </div>
        </form>
      </div>

      <div className="content-card">
        <div className="patients-table-header">
          <div>
            <h2 className="section-title">Appointment Records</h2>
            <p className="section-subtitle">
              View all scheduled and completed appointments
            </p>
          </div>

          <span className="results-badge">
            Total Results: {filteredAppointments.length}
          </span>
        </div>

        {loading ? (
          <p className="info-text">Loading appointments...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : filteredAppointments.length > 0 ? (
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Provider</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      {appointment.patient
                        ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                        : "No patient"}
                    </td>
                    <td>{appointment.provider || "N/A"}</td>
                    <td>{appointment.appointmentDate || "N/A"}</td>
                    <td>{appointment.appointmentTime || "N/A"}</td>
                    <td>{appointment.reason || "N/A"}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="table-btn edit-btn"
                          onClick={() => handleEdit(appointment)}
                        >
                          <FaEdit /> Edit
                        </button>

                        <button
                          type="button"
                          className="table-btn delete-btn"
                          onClick={() => handleDeleteClick(appointment._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No appointments found</h3>
            <p>Add a new appointment or try another search.</p>
          </div>
        )}
      </div>

      <EditModal
        title="Edit Appointment"
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        onSubmit={handleEditSubmit}
      >
        <div className="form-group">
          <label>Patient</label>
          <select
            name="patient"
            value={formData.patient}
            onChange={handleChange}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Provider</label>
          <input
            type="text"
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Appointment Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Appointment Time</label>
          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Reason</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked In">Checked In</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="notes-field"
          />
        </div>
      </EditModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this appointment?"
      />
    </div>
  );
}