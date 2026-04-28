import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import './PolicyReference.css';

const PolicyReference = () => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // Dummy Data for the Certificate
  const policyDetails = {
    ownerName: "Aditya Vardhan",
    bikeModel: "Royal Enfield Himalayan 450",
    registrationNo: "TS-09-EA-1234",
    insuredValue: "₹2,85,000",
    startTime: "April 28, 2026 | 10:00 AM",
    endTime: "April 27, 2027 | 11:59 PM",
    paymentAmount: "₹4,250.00",
    paymentMethod: "UPI (Google Pay)",
    transactionId: "TXN98237492837"
  };

  useEffect(() => {
    const paymentStatus = localStorage.getItem('paymentCompleted');

    if (paymentStatus === 'true') {
      setPaymentCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      const storedReferenceNumber = localStorage.getItem('policyReferenceNumber');
      if (storedReferenceNumber) {
        setReferenceNumber(storedReferenceNumber);
      } else {
        const uniqueNumber = "POL-" + Math.random().toString(36).substring(2, 9).toUpperCase();
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
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} gravity={0.1} />}
      
      <div className="policy-container">
        {!paymentCompleted ? (
          <div className="redirect-card">
            <div className="loader-ring"></div>
            <h2>Verifying Transaction...</h2>
            <p>Please do not refresh the page.</p>
          </div>
        ) : (
          <div className="success-wrapper animated-fade-in">
            {/* --- TOP STATUS --- */}
            <div className="status-badge">
              <div className="checkmark-circle">
                <i className="fa-solid fa-check"></i>
              </div>
              <h1>Payment Successful!</h1>
              <p>Your vehicle is now fully protected.</p>
            </div>

            {/* --- MAIN CERTIFICATE --- */}
            <div className="policy-certificate">
              <div className="cert-header">
                <div className="cert-logo">
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>SecureRide Insurance</span>
                </div>
                <div className="cert-ref">
                  <small>Policy Reference</small>
                  <strong>{referenceNumber}</strong>
                  <button className="copy-icon-btn" onClick={copyToClipboard}>
                    <i className={copied ? "fa-solid fa-check" : "fa-solid fa-copy"}></i>
                  </button>
                </div>
              </div>

              <div className="cert-main-grid">
                {/* Section 1: Owner & Duration */}
                <div className="cert-section">
                  <h3><i className="fa-solid fa-user"></i> Policy Holder</h3>
                  <div className="data-row"><span>Name:</span> <strong>{policyDetails.ownerName}</strong></div>
                  <div className="data-row"><span>Valid From:</span> <strong>{policyDetails.startTime}</strong></div>
                  <div className="data-row"><span>Valid Till:</span> <strong>{policyDetails.endTime}</strong></div>
                </div>

                {/* Section 2: Vehicle Details */}
                <div className="cert-section">
                  <h3><i className="fa-solid fa-motorcycle"></i> Vehicle Details</h3>
                  <div className="data-row"><span>Model:</span> <strong>{policyDetails.bikeModel}</strong></div>
                  <div className="data-row"><span>Reg No:</span> <strong>{policyDetails.registrationNo}</strong></div>
                  <div className="data-row"><span>IDV (Value):</span> <strong className="idv-highlight">{policyDetails.insuredValue}</strong></div>
                </div>

                {/* Section 3: Payment Summary */}
                <div className="cert-section full-width">
                  <h3><i className="fa-solid fa-receipt"></i> Payment Details</h3>
                  <div className="payment-flex">
                    <div className="data-row"><span>Paid Amount:</span> <strong>{policyDetails.paymentAmount}</strong></div>
                    <div className="data-row"><span>Method:</span> <strong>{policyDetails.paymentMethod}</strong></div>
                    <div className="data-row"><span>Transaction ID:</span> <strong>{policyDetails.transactionId}</strong></div>
                  </div>
                </div>
              </div>

              <div className="cert-footer-banner">
                <i className="fa-solid fa-circle-check"></i> Digitally Signed & Verified Certificate
              </div>
            </div>

            {/* Quick Actions */}
            <div className="action-grid">
              <div className="action-item" onClick={() => window.print()}>
                <i className="fa-solid fa-file-pdf"></i>
                <p>Download PDF</p>
              </div>
              <div className="action-item" onClick={() => window.location.href=`mailto:?subject=Insurance&body=${referenceNumber}`}>
                <i className="fa-solid fa-envelope"></i>
                <p>Email Policy</p>
              </div>
            </div>

            <button className="finish-btn" onClick={() => navigate('/dashboard')}>
              Go to Home <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyReference;