import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./ClaimInsurance.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

export default function ClaimForm() {
  const [selectedReason, setSelectedReason] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [linkedMobile, setLinkedMobile] = useState("");
  const [isHovered, setIsHovered] = useState(null);
  const navigate = useNavigate();

  const reasons = [
    { id: "Natural Disaster", icon: "fa-solid fa-cloud-showers-heavy", desc: "Flood, Storm, Earthquakes" },
    { id: "Man-Made Disaster", icon: "fa-solid fa-fire-extinguisher", desc: "Fire, Vandalism, Riots" },
    { id: "Road Accident", icon: "fa-solid fa-car-burst", desc: "Collision, Damage on Road" },
    { id: "Theft", icon: "fa-solid fa-mask", desc: "Stolen Vehicle or Parts" },
  ];

  return (
    <div className="claim-page-wrapper">
      <InnerHeader />
      <div className="claim-main-content">
        {/* Background Decorative Blob */}
        <div className="blob-decorator"></div>

        <div className="claim-glass-card">
          <div className="claim-header-box">
            <i className="fa-solid fa-shield-heart claim-main-icon"></i>
            <h2 className="claim-title">File Your Claim</h2>
            <p className="claim-subtitle">Tell us what happened. We're here to help you get back on track.</p>
          </div>

          <form onSubmit={(e) => {
              e.preventDefault();
              if (!policyNumber || !linkedMobile || !selectedReason) {
                window.alert('Please fill in all fields and select a claim reason.');
                return;
              }

              const existingRequests = JSON.parse(localStorage.getItem('adminClaimRequests') || '[]');
              const newRequest = {
                id: `CLM-${Date.now()}`,
                policy: policyNumber,
                mobile: linkedMobile,
                reason: selectedReason,
                status: 'Pending',
                createdAt: new Date().toLocaleString(),
              };
              localStorage.setItem('adminClaimRequests', JSON.stringify([newRequest, ...existingRequests]));
              window.alert('Claim process initiated. Your request has been sent to admin.');
              navigate('/dashboard');
            }}
            className="claim-form-layout"
          >
            <div className="input-group-modern">
              <div className="floating-field">
                <input
                  type="text"
                  id="policy"
                  placeholder=" "
                  required
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                />
                <label htmlFor="policy"><i className="fa-solid fa-hashtag"></i> Policy Number</label>
              </div>
              <div className="floating-field">
                <input
                  type="tel"
                  id="mobile"
                  placeholder=" "
                  required
                  value={linkedMobile}
                  onChange={(e) => setLinkedMobile(e.target.value)}
                />
                <label htmlFor="mobile"><i className="fa-solid fa-phone"></i> Linked Mobile</label>
              </div>
            </div>

            <div className="reason-grid-section">
              <h3 className="grid-label">Nature of Incident</h3>
              <div className="reason-grid">
                {reasons.map((item) => (
                  <div
                    key={item.id}
                    className={`reason-tile ${selectedReason === item.id ? "active" : ""}`}
                    onClick={() => setSelectedReason(item.id)}
                    onMouseEnter={() => setIsHovered(item.id)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <div className="tile-icon">
                      <i className={item.icon}></i>
                    </div>
                    <div className="tile-text">
                      <span className="tile-name">{item.id}</span>
                      <span className="tile-desc">{item.desc}</span>
                    </div>
                    {selectedReason === item.id && <i className="fa-solid fa-circle-check check-badge"></i>}
                  </div>
                ))}
              </div>
            </div>

            {selectedReason && (
              <div className="claim-footer-action animated-up">
                <div className="info-banner">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>Our adjusters typically review <strong>{selectedReason}</strong> claims within 24 hours.</span>
                </div>
                <button type="submit" className="claim-premium-btn">
                  Initiate Claim Process <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}