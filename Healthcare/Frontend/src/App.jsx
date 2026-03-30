import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import AddPrescription from "./pages/doctor/AddPrescriptions";

import PatientDashboard from "./pages/patient/PatientDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import MyAppointments from "./pages/patient/MyAppointments";
import ViewPrescription from "./pages/patient/ViewPrescriptions";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          } />

          {/* Doctor */}
          <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor/profile" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorProfile />
            </ProtectedRoute>
          } />
          <Route path="/doctor/appointments" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorAppointments />
            </ProtectedRoute>
          } />
          <Route path="/doctor/prescriptions/add" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <AddPrescription />
            </ProtectedRoute>
          } />

          {/* Patient */}
          <Route path="/patient" element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/book" element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <BookAppointment />
            </ProtectedRoute>
          } />
          <Route path="/patient/appointments" element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <MyAppointments />
            </ProtectedRoute>
          } />
          <Route path="/patient/prescription/:appointmentId" element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <ViewPrescription />
            </ProtectedRoute>
          } />

          <Route path="/unauthorized" element={<h2 style={{textAlign:"center", marginTop:"4rem"}}>⛔ Unauthorized</h2>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}