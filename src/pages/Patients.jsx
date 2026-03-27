import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";
import SearchBar from "../ui/SearchBar";
import DataTable from "../ui/DataTable";
import FormCard from "../ui/FormCard";
import EditModal from "../ui/EditModal";

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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await apiFetch("/api/patients");
        setPatients(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load patients");
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const value = searchTerm.toLowerCase();
    return patients.filter((p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(value)
    );
  }, [patients, searchTerm]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddPatient(e) {
    e.preventDefault();

    const newPatient = await apiFetch("/api/patients", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    setPatients((prev) => [newPatient, ...prev]);
    setFormData({ firstName: "", lastName: "", email: "", phone: "" });
  }

  function handleEditPatient(id) {
    const p = patients.find((x) => x._id === id);
    if (!p) return;

    setEditingPatientId(id);
    setEditFormData(p);
    setIsEditModalOpen(true);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();

    const updated = await apiFetch(`/api/patients/${editingPatientId}`, {
      method: "PUT",
      body: JSON.stringify(editFormData),
    });

    setPatients((prev) =>
      prev.map((p) => (p._id === editingPatientId ? updated : p))
    );

    setIsEditModalOpen(false);
  }

  async function handleDeletePatient(id) {
    await apiFetch(`/api/patients/${id}`, { method: "DELETE" });
    setPatients((prev) => prev.filter((p) => p._id !== id));
  }

  const columns = ["Name", "Email", "Phone", "Actions"];

  const rows = filteredPatients.map((p) => ({
  Name: `${p.firstName} ${p.lastName}`,
  Email: p.email,
  Phone: p.phone,
  Actions: (
    <div className="table-actions">
      <Link to={`/patients/${p._id}`} className="table-btn view-btn">
        View
      </Link>
      <button onClick={() => handleEditPatient(p._id)} className="table-btn edit-btn">
        Edit
      </button>
      <button onClick={() => handleDeletePatient(p._id)} className="table-btn delete-btn">
        Delete
      </button>
    </div>
  ),
}));
    

  return (
    <div className="page-section">
      <div className="page-header-block">
        <h1 className="page-title">Patients</h1>
      </div>

      <FormCard>
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </FormCard>

      <FormCard>
        <form onSubmit={handleAddPatient} className="patient-form">
          <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleFormChange} />
          <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleFormChange} />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleFormChange} />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleFormChange} />
          <button className="primary-btn">Add</button>
        </form>
      </FormCard>

      <FormCard>
        {loading ? <p>Loading...</p> : <DataTable columns={columns} data={rows} />}
      </FormCard>

      <EditModal
        title="Edit Patient"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
      >
        <input name="firstName" value={editFormData.firstName} onChange={(e)=>setEditFormData({...editFormData, firstName:e.target.value})} />
        <input name="lastName" value={editFormData.lastName} onChange={(e)=>setEditFormData({...editFormData, lastName:e.target.value})} />
        <input name="email" value={editFormData.email} onChange={(e)=>setEditFormData({...editFormData, email:e.target.value})} />
        <input name="phone" value={editFormData.phone} onChange={(e)=>setEditFormData({...editFormData, phone:e.target.value})} />
      </EditModal>
    </div>
  );
}