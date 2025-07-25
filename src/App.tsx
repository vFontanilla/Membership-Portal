import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PortalDashboard from "./components/portal_dashboard";
import Login from "./components/loginpage";
import Signup from "./components/signuppage";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Redirect root path */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* Public routes (Login and Signup) */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
        />

        {/* Protected route (Dashboard) */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <PortalDashboard /> : <Navigate to="/login" />}
        />

        {/* Fallback route (optional) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
