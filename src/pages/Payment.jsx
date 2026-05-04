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
  const UPI_AMOUNT = '700.00';
  const [netBankData, setNetBankData] = useState({ account: '', ifsc: '', holder: '' });
  const [netBankStage, setNetBankStage] = useState('details');
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [bankError, setBankError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (showQRCode && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showQRCode && countdown === 0) {
      handlePaymentTimeout();
    }
  }, [showQRCode, countdown]);

  useEffect(() => {
    if (paymentMethod !== 'upi') {
      setShowQRCode(false);
    }
    if (paymentMethod !== 'net-banking') {
      setNetBankStage('details');
      setBankError('');
      setEnteredOtp('');
      setOtp('');
    }
  }, [paymentMethod]);

  const handleUPISubmit = (e) => {
    e.preventDefault();
    setUpiId(upiId.trim());
    setShowQRCode(true);
    setCountdown(300);
  };

  const handlePaymentTimeout = () => {
    setShowQRCode(false);
    setUpiId('');
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
    if (name === 'number') {
      const cleaned = value.replace(/\D/g, '');
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
      setCardData({ ...cardData, [name]: formatted });
      return;
    }
    setCardData({ ...cardData, [name]: value });
  };

  const handleNetBankInputChange = (e) => {
    const { name, value } = e.target;
    setNetBankData({ ...netBankData, [name]: value });
  };

  const handleNetBankSubmit = (e) => {
    e.preventDefault();
    const { account, ifsc, holder } = netBankData;
    if (!account || !ifsc || !holder) {
      setBankError('Please fill in all net banking details.');
      return;
    }
    setBankError('');
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(generatedOtp);
    setEnteredOtp('');
    setNetBankStage('otp');
  };

  const verifyNetBankOtp = (e) => {
    e.preventDefault();
    if (enteredOtp !== otp) {
      setBankError('Invalid OTP. Please try again.');
      return;
    }
    setBankError('');
    localStorage.setItem('paymentCompleted', 'true');
    const policyRef = `POL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    localStorage.setItem('policyReferenceNumber', policyRef);
    setNetBankStage('success');
    setTimeout(() => navigate('/policy-reference'), 2000);
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
                    value={cardData.number}
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
                    />
                  </div>
                  <p className="upi-instruction">Enter your UPI ID to generate the payment QR code for ₹{UPI_AMOUNT}.</p>
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
                    {/* <p className="upi-display">{upiId || 'UPI ID not provided'}</p> */}
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
          ) : paymentMethod === 'net-banking' ? (
            <div className="netbanking-payment-container">
              {netBankStage === 'details' && (
                <form onSubmit={handleNetBankSubmit} className="upi-form">
                  <div className="upi-header">
                    <i className="fa-solid fa-building-columns"></i>
                    <h2>Net Banking</h2>
                  </div>
                  <div className="form-input-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      name="account"
                      placeholder="123456789012"
                      value={netBankData.account}
                      onChange={handleNetBankInputChange}
                    />
                  </div>
                  <div className="form-input-group">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      name="ifsc"
                      placeholder="ICIC0001234"
                      value={netBankData.ifsc}
                      onChange={handleNetBankInputChange}
                    />
                  </div>
                  <div className="form-input-group">
                    <label>Account Holder Name</label>
                    <input
                      type="text"
                      name="holder"
                      placeholder="John Doe"
                      value={netBankData.holder}
                      onChange={handleNetBankInputChange}
                    />
                  </div>
                  {bankError && <p className="form-error">{bankError}</p>}
                  <button type="submit" className="complete-pay-btn">
                    Generate OTP <i className="fa-solid fa-key"></i>
                  </button>
                </form>
              )}
              {netBankStage === 'otp' && (
                <form onSubmit={verifyNetBankOtp} className="upi-form">
                  <div className="upi-header">
                    <i className="fa-solid fa-lock"></i>
                    <h2>Enter OTP</h2>
                    <p className="upi-instruction">OTP sent to your registered mobile number.</p>
                  </div>
                  <div className="form-input-group">
                    <label>OTP</label>
                    <input
                      type="text"
                      name="otp"
                      maxLength="4"
                      placeholder="1234"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  {bankError && <p className="form-error">{bankError}</p>}
                  <p className="upi-notice">For demo, use OTP: <strong>{otp}</strong></p>
                  <button type="submit" className="complete-pay-btn">
                    Verify OTP <i className="fa-solid fa-check"></i>
                  </button>
                </form>
              )}
              {netBankStage === 'success' && (
                <div className="payment-success-card">
                  <div className="success-icon">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <h2>Payment Successful!</h2>
                  <p>Your net banking payment was completed successfully.</p>
                  <button onClick={() => navigate('/policy-reference')} className="complete-pay-btn">
                    Go to Policy Reference
                  </button>
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