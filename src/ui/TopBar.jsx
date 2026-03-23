import { useLocation, useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const today = new Date().toLocaleDateString();

  const pageTitles = {
    "/": "Dashboard",
    "/patients": "Patients",
    "/appointments": "Appointments",
    "/visits": "Visits",
    "/drug-lookup": "Drug Lookup",
  };

  const currentTitle = pageTitles[location.pathname] || "ClinicFlow";

  return (
    <header className="topbar">
      <div>
        <h2 className="topbar-title">{currentTitle}</h2>
        <p className="topbar-subtitle">ClinicFlow Healthcare System</p>
      </div>

      <div className="topbar-right">
        <span className="topbar-date">{today}</span>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        <div className="topbar-avatar">C</div>
      </div>
    </header>
  );
}
