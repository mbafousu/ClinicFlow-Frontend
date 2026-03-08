import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">ClinicFlow</div>

      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/visits">Visits</Link>
        <Link to="/druglookup">Drug Lookup</Link>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}