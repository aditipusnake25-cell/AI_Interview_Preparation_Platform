import { NavLink } from "react-router-dom";
import {
  CircleHelp,
  History,
  LayoutDashboard,
  Plus,
  UserRound
} from "lucide-react";
import BrandLogo from "./BrandLogo";

const links = [
  { to: "/dashboard", label: "Overview", icon: <LayoutDashboard size={18} strokeWidth={1.8} />, end: true },
  { to: "/create-interview", label: "New practice", icon: <Plus size={18} strokeWidth={1.8} /> },
  { to: "/history", label: "Interview history", icon: <History size={18} strokeWidth={1.8} /> },
  { to: "/profile", label: "Your profile", icon: <UserRound size={18} strokeWidth={1.8} /> }
];

function Sidebar({ open, onNavigate }) {
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  return (
    <aside className={`sidebar${open ? " sidebar-open" : ""}`}>
      <BrandLogo to="/dashboard" className="sidebar-brand" onClick={onNavigate} />

      <div className="sidebar-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {links.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            onClick={onNavigate}
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-coach-card">
        <span className="coach-icon"><CircleHelp size={18} /></span>
        <strong>Practice with purpose</strong>
        <p>Every thoughtful answer moves you forward.</p>
        <NavLink to="/create-interview" onClick={onNavigate}>
          Start a session <Plus size={14} />
        </NavLink>
      </div>

      <div className="sidebar-user">
        <span className="avatar">{(user.name || "M").trim().charAt(0).toUpperCase()}</span>
        <span className="sidebar-user-copy">
          <strong>{user.name || "Your account"}</strong>
          <small>{user.email || "Interview candidate"}</small>
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;