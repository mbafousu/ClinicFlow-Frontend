import AppShell from "../ui/AppShell";
import PageHeader from "../ui/PageHeader";
import FormCard from "../ui/FormCard";
import DataTable from "../ui/DataTable";
import StatusChip from "../ui/StatusChip";

export default function PatientDetails() {
  const patient = {
    id: 1,
    name: "John Doe",
    age: 35,
    gender: "Male",
    phone: "555-1234",
    email: "johndoe@email.com",
    address: "123 Main Street, Newark, NJ",
    status: "Active",
    bloodType: "O+",
    allergies: "Penicillin",
    emergencyContact: "Jane Doe - 555-9999",
  };

  const vitals = {
    bloodPressure: "120/80 mmHg",
    pulse: "76 bpm",
    temperature: "98.6°F",
    respiratoryRate: "16 breaths/min",
    oxygenSaturation: "98%",
    weight: "178 lbs",
    height: "5'10\"",
  };

  const visitColumns = ["Date", "Reason", "Provider", "Status"];

  const visitData = [
    {
      Date: "2026-03-01",
      Reason: "Routine Checkup",
      Provider: "Dr. Williams",
      Status: <StatusChip status="Completed" />,
    },
    {
      Date: "2026-02-15",
      Reason: "Blood Pressure Review",
      Provider: "Dr. Lee",
      Status: <StatusChip status="Pending" />,
    },
    {
      Date: "2026-01-28",
      Reason: "Follow-up Visit",
      Provider: "Dr. Brown",
      Status: <StatusChip status="Completed" />,
    },
  ];

  return (
    <AppShell>
      <PageHeader title="Patient Details" />

      <div className="patient-details-page">
        <div className="patient-details-grid">
          <FormCard>
            <div className="patient-profile-card">
              <div className="patient-avatar">
                {patient.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>

              <div className="patient-profile-info">
                <h2>{patient.name}</h2>
                <p>
                  <strong>Status:</strong> <StatusChip status={patient.status} />
                </p>
                <p>
                  <strong>Age:</strong> {patient.age}
                </p>
                <p>
                  <strong>Gender:</strong> {patient.gender}
                </p>
                <p>
                  <strong>Blood Type:</strong> {patient.bloodType}
                </p>
              </div>
            </div>
          </FormCard>

          <FormCard>
            <h2 className="section-title">Contact Information</h2>

            <div className="details-list">
              <p>
                <strong>Phone:</strong> {patient.phone}
              </p>
              <p>
                <strong>Email:</strong> {patient.email}
              </p>
              <p>
                <strong>Address:</strong> {patient.address}
              </p>
              <p>
                <strong>Emergency Contact:</strong> {patient.emergencyContact}
              </p>
              <p>
                <strong>Allergies:</strong> {patient.allergies}
              </p>
            </div>
          </FormCard>
        </div>

        <FormCard>
          <h2 className="section-title">Vitals Summary</h2>

          <div className="vitals-grid">
            <div className="vital-box">
              <span className="vital-label">Blood Pressure</span>
              <span className="vital-value">{vitals.bloodPressure}</span>
            </div>

            <div className="vital-box">
              <span className="vital-label">Pulse</span>
              <span className="vital-value">{vitals.pulse}</span>
            </div>

            <div className="vital-box">
              <span className="vital-label">Temperature</span>
              <span className="vital-value">{vitals.temperature}</span>
            </div>

            <div className="vital-box">
              <span className="vital-label">Respiratory Rate</span>
              <span className="vital-value">{vitals.respiratoryRate}</span>
            </div>

            <div className="vital-box">
              <span className="vital-label">Oxygen Saturation</span>
              <span className="vital-value">{vitals.oxygenSaturation}</span>
            </div>

            <div className="vital-box">
              <span className="vital-label">Weight</span>
              <span className="vital-value">{vitals.weight}</span>
            </div>

            <div className="vital-box">
              <span className="vital-label">Height</span>
              <span className="vital-value">{vitals.height}</span>
            </div>
          </div>
        </FormCard>

        <FormCard>
          <div className="patients-table-header">
            <h2 className="section-title">Visit History</h2>
            <p className="section-subtitle">Recent patient visits</p>
          </div>

          <DataTable columns={visitColumns} data={visitData} />
        </FormCard>
      </div>
    </AppShell>
  );
}