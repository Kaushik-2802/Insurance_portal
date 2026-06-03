import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import "./ClaimInsurance.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

export default function ClaimForm() {
  const [selectedReason, setSelectedReason] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [linkedMobile, setLinkedMobile] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [files, setFiles] = useState([]);
  
  // New State variables for active database lookups
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [detectedVehicleType, setDetectedVehicleType] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000/api/insurance";

  // Dynamic Reasons: Now relies on validated DB properties rather than fragile frontend string sniffing
  const getReasons = () => {
    const isTravel = policyNumber.toUpperCase().startsWith("TRV");
    if (isTravel) {
      return [
        { id: "Medical Emergency", icon: "fa-solid fa-hospital", desc: "Hospitalization or Injury abroad" },
        { id: "Trip Delay", icon: "fa-solid fa-plane-slash", desc: "Flight cancellation or delays" },
        { id: "Lost Baggage", icon: "fa-solid fa-suitcase-rolling", desc: "Missing or stolen luggage" },
        { id: "Passport Loss", icon: "fa-solid fa-passport", desc: "Emergency document replacement" },
      ];
    }
    
    // Motor policies grid defaults mapping safely
    return [
      { id: "Natural Disaster", icon: "fa-solid fa-cloud-showers-heavy", desc: "Flood, Storm, Earthquakes" },
      { id: "Man-Made Disaster", icon: "fa-solid fa-fire-extinguisher", desc: "Fire, Vandalism, Riots" },
      { id: "Road Accident", icon: "fa-solid fa-car-burst", desc: "Collision, Damage on Road" },
      { id: "Theft", icon: "fa-solid fa-mask", desc: "Stolen Vehicle or Parts" },
    ];
  };

  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  // =========================================================================
  // LIVE DATABASE RECORD CHECKER
  // =========================================================================
  const handleVerifyPolicy = async () => {
    if (!policyNumber.trim() || !linkedMobile.trim()) {
      setValidationError("Please complete both policy code and telephone fields to run check logs.");
      return;
    }

    setIsVerifying(true);
    setValidationError("");

    try {
      const response = await fetch(`${API_BASE_URL}/verify-claim-eligibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyNumber: policyNumber.trim(),
          linkedMobile: linkedMobile.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsVerified(true);
        setDetectedVehicleType(data.vehicleType);
        setValidationError("");
      } else {
        setIsVerified(false);
        setValidationError(data.message || "Verification failed. Record not discovered.");
      }
    } catch (err) {
      setValidationError("Communication block with validation authority error.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isVerified) {
      window.alert('You must run and pass an account identity validation lookup before registering requests.');
      return;
    }

    if (!selectedReason || !incidentDate) {
      window.alert('Please complete all fields, including the incident date.');
      return;
    }

    const existingRequests = JSON.parse(localStorage.getItem('adminClaimRequests') || '[]');
    const newRequest = {
      id: `CLM-${Date.now()}`,
      policy: policyNumber,
      mobile: linkedMobile,
      reason: selectedReason,
      date: incidentDate,
      vehicleType: detectedVehicleType,
      attachments: files.length,
      status: 'Pending',
      createdAt: new Date().toLocaleString(),
    };

    localStorage.setItem('adminClaimRequests', JSON.stringify([newRequest, ...existingRequests]));
    window.alert('Claim details securely logged. The review matrix pipeline is initialized.');
    navigate('/dashboard');
  };

  return (
    <div className="claim-page-wrapper">
      <InnerHeader />
      <div className="claim-main-content">
        <div className="blob-decorator"></div>

        <div className="claim-glass-card">
          <div className="claim-header-box">
            <i className="fa-solid fa-shield-heart claim-main-icon"></i>
            <h2 className="claim-title">File Your Claim</h2>
            <p className="claim-subtitle">Enter your validation token matching your database file reference ledger details.</p>
          </div>

          <form onSubmit={handleSubmit} className="claim-form-layout">
            
            {/* Verification Inputs Block */}
            <div className="input-group-modern">
              <div className="floating-field">
                <input 
                  type="text" 
                  id="policy" 
                  placeholder=" " 
                  required 
                  disabled={isVerified}
                  value={policyNumber} 
                  onChange={(e) => { setPolicyNumber(e.target.value); setValidationError(""); }} 
                />
                <label htmlFor="policy"><i className="fa-solid fa-hashtag"></i> Policy Number</label>
              </div>
              <div className="floating-field">
                <input 
                  type="tel" 
                  id="mobile" 
                  placeholder=" " 
                  required 
                  disabled={isVerified}
                  value={linkedMobile} 
                  onChange={(e) => { setLinkedMobile(e.target.value); setValidationError(""); }} 
                />
                <label htmlFor="mobile"><i className="fa-solid fa-phone"></i> Linked Mobile</label>
              </div>
              <div className="floating-field full-width-mobile">
                <input type="date" id="date" required value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                <label htmlFor="date" className="fixed-label">Incident Date</label>
              </div>
            </div>

            {/* Validation Control Action Center */}
            <div style={{ marginBottom: '25px' }}>
              {!isVerified ? (
                <button 
                  type="button" 
                  className="cta-btn primary" 
                  onClick={handleVerifyPolicy} 
                  disabled={isVerifying}
                  style={{ background: '#3498db', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  {isVerifying ? "Verifying Reference..." : "Verify Policy Status"}
                </button>
              ) : (
                <div style={{ color: '#2ecc71', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-circle-check"></i> Connected Policy File Found ({detectedVehicleType || "Verified"})
                  <button 
                    type="button" 
                    onClick={() => { setIsVerified(false); setDetectedVehicleType(null); }} 
                    style={{ marginLeft: '15px', background: 'transparent', border: '1px solid #ccc', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Change
                  </button>
                </div>
              )}

              {validationError && (
                <p style={{ color: '#e74c3c', marginTop: '10px', fontSize: '0.9rem' }}>
                  <i className="fa-solid fa-triangle-exclamation"></i> {validationError}
                </p>
              )}
            </div>

            {/* Render interactive sections only if policy checks succeed */}
            {isVerified && (
              <>
                {/* Grid: Reasons */}
                <div className="reason-grid-section">
                  <h3 className="grid-label">Nature of Incident</h3>
                  <div className="reason-grid">
                    {getReasons().map((item) => (
                      <div key={item.id} className={`reason-tile ${selectedReason === item.id ? "active" : ""}`} onClick={() => setSelectedReason(item.id)}>
                        <div className="tile-icon"><i className={item.icon}></i></div>
                        <div className="tile-text">
                          <span className="tile-name">{item.id}</span>
                          <span className="tile-desc">{item.desc}</span>
                        </div>
                        {selectedReason === item.id && <i className="fa-solid fa-circle-check check-badge"></i>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Addition: Elegant Document Upload */}
                <div className="upload-section">
                  <h3 className="grid-label">Evidence & Documentation</h3>
                  <div className="upload-dropzone" onClick={() => fileInputRef.current.click()}>
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <p>Drag photos or <span>Browse Files</span></p>
                    <input type="file" hidden multiple ref={fileInputRef} onChange={handleFileChange} />
                  </div>
                  {files.length > 0 && (
                    <div className="file-preview-list">
                      {files.map((f, i) => (
                        <div key={i} className="file-chip"><i className="fa-solid fa-paperclip"></i> {f.name}</div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedReason && (
                  <div className="claim-footer-action animated-up">
                    <div className="info-banner">
                      <i className="fa-solid fa-circle-info"></i>
                      <span>Estimated review time: <strong>24 Business Hours</strong></span>
                    </div>
                    <button type="submit" className="claim-premium-btn">
                      Submit Claim Request <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}