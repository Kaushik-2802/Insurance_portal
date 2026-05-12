import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();

  // Combined state for all form fields
  const [formData, setFormData] = useState({
    email: "",
    newPass: "",
    confPass: "",
  });

  // State for error messages
  const [errors, setErrors] = useState({});

  // Regex Patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Immediate Email Validation
    if (name === "email") {
      if (value.length > 0 && !emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    // Clear password errors as user types
    if (name === "newPass" || name === "confPass") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    const { email, newPass, confPass } = formData;

    if (!emailRegex.test(email)) {
      tempErrors.email = "Valid email is required";
    }

    if (!passwordRegex.test(newPass)) {
      tempErrors.newPass = "Password must be 8+ chars with uppercase, number & special char";
    }

    if (newPass !== confPass) {
      tempErrors.confPass = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Verification link sent to " + formData.email + " and password updated!");
      navigate("/login");
    }
  };

  // Disable button if email invalid or empty
  const isSubmitDisabled =
    !formData.email || !!errors.email || !formData.newPass || !formData.confPass;

  return (
    <div className="reset-password-page">
      <div className="bg-blob"></div>
      <div className="bg-blob-2"></div>

      <div className="reset-card-glass">
        <h1>Reset Password</h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className={`input-wrapper ${errors.email ? "input-error" : ""}`}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder=" "
              required
            />
            <label htmlFor="email">Email Address</label>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* New Password Field */}
          <div className={`input-wrapper ${errors.newPass ? "input-error" : ""}`}>
            <input
              type="password"
              id="newPass"
              name="newPass"
              value={formData.newPass}
              onChange={handleInputChange}
              placeholder=" "
              required
            />
            <label htmlFor="newPass">New Password</label>
            {errors.newPass && <span className="error-text">{errors.newPass}</span>}
          </div>

          {/* Confirm Password Field */}
          <div className={`input-wrapper ${errors.confPass ? "input-error" : ""}`}>
            <input
              type="password"
              id="confPass"
              name="confPass"
              value={formData.confPass}
              onChange={handleInputChange}
              placeholder=" "
              required
            />
            <label htmlFor="confPass">Confirm Password</label>
            {errors.confPass && <span className="error-text">{errors.confPass}</span>}
          </div>

          <button type="submit" className="login-btn-premium" disabled={isSubmitDisabled}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
