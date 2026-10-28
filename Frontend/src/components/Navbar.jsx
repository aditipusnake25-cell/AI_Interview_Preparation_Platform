import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    BrainCircuit,
    LogOut,
    LayoutDashboard,
    History,
    PlusCircle
} from "lucide-react";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="navbar">
            <Link to={token ? "/dashboard" : "/login"} className="brand">
                <span className="brand-icon">
                    <BrainCircuit size={24} />
                </span>
                <span>
                    Mock<span className="brand-ai">Mind</span>
                </span>
            </Link>

            {token ? (
                <nav className="nav-links">
                    <NavLink to="/dashboard">
                        <LayoutDashboard size={17} /> Dashboard
                    </NavLink>

                    <NavLink to="/create-interview">
                        <PlusCircle size={17} /> Practice
                    </NavLink>

                    <NavLink to="/history">
                        <History size={17} /> History
                    </NavLink>

                    <button className="logout-button" onClick={logout}>
                        <LogOut size={17} /> Logout
                    </button>
                </nav>
            ) : (
                <nav className="nav-links">
                    <NavLink to="/login">Login</NavLink>
                    <Link to="/register" className="nav-cta">
                        Get Started
                    </Link>
                </nav>
            )}
        </header>
    );
}

export default Navbar;