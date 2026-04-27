import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    focused: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    alert('Processing Secure Payment...');
    localStorage.setItem('paymentCompleted', 'true');
    setTimeout(() => navigate('/policy-reference'), 2000);
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        {/* Left Side: Summary & Methods */}
        <div className="checkout-info">
          <div className="brand-header">
            <i className="fa-solid fa-shield-halved"></i>
            <h1>Secure Checkout</h1>
          </div>

          <div className="price-card">
            <span className="price-label">Total Premium</span>
            <h2 className="price-amount">$700.00</h2>
            <div className="price-breakdown">
              <p>Basic Coverage: <span>$500.00</span></p>
              <p>Add-ons: <span>$200.00</span></p>
            </div>
          </div>

          <div className="method-selector">
            <h3>Choose Payment Method</h3>
            <div className="method-grid">
              {['credit-card', 'upi', 'net-banking'].map((method) => (
                <div 
                  key={method}
                  className={`method-tile ${paymentMethod === method ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  <i className={`fa-solid ${method === 'upi' ? 'fa-mobile-screen' : method === 'net-banking' ? 'fa-building-columns' : 'fa-credit-card'}`}></i>
                  <span>{method.replace('-', ' ').toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Visual Card & Form */}
        <div className="checkout-form-area">
          {paymentMethod === 'credit-card' ? (
            <div className="card-ux-container">
              {/* Visual Card Preview */}
              <div className={`visual-card ${cardData.focused === 'cvv' ? 'flipped' : ''}`}>
                <div className="card-front">
                  <div className="card-chip"></div>
                  <div className="card-logo">VISA</div>
                  <div className="card-number-display">
                    {cardData.number || "#### #### #### ####"}
                  </div>
                  <div className="card-bottom">
                    <div className="card-holder">
                      <small>Card Holder</small>
                      <div>{cardData.name || "FULL NAME"}</div>
                    </div>
                    <div className="card-expiry">
                      <small>Expires</small>
                      <div>{cardData.expiry || "MM/YY"}</div>
                    </div>
                  </div>
                </div>
                <div className="card-back">
                  <div className="card-strip"></div>
                  <div className="card-cvv-box">
                    <small>CVV</small>
                    <div className="cvv-display">{cardData.cvv}</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="real-form">
                <div className="form-input-group">
                  <label>Card Number</label>
                  <input 
                    name="number" 
                    maxLength="19" 
                    placeholder="0000 0000 0000 0000"
                    onChange={handleInputChange}
                    onFocus={() => setCardData({...cardData, focused: 'number'})}
                    required 
                  />
                </div>
                <div className="form-input-group">
                  <label>Card Holder</label>
                  <input 
                    name="name" 
                    placeholder="John Doe"
                    onChange={handleInputChange}
                    onFocus={() => setCardData({...cardData, focused: 'name'})}
                    required 
                  />
                </div>
                <div className="form-row">
                  <div className="form-input-group">
                    <label>Expiry</label>
                    <input 
                      name="expiry" 
                      placeholder="MM/YY"
                      onChange={handleInputChange}
                      onFocus={() => setCardData({...cardData, focused: 'expiry'})}
                      required 
                    />
                  </div>
                  <div className="form-input-group">
                    <label>CVV</label>
                    <input 
                      name="cvv" 
                      maxLength="3"
                      placeholder="***"
                      onChange={handleInputChange}
                      onFocus={() => setCardData({...cardData, focused: 'cvv'})}
                      required 
                    />
                  </div>
                </div>
                <button type="submit" className="complete-pay-btn">
                  Confirm Payment <i className="fa-solid fa-lock"></i>
                </button>
              </form>
            </div>
          ) : (
            <div className="other-method-placeholder">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <p>Redirecting to {paymentMethod.toUpperCase()} Gateway...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;