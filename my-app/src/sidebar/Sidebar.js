import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "../sidebar/SideBarLayout.css";


const SidebarLayout = () => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.clear(); // or your custom logout logic
      navigate("/login");
    };
  
    return (
      <div className="sidebar-layout">
        <aside className="sidebar">
          <div className="sidebar-top">
            <h2 className="sidebar-title">Menu</h2>
            <ul className="sidebar-menu">
              <li><Link to="/my-orders">My Orders</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/history">History</Link></li>
              <li><Link to="/account">My Account</Link></li>
            </ul>
          </div>
          <div className="sidebar-bottom">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </aside>
  
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    );
  };
  
  export default SidebarLayout;
