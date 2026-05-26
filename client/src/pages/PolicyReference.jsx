import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import './PolicyReference.css';

const PolicyReference = () => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Dynamic API state replacing old static hardcoding
  const [policyDetails, setPolicyDetails] = useState(null);
  
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000/api/payments";

  useEffect(() => {
    const paymentStatus = localStorage.getItem('paymentCompleted');
    const storedReferenceNumber = localStorage.getItem('policyReferenceNumber');

    if (paymentStatus === 'true' && storedReferenceNumber) {
      setReferenceNumber(storedReferenceNumber);
      setPaymentCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // Fetch unified data from Database
      fetch(`${API_BASE_URL}/summary/${storedReferenceNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPolicyDetails(data);
            setLoading(false);
          } else {
            alert("Error reading payment documents: " + data.message);
            navigate('/payment');
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Network failure pulling transaction data logs.");
          navigate('/payment');
        });

    } else {
      // Redirect to payment if page reached by error/bypassed
      setTimeout(() => navigate('/payment'), 3000);
    }
  }, [navigate]);

  const copyToClipboard = () => {
    if (!referenceNumber) return;
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="policy-root">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} gravity={0.1} />}
      
      <div className="policy-container">
        {(!paymentCompleted || loading) ? (
          <div className="redirect-card">
            <div className="loader-ring"></div>
            <h2>Verifying Transaction Documents...</h2>
            <p>Securing details with database channels. Please do not refresh.</p>
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
                  <span>LTI Insurance</span>
                </div>
                <div className="cert-ref">
                  <small>Policy Reference</small>
                  <strong>{referenceNumber}</strong>
                  <button className="copy-icon-btn" onClick={copyToClipboard} title="Copy Reference Number">
                    <i className={copied ? "fa-solid fa-check" : "fa-solid fa-copy"}></i>
                  </button>
                </div>
              </div>

              <div className="cert-main-grid">
                {/* Section 1: Owner & Duration */}
                <div className="cert-section">
                  <h3><i className="fa-solid fa-user"></i> Policy Holder</h3>
                  <div className="data-row"><span>Name:</span> <strong>{policyDetails?.ownerName}</strong></div>
                  <div className="data-row"><span>Valid From:</span> <strong>{policyDetails?.startTime}</strong></div>
                  <div className="data-row"><span>Valid Till:</span> <strong>{policyDetails?.endTime}</strong></div>
                </div>

                {/* Section 2: Vehicle Details */}
                <div className="cert-section">
                  <h3><i className="fa-solid fa-motorcycle"></i> Vehicle Details</h3>
                  <div className="data-row"><span>Model:</span> <strong>{policyDetails?.bikeModel}</strong></div>
                  <div className="data-row"><span>Reg No:</span> <strong>{policyDetails?.registrationNo}</strong></div>
                  <div className="data-row"><span>IDV (Value):</span> <strong className="idv-highlight">{policyDetails?.insuredValue}</strong></div>
                </div>

                {/* Section 3: Payment Summary */}
                <div className="cert-section full-width">
                  <h3><i className="fa-solid fa-receipt"></i> Payment Details</h3>
                  <div className="payment-flex">
                    <div className="data-row"><span>Paid Amount:</span> <strong>{policyDetails?.paymentAmount}</strong></div>
                    <div className="data-row"><span>Method:</span> <strong>{policyDetails?.paymentMethod}</strong></div>
                    <div className="data-row"><span>Transaction ID:</span> <strong>{policyDetails?.transactionId}</strong></div>
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
              <div className="action-item" onClick={() => window.location.href=`mailto:?subject=LTI Insurance Reference Paper&body=Your policy is active. Ref number is: ${referenceNumber}`}>
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