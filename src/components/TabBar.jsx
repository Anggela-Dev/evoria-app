import React from "react";
import { NavLink } from "react-router-dom";
import "./TabBar.css";

function TabBar() {
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
    </nav>
  );
}

export default TabBar;
