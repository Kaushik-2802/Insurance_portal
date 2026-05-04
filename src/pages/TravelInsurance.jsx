import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TravelInsurance.css';
import InnerHeader from '../components/InnerHeader';
import Footer from '../components/Footer';

export default function TravelInsurance() {
  const [step, setStep] = useState('type'); // type, trip, members, confirmation
  const [travelType, setTravelType] = useState('');
  const [tripData, setTripData] = useState({
    country: '',
    startDate: '',
    endDate: ''
  });
  const [memberData, setMemberData] = useState({
    name: '',
    age: '',
    mobile: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleTravelTypeSelect = (type) => {
    setTravelType(type);
    setStep('trip');
  };

  const handleTripInputChange = (e) => {
    const { name, value } = e.target;
    setTripData({ ...tripData, [name]: value });
  };

  const validateTripData = () => {
    const newErrors = {};
    if (!tripData.country.trim()) newErrors.country = 'Country is required';
    if (!tripData.startDate) newErrors.startDate = 'Start date is required';
    if (!tripData.endDate) newErrors.endDate = 'End date is required';
    if (tripData.startDate && tripData.endDate && tripData.startDate >= tripData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTripNext = () => {
    if (validateTripData()) {
      setErrors({});
      setStep('members');
    }
  };

  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberData, [name]: value });
  };

  const validateMemberData = () => {
    const newErrors = {};
    if (!memberData.name.trim()) newErrors.name = 'Name is required';
    if (!memberData.age || memberData.age < 18 || memberData.age > 100) {
      newErrors.age = 'Valid age (18-100) is required';
    }
    if (!memberData.mobile || memberData.mobile.length < 10) {
      newErrors.mobile = 'Valid mobile number is required';
    }
    if (!memberData.email || !memberData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    if (!memberData.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMemberNext = () => {
    if (validateMemberData()) {
      setErrors({});
      setStep('confirmation');
    }
  };

  const handleConfirmAndProceed = () => {
    localStorage.setItem('travelInsuranceData', JSON.stringify({
      travelType,
      tripData,
      memberData
    }));
    navigate('/payment');
  };

  const handleBack = () => {
    if (step === 'trip') {
      setStep('type');
      setTravelType('');
    } else if (step === 'members') {
      setStep('trip');
    } else if (step === 'confirmation') {
      setStep('members');
    }
  };

  return (
    <div className="travel-insurance-wrapper">
      <InnerHeader />
      <div className="travel-insurance-container">
        <div className="progress-indicator">
          <div className={`progress-step ${step === 'type' ? 'active' : step === 'trip' || step === 'members' || step === 'confirmation' ? 'completed' : ''}`}>
            <span>1</span>
            <p>Travel Type</p>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step === 'trip' ? 'active' : step === 'members' || step === 'confirmation' ? 'completed' : ''}`}>
            <span>2</span>
            <p>Trip Details</p>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step === 'members' ? 'active' : step === 'confirmation' ? 'completed' : ''}`}>
            <span>3</span>
            <p>Member Info</p>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step === 'confirmation' ? 'active' : ''}`}>
            <span>4</span>
            <p>Confirm</p>
          </div>
        </div>

        {/* Step 1: Travel Type Selection */}
        {step === 'type' && (
          <div className="travel-form-section">
            <div className="form-header">
              <i className="fa-solid fa-globe"></i>
              <h2>Choose Travel Insurance Type</h2>
              <p>Select the type of travel insurance that suits your needs</p>
            </div>

            <div className="travel-type-grid">
              <div
                className="travel-type-card"
                onClick={() => handleTravelTypeSelect('international')}
              >
                <div className="type-icon">
                  <i className="fa-solid fa-passport"></i>
                </div>
                <h3>International Travel</h3>
                <p>Coverage for travel outside your country</p>
                <ul className="type-features">
                  <li><i className="fa-solid fa-check"></i> Multiple countries</li>
                  <li><i className="fa-solid fa-check"></i> Visa assistance</li>
                  <li><i className="fa-solid fa-check"></i> Emergency medical care</li>
                </ul>
              </div>

              <div
                className="travel-type-card"
                onClick={() => handleTravelTypeSelect('domestic')}
              >
                <div className="type-icon">
                  <i className="fa-solid fa-map"></i>
                </div>
                <h3>Domestic Travel</h3>
                <p>Coverage for travel within your country</p>
                <ul className="type-features">
                  <li><i className="fa-solid fa-check"></i> All states covered</li>
                  <li><i className="fa-solid fa-check"></i> Quick claim process</li>
                  <li><i className="fa-solid fa-check"></i> Local hospital access</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Trip Details */}
        {step === 'trip' && (
          <div className="travel-form-section">
            <div className="form-header">
              <i className={`fa-solid ${travelType === 'international' ? 'fa-passport' : 'fa-map'}`}></i>
              <h2>Trip Details</h2>
              <p>Please provide your travel dates and destination</p>
            </div>

            <form className="travel-form">
              <div className="form-input-group">
                <label>
                  {travelType === 'international' ? 'Destination Country' : 'Destination City/State'}
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder={travelType === 'international' ? 'e.g., USA, UK, Canada' : 'e.g., Mumbai, Delhi, Bangalore'}
                  value={tripData.country}
                  onChange={handleTripInputChange}
                  className={errors.country ? 'error' : ''}
                />
                {errors.country && <span className="error-text">{errors.country}</span>}
              </div>

              <div className="form-row">
                <div className="form-input-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={tripData.startDate}
                    onChange={handleTripInputChange}
                    className={errors.startDate ? 'error' : ''}
                  />
                  {errors.startDate && <span className="error-text">{errors.startDate}</span>}
                </div>

                <div className="form-input-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={tripData.endDate}
                    onChange={handleTripInputChange}
                    className={errors.endDate ? 'error' : ''}
                  />
                  {errors.endDate && <span className="error-text">{errors.endDate}</span>}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleBack} className="btn-back">
                  <i className="fa-solid fa-arrow-left"></i> Back
                </button>
                <button type="button" onClick={handleTripNext} className="btn-next">
                  Next <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Member Details */}
        {step === 'members' && (
          <div className="travel-form-section">
            <div className="form-header">
              <i className="fa-solid fa-user"></i>
              <h2>Member Information</h2>
              <p>Please provide your personal details</p>
            </div>

            <form className="travel-form">
              <div className="form-input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={memberData.name}
                  onChange={handleMemberInputChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-input-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="25"
                    min="18"
                    max="100"
                    value={memberData.age}
                    onChange={handleMemberInputChange}
                    className={errors.age ? 'error' : ''}
                  />
                  {errors.age && <span className="error-text">{errors.age}</span>}
                </div>

                <div className="form-input-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="9876543210"
                    value={memberData.mobile}
                    onChange={handleMemberInputChange}
                    className={errors.mobile ? 'error' : ''}
                  />
                  {errors.mobile && <span className="error-text">{errors.mobile}</span>}
                </div>
              </div>

              <div className="form-input-group">
                <label>Email ID</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={memberData.email}
                  onChange={handleMemberInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-input-group">
                <label>Address</label>
                <textarea
                  name="address"
                  placeholder="Enter your full address"
                  rows="3"
                  value={memberData.address}
                  onChange={handleMemberInputChange}
                  className={errors.address ? 'error' : ''}
                ></textarea>
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleBack} className="btn-back">
                  <i className="fa-solid fa-arrow-left"></i> Back
                </button>
                <button type="button" onClick={handleMemberNext} className="btn-next">
                  Next <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirmation' && (
          <div className="travel-form-section">
            <div className="form-header">
              <i className="fa-solid fa-check-circle"></i>
              <h2>Review Your Details</h2>
              <p>Please verify all information before proceeding to payment</p>
            </div>

            <div className="confirmation-cards">
              <div className="confirmation-card">
                <h3>Travel Information</h3>
                <div className="confirm-row">
                  <span>Type</span>
                  <strong>{travelType.charAt(0).toUpperCase() + travelType.slice(1)}</strong>
                </div>
                <div className="confirm-row">
                  <span>Destination</span>
                  <strong>{tripData.country}</strong>
                </div>
                <div className="confirm-row">
                  <span>Start Date</span>
                  <strong>{new Date(tripData.startDate).toLocaleDateString()}</strong>
                </div>
                <div className="confirm-row">
                  <span>End Date</span>
                  <strong>{new Date(tripData.endDate).toLocaleDateString()}</strong>
                </div>
              </div>

              <div className="confirmation-card">
                <h3>Member Details</h3>
                <div className="confirm-row">
                  <span>Name</span>
                  <strong>{memberData.name}</strong>
                </div>
                <div className="confirm-row">
                  <span>Age</span>
                  <strong>{memberData.age}</strong>
                </div>
                <div className="confirm-row">
                  <span>Mobile</span>
                  <strong>{memberData.mobile}</strong>
                </div>
                <div className="confirm-row">
                  <span>Email</span>
                  <strong>{memberData.email}</strong>
                </div>
                <div className="confirm-row">
                  <span>Address</span>
                  <strong>{memberData.address}</strong>
                </div>
              </div>

              <div className="confirmation-card premium-card">
                <h3>Premium</h3>
                <div className="premium-amount">$299.00</div>
                <p>for {travelType} travel insurance</p>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleBack} className="btn-back">
                <i className="fa-solid fa-arrow-left"></i> Back
              </button>
              <button type="button" onClick={handleConfirmAndProceed} className="btn-confirm">
                Proceed to Payment <i className="fa-solid fa-credit-card"></i>
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
