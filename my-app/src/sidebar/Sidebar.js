import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "../sidebar/SideBarLayout.css";
import Header from "./Header";

const SidebarLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    console.log(collapsed);
    setCollapsed((prev) => !prev);
    console.log("here");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`sidebar-layout ${collapsed ? "collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2 className="sidebar-title">Menu</h2>
          <ul className="sidebar-menu">
            <li><Link to="/my-orders" onClick={toggleSidebar}>My Orders</Link></li>
            <li><Link to="/all-events" onClick={toggleSidebar}>Events</Link></li>
            <li><Link to="/history" onClick={toggleSidebar}>History</Link></li>
            <li><Link to="/account" onClick={toggleSidebar}>My Account</Link></li>
          </ul>
        </div>
        <div className="sidebar-bottom">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className="main-area">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
