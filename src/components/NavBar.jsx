import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="nav">
      <Link to="/">Dashboard</Link>
      <Link to="/patients">Patients</Link>
      <Link to="/visits">Visits</Link>

      <div className="spacer" />

      {token ? (
        <button className="linkBtn" onClick={logout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}