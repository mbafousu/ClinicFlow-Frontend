export default function TopBar() {
  const today = new Date().toLocaleDateString();

  return (
    <header className="topbar">
      <div>
        <h3 className="topbar-title">ClinicFlow Dashboard</h3>
        <p className="topbar-subtitle">
          Manage patients, visits, and medication data
        </p>
      </div>

      <div className="topbar-right">
        <span className="topbar-date">{today}</span>
        <div className="topbar-user">C</div>
      </div>
    </header>
  );
}