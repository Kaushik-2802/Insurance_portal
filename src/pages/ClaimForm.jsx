import React, { useState } from "react";
import "./ClaimForm.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

export default function ClaimForm() {
  // State to track which reason is selected
  const [selectedReason, setSelectedReason] = useState("");

  const reasons = [
    "Natural Disaster",
    "Man-Made Disaster",
    "Road Accident",
    "Theft",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted for reason: ${selectedReason}`);
  };

  return (
    <>
    <InnerHeader />
    <div className="claim-container">
      <div className="claim-card">
        <h2 className="claim-title">Estimate Insurance Premium Calculation</h2>

        <form onSubmit={handleSubmit} className="claim-form">
          <input 
            type="text" 
            placeholder="Policy Number" 
            className="claim-input" 
            required 
          />
          
          <input 
            type="text" 
            placeholder="Mobile Number" 
            className="claim-input" 
            required 
          />

          <div className="reason-section">
            <h3 className="reason-header">Reason to Claim Insurance</h3>
            <div className="reason-box">
              {reasons.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  className={`reason-btn ${selectedReason === reason ? "active" : ""}`}
                  onClick={() => setSelectedReason(reason)}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="claim-submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
}