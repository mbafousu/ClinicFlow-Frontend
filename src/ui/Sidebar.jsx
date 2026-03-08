import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/patients", label: "Patients", icon: "🧑‍⚕️" },
  { to: "/visits", label: "Visits", icon: "📅" },
  { to: "/drug-lookup", label: "Drug Lookup", icon: "💊" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-badge">CF</div>
        <div>
          <h2>ClinicFlow</h2>
          <p>Healthcare System</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>ClinicFlow Capstone</p>
      </div>
    </aside>
  );
}