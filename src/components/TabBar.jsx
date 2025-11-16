import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./TabBar.css";

function TabBar({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // 🔥 trigger re-render supaya tab hilang
    navigate("/login");
  };

  return (
    <nav className="tabbar">
      <NavLink to="/" className="tab-item">
        🏠 <span>Home</span>
      </NavLink>

      <NavLink to="/myevents" className="tab-item">
        📅 <span>My Events</span>
      </NavLink>

      <NavLink to="/profile" className="tab-item">
        👤 <span>Profile</span>
      </NavLink>

      <button onClick={handleLogout} className="tab-item btn-logout">
        🚪 <span>Logout</span>
      </button>
    </nav>
  );
}

export default TabBar;
