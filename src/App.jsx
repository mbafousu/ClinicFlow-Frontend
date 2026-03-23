import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import PatientDetails from "./pages/PatientDetails";
import Visits from "./pages/Visits";
import DrugLookup from "./pages/DrugLookup";

export default function App() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <>
      {isLoggedIn && location.pathname !== "/login" && <Navbar />}

      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
  path="/appointments"
  element={
    <ProtectedRoute>
      <Appointments />
    </ProtectedRoute>
  }
/>

        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute>
              <PatientDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/visits"
          element={
            <ProtectedRoute>
              <Visits />
            </ProtectedRoute>
          }
        />

        <Route
          path="/druglookup"
          element={
            <ProtectedRoute>
              <DrugLookup />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
      </Routes>

      <ToastContainer />
    </>
  );
}