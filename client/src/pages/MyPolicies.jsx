import React from "react";
import "./MyPolicies.css";
import { useNavigate } from "react-router-dom";

export default function MyPolicies() {
  const navigate=useNavigate();
  const handleBack=()=>{
    navigate("/dashboard")
  }
  const policies = [
    {
      id: "POL-992831",
      holder: "John Doe",
      category: "Four Wheeler",
      vehicle: "Tesla Model 3 (ABC-1234)",
      premium: "$450.00",
      expiry: "Dec 12, 2026",
      status: "Active",
    },
    {
      id: "POL-445502",
      holder: "John Doe",
      category: "Two Wheeler",
      vehicle: "Ducati Panigale V4",
      premium: "$120.00",
      expiry: "Aug 24, 2026",
      status: "Active",
    }
  ];

  return (
    <div className="profile-wrapper">
      <div className="profile-page">
        <h1 className="profile-title">Active Policies</h1>

        <div className="profile-header">
          {/* Using a placeholder for John's Photo */}
          <img 
            src="#"
            alt="John Doe" 
            className="profile-photo" 
          />
          <div className="profile-basic">
            <h2>John Doe</h2>
            <p>Premium Member • Member since 2022</p>
          </div>
        </div>

        {policies.map((policy) => (
          <div key={policy.id} className="profile-section" style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{policy.category} Insurance</h3>
              <span className="status-badge">{policy.status}</span>
            </div>
            
            <div className="address-grid">
              <div className="address-item">
                <span className="address-label">Policy Number</span>
                <span className="address-value">{policy.id}</span>
              </div>
              <div className="address-item">
                <span className="address-label">Vehicle Details</span>
                <span className="address-value">{policy.vehicle}</span>
              </div>
              <div className="address-item">
                <span className="address-label">Annual Premium</span>
                <span className="address-value" style={{ color: '#22d3ee' }}>{policy.premium}</span>
              </div>
              <div className="address-item">
                <span className="address-label">Renewal Date</span>
                <span className="address-value">{policy.expiry}</span>
              </div>
            </div>
          </div>
        ))}

        <button className="back-btn" onClick={handleBack}>Back to Dashboard</button>
      </div>
    </div>
  );
}