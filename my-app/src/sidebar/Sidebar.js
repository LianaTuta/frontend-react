import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "../sidebar/SideBarLayout.css";
import Header from "./Header";
import { jwtDecode } from "jwt-decode";
import AuthHelper from "../Common/authHelper"; 
import { Roles } from "../constants/roleEnum";


const SidebarLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isManager, setIsManager] = useState(false);

  const isLoggedIn = AuthHelper.isLoggedIn();


  useEffect(() => {
    const loggedIn = AuthHelper.isLoggedIn();
    const hasManagerRole = AuthHelper.hasRole(Roles.MANAGER);
    setIsManager(loggedIn && hasManagerRole);
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`sidebar-layout ${collapsed ? "collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Menu</h2>
            <button className="close-sidebar-button" onClick={toggleSidebar}>✕</button>
          </div>
          <ul className="sidebar-menu">
          {!isManager && (
              <li>
                <Link to="/my-orders" onClick={toggleSidebar}>
                  My Orders
                </Link>
              </li>
            )}
            <li><Link to="/all-events" onClick={toggleSidebar}>Events</Link></li>
            {isManager && (
              <li>
                <Link to="/configure-event" onClick={toggleSidebar}>
                  Configure Events
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="sidebar-bottom">
        {isLoggedIn ? (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" className="logout-button">Login</Link>
        )}
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
