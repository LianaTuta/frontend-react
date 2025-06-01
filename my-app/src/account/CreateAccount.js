import React, { useState } from "react";
import "../styles/forms.css"; 
import { useNavigate, Link } from "react-router-dom";
import apiService from "../Common/apiService";
import { Roles } from "../constants/roleEnum";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const CreateAccount = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState({});

  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    const errors = {
      firstName: !firstName,
      lastName: !lastName,
      email: !email,
      password: !password,
      birthDate: !birthDate,
    };

    setFormError(errors);

    if (Object.values(errors).some(Boolean)) {
      setMessage("First name, last name, email, password, and birthdate are required.");
      return;
    }

    const newUser = {
      firstName,
      middleName,
      lastName,
      birthDate: birthDate?.toISOString().split("T")[0],
      email,
      password,
      roleid: Roles.CUSTOMER,
    };

    try {
      const response = await apiService.request(
        "useraccount/create-account",
        "POST",
        newUser,
        { "Content-Type": "application/json" }
      );

      if (response.status === 200) {
        setMessage("Account created successfully!");
        navigate("/login");
      } else {
        setMessage(response.message || "Failed to create account.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error creating account. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create Account</h2>

        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Middle Name (Optional)</label>
          <input
            type="text"
            placeholder="Middle Name"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Birth Date</label>
          <DatePicker
            selected={birthDate}
            onChange={(date) => setBirthDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select your birth date"
            maxDate={new Date()}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="button" className="login-btn" onClick={handleCreateAccount}>
          Sign Up
        </button>

        {message && <div className="error-message">{message}</div>}

        <div className="login-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
