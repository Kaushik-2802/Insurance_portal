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
  
  const [policyDetails, setPolicyDetails] = useState(null);
  const [fallbackIdv, setFallbackIdv] = useState('0');
  
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000/api/payments";

  useEffect(() => {

  const paymentStatus =
    localStorage.getItem(
      "paymentCompleted"
    );

  const storedReferenceNumber =
    localStorage.getItem(
      "policyReferenceNumber"
    );

  const localIdv =
    localStorage.getItem(
      "policyInsuredValue"
    );

  if (localIdv) {
    setFallbackIdv(localIdv);
  }

  if (
    paymentStatus === "true" &&
    storedReferenceNumber
  ) {

    setReferenceNumber(
      storedReferenceNumber
    );

    setPaymentCompleted(true);

    setShowConfetti(true);

    setTimeout(() =>
      setShowConfetti(false),
      5000
    );

    // ✅ JWT TOKEN
    const token =
      localStorage.getItem("token");

    if (!token) {

      alert(
        "Session expired. Please login again."
      );

      navigate("/login");

      return;
    }

    fetch(
      `${API_BASE_URL}/summary/${storedReferenceNumber}`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())

      .then((data) => {

        if (data.success) {

          setPolicyDetails(data);

          setLoading(false);

        } else {

          alert(
            "Error fetching policy details: " +
            data.message
          );

          navigate("/payment");
        }
      })

      .catch((err) => {

        console.error(err);

        alert(
          "Network error loading summary."
        );

        navigate("/payment");
      });

  } else {

    setTimeout(() => {

      navigate("/payment");

    }, 3000);
  }

}, [navigate]);

  const copyToClipboard = () => {
    if (!referenceNumber) return;
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFourWheeler = 
    policyDetails?.vehicleType?.toLowerCase().includes("four") || 
    policyDetails?.policyTitle?.toLowerCase().includes("4w") ||
    !!policyDetails?.carModel;

  const displayModelName = isFourWheeler 
    ? (policyDetails?.carModel || policyDetails?.vehicleModel || "Private Passenger Car")
    : (policyDetails?.bikeModel || policyDetails?.vehicleModel || "Two-Wheeler Motorcycle");

  const finalInsuredValue = fallbackIdv !== '0' ? fallbackIdv : (policyDetails?.insuredValue || '0');

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
                    <i className={copied ? "fa-solid fa-check" : "fa-solid fa-copy" ?? "fa-solid fa-copy"}></i>
                  </button>
                </div>
              </div>

              <div className="cert-main-grid">
                {/* Section 1: Owner & Duration */}
                <div className="cert-section">
                  <h3><i className="fa-solid fa-user"></i> Policy Holder</h3>
                  <div className="data-row"><span>Name:</span> <strong>{policyDetails?.ownerName}</strong></div>
                  <div className="data-row"><span>Plan Option:</span> <strong style={{ fontSize: '0.85rem' }}>{policyDetails?.policyTitle || localStorage.getItem("policyTitle") || "Comprehensive Protection"}</strong></div>
                  <div className="data-row"><span>Valid From:</span> <strong>{policyDetails?.startTime}</strong></div>
                  <div className="data-row"><span>Valid Till:</span> <strong>{policyDetails?.endTime}</strong></div>
                </div>

                {/* Section 2: Dynamic Vehicle Details & IDV */}
                <div className="cert-section">
                  <h3>
                    <i className={isFourWheeler ? "fa-solid fa-car" : "fa-solid fa-motorcycle"}></i> 
                     Vehicle Details
                  </h3>
                  <div className="data-row"><span>Model:</span> <strong>{displayModelName}</strong></div>
                  <div className="data-row"><span>Reg No:</span> <strong>{policyDetails?.registrationNo || "NEW REGISTRATION"}</strong></div>
                  <div className="data-row">
                    <span>Insured Cover (IDV):</span> 
                    <strong className="idv-highlight">
                      {finalInsuredValue === "0" || Number(finalInsuredValue) === 0
                        ? "Third-Party Only (₹0)"
                        : typeof finalInsuredValue === "number" || !isNaN(Number(finalInsuredValue))
                        ? `₹${Number(finalInsuredValue).toLocaleString("en-IN")}`
                        : finalInsuredValue}
                    </strong>
                  </div>
                </div>

                {/* Section 3: Payment Summary */}
                <div className="cert-section full-width">
                  <h3><i className="fa-solid fa-receipt"></i> Payment Details</h3>
                  <div className="payment-flex">
                    <div className="data-row">
                      <span>Paid Amount:</span> 
                      <strong>
                        {typeof policyDetails?.paymentAmount === "number" || !isNaN(Number(policyDetails?.paymentAmount))
                          ? `₹${Number(policyDetails?.paymentAmount).toLocaleString("en-IN")}`
                          : policyDetails?.paymentAmount || localStorage.getItem("policyPrice")}
                      </strong>
                    </div>
                    <div className="data-row"><span>Method:</span> <strong>{policyDetails?.paymentMethod || "Online Gateway"}</strong></div>
                    <div className="data-row"><span>Transaction ID:</span> <strong style={{ wordBreak: 'break-all' }}>{policyDetails?.transactionId}</strong></div>
                  </div>
                </div>
              </div>

              <div className="cert-footer-banner">
                <i className="fa-solid fa-circle-check"></i> Digitally Signed & Verified Certificate (IRDAI Compliant)
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
              Go to Dashboard <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyReference;