import React, { useState } from "react";
import "../styles/forms.css";
import { useNavigate } from "react-router-dom";
import apiService from "../Common/apiService.js";
import { Roles } from "../constants/roleEnum.js";

const CreateAccount = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    birthDate: false,
  });
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    setFormError({
      firstName: !firstName,
      lastName: !lastName,
      email: !email,
      password: !password,
      birthDate: !birthDate,
    });
    if (!firstName || !lastName || !email || !password || !birthDate) {
      setMessage(
        "First name, last name, email, password, and birthdate are required."
      );
      return;
    }

    const newUser = {
      firstName,
      middleName,
      lastName,
      birthDate,
      email,
      password,
      roleid: Roles.MANAGER,
    };

    try {
      await apiService
        .request("useraccount/create-account", "POST", newUser, {
          "Content-Type": "application/json",
        })
        .then((response) => {
          if (response.status === 200) {
            setMessage("Account created successfully! You can now log in.");
            navigate("/login");
          } else {
            setMessage(response.message || "Failed to create account.");
          }
        })
        .catch((ex) => console.log(ex));
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error creating account. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <h2>Create Account</h2>
        <form className="create-account-form">
          <div className="form-field">
            <label className={formError.firstName ? "required" : ""}>
              First Name{" "}
              {formError.firstName && <span className="asterisk">*</span>}
            </label>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`input-field ${formError.firstName ? "error" : ""}`}
            />
          </div>

          <div className="form-field">
            <label>Middle Name (Optional)</label>
            <input
              type="text"
              placeholder="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-field">
            <label className={formError.lastName ? "required" : ""}>
              Last Name{" "}
              {formError.lastName && <span className="asterisk">*</span>}
            </label>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`input-field ${formError.lastName ? "error" : ""}`}
            />
          </div>

          <div className="form-field">
            <label className={formError.birthDate ? "required" : ""}>
              Birth Date{" "}
              {formError.birthDate && <span className="asterisk">*</span>}
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={`input-field ${formError.birthDate ? "error" : ""}`}
            />
          </div>

          <div className="form-field">
            <label className={formError.email ? "required" : ""}>
              Email {formError.email && <span className="asterisk">*</span>}
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input-field ${formError.email ? "error" : ""}`}
            />
          </div>

          <div className="form-field">
            <label className={formError.password ? "required" : ""}>
              Password{" "}
              {formError.password && <span className="asterisk">*</span>}
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-field ${formError.password ? "error" : ""}`}
            />
          </div>

          <button
            type="button"
            onClick={handleCreateAccount}
            className="submit-btn"
          >
            Sign Up
          </button>
        </form>
        <p>{message}</p>
      </header>
    </div>
  );
};

export default CreateAccount;
