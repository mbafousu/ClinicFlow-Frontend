import { useEffect, useMemo, useState } from "react";
import { FaCalendarPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { apiFetch } from "../api/client";
import "./dashboard.css";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);

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
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await apiFetch("/api/appointments");
      setAppointments(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await apiFetch("/api/patients");
      setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await apiFetch(`/api/appointments/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch("/api/appointments", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }

      resetForm();
      fetchAppointments();
    } catch (error) {
      console.error("Failed to save appointment:", error);
      alert(error.message || "Failed to save appointment");
    }
  };

  const handleEdit = (appointment) => {
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
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });
      fetchAppointments();
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  };

  const filteredAppointments = useMemo(() => {
    const query = searchTerm.toLowerCase();

    return appointments.filter((appointment) => {
      const patientName =
        `${appointment.patient?.firstName || ""} ${appointment.patient?.lastName || ""}`.toLowerCase();

      return (
        patientName.includes(query) ||
        appointment.provider?.toLowerCase().includes(query) ||
        appointment.reason?.toLowerCase().includes(query) ||
        appointment.status?.toLowerCase().includes(query)
      );
    });
  }, [appointments, searchTerm]);

  const getStatusClass = (status) => {
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
  };

  return (
    <div className="dashboard-page">
      <div className="page-hero">
        <div>
          <p className="page-eyebrow">Appointment Management</p>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">
            Schedule, update, and manage patient appointments using real patient records.
          </p>
        </div>

        <div className="hero-badge">
          <FaCalendarPlus />
          {appointments.length} Appointments
        </div>
      </div>

      <section className="patients-toolbar card-shell">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by patient, provider, reason, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <section className="card-shell">
        <div className="section-header">
          <div>
            <h2>{editingId ? "Edit Appointment" : "Add New Appointment"}</h2>
            <p>Create a real appointment linked to a patient record.</p>
          </div>
        </div>

        <form className="patient-form" onSubmit={handleSubmit}>
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

          <input
            type="text"
            name="provider"
            placeholder="Provider Name"
            value={formData.provider}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="reason"
            placeholder="Reason for Appointment"
            value={formData.reason}
            onChange={handleChange}
            required
          />

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

          <textarea
            name="notes"
            placeholder="Optional notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="notes-field"
          />

          <button type="submit" className="primary-btn full-btn">
            {editingId ? "Update Appointment" : "Add Appointment"}
          </button>
        </form>
      </section>

      <section className="card-shell">
        <div className="section-header table-head">
          <div>
            <h2>Appointment Records</h2>
            <p>View all scheduled and completed appointments.</p>
          </div>
          <span className="results-badge">
            Total Results: {filteredAppointments.length}
          </span>
        </div>

        <div className="table-wrap">
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
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      {appointment.patient
                        ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                        : "No patient"}
                    </td>
                    <td>{appointment.provider}</td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.appointmentTime}</td>
                    <td>{appointment.reason}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(appointment.status)}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
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
                          onClick={() => handleDelete(appointment._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <h3>No appointments found</h3>
                      <p>Add a new appointment or try another search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}