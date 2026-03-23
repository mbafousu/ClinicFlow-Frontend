import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const today = new Date().toLocaleDateString();

  return (
    <header className="topbar">
      <div>
        <h2 className="topbar-title">ClinicFlow</h2>
        <p className="topbar-subtitle">Healthcare Dashboard</p>
      </div>

      <div className="topbar-right">
        <span className="topbar-date">{today}</span>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        <div className="topbar-avatar">C</div>
      </div>
    </header>
  );
}