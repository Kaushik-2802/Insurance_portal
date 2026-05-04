import React, { useState, useEffect } from 'react';
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
  const [upiId, setUpiId] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [qrCode, setQrCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (showQRCode && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showQRCode && countdown === 0) {
      handlePaymentTimeout();
    }
  }, [showQRCode, countdown]);

  const generateQRCode = (text) => {
    try {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}&ecc=M`;
      return qrCodeUrl;
    } catch (error) {
      console.error('QR Code generation error:', error);
      return null;
    }
  };

  const handleUPISubmit = (e) => {
    e.preventDefault();
    if (!upiId) {
      alert('Please enter a valid UPI ID');
      return;
    }
    const upiString = `upi://pay?pa=${upiId.trim()}&pn=InsurancePayment&am=700&tn=PolicyPayment&tr=${Date.now()}`;
    const qrUrl = generateQRCode(upiString);
    if (qrUrl) {
      setQrCode(qrUrl);
      setShowQRCode(true);
      setCountdown(300);
    } else {
      alert('Failed to generate QR code. Please try again.');
    }
  };

  const handlePaymentTimeout = () => {
    setShowQRCode(false);
    setUpiId('');
    setQrCode('');
    setCountdown(300);
    alert('QR Code expired. Please try again.');
  };

  const completeUPIPayment = () => {
    alert('UPI Payment Successful!');
    localStorage.setItem('paymentCompleted', 'true');
    const policyRef = `POL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    localStorage.setItem('policyReferenceNumber', policyRef);
    setTimeout(() => navigate('/policy-reference'), 1500);
  };

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
          ) : paymentMethod === 'upi' ? (
            <div className="upi-payment-container">
              {!showQRCode ? (
                <form onSubmit={handleUPISubmit} className="upi-form">
                  <div className="upi-header">
                    <i className="fa-solid fa-mobile-screen"></i>
                    <h2>UPI Payment</h2>
                  </div>
                  <div className="form-input-group">
                    <label>Enter UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="complete-pay-btn">
                    Generate QR Code <i className="fa-solid fa-qrcode"></i>
                  </button>
                </form>
              ) : (
                <div className="qr-code-display">
                  <div className="qr-header">
                    <h3>Scan to Pay</h3>
                    <div className="countdown-timer">
                      <span className={countdown <= 60 ? 'warning' : ''}>
                        {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <div className="qr-body">
                    <img src="/qr_code_1.jpg" alt="Payment QR Code" className="qr-image" />
                    <p className="upi-display">{upiId}</p>
                  </div>

                  <div className="policy-amount-section">
                    <div className="amount-card">
                      <div className="amount-header">
                        <i className="fa-solid fa-receipt"></i>
                        <span>Policy Premium</span>
                      </div>
                      <div className="amount-breakdown">
                        <div className="breakdown-item">
                          <span>Basic Coverage</span>
                          <span className="amount-value">$500.00</span>
                        </div>
                        <div className="breakdown-item">
                          <span>Add-ons</span>
                          <span className="amount-value">$200.00</span>
                        </div>
                        <div className="breakdown-divider"></div>
                        <div className="breakdown-item total">
                          <span>Total Amount</span>
                          <span className="total-amount">$700.00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="qr-actions">
                    <button onClick={completeUPIPayment} className="complete-pay-btn">
                      Confirm Payment <i className="fa-solid fa-check"></i>
                    </button>
                    <button 
                      onClick={() => setShowQRCode(false)} 
                      className="cancel-btn"
                    >
                      Cancel <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              )}
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