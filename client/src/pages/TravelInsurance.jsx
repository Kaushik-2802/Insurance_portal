import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TravelInsurance.css';
import InnerHeader from '../components/InnerHeader';
import Footer from '../components/Footer';

export default function TravelInsurance() {
  const [step, setStep] = useState('type');
  const [travelType, setTravelType] = useState('');
  // Changed 'country' to 'destination' to handle both states and countries cleanly
  const [tripData, setTripData] = useState({ destination: '', startDate: '', endDate: '' });
  const [memberData, setMemberData] = useState({ name: '', age: '', mobile: '', email: '', address: '' });
  const [members, setMembers] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [healthAnswers, setHealthAnswers] = useState({ q1: 'no', q2: 'no', q3: 'no', q4: 'no' });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const addonsList = [
    { id: 'ped', title: 'Life Threatening Condition Cover', price: 98, icon: 'fa-heart-pulse' },
    { id: 'adventure', title: 'Adventure Sports Cover', price: 449, icon: 'fa-person-snowboarding' },
    { id: 'sports', title: 'General Sports Cover', price: 1537, icon: 'fa-table-tennis-paddle-ball' },
    { id: 'visa', title: 'Refund of Visa Fee', price: 1365, icon: 'fa-passport' },
    { id: 'hotel', title: 'Emergency Hotel Accommodation', price: 24, icon: 'fa-bed' },
  ];

  const handleTravelTypeSelect = (type) => { setTravelType(type); setStep('trip'); };
  const handleTripInputChange = (e) => setTripData({ ...tripData, [e.target.name]: e.target.value });
  const handleMemberInputChange = (e) => setMemberData({ ...memberData, [e.target.name]: e.target.value });
  const clearMemberForm = () => setMemberData({ name: '', age: '', mobile: '', email: '', address: '' });
  const handleHealthChange = (q, val) => setHealthAnswers({ ...healthAnswers, [q]: val });
  const toggleAddon = (id) => setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);

  const validateTripData = () => {
    const newErrors = {};
    // Dynamic validation message based on travel type
    if (!tripData.destination.trim()) newErrors.destination = travelType === 'domestic' ? 'State required' : 'Country required';
    if (!tripData.startDate) newErrors.startDate = 'Required';
    if (!tripData.endDate) newErrors.endDate = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMemberData = () => {
    const newErrors = {};
    if (!memberData.name.trim()) newErrors.name = 'Required';
    if (!memberData.age || memberData.age < 1) newErrors.age = 'Invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (nextStep) => {
    if (step === 'trip' && !validateTripData()) return;
    setErrors({});
    setStep(nextStep);
  };

  const handleAddMember = () => {
    if (!validateMemberData()) return;
    setMembers([...members, memberData]);
    clearMemberForm();
    setErrors({});
  };

  const handleMembersToAddons = () => {
    if (memberData.name) {
      if (!validateMemberData()) return;
      setMembers([...members, memberData]);
      clearMemberForm();
    } else if (members.length === 0) {
      validateMemberData();
      return;
    }
    setErrors({});
    setStep('addons');
  };

  const handleBack = () => {
    const flows = { trip: 'type', members: 'trip', addons: 'members', health: 'addons', confirmation: 'health' };
    setStep(flows[step] || 'type');
  };
  const userId=localStorage.getItem("userId");

  const handleProceedToPayment = async () => {
    // 1. Capture the exact premium calculated on the UI
    localStorage.removeItem("vehicleDetails");
    const payload = {
      userId,
      travelType,
      tripData,
      members,
      selectedAddons,
      healthAnswers,
      amountToPay: totalPremium // Add this line to pass the cost forward
    };

    try {
      const token = localStorage.getItem("token");

if (!token) {

  alert("Session expired. Please login again.");

  navigate("/login");

  return;
}

const response = await fetch(
  "http://localhost:5000/api/travel/booking",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },

    body: JSON.stringify(payload)
  }
);
      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem("activeFlow", 'travel');
        // Storing the payload with amountToPay included
        const dataToStore = {
          ...payload,
          // Extract the policyNo sent by your backend router logic
          policyNo: result.policyNo || result.data?.policyNo 
        };

        localStorage.setItem("travelInsuranceData", JSON.stringify(dataToStore));
        navigate("/payment");
      } else {
        alert("Failed to save the data: " + result.message);
      }
    } catch (error) {
      console.error("Network integration layer fault: ", error);
      alert("Connection lost to server. Please try again later");
    }
  };

  const handleSidebarContinue = () => {
    if (step === 'trip') handleNext('members');
    else if (step === 'members') handleMembersToAddons();
    else if (step === 'addons') handleNext('health');
    else if (step === 'health') handleNext('confirmation');
  };

  const basePremium = 1607;
  const addonTotal = selectedAddons.reduce((sum, id) => sum + (addonsList.find(a => a.id === id)?.price || 0), 0);
  const familyDiscount = members.length > 1 ? 42 : 0;
  const totalPremium = basePremium + addonTotal - familyDiscount;

  const stepsList = ['type', 'trip', 'members', 'addons', 'health', 'confirmation'];
  const currentStepIdx = stepsList.indexOf(step);

  return (
    <div className="neo-wrapper">
      <InnerHeader />

      <div className="neo-bg-layer" aria-hidden="true">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
      </div>

      <main className="neo-container">
        {step !== 'type' && (
          <nav className="neo-stepper" aria-label="Progress">
            {['Destination', 'Details', 'Travelers', 'Add-ons', 'Health'].map((label, idx) => (
              <div key={idx} className={`step-item ${currentStepIdx >= idx ? 'active' : ''} ${currentStepIdx === idx ? 'current' : ''}`}>
                <div className="step-dot" />
                <span className="step-label">{label}</span>
              </div>
            ))}
          </nav>
        )}

        <div className="neo-split-layout">
          <section className="neo-main-content">
            {step === 'type' && (
              <div className="type-hero-section animate-fade-in">
                <div className="type-header">
                  <span className="neo-subtitle">Secure Your Journey</span>
                  <h1 className="neo-title massive">
                    Where are we flying?&nbsp;
                    <i className="fa-solid fa-plane-departure highlight" aria-hidden="true" />
                  </h1>
                  <p className="neo-desc">Unlock premium coverage and get up to 20% discount on family trips.</p>
                </div>
                
                <div className="neo-type-grid massive-grid">
                  <div className="neo-type-box massive-box" onClick={() => handleTravelTypeSelect('international')} role="button" tabIndex={0}>
                    <span className="type-icon"><i className="fa-solid fa-earth-americas" aria-hidden="true" /></span>
                    <h3>International</h3>
                    <p>Global Protection</p>
                  </div>
                  
                  <div className="neo-type-box massive-box outline" onClick={() => handleTravelTypeSelect('domestic')} role="button" tabIndex={0}>
                    <span className="type-icon"><i className="fa-solid fa-map-location-dot" aria-hidden="true" /></span>
                    <h3>Domestic</h3>
                    <p>Local Adventures</p>
                  </div>
                </div>
              </div>
            )}

            {step === 'trip' && (
              <div className="glass-card animate-fade-in">
                <h2 className="neo-title">Trip Logistics</h2>
                <div className="neo-input-group">
                  {/* Dynamic Label based on travelType */}
                  <label htmlFor="destination">{travelType === 'domestic' ? 'Destination State' : 'Destination Country'}</label>
                  <div className="input-wrapper">
                    <i className="fa-solid fa-location-dot input-icon" aria-hidden="true" />
                    <input
                      id="destination" type="text" name="destination"
                      // Dynamic Placeholder based on travelType
                      placeholder={travelType === 'domestic' ? 'e.g. Kerala, Goa, Rajasthan' : 'e.g. USA, Japan, Switzerland'}
                      value={tripData.destination} onChange={handleTripInputChange}
                      className={errors.destination ? 'error' : ''}
                    />
                  </div>
                  {errors.destination && <span className="neo-error">{errors.destination}</span>}
                </div>
                <div className="neo-row">
                  <div className="neo-input-group">
                    <label htmlFor="startDate">Take-off Date</label>
                    <input id="startDate" type="date" name="startDate" value={tripData.startDate} onChange={handleTripInputChange} className={errors.startDate ? 'error' : ''}  min={new Date().toISOString().split("T")[0]} />
                    {errors.startDate && <span className="neo-error">{errors.startDate}</span>}
                  </div>
                  <div className="neo-input-group">
                    <label htmlFor="endDate">Return Date</label>
                    <input id="endDate" type="date" name="endDate" value={tripData.endDate} onChange={handleTripInputChange} className={errors.endDate ? 'error' : ''} min={tripData.startDate}/>
                    {errors.endDate && <span className="neo-error">{errors.endDate}</span>}
                  </div>
                </div>
                <div className="neo-actions">
                  <button type="button" className="neo-btn-text" onClick={handleBack}>← Back</button>
                  <button type="button" className="neo-btn-gradient" onClick={() => handleNext('members')}>
                    Next Step&nbsp;<i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {step === 'members' && (
              <div className="glass-card animate-fade-in">
                <h2 className="neo-title">Passenger Manifest</h2>
                {members.length > 0 && (
                  <div className="neo-member-preview">
                    {members.map((member, index) => (
                      <div className="member-chip" key={index}>
                        <div className="chip-avatar"><i className="fa-solid fa-user" aria-hidden="true" /></div>
                        <div className="chip-info">
                          <strong>{member.name}</strong>
                          <span>{member.age} yrs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="neo-input-group">
                  <label htmlFor="mem-name">Full Name</label>
                  <input id="mem-name" type="text" name="name" value={memberData.name} onChange={handleMemberInputChange} placeholder="As per Passport" className={errors.name ? 'error' : ''} />
                  {errors.name && <span className="neo-error">{errors.name}</span>}
                </div>
                <div className="neo-row">
                  <div className="neo-input-group">
                    <label htmlFor="mem-age">Age</label>
                    <input id="mem-age" type="number" name="age" value={memberData.age} onChange={handleMemberInputChange} placeholder="Years" min={1} className={errors.age ? 'error' : ''} />
                    {errors.age && <span className="neo-error">{errors.age}</span>}
                  </div>
                  <div className="neo-input-group">
                    <label htmlFor="mem-mobile">Mobile Number</label>
                    <input id="mem-mobile" type="tel" name="mobile" value={memberData.mobile} onChange={handleMemberInputChange} placeholder="Mobile" />
                  </div>
                </div>
                <div className="neo-input-group">
                  <label htmlFor="mem-email">Email Address</label>
                  <input id="mem-email" type="email" name="email" value={memberData.email} onChange={handleMemberInputChange} placeholder="Email" />
                </div>
                <div className="neo-actions">
                  <button type="button" className="neo-btn-text" onClick={handleBack}>← Back</button>
                  <div className="action-right-group">
                    <button type="button" className="neo-btn-outline" onClick={handleAddMember}>
                      <i className="fa-solid fa-user-plus" aria-hidden="true" /> Add Person
                    </button>
                    <button type="button" className="neo-btn-gradient" onClick={handleMembersToAddons}>Continue</button>
                  </div>
                </div>
              </div>
            )}

            {step === 'addons' && (
              <div className="glass-card animate-fade-in">
                <h2 className="neo-title">Enhance Your Cover</h2>
                <p className="neo-desc">Select premium add-ons for total peace of mind.</p>
                <div className="neo-addon-list">
                  {addonsList.map(addon => (
                    <div
                      key={addon.id}
                      className={`neo-addon-row ${selectedAddons.includes(addon.id) ? 'active' : ''}`}
                      onClick={() => toggleAddon(addon.id)}
                      role="checkbox" aria-checked={selectedAddons.includes(addon.id)}
                      tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleAddon(addon.id)}
                    >
                      <div className="addon-icon-wrap">
                        <i className={`fa-solid ${addon.icon}`} aria-hidden="true" />
                      </div>
                      <div className="addon-details">
                        <span className="addon-title">{addon.title}</span>
                        <span className="addon-price">+ ₹{addon.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className={`addon-toggle ${selectedAddons.includes(addon.id) ? 'on' : 'off'}`}>
                        <div className="toggle-knob" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="neo-actions">
                  <button type="button" className="neo-btn-text" onClick={handleBack}>← Back</button>
                  <button type="button" className="neo-btn-gradient" onClick={() => handleNext('health')}>Proceed to Health</button>
                </div>
              </div>
            )}

            {step === 'health' && (
              <div className="glass-card animate-fade-in">
                <div className="neo-health-info-card">
                  <div className="health-card-copy">
                    <h3 className="neo-title m-0">Health Check Snapshot</h3>
                    <p className="neo-desc">Review your medical declaration with a quick glance before you continue.</p>
                    <button type="button" className="neo-btn-text health-back-button" onClick={handleBack}>
                      <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Back
                    </button>
                  </div>
                  <div className="health-card-image">
                    <img src="/health_img.png" alt="Health travel illustration" />
                  </div>
                </div>
                <div className="neo-health-header">
                  <h2 className="neo-title m-0">Medical Declaration</h2>
                  <i className="fa-solid fa-stethoscope highlight-icon" aria-hidden="true" />
                </div>
                <div className="neo-health-body">
                  {[
                    { q: 'q1', text: 'Does any person(s) to be insured have any Pre-existing diseases?' },
                    { q: 'q2', text: 'Has anyone been diagnosed or hospitalized during the last 48 months?' },
                    { q: 'q3', text: 'Have you ever claimed under any travel policy?' },
                    { q: 'q4', text: 'Does any of the insured members fall under Politically Exposed Persons (PEPs)?' },
                  ].map((item, idx) => (
                    <div className="neo-question-row" key={item.q}>
                      <div className="q-text">
                        <span className="q-num">{idx + 1}.</span>
                        <p>{item.text}</p>
                      </div>
                      <div className="neo-radio-group">
                        <label className={`neo-radio ${healthAnswers[item.q] === 'yes' ? 'selected-yes' : ''}`}>
                          <input type="radio" name={item.q} checked={healthAnswers[item.q] === 'yes'} onChange={() => handleHealthChange(item.q, 'yes')} />
                          Yes
                        </label>
                        <label className={`neo-radio ${healthAnswers[item.q] === 'no' ? 'selected-no' : ''}`}>
                          <input type="radio" name={item.q} checked={healthAnswers[item.q] === 'no'} onChange={() => handleHealthChange(item.q, 'no')} />
                          No
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="neo-actions">
                  <button type="button" className="neo-btn-text" onClick={handleBack}>← Back</button>
                  <button type="button" className="neo-btn-gradient" onClick={() => handleNext('confirmation')}>View Final Summary</button>
                </div>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="glass-card animate-fade-in">
                <div className="neo-confirmation-card">
                  <div className="confirmation-card-copy">
                    <h3 className="neo-title m-0">Final Confirmation</h3>
                    <p className="neo-desc">Your trip details and add-on selection are ready. Review the summary and complete checkout from the sidebar.</p>
                    <button type="button" className="neo-btn-text health-back-button" onClick={handleBack}>
                      <i className="fa-solid fa-arrow-left" aria-hidden="true" /> Back to Health
                    </button>
                  </div>
                  <div className="confirmation-card-image">
                    <img src="/4.png" alt="Travel confirmation illustration" />
                  </div>
                </div>
                <div className="neo-confirmation-summary">
                  <div className="summary-chip">
                    <span>Travel Type</span>
                    <strong>{travelType ? travelType.charAt(0).toUpperCase() + travelType.slice(1) : 'Not selected'}</strong>
                  </div>
                  <div className="summary-chip">
                    <span>Destination</span>
                    <strong>{tripData.destination || 'Pending'}</strong>
                  </div>
                  <div className="summary-chip">
                    <span>Travelers</span>
                    <strong>{members.length > 0 ? `${members.length} Person(s)` : '1 Person'}</strong>
                  </div>
                </div>
              </div>
            )}
          </section>

          {step !== 'type' && (
            <aside className="neo-sidebar animate-slide-up" aria-label="Booking Summary">
              <div className="neo-summary-widget">
                <div className="summary-top">
                  <div className="dest-badge">
                    <i className="fa-solid fa-plane" aria-hidden="true" />
                    {tripData.destination ? tripData.destination.toUpperCase() : 'DESTINATION'}
                  </div>
                  <button className="neo-edit-btn" onClick={() => setStep('trip')} aria-label="Edit destination">
                    <i className="fa-solid fa-pen" aria-hidden="true" />
                  </button>
                </div>
                <div className="summary-meta">
                  <div className="meta-item">
                    <i className="fa-solid fa-users" aria-hidden="true" />
                    <span>{members.length > 0 ? `${members.length} Traveler(s)` : '1 Traveler'}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fa-regular fa-calendar" aria-hidden="true" />
                    <span>
                      {tripData.startDate
                        ? new Date(tripData.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'Dates Pending'}
                    </span>
                  </div>
                </div>
                <div className="neo-receipt">
                  <div className="receipt-row">
                    <span>Base Premium</span>
                    <span>₹{basePremium.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedAddons.length > 0 && (
                    <div className="receipt-row">
                      <span>Add-ons ({selectedAddons.length})</span>
                      <span>₹{addonTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {familyDiscount > 0 && (
                    <div className="receipt-row discount">
                      <span>Family Discount</span>
                      <span>−₹{familyDiscount}</span>
                    </div>
                  )}
                  <div className="receipt-total">
                    <span>Total Payable</span>
                    <span className="total-amount">₹{totalPremium.toLocaleString('en-IN')}</span>
                  </div>
                  {step === 'confirmation' ? (
                    <button className="neo-btn-checkout pulse" onClick={handleProceedToPayment}>
                      <i className="fa-solid fa-shield-check" aria-hidden="true" /> Secure Checkout
                    </button>
                  ) : (
                    <button className="neo-btn-checkout outline" onClick={handleSidebarContinue}>
                      Continue Journey
                    </button>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}