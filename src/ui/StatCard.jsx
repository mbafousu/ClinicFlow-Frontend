export default function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-content">
        <h4 className="stat-title">{title}</h4>
        <p className="stat-number">{value}</p>
      </div>
    </div>
  );
}