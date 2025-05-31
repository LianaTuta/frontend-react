import React, { useState } from "react";
import "../styles/forms.css";
import { useNavigate, Link } from "react-router-dom";
import apiService from "../Common/apiService.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const model = { email, password };
    try {
      const response = await apiService.request("useraccount/login", "POST", model);
      const token = response.body.Data.token;
      if (token) {
        localStorage.setItem("bearer", token);
        navigate("/all-events");
      } else {
        setError("Invalid login credentials.");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Login</h2>
        <form className="create-account-form">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-button-row">
            <button type="button" onClick={handleLogin} className="submit-btn">
              Login
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
          <p className="account-link">
            Don’t have an account?{" "}
            <Link to="/create-account" className="text-link">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
