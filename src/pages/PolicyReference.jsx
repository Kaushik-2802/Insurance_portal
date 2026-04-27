import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti'; // Optional: npm install react-confetti
import './PolicyReference.css';

const PolicyReference = () => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const paymentStatus = localStorage.getItem('paymentCompleted');

    if (paymentStatus === 'true') {
      setPaymentCompleted(true);
      setShowConfetti(true);
      // Stop confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);

      const storedReferenceNumber = localStorage.getItem('policyReferenceNumber');
      if (storedReferenceNumber) {
        setReferenceNumber(storedReferenceNumber);
      } else {
        const uniqueNumber = Math.random().toString(36).substring(2, 10).toUpperCase() + 
                             Math.random().toString(36).substring(2, 10).toUpperCase();
        localStorage.setItem('policyReferenceNumber', uniqueNumber);
        setReferenceNumber(uniqueNumber);
      }
    } else {
      setTimeout(() => navigate('/payment'), 3000);
    }
  }, [navigate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="policy-root">
      {showConfetti && <Confetti numberOfPieces={150} recycle={false} gravity={0.2} />}
      
      <div className="policy-container">
        {!paymentCompleted ? (
          <div className="redirect-card">
            <div className="loader-ring"></div>
            <h2>Verifying Payment...</h2>
            <p>You'll be redirected to secure payment shortly.</p>
          </div>
        ) : (
          <div className="success-wrapper animated-fade-in">
            {/* Visual Header */}
            <div className="status-badge">
              <div className="checkmark-circle">
                <i className="fa-solid fa-check"></i>
              </div>
              <h1>Success!</h1>
              <p>Your policy is now active.</p>
            </div>

            {/* The Certificate Card */}
            <div className="policy-certificate">
              <div className="cert-header">
                <i className="fa-solid fa-shield-halved"></i>
                <span>OFFICIAL POLICY REFERENCE</span>
              </div>
              
              <div className="cert-body">
                <p className="cert-label">Your unique ID for claims & renewals:</p>
                <div className="ref-display-group">
                  <span className="ref-text">{referenceNumber}</span>
                  <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copyToClipboard}>
                    <i className={copied ? "fa-solid fa-check" : "fa-solid fa-copy"}></i>
                  </button>
                </div>
                {copied && <span className="copy-toast">Copied to clipboard!</span>}
              </div>

              <div className="cert-footer">
                <div className="footer-item">
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>Valid for: 1 Year</span>
                </div>
                <div className="footer-item">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Status: Verified</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="action-grid">
              <div className="action-item">
                <i className="fa-solid fa-file-pdf"></i>
                <p>Download PDF</p>
              </div>
              <div className="action-item" onClick={() => window.print()}>
                <i className="fa-solid fa-print"></i>
                <p>Print Page</p>
              </div>
              <div className="action-item">
                <i className="fa-solid fa-envelope"></i>
                <p>Email Me</p>
              </div>
            </div>

            <button className="finish-btn" onClick={() => navigate('/')}>
              Go to Dashboard <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyReference;