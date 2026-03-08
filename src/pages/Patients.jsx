import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../ui/AppShell";
import PageHeader from "../ui/PageHeader";
import SearchBar from "../ui/SearchBar";
import DataTable from "../ui/DataTable";
import StatusChip from "../ui/StatusChip";
import FormCard from "../ui/FormCard";

const initialPatients = [
  {
    id: 1,
    name: "John Doe",
    age: 35,
    gender: "Male",
    phone: "555-1234",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 29,
    gender: "Female",
    phone: "555-5678",
    status: "Pending",
  },
  {
    id: 3,
    name: "Michael Brown",
    age: 41,
    gender: "Male",
    phone: "555-9012",
    status: "Discharged",
  },
];

export default function Patients() {
  const [patients, setPatients] = useState(initialPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    status: "Active",
  });

  const filteredPatients = useMemo(() => {
    const value = searchTerm.toLowerCase();

    return patients.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(value) ||
        patient.gender.toLowerCase().includes(value) ||
        patient.phone.toLowerCase().includes(value) ||
        patient.status.toLowerCase().includes(value)
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

  function handleAddPatient(event) {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.age.trim() ||
      !formData.gender.trim() ||
      !formData.phone.trim()
    ) {
      alert("Please fill in all patient fields.");
      return;
    }

    const newPatient = {
      id: Date.now(),
      name: formData.name.trim(),
      age: formData.age.trim(),
      gender: formData.gender.trim(),
      phone: formData.phone.trim(),
      status: formData.status,
    };

    setPatients((prev) => [newPatient, ...prev]);

    setFormData({
      name: "",
      age: "",
      gender: "",
      phone: "",
      status: "Active",
    });
  }

  function handleDeletePatient(id) {
    const confirmed = window.confirm("Delete this patient?");
    if (!confirmed) return;

    setPatients((prev) => prev.filter((patient) => patient.id !== id));
  }

  function handleEditPatient(id) {
    const patientToEdit = patients.find((patient) => patient.id === id);
    if (!patientToEdit) return;

    const updatedName = prompt("Edit patient name:", patientToEdit.name);
    if (!updatedName) return;

    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id
          ? { ...patient, name: updatedName.trim() || patient.name }
          : patient
      )
    );
  }

  const columns = ["Name", "Age", "Gender", "Phone", "Status", "Actions"];

  const tableRows = filteredPatients.map((patient) => ({
    Name: patient.name,
    Age: patient.age,
    Gender: patient.gender,
    Phone: patient.phone,
    Status: <StatusChip status={patient.status} />,
    Actions: (
      <div className="table-actions">
        <Link to={`/patients/${patient.id}`} className="table-btn view-btn">
          View Details
        </Link>

        <button
          className="table-btn edit-btn"
          onClick={() => handleEditPatient(patient.id)}
        >
          Edit
        </button>

        <button
          className="table-btn delete-btn"
          onClick={() => handleDeletePatient(patient.id)}
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
              placeholder="Search patients by name, gender, phone, or status..."
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
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleFormChange}
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleFormChange}
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleFormChange}
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleFormChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Discharged">Discharged</option>
            </select>

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

          <DataTable columns={columns} data={tableRows} />
        </FormCard>
      </div>
    </AppShell>
  );
}