import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import "./ClaimInsurance.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

export default function TravelClaimInsurance() {
  const [selectedReason, setSelectedReason] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [linkedMobile, setLinkedMobile] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!policyNumber || !linkedMobile || !selectedReason || !incidentDate) {
      window.alert('Please complete all fields before submitting your travel claim.');
      return;
    }

    const existingRequests = JSON.parse(localStorage.getItem('adminClaimRequests') || '[]');
    const newRequest = {
      id: `TRV-CLM-${Date.now()}`,
      policy: policyNumber,
      mobile: linkedMobile,
      reason: selectedReason,
      date: incidentDate,
      attachments: files.length,
      type: 'Travel',
      status: 'Pending',
      createdAt: new Date().toLocaleString(),
    };

    localStorage.setItem('adminClaimRequests', JSON.stringify([newRequest, ...existingRequests]));
    window.alert('Travel claim submitted successfully. Our team will reach out soon.');
    navigate('/dashboard');
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
                <input type="text" id="policy" placeholder=" " required value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} />
                <label htmlFor="policy"><i className="fa-solid fa-hashtag"></i> Policy Number</label>
              </div>
              <div className="floating-field">
                <input type="tel" id="mobile" placeholder=" " required value={linkedMobile} onChange={(e) => setLinkedMobile(e.target.value)} />
                <label htmlFor="mobile"><i className="fa-solid fa-phone"></i> Linked Mobile</label>
              </div>
              <div className="floating-field full-width-mobile">
                <input type="date" id="date" required value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                <label htmlFor="date" className="fixed-label">Incident Date</label>
              </div>
            </div>

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
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
