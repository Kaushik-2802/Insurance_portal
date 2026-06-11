import React from "react";
import "./outerFooter.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Brand & Purpose */}
          <div className="footer-section footer-logo-box">
            <h2>CTS Insurance</h2>
            <p className="footer-desc">
              Redefining automotive security through smart insurance tech. 
              Delivering data-driven protection and seamless digital coverage for modern drivers.
            </p>
          </div>

          {/* Core Values / Pillar Content */}
          <div className="footer-section">
            <h3>Our Pillars</h3>
            <ul style={{ listStyleType: 'none', padding: 0, color: '#8892b0', fontSize: '0.9rem', lineHeigh: '1.6' }}>
              <li style={{ marginBottom: '8px' }}>⚡ <strong>Instant Tech:</strong> AI-driven premium processing.</li>
              <li style={{ marginBottom: '8px' }}>🛡️ <strong>Max Security:</strong> End-to-end policy encryption.</li>
              <li style={{ marginBottom: '8px' }}>🤝 <strong>Trust First:</strong> Fully transparent claim assessments.</li>
            </ul>
          </div>

          {/* Corporate Information */}
          <div className="footer-section">
            <h3>Corporate Desk</h3>
            <p style={{ color: '#8892b0', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
              <strong>HQ Address:</strong> Tech Zone, Coimbatore, Tamil Nadu, India
            </p>
            <p style={{ color: '#8892b0', fontSize: '0.9rem', margin: '0' }}>
              <strong>Hours:</strong> Mon - Fri, 9:00 AM - 6:00 PM (IST)
            </p>
          </div>

          {/* Statutory Disclosure */}
          <div className="footer-section">
            <h3>Regulatory Status</h3>
            <p style={{ fontSize: '0.85rem', color: '#8892b0', lineHeigh: '1.4' }}>
              Licensed and regulated by the Insurance Regulatory and Development Authority of India (IRDAI). Operating strictly under corporate insurance guidelines.
            </p>
          </div>

        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #233554', margin: '30px 0 20px 0' }} />

        {/* Global Legal & Copyright Bar */}
        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'between', flexWrap: 'wrap', gap: '15px' }}>
          <p style={{ fontSize: '0.8rem', color: '#8892b0', margin: 0 }}>
            &copy; {new Date().getFullYear()} LTI Insurance Company Ltd. All Rights Reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#8892b0', margin: 0 }}>
            IRDAI Registration No. 123456 | CIN: U66010TZ2024PLC000000
          </p>
        </div>
      </div>
    </footer>
  );
}