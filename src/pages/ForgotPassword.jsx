import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value.includes("@")) {
      setShowOtp(true);
    } else {
      setShowOtp(false);
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

  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    console.log("Entered OTP:", enteredOtp);
    navigate("/reset-password");
  };

  return (
    <div className="forgot-password-page">
      {/* Background blobs */}
      <div className="bg-blob"></div>
      <div className="bg-blob-2"></div>

      {/* Glass Card */}
      <div className="forgot-card-glass">
        <h1>Reset Password</h1>

        <div className="input-wrapper">
          <input
            type="email"
            id="email"
            placeholder=" "
            value={email}
            onChange={handleEmailChange}
            required
          />
          <label htmlFor="email">Email Id</label>
        </div>

        {showOtp && (
          <>
            <label>Enter OTP</label>
            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                />
              ))}
            </div>
          </>
        )}

        <button
          type="submit"
          className="login-btn-premium"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
