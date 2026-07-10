import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./styles/AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  return (
    <div className="admin-wrapper">

      <aside className="admin-sidebar">

        <h2 className="admin-logo">🩸 BloodCare</h2>

        <nav className="admin-menu">

          <NavLink to="/admin" end className="admin-link">
            📊 Dashboard
          </NavLink>

          <NavLink to="/admin/users" className="admin-link">
            👤 Users
          </NavLink>

          <NavLink to="/admin/donors" className="admin-link">
            🩸 Donors
          </NavLink>

          <NavLink to="/admin/blood-requests" className="admin-link">
            📩 Blood Requests
          </NavLink>
        
        <NavLink to="/admin/hospitals" className="admin-link">
           🏥 Hospitals
           </NavLink>
          
          

        </nav>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </aside>

      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;