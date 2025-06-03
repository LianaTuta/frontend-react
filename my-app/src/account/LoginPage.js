import React, { useState } from "react";
import "../styles/forms.css";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../Common/apiService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
  
    try {
      const response = await apiService.request("useraccount/login", "POST", {
        email,
        password,
      });

      if(response.status === 400){
        setError(response.body?.Data?.Message);
      }
      const token = response.body?.Data?.token;
      if (token) {
        localStorage.setItem("bearer", token);
        navigate(-1);
      } else {
        setError("Invalid credentials.");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        {error && <div className="error-message">{error}</div>}

        <div className="login-footer">
          Don’t have an account? <Link to="/create-account">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
