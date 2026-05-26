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
  
  const [errors, setErrors] = useState({});
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
  const API_BASE_URL = "http://localhost:5000/api/payments";

  const getRedirectPath = () => {
    const flow = localStorage.getItem('activeFlow');
    return flow === 'travel' ? '/travel-success' : '/policy-reference';
  };

  const handleBackClick = () => {
    const confirmBack = window.confirm("Are you sure you want to go back? Your payment progress will be lost.");
    if (confirmBack) {
      navigate(-1);
    }
  };

  // --- VALIDATION UTILITIES ---

  const validateCardNumber = (number) => {
    const raw = number.replace(/\s/g, '');
    if (raw.length !== 16) return "Card number must be 16 digits";
    
    let sum = 0;
    for (let i = 0; i < raw.length; i++) {
      let intVal = parseInt(raw.substr(i, 1));
      if (i % 2 === 0) {
        intVal *= 2;
        if (intVal > 9) intVal = 1 + (intVal % 10);
      }
      sum += intVal;
    }
    return sum % 10 === 0 ? null : "Invalid card number (Luhn check failed)";
  };

  const validateExpiry = (expiry) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Use MM/YY format";
    const [month, year] = expiry.split('/').map(n => parseInt(n));
    if (month < 1 || month > 12) return "Invalid month";
    
    const now = new Date();
    const expiryDate = new Date(`20${year}`, month - 1);
    if (expiryDate < now) return "Card has expired";
    return null;
  };

  // --- SIDE EFFECTS ---

  useEffect(() => {
    if (showQRCode && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showQRCode && countdown === 0) {
      handlePaymentTimeout();
    }
  }, [showQRCode, countdown]);

  useEffect(() => {
    setErrors({});
    if (paymentMethod !== 'upi') setShowQRCode(false);
    if (paymentMethod !== 'net-banking') {
      setNetBankStage('details');
      setBankError('');
    }
  }, [paymentMethod]);

  // --- INPUT HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      const cleaned = value.replace(/\D/g, '');
      formattedValue = cleaned.match(/.{1,4}/g)?.join(' ') || '';
    } else if (name === 'expiry') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        formattedValue = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      } else {
        formattedValue = cleaned;
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardData({ ...cardData, [name]: formattedValue });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleNetBankInputChange = (e) => {
    const { name, value } = e.target;
    setNetBankData({ ...netBankData, [name]: value });
    if (bankError) setBankError('');
  };

  const handlePaymentTimeout = () => {
    setShowQRCode(false);
    setUpiId('');
    setCountdown(300);
    alert('QR Code expired. Please try again.');
  };

  // --- BACKEND INTEGRATED SUBMISSIONS ---

  // 1. Credit Card Submit
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    const cardError = validateCardNumber(cardData.number);
    const expiryError = validateExpiry(cardData.expiry);
    const nameError = !cardData.name.trim() ? "Name is required" : null;
    const cvvError = cardData.cvv.length < 3 ? "Invalid CVV" : null;

    if (cardError || expiryError || nameError || cvvError) {
      setErrors({ number: cardError, expiry: expiryError, name: nameError, cvv: cvvError });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/credit-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: cardData.number,
          name: cardData.name,
          expiry: cardData.expiry,
          cvv: cardData.cvv
        })
      });
      const data = await response.json();

      if (data.success) {
        alert('Processing Secure Payment...');
        localStorage.setItem('paymentCompleted', 'true');
        localStorage.setItem('policyReferenceNumber', data.policyReferenceNumber);
        setTimeout(() => navigate(getRedirectPath()), 2000);
      } else {
        alert("Payment Failed: " + data.message);
      }
    } catch (err) {
      alert("Error connecting to the payment server.");
    }
  };

  // 2. UPI Initiate
  const handleUPISubmit = async (e) => {
    e.preventDefault();
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiRegex.test(upiId)) {
      setErrors({ upi: "Please enter a valid UPI ID (e.g., name@bank)" });
      return;
    }
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/upi/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId })
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('policyReferenceNumber', data.policyReferenceNumber);
        setShowQRCode(true);
        setCountdown(300);
      } else {
        alert("Could not generate QR Code: " + data.message);
      }
    } catch (err) {
      alert("Error connecting to the payment server.");
    }
  };

  // 3. UPI Confirm
  const completeUPIPayment = async () => {
    const policyReferenceNumber = localStorage.getItem('policyReferenceNumber');
    try {
      const response = await fetch(`${API_BASE_URL}/upi/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyReferenceNumber })
      });
      const data = await response.json();

      if (data.success) {
        alert('UPI Payment Successful!');
        localStorage.setItem('paymentCompleted', 'true');
        setTimeout(() => navigate(getRedirectPath()), 1500);
      } else {
        alert("Verification failed. Please retry.");
      }
    } catch (err) {
      alert("Error verifying payment verification hook.");
    }
  };

  // 4. Net Banking Details Form Handlers
  const handleNetBankSubmit = (e) => {
    e.preventDefault();
    const { account, ifsc, holder } = netBankData;
    
    if (account.length < 9) return setBankError("Enter a valid account number (min 9 digits)");
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())) {
        return setBankError("Invalid IFSC format (e.g. ABCD0123456)");
    }
    if (!holder.trim()) return setBankError("Account holder name is required");

    setBankError('');
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(generatedOtp);
    setEnteredOtp('');
    setNetBankStage('otp');
  };

  // 5. Net Banking OTP Verification
  const verifyNetBankOtp = async (e) => {
    e.preventDefault();
    if (enteredOtp !== otp) {
      setBankError('Invalid OTP. Please try again.');
      return;
    }
    setBankError('');

    try {
      const response = await fetch(`${API_BASE_URL}/net-banking/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(netBankData)
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('paymentCompleted', 'true');
        localStorage.setItem('policyReferenceNumber', data.policyReferenceNumber);
        setNetBankStage('success');
        setTimeout(() => navigate(getRedirectPath()), 2000);
      } else {
        setBankError(data.message || "Netbanking processing failed.");
      }
    } catch (err) {
      alert("Server failure processing net banking transmission.");
    }
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
          <div className="back-navigation">
            <button type="button" className="secondary-back-btn" onClick={handleBackClick}>
              <i className="fa-solid fa-chevron-left"></i> Go Back
            </button>
          </div>
        </div>

        {/* Right Side: Visual Card & Form */}
        <div className="checkout-form-area">
          {paymentMethod === 'credit-card' ? (
            <div className="card-ux-container">
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
                      <div>{cardData.name.toUpperCase() || "FULL NAME"}</div>
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
                <div className={`form-input-group ${errors.number ? 'has-error' : ''}`}>
                  <label>Card Number</label>
                  <input 
                    name="number" 
                    value={cardData.number}
                    maxLength="19" 
                    placeholder="0000 0000 0000 0000"
                    onChange={handleInputChange}
                    onFocus={() => setCardData({...cardData, focused: 'number'})}
                  />
                  {errors.number && <span className="error-msg">{errors.number}</span>}
                </div>
                <div className={`form-input-group ${errors.name ? 'has-error' : ''}`}>
                  <label>Card Holder</label>
                  <input 
                    name="name" 
                    placeholder="John Doe"
                    onChange={handleInputChange}
                    onFocus={() => setCardData({...cardData, focused: 'name'})}
                  />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>
                <div className="form-row">
                  <div className={`form-input-group ${errors.expiry ? 'has-error' : ''}`}>
                    <label>Expiry</label>
                    <input 
                      name="expiry" 
                      value={cardData.expiry}
                      placeholder="MM/YY"
                      maxLength="5"
                      onChange={handleInputChange}
                      onFocus={() => setCardData({...cardData, focused: 'expiry'})}
                    />
                    {errors.expiry && <span className="error-msg">{errors.expiry}</span>}
                  </div>
                  <div className={`form-input-group ${errors.cvv ? 'has-error' : ''}`}>
                    <label>CVV</label>
                    <input 
                      name="cvv" 
                      value={cardData.cvv}
                      maxLength="3"
                      placeholder="***"
                      onChange={handleInputChange}
                      onFocus={() => setCardData({...cardData, focused: 'cvv'})}
                    />
                    {errors.cvv && <span className="error-msg">{errors.cvv}</span>}
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
                  <div className={`form-input-group ${errors.upi ? 'has-error' : ''}`}>
                    <label>Enter UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => { setUpiId(e.target.value); setErrors({}); }}
                    />
                    {errors.upi && <span className="error-msg">{errors.upi}</span>}
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
                  </div>
                  <div className="qr-actions">
                    <button onClick={completeUPIPayment} className="complete-pay-btn">
                      Confirm Payment <i className="fa-solid fa-check"></i>
                    </button>
                    <button onClick={() => setShowQRCode(false)} className="cancel-btn">
                      Cancel <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="netbanking-payment-container">
              {netBankStage === 'details' && (
                <form onSubmit={handleNetBankSubmit} className="upi-form">
                   <div className="upi-header">
                    <i className="fa-solid fa-building-columns"></i>
                    <h2>Net Banking</h2>
                  </div>
                  <div className="form-input-group">
                    <label>Account Number</label>
                    <input name="account" placeholder="1234567890" value={netBankData.account} onChange={handleNetBankInputChange} />
                  </div>
                  <div className="form-input-group">
                    <label>IFSC Code</label>
                    <input name="ifsc" placeholder="ABCD0123456" value={netBankData.ifsc} onChange={handleNetBankInputChange} />
                  </div>
                  <div className="form-input-group">
                    <label>Account Holder</label>
                    <input name="holder" placeholder="John Doe" value={netBankData.holder} onChange={handleNetBankInputChange} />
                  </div>
                  {bankError && <p className="error-msg">{bankError}</p>}
                  <button type="submit" className="complete-pay-btn">Generate OTP</button>
                </form>
              )}
              {netBankStage === 'otp' && (
                <form onSubmit={verifyNetBankOtp} className="upi-form">
                   <h2>Enter OTP</h2>
                   <input 
                    className="otp-input"
                    maxLength="4" 
                    value={enteredOtp} 
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))} 
                   />
                   {bankError && <p className="error-msg">{bankError}</p>}
                   <p className="otp-hint">Demo OTP: {otp}</p>
                   <button type="submit" className="complete-pay-btn">Verify & Pay</button>
                </form>
              )}
              {netBankStage === 'success' && (
                <div className="upi-form" style={{textAlign: 'center', padding: '20px'}}>
                  <i className="fa-solid fa-circle-check" style={{fontSize: '3rem', color: '#2ecc71', marginBottom: '15px'}}></i>
                  <h2>Authentication Successful!</h2>
                  <p>Securing details with backend systems...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;