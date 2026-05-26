import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  
  // Track backend statuses or rate-limiting states
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setServerError(""); // Reset error banners on text change

    if (value === "") {
      setEmailError("");
    } else if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // Condition validation variables split logically by flow phase
  const isEmailInvalid = !emailRegex.test(email);
  const isOtpInvalid = otp.some((digit) => digit === "");

  // Button disabled state dynamically shifts depending on the display mode phase
  const isButtonDisabled = isLoading || (showOtp ? (isEmailInvalid || isOtpInvalid) : isEmailInvalid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!showOtp) {
      // PHASE 1: Handle sending the OTP to the database server request
      if (isEmailInvalid) return;
      
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.toLowerCase() }),
        });

        const data = await response.json();

        if (response.ok) {
          // Reveal OTP entry components conditionally only after 200 OK delivery confirmation
          setShowOtp(true);
        } else {
          setServerError(data.message || "Failed to transmit validation code.");
        }
      } catch (err) {
        console.error("Network Error:", err);
        setServerError("Could not reach auth server cluster. Try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // PHASE 2: Route local collection parameters directly to password mutations view
      if (isEmailInvalid || isOtpInvalid) return;
      
      const enteredOtp = otp.join("");
      
      // Navigate forward carrying along values required by the endpoint context payload
      navigate("/reset-password", {
        state: {
          email: email,
          otp: enteredOtp,
        },
      });
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="bg-blob"></div>
      <div className="bg-blob-2"></div>

      <div className="forgot-card-glass">
        <h1>Verify Identity</h1>
        <p className="subtitle">Enter your registered email to receive an OTP</p>

        {serverError && (
          <span className="error-text" style={{ display: "block", textGuild: "center", marginBottom: "15px" }}>
            {serverError}
          </span>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Input Wrapper Grouping */}
          <div className={`input-wrapper ${emailError ? "input-error" : ""}`}>
            <input
              type="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={handleEmailChange}
              disabled={showOtp} // Locks the email modification block once dispatched successfully
              required
            />
            <label htmlFor="email">Email Id</label>
            {emailError && <span className="error-text">{emailError}</span>}
          </div>

          {/* Conditional Input Grid Block Assembly Elements */}
          {showOtp && (
            <div className="otp-section animate-fade-in">
              <label className="otp-label">Enter 6-Digit OTP</label>
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    inputMode="numeric"
                    value={digit}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    required
                  />
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="login-btn-premium"
            disabled={isButtonDisabled}
          >
            {isLoading ? "Processing..." : showOtp ? "Verify & Proceed" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}