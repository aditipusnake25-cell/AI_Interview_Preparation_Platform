import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoutes";
import AmbientBackground from "./components/AmbientBackground";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/CreateInterview";
import MockInterview from "./pages/MockInterview";
import InterviewResult from "./pages/InterviewResult";
import History from "./pages/History";
import Profile from "./pages/Profile";

function Workspace({ theme, onThemeToggle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="workspace">
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="workspace-main">
        <Navbar
          theme={theme}
          onThemeToggle={onThemeToggle}
          onMenuToggle={() => setSidebarOpen((open) => !open)}
        />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("mockmind-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("mockmind-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => current === "light" ? "dark" : "light");
  };

  return (
    <>
      <AmbientBackground />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/login"
          element={<Login theme={theme} onThemeToggle={toggleTheme} />}
        />
        <Route
          path="/register"
          element={<Register theme={theme} onThemeToggle={toggleTheme} />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<Workspace theme={theme} onThemeToggle={toggleTheme} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-interview" element={<CreateInterview />} />
            <Route path="/mock-interview" element={<MockInterview />} />
            <Route path="/result" element={<InterviewResult />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;