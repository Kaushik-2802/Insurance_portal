import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-page">
        <h1 className="profile-title">User Profile</h1>

        <div className="profile-header">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="profile-photo"
          />
          <div className="profile-basic">
            <h2>John Doe</h2>
            <p><strong>Age:</strong> 32</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Email:</strong> john.doe@example.com</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Address</h3>
          <div className="address-grid">
            <div className="address-item">
              <span className="address-label">Street:</span>
              <span className="address-value"> 123 Green Street</span>
            </div>
            <div className="address-item">
              <span className="address-label">City:</span>
              <span className="address-value"> Coimbatore</span>
            </div>
            <div className="address-item">
              <span className="address-label">State:</span>
              <span className="address-value">   Tamil Nadu</span>
            </div>
            <div className="address-item">
              <span className="address-label">Country:</span>
              <span className="address-value"> India</span>
            </div>
            <div className="address-item">
              <span className="address-label">Pincode:</span>
              <span className="address-value"> 641001</span>
            </div>
          </div>
        </div>

        <button className="back-btn" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
