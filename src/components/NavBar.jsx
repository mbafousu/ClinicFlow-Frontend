import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserInjured,
  FaCalendarAlt,
  FaNotesMedical,
  FaCapsules,
  FaSignOutAlt,
} from "react-icons/fa";

import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">ClinicFlow</div>

      <div className="navbar-links">
        <Link to="/" className={isActive("/") ? "active" : ""}>
          <FaTachometerAlt /> Dashboard
        </Link>

        <Link to="/patients" className={isActive("/patients") ? "active" : ""}>
          <FaUserInjured /> Patients
        </Link>

        <Link
          to="/appointments"
          className={isActive("/appointments") ? "active" : ""}
        >
          <FaCalendarAlt /> Appointments
        </Link>

        <Link to="/visits" className={isActive("/visits") ? "active" : ""}>
          <FaNotesMedical /> Visits
        </Link>

        <Link
          to="/druglookup"
          className={isActive("/druglookup") ? "active" : ""}
        >
          <FaCapsules /> Drug Lookup
        </Link>

        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
}