import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">🩸 BloodCare</div>

      <ul className="nav-links">
        <li><Link to="/">🏠 Home</Link></li>
        <li><Link to="/donors">🔍 Find Donors</Link></li>
        <li><Link to="/request">🩸 Request Blood</Link></li>

        {userEmail ? (
          <li className="account">
            <span onClick={() => setOpen(!open)}>👤 Account</span>

            {open && (
              <div className="dropdown">
                <Link to="/dashboard">📊 Dashboard</Link>
                <Link to="/profile">🙍 Profile</Link>
                <Link to="/become-donor">🩸 Become Donor</Link>

                <button onClick={logout}>🚪 Logout</button>
              </div>
            )}
          </li>
        ) : (
          <>
            <li><Link to="/register">📝 Register</Link></li>
            <li><Link to="/login">🔐 Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
