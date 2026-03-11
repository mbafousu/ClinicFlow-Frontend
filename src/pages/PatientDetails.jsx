import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import AppShell from "../ui/AppShell";
import PageHeader from "../ui/PageHeader";
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
      <AppShell>
        <PageHeader title="Patient Details" />
        <p className="info-text">Loading patient...</p>
      </AppShell>
    );
  }

  if (error || !patient) {
    return (
      <AppShell>
        <PageHeader title="Patient Details" />
        <p className="error-text">{error || "Patient not found."}</p>
      </AppShell>
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
    <AppShell>
      <PageHeader title="Patient Details" />

      <div className="patient-details-page">
        <div className="patient-details-grid">
          <FormCard>
            <h2>{patientName}</h2>
            <p>
              <strong>Email:</strong> {patient.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {patient.phone || "N/A"}
            </p>
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
    </AppShell>
  );
}