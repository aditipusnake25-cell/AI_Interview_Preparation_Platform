import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, UserRound } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const pageTitles = {
    "/dashboard": "Overview",
    "/create-interview": "New practice",
    "/mock-interview": "Mock interview",
    "/result": "Session results",
    "/history": "Interview history",
    "/profile": "Your profile"
};

function Navbar({ theme, onThemeToggle, onMenuToggle }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <header className="topbar">
            <button className="icon-button menu-button" onClick={onMenuToggle} aria-label="Open navigation">
                <Menu size={20} />
            </button>
            <div className="topbar-heading">
                <span className="topbar-kicker">MOCKMIND WORKSPACE</span>
                <strong>{pageTitles[pathname] || "Workspace"}</strong>
            </div>
            <div className="topbar-actions">
                <ThemeToggle theme={theme} onToggle={onThemeToggle} />
                <button className="profile-shortcut" onClick={() => navigate("/profile")} aria-label="Open your profile">
                    <UserRound size={17} />
                    <span>Profile</span>
                </button>
                <button
                    className="icon-button logout-control"
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/login");
                    }}
                    aria-label="Sign out"
                    title="Sign out"
                >
                    <LogOut size={17} />
                </button>
            </div>
        </header>
    );
}

export default Navbar;