import React from "react";
import { NavLink } from "react-router-dom";
import "./TabBar.css";

function AdminTabBar({ setUser }) {
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="tabbar">
      <NavLink to="/admin" className="tab-item">
        🏠 <span>Dashboard</span>
      </NavLink>
      <NavLink to="/admin/events" className="tab-item">
        📅 <span>Events</span>
      </NavLink>
      <button
        onClick={handleLogout}
        className="tab-item btn text-danger fw-semibold"
        style={{ border: "none", background: "transparent" }}
      >
        🚪 <span>Logout</span>
      </button>
    </nav>
  );
}

export default AdminTabBar;
