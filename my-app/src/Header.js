import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // For routing links
import "./Header.css"; // Import the updated header styling

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const bearer = localStorage.getItem("bearer");
    if (bearer) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("isLoggedIn"); // Remove login status
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true"); // Set login status
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>My App</h1>
      </div>

      <nav className="nav">
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/all-events">Events</Link>
          </li>
          <li>
            <Link to="/create-event">Create Event</Link>
          </li>
        </ul>
      </nav>

      <div className="auth">
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
        <button className="logout-btn">Logout</button>
      </div>
    </header>
  );
};

export default Header;
