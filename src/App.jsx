import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./ui/Sidebar";
import Topbar from "./ui/TopBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import PatientDetails from "./pages/PatientDetails";
import Visits from "./pages/Visits";
import DrugLookup from "./pages/DrugLookup";
import "./styles/layout.css";

export default function App() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  //  only show login page
  if (!isLoggedIn) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer />
      </>
    );
  }

  // Logged in layout 
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Topbar />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
            <Route path="/visits" element={<Visits />} />
            <Route path="/drug-lookup" element={<DrugLookup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}