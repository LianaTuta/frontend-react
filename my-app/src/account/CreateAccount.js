import React, { useState } from "react";
import "../styles/forms.css"; 
import { useNavigate, Link } from "react-router-dom";
import apiService from "../Common/apiService";
import { Roles } from "../constants/roleEnum";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

const validatePassword = (password) => {
  const minLength = 8;
  if (password.length < minLength) return `Password must be at least ${minLength} characters.`;
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include at least one number.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must include at least one special character.";
  return null; 
};

const CreateAccount = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState({});
    const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const today = new Date();
  const sixteenYearsAgo = new Date(
    today.getFullYear() - 16,
    today.getMonth(),
    today.getDate()
  );

  const handleCreateAccount = async () => {
    const passwordError = validatePassword(password);
    const errors = {
      firstName: !firstName,
      lastName: !lastName,
      email: !email,
      password: !password || passwordError,
      birthDate: !birthDate,
    };
  
    setFormError(errors);
  
    const missingFields = [];
    if (!firstName) missingFields.push("First name");
    if (!lastName) missingFields.push("Last name");
    if (!email) missingFields.push("Email");
    if (!password) missingFields.push("Password");
    if (!birthDate) missingFields.push("Birthdate");
  
    if (missingFields.length > 0) {
      const errorMessage = missingFields.join(", ") + " " + (missingFields.length === 1 ? "is" : "are") + " required.";
      setMessage(errorMessage);
      return;
    }

    if (Object.values(errors).some(Boolean)) {
      setMessage(passwordError  || "First name, last name, email, password, and birthdate are required.");
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
        console.log(response.body.message);
        setMessage(response.body.Data.Message || "Failed to create account.");
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
            maxLength={20}
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <div className="char-count">{firstName.length} / 20</div>
        </div>

        <div className="form-group">
          <label>Middle Name (Optional)</label>
          <input
            type="text"
            placeholder="Middle Name"
            maxLength={20}
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
           <div className="char-count">{middleName.length} / 20</div>
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            maxLength={20}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <div className="char-count">{lastName.length} / 20</div>
        </div>

        <div className="form-group">
          <label>Birth Date</label>
          <DatePicker
          selected={birthDate}
          onChange={(date) => setBirthDate(date)}
          onSelect={(date) => setBirthDate(date)}  
          dateFormat="yyyy-MM-dd"
          placeholderText="Select your birth date"
          maxDate={sixteenYearsAgo}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          shouldCloseOnSelect={true}
        />
        
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            maxLength={30}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="char-count">{email.length} / 20</div>
        </div>

        <div className="form-group password-group">
          <label>Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              maxLength={20}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {}
            </div>
          </div>
          <div className="char-count">{password.length} / 20</div>
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
