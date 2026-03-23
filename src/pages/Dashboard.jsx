import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import StatCard from "../ui/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    visitsToday: 0,
    activeCases: 0,
    drugSearches: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const [patients, visits] = await Promise.all([
          apiFetch("/api/patients"),
          apiFetch("/api/visits"),
        ]);

        const today = new Date().toDateString();

        const visitsToday = visits.filter(
          (visit) =>
            visit.visitDate &&
            new Date(visit.visitDate).toDateString() === today
        ).length;

        const activeCases = visits.filter(
          (visit) =>
            visit.status === "checked_in" || visit.status === "in_progress"
        ).length;

        setStats({
          patients: patients.length,
          visitsToday,
          activeCases,
          drugSearches: Number(localStorage.getItem("drugSearchCount") || 0),
        });
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="page-section">
      <div className="page-header-block">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Overview of patients, visits, and activity in ClinicFlow
        </p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Patients"
          value={loading ? "..." : stats.patients}
        />

        <StatCard
          title="Visits Today"
          value={loading ? "..." : stats.visitsToday}
        />

        <StatCard
          title="Active Cases"
          value={loading ? "..." : stats.activeCases}
        />

        <StatCard
          title="Drug Searches"
          value={loading ? "..." : stats.drugSearches}
        />
      </div>
    </div>
  );
}