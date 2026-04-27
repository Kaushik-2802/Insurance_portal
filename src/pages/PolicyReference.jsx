import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PolicyReference.css';

const PolicyReference = () => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if payment has been completed
    const paymentStatus = localStorage.getItem('paymentCompleted');

    if (paymentStatus === 'true') {
      setPaymentCompleted(true);

      // Check if reference number already exists in localStorage
      const storedReferenceNumber = localStorage.getItem('policyReferenceNumber');

      if (storedReferenceNumber) {
        // Use existing reference number
        setReferenceNumber(storedReferenceNumber);
      } else {
        // Generate a new unique 16-character alphanumeric reference number
        const generateReferenceNumber = () => {
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let uniqueNumber = '';

          for (let i = 0; i < 16; i++) {
            uniqueNumber += characters.charAt(Math.floor(Math.random() * characters.length));
          }

          // Store the new reference number in localStorage
          localStorage.setItem('policyReferenceNumber', uniqueNumber);
          setReferenceNumber(uniqueNumber);
        };

        generateReferenceNumber();
      }
    } else {
      // Payment not completed, redirect to payment page after a short delay
      setTimeout(() => {
        navigate('/payment');
      }, 3000);
    }
  }, [navigate]);

  const handleNext = () => {
    // You can navigate to the next page or perform any action here
    navigate('/');
  };

  return (
    <div className="policy-reference-container">
      {/* Header Section */}
      <div className="policy-reference-header">
        <h1>Policy Reference Number</h1>
        <p>Your unique insurance policy reference number</p>
      </div>

      {/* Content Section */}
      <div className="policy-reference-content">
        <div className="policy-reference-card">
          {!paymentCompleted ? (
            <div className="payment-pending">
              <h2>Payment Required</h2>
              <p>
                To view your policy reference number, you need to complete the payment process first.
              </p>
              <div className="loading-indicator">
                <p>Redirecting to payment page...</p>
                <div className="spinner"></div>
              </div>
            </div>
          ) : (
            <div className="reference-info">
              <h2>Your Insurance Policy Reference Number</h2>
              <p>
                Thank you for choosing our insurance services. We have generated a unique 16-character
                reference number for your policy. This number will help you track and manage your
                insurance policy. Please save this number for future reference as it will be required
                for all your policy-related inquiries, claims, and communications with our support team.
              </p>

              <div className="reference-number-box">
                <p className="reference-label">Reference Number:</p>
                <p className="reference-number">{referenceNumber}</p>
              </div>

              <div className="reference-note">
                <p>This is your unique policy identification number. You can use this number to:</p>
                <ul>
                  <li>Track your policy status</li>
                  <li>File claims</li>
                  <li>Access policy documents</li>
                  <li>Contact our support team</li>
                  <li>Renew your policy</li>
                </ul>
              </div>
            </div>
          )}

          {paymentCompleted && (
            <button className="next-btn" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyReference;
