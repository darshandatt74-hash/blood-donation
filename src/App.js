import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

/* USER PAGES */
import Home from "./pages/Home";
import Register from "./pages/RegisterUser";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import BecomeDonor from "./pages/BecomeDonor";
import DonorSearch from "./pages/DonorSearch";
import RequestBlood from "./pages/RequestBlood";

/* ADMIN PAGES */
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminDonors from "./admin/AdminDonors";
import AdminBloodRequests from "./admin/AdminBloodRequests";
import AdminHospitals from "./admin/AdminHospitals"

/* 🔐 ADMIN PROTECT (FIXED) */
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin");
  return isAdmin === "true" ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= USER ROUTES ================= */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        <Route path="/profile" element={<><Navbar /><UserProfile /></>} />
        <Route path="/become-donor" element={<><Navbar /><BecomeDonor /></>} />
        <Route path="/donors" element={<><Navbar /><DonorSearch /></>} />
        <Route path="/request" element={<><Navbar /><RequestBlood /></>} />

        {/* ================= ADMIN LOGIN ================= */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ================= ADMIN PANEL ================= */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="donors" element={<AdminDonors />} />
          <Route path="blood-requests" element={<AdminBloodRequests />} />
          <Route path="hospitals" element={<AdminHospitals />} />

        </Route>
           
        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
