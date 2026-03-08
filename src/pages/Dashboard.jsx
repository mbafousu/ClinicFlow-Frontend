import AppShell from "../ui/AppShell";
import PageHeader from "../ui/PageHeader";
import StatCard from "../ui/StatCard";

export default function Dashboard() {
  return (
    <AppShell>
      <PageHeader title="Dashboard" />

      <div className="stats-grid">
        <StatCard title="Total Patients" value="124" />
        <StatCard title="Visits Today" value="18" />
        <StatCard title="Active Cases" value="42" />
        <StatCard title="Drug Searches" value="67" />
      </div>
    </AppShell>
  );
}