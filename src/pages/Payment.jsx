import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const navigate = useNavigate();

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    // Simulate payment processing
    alert('Payment processing...');

    // Set payment as completed in localStorage
    localStorage.setItem('paymentCompleted', 'true');

    // Redirect to policy reference page
    setTimeout(() => {
      navigate('/policy-reference');
    }, 2000);
  };

  return (
    <div className="payment-container">
      {/* Header Section */}
      <div className="payment-header">
        <h1>Payment</h1>
        <p>Complete your insurance payment</p>
      </div>

      {/* Content Section */}
      <div className="payment-content">
        <div className="payment-card">
          <h2>Payment Details</h2>

          <div className="payment-summary">
            <h3>Insurance Premium Summary</h3>
            <div className="summary-item">
              <span>Basic Coverage:</span>
              <span>$500.00</span>
            </div>
            <div className="summary-item">
              <span>Additional Coverage:</span>
              <span>$200.00</span>
            </div>
            <div className="summary-item total">
              <span>Total Amount:</span>
              <span>$700.00</span>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit}>
            <div className="form-group">
              <label htmlFor="payment-method">Payment Method</label>
              <select
                id="payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="">Select Payment Method</option>
                <option value="credit-card">Credit Card</option>
                <option value="debit-card">Debit Card</option>
                <option value="net-banking">Net Banking</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            {(paymentMethod === 'credit-card' || paymentMethod === 'debit-card') && (
              <>
                <div className="form-group">
                  <label htmlFor="card-holder-name">Card Holder Name</label>
                  <input
                    type="text"
                    id="card-holder-name"
                    placeholder="Enter card holder name"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input
                    type="text"
                    id="card-number"
                    placeholder="Enter card number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength="16"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry-date">Expiry Date</label>
                    <input
                      type="text"
                      id="expiry-date"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      maxLength="5"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="pay-btn">
              Pay $700.00
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
