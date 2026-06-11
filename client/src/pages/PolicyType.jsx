import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Policytype.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

export default function VehiclePolicies() {
  const navigate = useNavigate();
  

  const [category, setCategory] = useState("twoWheeler");
  const [isCategoryLocked, setIsCategoryLocked] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedTenure, setSelectedTenure] = useState(1); 

  useEffect(() => {
    try {
      const rawVehicleDetails = localStorage.getItem("vehicleDetails");
      const rawInsuranceForm = localStorage.getItem("insuranceForm");
      
      let detectedType = null;

      if (rawVehicleDetails) {
  const parsed = JSON.parse(rawVehicleDetails);

  if (parsed.vehicleType === "Two Wheeler") {
    detectedType = "twoWheeler";
  } else if (parsed.vehicleType === "Four Wheeler") {
    detectedType = "fourWheeler";
  }
}
      
      if (!detectedType && rawInsuranceForm) {
        const parsedForm = JSON.parse(rawInsuranceForm);
        if (parsedForm.vehicleType === "Two Wheeler" || parsedForm.bikeModel) {
          detectedType = "twoWheeler";
        } else if (parsedForm.vehicleType === "Four Wheeler" || parsedForm.carModel) {
          detectedType = "fourWheeler";
        }
      }

      if (!detectedType) {
        const fallbackType = localStorage.getItem("selectedVehicleType");
        if (fallbackType === "Two Wheeler" || fallbackType === "twoWheeler") detectedType = "twoWheeler";
        if (fallbackType === "Four Wheeler" || fallbackType === "fourWheeler") detectedType = "fourWheeler";
      }

      if (detectedType) {
        setCategory(detectedType);
        setIsCategoryLocked(true);
      }
    } catch (e) {
      console.error("Error evaluating parent vehicle selection variables", e);
    }
  }, []);

  useEffect(() => {
    if (selectedPolicy) {
      setSelectedTenure(selectedPolicy.allowedTenures[0]);
    }
  }, [selectedPolicy]);


  const policyData = {
    twoWheeler: [
      {
        id: "2w_tp",
        title: "Statutory Third-Party Liability Cover",
        desc: "Mandatory by Motor Vehicles Act. Covers third-party bodily injury, death, and property damage.",
        icon: "⚖️",
        allowedTenures: [1, 2, 3, 5],
        basePremium: 1480,
        insuredValue: 0, 
        details: {
          tenure: "Flexible options up to 5 Years",
          coverage: "Unlimited legal liability cover for physical injury or death to external third parties. Third-party property damage coverage up to ₹1,00,000.",
          exclusions: "Zero compensation for accidental damages to your own bike, accidental fire destruction, or theft.",
          claimsProcess: "1. Promptly lodge an FIR at the nearest police station. 2. Legal adjustments are handled via the Motor Accident Claims Tribunal (MACT).",
          documents: "Digitized Policy Schedule, Vehicle Registration Certificate (RC), Active Driving License."
        }
      },
      {
        id: "2w_comp",
        title: "Standard Bundled Comprehensive Package",
        desc: "All-inclusive peace of mind. Safeguards against theft, natural disasters, and personal accidents alongside legal liabilities.",
        icon: "🛡️",
        allowedTenures: [1, 2, 3],
        basePremium: 2828,
        insuredValue: 85000, 
        details: {
          tenure: "Multi-Year Options Available",
          coverage: "Total Own Damage (OD) protection covering theft, vandalism, fire, and natural hazards. Includes full standard Third-Party Liability risk protection.",
          exclusions: "Routine component wear and tear, mechanical breakdowns, and regular asset depreciation factors.",
          claimsProcess: "1. File an instant digital claim request. 2. Digital surveyor inspects and issues cashless authorization at workshop.",
          documents: "Original Policy Document, Vehicle RC, Driving License, Detailed Repair Invoice."
        }
      },
      {
        id: "2w_zero_dep",
        title: "Titanium Zero-Depreciation Bike Shield",
        desc: "High-tier bumper-to-bumper protection plan. Disregards depreciation on plastic, rubber, and glass parts during accident settlements.",
        icon: "⚡",
        allowedTenures: [1, 2],
        basePremium: 4350,
        insuredValue: 120000,
        details: {
          tenure: "1 or 2 Year Premium Tier",
          coverage: "100% payout coverage on replaced hardware elements following a collision. Includes mandatory personal accident protection blocks.",
          exclusions: "Damages sustained while operating without a valid license or operating under the influence.",
          claimsProcess: "1. Upload localized accident photos via mobile app stream. 2. Tow directly to high-tier network repair centers for priority parsing.",
          documents: "KYC Documents, Verified Driving License, Active Policy Core Token."
        }
      },
      {
        id: "2w_od",
        title: "Standalone Own-Damage (OD) Cover",
        desc: "Perfect if you already have a multi-year Third-Party liability cover but want full standalone damage and theft protection.",
        icon: "🏍️",
        allowedTenures: [1],
        basePremium: 1150,
        insuredValue: 75000,
        details: {
          tenure: "Annual Renewal Structure",
          coverage: "Exclusive physical asset protection covering accidental impacts, custom modifications, engine damage, fire incidents, or total vehicle theft.",
          exclusions: "Does not fulfill the mandatory legal requirements for third-party liability coverage.",
          claimsProcess: "1. Open the claim portal and submit damage site photos. 2. Surveyor checks the digital media files.",
          documents: "Active Registration Certificate (RC), Driving License, Proof of active Third-Party Policy."
        }
      }
    ],
    fourWheeler: [
      {
        id: "4w_tp",
        title: "Statutory Third-Party Liability Shield",
        desc: "Legally mandated coverage parameters protecting your estate from litigation liabilities involving external parties.",
        icon: "⚖️",
        allowedTenures: [1, 3],
        basePremium: 3416,
        insuredValue: 0,
        details: {
          tenure: "Standard 1 or 3 Year Lock",
          coverage: "Total protection against financial impacts stemming from legal claims for bodily harm. Property damage limit capped at ₹7,500,000.",
          exclusions: "Accidental scratch repairs, broken windshields, internal fires, or vehicle component theft.",
          claimsProcess: "1. Note down third-party vehicle registration numbers. 2. Summons are handled directly by our legal team.",
          documents: "Active Policy Certificate, Vehicle RC copy, Valid Driving License."
        }
      },
      {
        id: "4w_comp",
        title: "Elite Comprehensive Protection Plan",
        desc: "Premium asset management plan covering third-party liabilities alongside advanced bumper-to-bumper vehicle crash protections.",
        icon: "🚗",
        allowedTenures: [1, 2, 3],
        basePremium: 7200,
        insuredValue: 550000,
        details: {
          tenure: "1 to 3 Year Comprehensive Protection",
          coverage: "Complete own damage safety shield against structural accidents, house fires, floods, and vehicle theft.",
          exclusions: "Consequential damages (like hydro-locking an engine by driving through flooded regions intentionally).",
          claimsProcess: "1. Call our roadside flatbed service. 2. Cashless approval processed within 4 hours at network garage sites.",
          documents: "Policy Schedule Copy, Car Registration Certificate, Driving License."
        }
      },
      {
        id: "4w_zero_dep",
        title: "Bumper-to-Bumper Zero Depreciation Pro",
        desc: "High-value policy configuration setup. Eliminates out-of-pocket costs for fiber, glass, and metal elements during collision restorative work.",
        icon: "💎",
        allowedTenures: [1, 2, 3],
        basePremium: 11800,
        insuredValue: 780000,
        details: {
          tenure: "Multi-year premium depreciation exclusion coverage",
          coverage: "Full replacement settlements on parts without indexing age deduction tables. Includes engine protection and consumables add-on packages.",
          exclusions: "Mechanical failures unlinked to an external physical accident or collision trace vector.",
          claimsProcess: "1. Log incident event telemetry. 2. Instant digital video assessment deployment clears work order sheets.",
          documents: "Active Driving License, Claims Intake Forms, Clear Spot-Accident Media Streams."
        }
      },
      {
        id: "4w_invoice",
        title: "Return-to-Invoice (RTI) Premium Shield",
        desc: "The highest grade of asset insurance. In case of total theft or structural write-off, pays back the full original showroom invoice price.",
        icon: "👑",
        allowedTenures: [1, 2],
        basePremium: 16400,
        insuredValue: 1050000, 
        details: {
          tenure: "Up to 2 Years max vehicle age limits",
          coverage: "Bridges the gap between standard market value and original purchase price including registered road tax structures during total loss scenarios.",
          exclusions: "Standard minor body cosmetic defects or typical scratch panel maintenance repairs.",
          claimsProcess: "1. Provide complete total loss survey clearance files. 2. Showroom matrix pricing review validates full invoice distribution rules.",
          documents: "Original Purchase Invoice, Road Tax Receipt Ledger, Non-Traceable Police Clearance Certificate (for theft)."
        }
      }
    ]
  };

  const calculateCurrentPrice = (policy, tenure) => {
    if (!policy || typeof policy.basePremium !== "number") return 0;
    
    let cumulativePremium = 0;
    for (let i = 1; i <= tenure; i++) {
      if (i === 1) {
        cumulativePremium += policy.basePremium;
      } else if (i === 2) {
        cumulativePremium += policy.basePremium * 0.95;
      } else {
        cumulativePremium += policy.basePremium * 0.90;
      }
    }
    return Math.round(cumulativePremium);
  };

  const calculateDynamicInsuredValue = (policy, tenure) => {
    if (!policy || policy.insuredValue === 0) return 0;
    

    let dynamicIdv = policy.insuredValue;
    if (tenure > 1) {
      dynamicIdv = policy.insuredValue * (1 + (tenure - 1) * 0.85);
    }
    return Math.round(dynamicIdv);
  };


  const handleApplyAction = () => {
    if (selectedPolicy) {
      const finalComputedPrice = calculateCurrentPrice(selectedPolicy, selectedTenure);
      const computedInsuredValue = calculateDynamicInsuredValue(selectedPolicy, selectedTenure);
      
      const displayPriceString = finalComputedPrice === 0 
        ? "Included Benefit" 
        : `₹${finalComputedPrice.toLocaleString("en-IN")}`;
        
      const displayTitleString = `${selectedPolicy.title} (${selectedTenure} Year Plan)`;

      localStorage.setItem("activeFlow", "motor");
      localStorage.setItem("policyTitle", displayTitleString);
      localStorage.setItem("policyPrice", displayPriceString);
      localStorage.setItem("tenure", selectedTenure.toString());
      localStorage.setItem("policyInsuredValue", computedInsuredValue.toString()); 
      localStorage.removeItem("paymentCompleted");
      
      navigate("/payment", { 
        state: { 
          title: displayTitleString, 
          price: finalComputedPrice,
          tenure: selectedTenure,
          insuredValue: computedInsuredValue
        } 
      });
    }
  };

  return (
    <>
      <InnerHeader />
      <div className="policy-section">
        <h2 className="premium-header">Explore Our Insurance Policies</h2>
        
        {/* --- DYNAMIC FILTER TABS --- */}
        <div className="tab-container">
          <button 
            type="button"
            className={`tab-btn ${category === "twoWheeler" ? "active" : ""}`} 
            onClick={() => !isCategoryLocked && setCategory("twoWheeler")}
            disabled={isCategoryLocked && category !== "twoWheeler"}
            style={{ cursor: isCategoryLocked && category !== "twoWheeler" ? "not-allowed" : "pointer" }}
          >
            Two Wheeler {isCategoryLocked && category === "twoWheeler" && "🔒"}
          </button>
          <button 
            type="button"
            className={`tab-btn ${category === "fourWheeler" ? "active" : ""}`} 
            onClick={() => !isCategoryLocked && setCategory("fourWheeler")}
            disabled={isCategoryLocked && category !== "fourWheeler"}
            style={{ cursor: isCategoryLocked && category !== "fourWheeler" ? "not-allowed" : "pointer" }}
          >
            Four Wheeler {isCategoryLocked && category === "fourWheeler" && "🔒"}
          </button>
        </div>

        {isCategoryLocked && (
          <p className="category-lock-notice">
            * Showing policies available for your selected {category === "twoWheeler" ? "Two-Wheeler" : "Four-Wheeler"}.
          </p>
        )}

        {/* --- CARDS GRID RUNTIME DISPLAY --- */}
        <div className="policy-grid">
          {policyData[category].map((item) => {
            const initialPrice = calculateCurrentPrice(item, item.allowedTenures[0]);
            const initialInsuredValue = calculateDynamicInsuredValue(item, item.allowedTenures[0]);
            
            return (
              <div key={item.id} className="policy-card" onClick={() => setSelectedPolicy(item)}>
                <div className="policy-icon-wrapper">{item.icon}</div>
                <div className="policy-info">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  
                  <div className="policy-metrics-strip" style={{ marginTop: '12px', display: 'flex', gap: '15px' }}>
                    <span className="premium-price-tag" style={{ fontSize: '0.9rem' }}>
                      Premium: <strong>₹{initialPrice.toLocaleString("en-IN")}</strong>
                    </span>
                    {initialInsuredValue > 0 && (
                      <span className="insured-value-tag" style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                        Insured Cover (IDV): <strong style={{ color: '#2c3e50' }}>₹{initialInsuredValue.toLocaleString("en-IN")}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- SCROLLABLE MODAL DIALOG DISPLAY PANEL --- */}
        {selectedPolicy && (
          <div className="modal-overlay" onClick={() => setSelectedPolicy(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              
              <div className="modal-header">
                <div className="header-top">
                  <span className="modal-icon-large">{selectedPolicy.icon}</span>
                  <h2>{selectedPolicy.title}</h2>
                  <button type="button" className="close-btn" onClick={() => setSelectedPolicy(null)}>&times;</button>
                </div>
              </div>

              <div className="modal-scroll-area">
                {/* --- CHOOSE TENURE SCHEDULE SELECTION --- */}
                <div className="detail-row tenure-selector-row">
                  <strong>Select Policy Tenure Schedule</strong>
                  <div className="tenure-pill-container">
                    {selectedPolicy.allowedTenures.map((year) => (
                      <button
                        key={year}
                        type="button"
                        className={`tenure-pill ${selectedTenure === year ? "active" : ""}`}
                        onClick={() => setSelectedTenure(year)}
                      >
                        {year} {year === 1 ? "Year" : "Years"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* --- DYNAMIC SPECIFICATIONS DISPLAY METRICS --- */}
                <div className="policy-financial-summary" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', margin: '15px 0' }}>
                  <div className="detail-row premium-summary-row" style={{ marginBottom: '10px' }}>
                    <strong>Calculated Premium Due</strong>
                    <div className="computed-premium-text" style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#2e7d32' }}>
                      ₹{calculateCurrentPrice(selectedPolicy, selectedTenure).toLocaleString("en-IN")} 
                      <span className="tax-subtext" style={{ fontSize: '0.8rem', color: '#7f8c8d', fontWeight: 'normal' }}> (Includes 18% GST additions)</span>
                    </div>
                  </div>

                  {calculateDynamicInsuredValue(selectedPolicy, selectedTenure) > 0 && (
                    <div className="detail-row asset-value-row">
                      <strong>Total Insured Asset Value (IDV Coverage)</strong>
                      <div className="computed-idv-text" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1565c0' }}>
                        ₹{calculateDynamicInsuredValue(selectedPolicy, selectedTenure).toLocaleString("en-IN")}
                      </div>
                    </div>
                  )}
                </div>

                <div className="detail-row">
                  <strong>Standard Tenure Classification</strong>
                  <p>{selectedPolicy.details.tenure}</p>
                </div>
                <div className="detail-row">
                  <strong>What is Covered?</strong>
                  <p>{selectedPolicy.details.coverage}</p>
                </div>
                <div className="detail-row">
                  <strong>Claims Process Journey</strong>
                  <p>{selectedPolicy.details.claimsProcess}</p>
                </div>
                <div className="detail-row">
                  <strong>Documents Required</strong>
                  <p>{selectedPolicy.details.documents}</p>
                </div>
                <div className="detail-row">
                  <strong>Major Exclusions</strong>
                  <p>{selectedPolicy.details.exclusions}</p>
                </div>
                <div className="terms-notice">
                  <p>* Disclaimer: Final core premium computations remain subject to verified vehicle configurations, manufacturing age, and updated IRDAI regulatory rules.</p>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="modal-apply-btn" onClick={handleApplyAction}>
                  Proceed to Payment • ₹{calculateCurrentPrice(selectedPolicy, selectedTenure).toLocaleString("en-IN")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}