import React from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/login");
  };

  return (
    <div className="reset-password-page">
      {/* Background blobs for depth */}
      <div className="bg-blob"></div>
      <div className="bg-blob-2"></div>

      {/* Glass Card */}
      <div className="reset-card-glass">
        <h1>Reset Password</h1>

        <div className="input-wrapper">
          <input
            type="password"
            id="NewPass"
            name="NewPass"
            placeholder=" "
            required
          />
          <label htmlFor="NewPass">New Password</label>
        </div>

        <div className="input-wrapper">
          <input
            type="password"
            id="ConfPass"
            name="ConfPass"
            placeholder=" "
            required
          />
          <label htmlFor="ConfPass">Confirm Password</label>
        </div>

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
