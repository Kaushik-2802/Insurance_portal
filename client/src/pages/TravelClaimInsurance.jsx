import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./ClaimInsurance.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

export default function TravelClaimInsurance() {
  const [selectedReason, setSelectedReason] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [linkedMobile, setLinkedMobile] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [claimAmount, setClaimAmount] = useState(""); // <-- ADDED STATE
  const [files, setFiles] = useState([]);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [detectedDestination, setDetectedDestination] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          setLinkedMobile(data.mobile || "");
        } else {
          alert("Unable to load profile.");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [navigate]);

  const travelReasons = [
    { id: "Medical Emergency", icon: "fa-solid fa-hospital", desc: "Medical care or evacuation while traveling" },
    { id: "Trip Delay", icon: "fa-solid fa-plane-slash", desc: "Flight cancellation, missed connection or delay" },
    { id: "Lost Baggage", icon: "fa-solid fa-suitcase-rolling", desc: "Lost, delayed or stolen luggage" },
    { id: "Passport Loss", icon: "fa-solid fa-passport", desc: "Emergency passport or travel document replacement" },
  ];

  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const handleVerifyPolicy = async () => {
    if (!policyNumber.trim()) {
      setValidationError("Please complete the policy code field.");
      return;
    }

    setIsVerifying(true);
    setValidationError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/claims/verify-claim-eligibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          policyNumber: policyNumber.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsVerified(true);
        setDetectedDestination(data.destination || "Valid Travel Policy");
        setValidationError("");
      } else {
        setIsVerified(false);
        setValidationError(data.message || "Verification failed.");
      }
    } catch (err) {
      console.error(err);
      setValidationError("Communication error with verification server.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      window.alert("You must verify your policy first.");
      return;
    }

    // Include claimAmount validation rule check
    if (!policyNumber || !selectedReason || !incidentDate || !claimAmount) {
      window.alert("Please complete all fields before submitting your travel claim.");
      return;
    }

    if (files.length === 0) {
      window.alert("Please upload supporting documentation.");
      return;
    }

    const formData = new FormData();
    formData.append("policyNo", policyNumber.trim());
    formData.append("mobileNo", linkedMobile.trim());
    formData.append("date", incidentDate);
    formData.append("incidentType", selectedReason);
    formData.append("claimAmount", claimAmount); // <-- APPEND AMOUNT

    files.forEach((file) => {
      formData.append("supportDocs", file);
    });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/claims/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        window.alert("Travel claim submitted successfully.");
        navigate("/dashboard");
      } else {
        window.alert("Verification / Submission Warning: " + result.message);
      }
    } catch (error) {
      console.error("Network layer execution fault:", error);
      window.alert("Unable to connect to server.");
    }
  };

  return (
    <div className="claim-page-wrapper">
      <InnerHeader />
      <div className="claim-main-content">
        <div className="blob-decorator"></div>

        <div className="claim-glass-card">
          <div className="claim-header-box">
            <i className="fa-solid fa-plane-departure claim-main-icon"></i>
            <h2 className="claim-title">Travel Insurance Claim</h2>
            <p className="claim-subtitle">Enter the travel policy details beginning with <strong>TRV</strong> and select the incident type.</p>
          </div>

          <form onSubmit={handleSubmit} className="claim-form-layout">
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
                  disabled
                  value={linkedMobile}
                />
                <label htmlFor="mobile"><i className="fa-solid fa-phone"></i> Linked Mobile</label>
              </div>
              <div className="floating-field full-width-mobile">
                <input 
                  type="date" 
                  id="date" 
                  required 
                  value={incidentDate} 
                  onChange={(e) => setIncidentDate(e.target.value)} 
                  max={new Date().toISOString().split("T")[0]} 
                />
                <label htmlFor="date" className="fixed-label">Incident Date</label>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              {!isVerified ? (
                <button 
                  type="button" 
                  className="cta-btn primary" 
                  onClick={handleVerifyPolicy} 
                  disabled={isVerifying}
                  style={{ background: '#3498db', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  {isVerifying ? "Verifying Record..." : "Verify Policy Status"}
                </button>
              ) : (
                <div style={{ color: '#2ecc71', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-circle-check"></i> Active Policy Found ({detectedDestination})
                  <button 
                    type="button" 
                    onClick={() => { setIsVerified(false); setDetectedDestination(null); }} 
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

            {isVerified && (
              <>
                <div className="reason-grid-section">
                  <h3 className="grid-label">Travel Incident Type</h3>
                  <div className="reason-grid">
                    {travelReasons.map((item) => (
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

                <div className="upload-section">
                  <h3 className="grid-label">Supporting Documents</h3>
                  <div className="upload-dropzone" onClick={() => fileInputRef.current.click()}>
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <p>Drag travel documents or <span>Browse Files</span></p>
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

                {/* ADDED FLOATING FIELD FOR CLAIM AMOUNT */}
                <div className="floating-field" style={{ marginTop: '20px' }}>
                  <input 
                    type="number" 
                    id="amount" 
                    placeholder=" " 
                    required 
                    value={claimAmount} 
                    onChange={(e) => setClaimAmount(e.target.value)} 
                  />
                  <label htmlFor="amount"><i className="fa-solid fa-indian-rupee-sign"></i> Estimated Claim Amount (₹)</label>
                </div>

                {selectedReason && (
                  <div className="claim-footer-action animated-up">
                    <div className="info-banner">
                      <i className="fa-solid fa-circle-info"></i>
                      <span>Your travel claim will be reviewed within <strong>24 Business Hours</strong>.</span>
                    </div>
                    <button type="submit" className="claim-premium-btn">
                      Submit Travel Claim <i className="fa-solid fa-paper-plane"></i>
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