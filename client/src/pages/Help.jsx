import React from "react";
import "./Help.css"; 
import { useNavigate } from "react-router-dom";

export default function Help() {
  const faqCategories = [
    { title: "Claims", desc: "How to file a motor insurance claim step-by-step." },
    { title: "Policy", desc: "Renewals, mid-term changes, and cancellations." },
    { title: "Payments", desc: "Manage premium schedules and payment methods." },
    { title: "Documents", desc: "Download your tax certificates and ID cards." }
  ];
  const navigate=useNavigate();
  const handleBack=()=>{
    navigate("/dashboard")
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-page">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 className="profile-title" style={{ textAlign: 'center', border: 'none' }}>
            How can we help, John?
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '-20px' }}>
            Search our knowledge base or contact a support specialist.
          </p>
        </div>

        {/* Quick Help Grid */}
        <div className="profile-section">
          <h3>Knowledge Base</h3>
          <div className="address-grid">
            {faqCategories.map((cat, index) => (
              <div key={index} className="address-item faq-card">
                <span className="address-label">{cat.title}</span>
                <span className="address-value" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  {cat.desc}
                </span>
                <button className="text-link">Read Articles →</button>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact Section */}
        <div className="profile-section" style={{ marginTop: '50px' }}>
          <h3>Emergency Assistance</h3>
          <div className="emergency-container">
            <div className="contact-box">
              <span className="address-label">24/7 Roadside Support:</span>
              <span className="address-value" style={{ fontSize: '1.4rem' }}> 1-800-MOTOR-HELP</span>
            </div>
            <div className="contact-box">
              <span className="address-label">Email Support:</span>
              <span className="address-value"> support@arctic-insurance.com</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="back-btn" onClick={handleBack}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}