import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import FormCard from "../ui/FormCard";
import DataTable from "../ui/DataTable";
import StatusChip from "../ui/StatusChip";

export default function PatientDetails() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPatientDetails() {
      try {
        setLoading(true);
        setError("");

        const patientData = await apiFetch(`/api/patients/${id}`);
        setPatient(patientData);

        try {
          const visitsData = await apiFetch(`/api/visits/patient/${id}`);
          setVisits(Array.isArray(visitsData) ? visitsData : []);
        } catch (visitError) {
          console.error("Visits error:", visitError);
          setVisits([]);
        }
      } catch (err) {
        console.error("Patient error:", err);
        setError("Unable to load patient details.");
        setPatient(null);
        setVisits([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPatientDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="page-section">
        <div className="page-header-block">
          <h1 className="page-title">Patient Details</h1>
          <p className="page-subtitle">Loading patient information</p>
        </div>

        <FormCard>
          <p className="info-text">Loading patient...</p>
        </FormCard>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="page-section">
        <div className="page-header-block">
          <h1 className="page-title">Patient Details</h1>
          <p className="page-subtitle">Unable to display this patient record</p>
        </div>

        <FormCard>
          <p className="error-text">{error || "Patient not found."}</p>
        </FormCard>
      </div>
    );
  }

  const patientName =
    `${patient.firstName || ""} ${patient.lastName || ""}`.trim() ||
    "Unknown Patient";

  const latestVisit = visits.length > 0 ? visits[0] : null;
  const vitals = latestVisit?.vitals || {};

  const visitColumns = ["Date", "Reason", "Status"];

  const visitData = visits.map((visit) => ({
    Date: visit.visitDate
      ? new Date(visit.visitDate).toLocaleDateString()
      : "N/A",
    Reason: visit.reason || "N/A",
    Status: <StatusChip status={visit.status || "scheduled"} />,
  }));

  return (
    <div className="page-section">
      <div className="page-header-block">
        <h1 className="page-title">Patient Details</h1>
        <p className="page-subtitle">
          Review patient profile, vitals, and visit history
        </p>
      </div>

      <div className="patient-summary-grid">
        <FormCard>
          <div className="patient-profile-card">
            <div className="patient-avatar large">
              {(patient.firstName?.[0] || "P").toUpperCase()}
            </div>

            <div className="patient-profile-info">
              <h2 className="section-title">{patientName}</h2>
              <p>
                <strong>Email:</strong> {patient.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {patient.phone || "N/A"}
              </p>
            </div>
          </div>
        </FormCard>
      </div>

      <FormCard>
        <h2 className="section-title">Vitals Summary</h2>

        {latestVisit ? (
          <div className="vitals-grid">
            <div className="vital-box">
              <span className="vital-label">Temperature</span>
              <span className="vital-value">
                {vitals.temperatureC ? `${vitals.temperatureC} °C` : "N/A"}
              </span>
            </div>

            <div className="vital-box">
              <span className="vital-label">Pulse</span>
              <span className="vital-value">
                {vitals.pulse ? `${vitals.pulse} bpm` : "N/A"}
              </span>
            </div>

            <div className="vital-box">
              <span className="vital-label">Respiratory Rate</span>
              <span className="vital-value">
                {vitals.respRate ? `${vitals.respRate} breaths/min` : "N/A"}
              </span>
            </div>

            <div className="vital-box">
              <span className="vital-label">Blood Pressure</span>
              <span className="vital-value">
                {vitals.bpSystolic && vitals.bpDiastolic
                  ? `${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg`
                  : "N/A"}
              </span>
            </div>

            <div className="vital-box">
              <span className="vital-label">Oxygen Saturation</span>
              <span className="vital-value">
                {vitals.spo2 ? `${vitals.spo2}%` : "N/A"}
              </span>
            </div>

            <div className="vital-box">
              <span className="vital-label">Weight</span>
              <span className="vital-value">
                {vitals.weightKg ? `${vitals.weightKg} kg` : "N/A"}
              </span>
            </div>
          </div>
        ) : (
          <p className="info-text">No vitals recorded.</p>
        )}
      </FormCard>

      <FormCard>
        <h2 className="section-title">Clinical Notes</h2>

        {latestVisit?.notes ? (
          <p>{latestVisit.notes}</p>
        ) : (
          <p className="info-text">No notes available.</p>
        )}
      </FormCard>

      <FormCard>
        <h2 className="section-title">Visit History</h2>

        {visitData.length > 0 ? (
          <DataTable columns={visitColumns} data={visitData} />
        ) : (
          <p className="info-text">No visit history.</p>
        )}
      </FormCard>
    </div>
  );
}