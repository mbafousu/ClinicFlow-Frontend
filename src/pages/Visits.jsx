import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/client";
import DataTable from "../ui/DataTable";
import FormCard from "../ui/FormCard";
import SearchBar from "../ui/SearchBar";
import StatusChip from "../ui/StatusChip";
import EditModal from "../ui/EditModal";

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVisitId, setEditingVisitId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    patient: "",
    visitDate: "",
    reason: "",
    status: "scheduled",
  });

  useEffect(() => {
    async function load() {
      const [v, p] = await Promise.all([
        apiFetch("/api/visits"),
        apiFetch("/api/patients"),
      ]);
      setVisits(v);
      setPatients(p);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return visits.filter((v) =>
      v.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [visits, searchTerm]);

  function handleEdit(id) {
    const v = visits.find((x) => x._id === id);
    setEditingVisitId(id);
    setEditFormData({
      ...v,
      patient: v.patient?._id || "",
      visitDate: v.visitDate?.split("T")[0],
    });
    setIsEditModalOpen(true);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();

    await apiFetch(`/api/visits/${editingVisitId}`, {
      method: "PUT",
      body: JSON.stringify(editFormData),
    });

    const refreshed = await apiFetch("/api/visits");
    setVisits(refreshed);
    setIsEditModalOpen(false);
  }

  const columns = ["Patient", "Date", "Reason", "Status", "Actions"];

  const rows = filtered.map((v) => ({
    Patient: `${v.patient?.firstName || ""} ${v.patient?.lastName || ""}`,
    Date: new Date(v.visitDate).toLocaleDateString(),
    Reason: v.reason,
    Status: <StatusChip status={v.status} />,
    Actions: (
      <button className="table-btn edit-btn" onClick={() => handleEdit(v._id)}>
        Edit
      </button>
    ),
  }));

  return (
    <div className="page-section">
      <div className="page-header-block">
        <h1 className="page-title">Visits</h1>
      </div>

      <FormCard>
        <SearchBar value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
      </FormCard>

      <FormCard>
        <DataTable columns={columns} data={rows} />
      </FormCard>

      <EditModal
        title="Edit Visit"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
      >
        <select value={editFormData.patient} onChange={(e)=>setEditFormData({...editFormData, patient:e.target.value})}>
          {patients.map(p => (
            <option key={p._id} value={p._id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>

        <input type="date" value={editFormData.visitDate} onChange={(e)=>setEditFormData({...editFormData, visitDate:e.target.value})} />

        <input value={editFormData.reason} onChange={(e)=>setEditFormData({...editFormData, reason:e.target.value})} />

        <select value={editFormData.status} onChange={(e)=>setEditFormData({...editFormData, status:e.target.value})}>
          <option value="scheduled">Scheduled</option>
          <option value="checked_in">Checked In</option>
          <option value="completed">Completed</option>
        </select>
      </EditModal>
    </div>
  );
}