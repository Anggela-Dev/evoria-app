import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./TabBar.css";

function AdminTabBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Yakin ingin logout?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav className="tabbar">
      <NavLink to="/admin/events" className="tab-item">
        🗓️ <span>Kelola Event</span>
      </NavLink>
      <NavLink to="/dashboard" className="tab-item">
        📸 <span>Scan QR</span>
      </NavLink>
      <button onClick={handleLogout} className="tab-item btn-logout">
        🚪 <span>Logout</span>
      </button>
    </nav>
  );
}

export default AdminTabBar;
