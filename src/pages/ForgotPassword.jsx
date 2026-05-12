import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value === "") {
      setEmailError("");
      setShowOtp(false);
    } else if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      setShowOtp(false);
    } else {
      setEmailError("");
      setShowOtp(true);
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

  const isFormInvalid = !emailRegex.test(email) || otp.some((digit) => digit === "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormInvalid) {
      const enteredOtp = otp.join("");
      console.log("Verified Email:", email);
      console.log("Entered OTP:", enteredOtp);
      navigate("/reset-password");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="bg-blob"></div>
      <div className="bg-blob-2"></div>

      <div className="forgot-card-glass">
        <h1>Verify Identity</h1>
        <p className="subtitle">Enter your registered email to receive an OTP</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={`input-wrapper ${emailError ? "input-error" : ""}`}>
            <input
              type="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={handleEmailChange}
              required
            />
            <label htmlFor="email">Email Id</label>
            {emailError && <span className="error-text">{emailError}</span>}
          </div>

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
            disabled={isFormInvalid}
          >
            Verify & Proceed
          </button>
        </form>
      </div>
    </div>
  );
}