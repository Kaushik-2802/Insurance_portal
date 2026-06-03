import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Policytype.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

export default function VehiclePolicies() {
  const navigate = useNavigate();
  
  // =========================================================================
  // STATE DEFINITIONS & INITIALIZATION
  // =========================================================================
  const [category, setCategory] = useState("twoWheeler");
  const [isCategoryLocked, setIsCategoryLocked] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedTenure, setSelectedTenure] = useState(1); // Default to 1 Year

  // =========================================================================
  // VEHICLE DETECTION HOOK (MATCHED TO YOUR LOCAL STORAGE STRUCTURE)
  // =========================================================================
  useEffect(() => {
    try {
      // Pull the exact key verified in your local storage trace
      const rawVehicleDetails = localStorage.getItem("vehicleDetails");
      const rawInsuranceForm = localStorage.getItem("insuranceForm");
      
      let detectedType = null;

      if (rawVehicleDetails) {
        const parsed = JSON.parse(rawVehicleDetails);
        // Direct detection of 'bikeModel' as explicitly seen in your logs
        if (parsed.bikeModel || parsed.vehicleType === "Two Wheeler" || parsed.vehicleType === "twoWheeler") {
          detectedType = "twoWheeler";
        } else if (parsed.carModel || parsed.vehicleType === "Four Wheeler" || parsed.vehicleType === "fourWheeler") {
          detectedType = "fourWheeler";
        }
      } 
      
      // Fallback structural form verification
      if (!detectedType && rawInsuranceForm) {
        const parsedForm = JSON.parse(rawInsuranceForm);
        if (parsedForm.vehicleType === "Two Wheeler" || parsedForm.bikeModel) {
          detectedType = "twoWheeler";
        } else if (parsedForm.vehicleType === "Four Wheeler" || parsedForm.carModel) {
          detectedType = "fourWheeler";
        }
      }

      // Standalone loose string checks
      if (!detectedType) {
        const fallbackType = localStorage.getItem("selectedVehicleType");
        if (fallbackType === "Two Wheeler" || fallbackType === "twoWheeler") detectedType = "twoWheeler";
        if (fallbackType === "Four Wheeler" || fallbackType === "fourWheeler") detectedType = "fourWheeler";
      }

      // Lock view and set standard tab category if type is detected
      if (detectedType) {
        setCategory(detectedType);
        setIsCategoryLocked(true);
      }
    } catch (e) {
      console.error("Error evaluating parent vehicle selection variables", e);
    }
  }, []);

  // Sync baseline allowed tenure configurations whenever modal selection shifts
  useEffect(() => {
    if (selectedPolicy) {
      setSelectedTenure(selectedPolicy.allowedTenures[0]);
    }
  }, [selectedPolicy]);

  // =========================================================================
  // REALISTIC MARKET INSURANCE DATA CONFIGURATION (IRDAI BASELINES)
  // =========================================================================
  const policyData = {
    twoWheeler: [
      {
        id: "2w_tp",
        title: "Statutory Third-Party Liability Cover",
        desc: "Mandatory by Motor Vehicles Act. Covers third-party bodily injury, death, and property damage.",
        icon: "⚖️",
        allowedTenures: [1, 2, 3, 5],
        basePremium: 843, // Based on standard 75cc - 150cc bike brackets
        details: {
          tenure: "Flexible options up to 5 Years",
          coverage: "Unlimited legal liability cover for physical injury or death to external third parties. Third-party property damage coverage up to ₹1,00,000. Includes an option to bind ₹15 Lakhs Owner-Driver Personal Accident (CPA) protection.",
          exclusions: "Zero compensation for accidental damages to your own bike, accidental fire destruction, theft, or incidents occurring while driving without a valid license.",
          claimsProcess: "1. Promptly lodge an FIR at the nearest police station. 2. Share FIR copy and tracking info with our claims desk. 3. Legal adjustments are handled via the Motor Accident Claims Tribunal (MACT).",
          documents: "Digitized Policy Schedule, Vehicle Registration Certificate (RC), Active Driving License, Signed FIR Transcript."
        }
      },
      {
        id: "2w_comp",
        title: "Standard Bundled Comprehensive Package",
        desc: "All-inclusive peace of mind. Safeguards against theft, natural disasters, and personal accidents alongside legal liabilities.",
        icon: "🛡️",
        allowedTenures: [1, 2, 3],
        basePremium: 1450,
        details: {
          tenure: "Multi-Year Options Available",
          coverage: "Total Own Damage (OD) protection covering theft, vandalism, fire, and natural hazards (floods, earthquakes, cyclones). Includes full standard Third-Party Liability risk protection seamlessly.",
          exclusions: "Routine component wear and tear, electrical or mechanical breakdowns, regular asset depreciation, and damages sustained while operating under the influence.",
          claimsProcess: "1. File an instant digital claim request. 2. Request roadside towing assistance directly to our network service point. 3. Digital surveyor inspects and issues cashless authorization.",
          documents: "Original Policy Document, Vehicle RC, Driving License, Detailed Repair Invoice from Network Workshop."
        }
      },
      {
        id: "2w_od",
        title: "Standalone Own-Damage (OD) Cover",
        desc: "Perfect if you already have a multi-year Third-Party liability cover but want full standalone damage and theft protection.",
        icon: "🏍️",
        allowedTenures: [1],
        basePremium: 580,
        details: {
          tenure: "Annual Renewal Structure",
          coverage: "Exclusive physical asset protection covering accidental impacts, custom modifications, engine damage, fire incidents, or total vehicle theft.",
          exclusions: "Does not fulfill the mandatory legal requirements for third-party liability coverage. Must run concurrently with an active third-party insurance schedule.",
          claimsProcess: "1. Open the claim portal and submit damage site photos. 2. Surveyor checks the digital media files. 3. Vehicle undergoes restoration at a selected garage cluster.",
          documents: "Active Registration Certificate (RC), Driving License, Cross-reference Proof of existing active Third-Party Policy."
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
        basePremium: 3416, // Based on standard 1000cc - 1500cc private car bracket
        details: {
          tenure: "Standard 1 or 3 Year Lock",
          coverage: "Total protection against financial impacts stemming from legal claims for bodily harm or third-party fatalities. Property damage limit capped at ₹7,500,000.",
          exclusions: "Accidental scratch repairs, broken windshields, internal fires, vehicle component theft, or structural engine damage.",
          claimsProcess: "1. Note down third-party vehicle registration numbers. 2. Obtain an official police FIR document. 3. Hand over legal representation summons directly to our corporate defense team.",
          documents: "Active Policy Certificate, Vehicle RC copy, Valid Driving License, Copy of Police FIR."
        }
      },
      {
        id: "4w_comp",
        title: "Elite Comprehensive Protection Plan",
        desc: "Premium asset management plan covering third-party liabilities alongside advanced bumper-to-bumper vehicle crash protections.",
        icon: "🚗",
        allowedTenures: [1, 2, 3],
        basePremium: 7200,
        details: {
          tenure: "1 to 3 Year Comprehensive Protection",
          coverage: "Complete own damage safety shield against structural accidents, house fires, floods, and vehicle theft. Covers standard third-party legal obligations completely.",
          exclusions: "Consequential damages (like driving through a flood with a locked engine), depreciation of glass/plastic parts unless explicitly zero-dep protected.",
          claimsProcess: "1. Do not move the car if severely impacted; call our roadside flatbed service. 2. Garage generates a standard digital estimation record. 3. Cashless approval processed within 4 hours.",
          documents: "Policy Schedule Copy, Car Registration Certificate, Driving License, Driver's KYC Proof."
        }
      },
      {
        id: "4w_od",
        title: "Standalone Private Car Own-Damage Cover",
        desc: "Isolate your premium costs. Protects your high-value car from crashes and environmental hazards without matching existing long-term liability lines.",
        icon: "💎",
        allowedTenures: [1],
        basePremium: 3150,
        details: {
          tenure: "Annual Lifecycle Structure",
          coverage: "Safeguards your private passenger vehicle against structural accidental impacts, lightning strikes, landslides, hail, animal impacts, and grand theft auto risks.",
          exclusions: "Claims arising outside specified geographical limits or missing verification details from your concurrent mandatory liability structure.",
          claimsProcess: "1. Report incident details on our mobile application. 2. Match with an on-site virtual surveyor check. 3. Pick up your restored vehicle after paying the compulsory deductible fee.",
          documents: "Car RC Document, Valid Driving License, Declaration of Active Third-Party Policy Number."
        }
      }
    ]
  };

  // =========================================================================
  // DYNAMIC PRICING CALCULATION ENGINE
  // =========================================================================
  const calculateCurrentPrice = (policy, tenure) => {
    if (!policy || typeof policy.basePremium !== "number") return 0;
    
    let cumulativePremium = 0;
    for (let i = 1; i <= tenure; i++) {
      if (i === 1) {
        cumulativePremium += policy.basePremium;
      } else if (i === 2) {
        cumulativePremium += policy.basePremium * 0.95; // 5% discount factor on multi-year commitment
      } else {
        cumulativePremium += policy.basePremium * 0.90; // 10% discount factor applied sequentially
      }
    }
    return Math.round(cumulativePremium);
  };

  // =========================================================================
  // FORM SUBMISSION & ROUTING HANDLER
  // =========================================================================
  const handleApplyAction = () => {
    if (selectedPolicy) {
      const finalComputedPrice = calculateCurrentPrice(selectedPolicy, selectedTenure);
      
      // Formatting fallback patterns safely to avoid NaN conversions down the road
      const displayPriceString = finalComputedPrice === 0 
        ? "Included Benefit" 
        : `₹${finalComputedPrice.toLocaleString("en-IN")}`;
        
      const displayTitleString = `${selectedPolicy.title} (${selectedTenure} Year Plan)`;

      // 1. Maintain local state engine parity mapping profiles
      localStorage.setItem("activeFlow", "motor");
      localStorage.setItem("policyTitle", displayTitleString);
      localStorage.setItem("policyPrice", displayPriceString);
      
      // ✅ NEW: Explicitly save the dynamic integer tenure value to localStorage here!
      localStorage.setItem("tenure", selectedTenure.toString());
      
      // 2. Clear out old historical payment flags to ensure fresh processing sequences
      localStorage.removeItem("paymentCompleted");
      
      // 3. Forward clear structured operational payloads through router properties
      navigate("/payment", { 
        state: { 
          title: displayTitleString, 
          price: finalComputedPrice,
          tenure: selectedTenure // Pass via router state as a backup safety net
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
            return (
              <div key={item.id} className="policy-card" onClick={() => setSelectedPolicy(item)}>
                <div className="policy-icon-wrapper">{item.icon}</div>
                <div className="policy-info">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <span className="premium-price-tag">
                    Starts at <strong>₹{initialPrice.toLocaleString("en-IN")}</strong>
                  </span>
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

                {/* --- LIVE COMPUTED CALCULATION BOX --- */}
                <div className="detail-row premium-summary-row">
                  <strong>Calculated Premium Due</strong>
                  <div className="computed-premium-text">
                    ₹{calculateCurrentPrice(selectedPolicy, selectedTenure).toLocaleString("en-IN")} 
                    <span className="tax-subtext"> (Includes 18% GST baseline additions)</span>
                  </div>
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
                  <p>* Disclaimer: Final core premium computations remain subject to verified vehicle IDV configurations, manufacturing age, registration zones, and updated IRDAI regulatory updates.</p>
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