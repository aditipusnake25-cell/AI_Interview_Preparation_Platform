import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/CreateInterview";
import MockInterview from "./pages/MockInterview";
import InterviewResult from "./pages/InterviewResult";
import History from "./pages/History";

function App() {
  return (
    <>
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-interview" element={<CreateInterview />} />
            <Route path="/mock-interview" element={<MockInterview />} />
            <Route path="/result" element={<InterviewResult />} />
            <Route path="/history" element={<History />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;