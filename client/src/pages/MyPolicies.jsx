import React, { useState, useEffect } from "react";
import "./MyPolicies.css";
import { useNavigate } from "react-router-dom";

export default function MyPolicies() {
  const navigate = useNavigate();
  
  // Dynamic State declarations for policy tracking, loading states, and error handling
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBack = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    // 1. Fetch the active logged-in userId from local storage space
    const currentUserId = localStorage.getItem("userId");

    if (!currentUserId) {
      setError("User session profile trace missing. Please re-login.");
      setLoading(false);
      return;
    }

    // 2. Query both backend endpoints concurrently using Promise.all
    Promise.all([
      fetch(`http://localhost:5000/api/payments/user-policies/${currentUserId}`).then((res) => {
        if (!res.ok) throw new Error("Could not download vehicle records.");
        return res.json();
      }),
      fetch(`http://localhost:5000/api/travel/user-policies/${currentUserId}`).then((res) => {
        if (!res.ok) throw new Error("Could not download travel records.");
        return res.json();
      })
    ])
      .then(([vehicleData, travelData]) => {
        let combinedPolicies = [];

        if (vehicleData.success && vehicleData.policies) {
          // Standardize vehicle entries if needed to match custom display keys
          const normalizedVehicles = vehicleData.policies.map(p => ({
            ...p,
            detailLabel: p.detailLabel || "Vehicle Details",
            detailValue: p.detailValue || p.vehicle // safety fallback for original property names
          }));
          combinedPolicies = [...combinedPolicies, ...normalizedVehicles];
        }

        if (travelData.success && travelData.policies) {
          combinedPolicies = [...combinedPolicies, ...travelData.policies];
        }

        // Sort combined array by expiry date or order received to keep things neat
        setPolicies(combinedPolicies);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Policy retrieval breakdown: ", err);
        setError("Network configuration error reaching database arrays.");
        setLoading(false);
      });
  }, []);

  // Determine user context profile name card display 
  // (Uses the name from the newest active policy, defaults back to standard fallback otherwise)
  const primaryHolderName = policies.length > 0 ? policies[0].holder : "Valued Member";

  return (
    <div className="profile-wrapper">
      <div className="profile-page">
        <h1 className="profile-title">Active Policies</h1>

        <div className="profile-header">
          {/* Profile Avatars / Initials wrapper */}
          <div className="profile-avatar-placeholder">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <div className="profile-basic">
            <h2>{primaryHolderName}</h2>
            <p>Premium Member • Secure Dashboard Active</p>
          </div>
        </div>

        {/* Loading Spinner State */}
        {loading && (
          <div className="policy-loading-state">
            <div className="loader-ring"></div>
            <p style={{ color: "#a5f3fc", textAlign: "center" }}>Fetching your registered policies...</p>
          </div>
        )}

        {/* Error Alert Box */}
        {error && (
          <div className="policy-error-banner" style={{ color: "#ef4444", padding: "10px", textAlign: "center" }}>
             <i className="fa-solid fa-triangle-exclamation"></i> {error}
          </div>
        )}

        {/* Empty State Banner */}
        {!loading && policies.length === 0 && !error && (
          <div className="policy-empty-state" style={{ textAlign: "center", padding: "40px 10px" }}>
            <p style={{ color: "#9ca3af" }}>No verified insurance protection sheets found on this profile database link.</p>
          </div>
        )}

        {/* Dynamic List Render for Vehicle & Travel Insurances */}
        {!loading && policies.map((policy) => (
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

              {/* Dynamic Key Row: Displays 'Vehicle Details' or 'Trip Destination' contextually */}
              <div className="address-item">
                <span className="address-label">{policy.detailLabel || "Details"}</span>
                <span className="address-value">{policy.detailValue}</span>
              </div>

              <div className="address-item">
                <span className="address-label">Premium Status</span>
                <span className="address-value" style={{ color: '#22d3ee' }}>{policy.premium}</span>
              </div>

              <div className="address-item">
                <span className="address-label">Coverage Ends</span>
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