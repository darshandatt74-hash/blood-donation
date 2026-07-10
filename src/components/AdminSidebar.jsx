import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("isAdmin"); // 🔴 IMPORTANT
    navigate("/admin-login");
  };

  return (
    <div className="admin-sidebar">
      <h2 className="admin-logo">🩸 Admin Panel</h2>

      <NavLink to="/admin-dashboard" className="nav-item">
        Dashboard
      </NavLink>

      <NavLink to="/admin-users" className="nav-item">
        Users
      </NavLink>

      <NavLink to="/admin-donors" className="nav-item">
        Donors
      </NavLink>

      {/* ✅ FIXED ROUTE */}
      <NavLink to="/admin-blood-requests" className="nav-item">
        Blood Requests
      </NavLink>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
