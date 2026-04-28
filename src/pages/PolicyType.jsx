import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Policytype.css";
import InnerHeader from "../components/InnerHeader";
import Footer from "../components/Footer";

export default function VehiclePolicies() {
  const [category, setCategory] = useState("twoWheeler");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const navigate=useNavigate();

  const handleSubmit = () => {
    if (selectedPolicy) {
      // FIX: Added Key and Value correctly
      localStorage.setItem("policyTitle", selectedPolicy.title);
      localStorage.setItem("policyPrice", selectedPolicy.details.minAmount);
      navigate("/payment");
    }
  };


  const policyData = {
    twoWheeler: [
      { 
        title: "Third-Party Insurance", 
        desc: "Mandatory in India. Covers legal liabilities for injuries or damage to third parties.", 
        icon: "⚖️",
        details: {
          minAmount: "₹750/year",
          tenure: "1 - 5 Years",
          coverage: "Covers legal liability for death or bodily injury to third parties. Includes property damage up to ₹1 Lakh. Provides Compulsory Personal Accident cover for the owner-driver.",
          exclusions: "Does not cover damage to your own vehicle, theft, fire, or driving without a valid license/under influence.",
          claimsProcess: "1. File an FIR at the nearest station. 2. Notify insurer immediately. 3. Submit claim form with FIR and policy documents.",
          documents: "Original Policy Copy, Vehicle RC, Driving License, FIR Copy."
        }
      },
      { 
        title: "Comprehensive Insurance", 
        desc: "Covers third-party liability plus damage to your bike, theft, and other risks.", 
        icon: "🛡️",
        details: {
          minAmount: "₹1,200/year",
          tenure: "1 - 3 Years",
          coverage: "Provides 'Own Damage' cover for accidents, theft, fire, and natural disasters (floods, earthquakes). Includes full Third-Party liability protection.",
          exclusions: "Normal wear and tear, mechanical/electrical failure, depreciation, and driving outside geographical limits.",
          claimsProcess: "1. Record incident details. 2. Contact 24/7 helpline for towing. 3. Surveyor assessment. 4. Cashless repair at network garage.",
          documents: "Policy Document, RC, Driving License, Damage Estimates, Cancelled Cheque."
        }
      },
      { 
        title: "Own-Damage Insurance", 
        desc: "Covers damage to your bike due to accidents, fire, or theft. Essential for owners.", 
        icon: "🏍️",
        details: {
          minAmount: "₹450/year",
          tenure: "Annual Renewal",
          coverage: "Stand-alone cover for accidents, fire, and theft for your own bike. High flexibility for older vehicles.",
          exclusions: "Does not satisfy the legal requirement for Third-Party liability. Must be paired with a TP policy.",
          claimsProcess: "1. Intimate claim via app/phone. 2. Professional surveyor assessment. 3. Repair at preferred or network garage.",
          documents: "RC, Driving License, Evidence of existing Third-Party policy."
        }
      },
      { 
        title: "Add-On Covers", 
        desc: "Enhance policy with Zero Depreciation, Personal Accident, and Roadside Assistance.", 
        icon: "➕",
        details: {
          minAmount: "₹200 (Starts)",
          tenure: "Linked to Base Policy",
          coverage: "Zero Dep (Full settlement), Consumables cover, Engine Protection, and 24/7 Roadside Assistance.",
          exclusions: "Varies by add-on. Generally excludes standard maintenance and pre-existing damages.",
          claimsProcess: "Processed as part of your Comprehensive or Own-Damage claim journey.",
          documents: "Standard claim documents as per base policy."
        }
      },
      { 
        title: "Cashless Garages", 
        desc: "Repair services at network garages without upfront payments. Quick and easy.", 
        icon: "🔧",
        details: {
          minAmount: "Included Benefit",
          tenure: "Valid with Active Policy",
          coverage: "Direct bill settlement with 5000+ network garages across India. No out-of-pocket expenses for approved amounts.",
          exclusions: "Deductibles (Compulsory/Voluntary) and amounts exceeding the surveyor-approved estimate.",
          claimsProcess: "1. Select network garage. 2. Provide policy details. 3. Insurer pays garage directly after repairs.",
          documents: "Policy Number and ID Proof at the garage."
        }
      }
    ],
    fourWheeler: [
      { 
        title: "Third-Party Liability", 
        desc: "Legally mandatory cover. Protects against damages caused to third parties in an accident.", 
        icon: "⚖️",
        details: {
          minAmount: "₹2,094/year",
          tenure: "1 - 3 Years",
          coverage: "Unlimited liability for third-party injury/death. Property damage up to ₹7.5 Lakhs. Covers legal defense costs.",
          exclusions: "Damage to your own car, theft, or fire damage. Personal accident for passengers is optional.",
          claimsProcess: "1. Note third-party vehicle details. 2. File FIR. 3. Notify insurer to handle legal proceedings.",
          documents: "Policy Copy, RC, Driving License, FIR Copy."
        }
      },
      { 
        title: "Comprehensive Insurance", 
        desc: "Includes third-party cover and protects your car against theft, accidents, and fire.", 
        icon: "🚗",
        details: {
          minAmount: "₹4,500/year",
          tenure: "1 - 3 Years",
          coverage: "Full protection covering self-damage, theft, natural calamities (Floods, Earthquakes), and all Third-Party liabilities.",
          exclusions: "Wear and tear, mechanical failure, driving without a license, or driving under the influence.",
          claimsProcess: "1. Immediate intimation. 2. Survey at network garage. 3. Cashless repair or direct reimbursement.",
          documents: "Policy Copy, RC, Driving License, Original Repair Bills."
        }
      },
      { 
        title: "Standalone Own-Damage (OD)", 
        desc: "Covers damage to your own vehicle due to accidents, theft, or natural calamities.", 
        icon: "💎",
        details: {
          minAmount: "₹1,800/year",
          tenure: "Annual Renewal",
          coverage: "Specialized cover for your vehicle's damages, theft, and fire. Perfect if you already have a multi-year Third-Party policy.",
          exclusions: "Does not provide Third-Party liability cover. Wear and tear excluded.",
          claimsProcess: "1. Notify insurer of damage. 2. Surveyor assessment. 3. Repair at network garage.",
          documents: "RC, Driving License, Evidence of existing Third-Party policy."
        }
      },
      { 
        title: "Bundled/Package Policy", 
        desc: "3-5 years of Third-Party cover combined with 1-year Own-Damage protection.", 
        icon: "📦",
        details: {
          minAmount: "₹15,000 (Multi-year)",
          tenure: "3/5 Years (TP) + 1 Year (OD)",
          coverage: "Designed for new car owners. Provides long-term legal security while protecting your vehicle for the first year.",
          exclusions: "OD portion expires after 1 year. Depreciation excluded without add-ons.",
          claimsProcess: "1. Contact 24/7 helpline. 2. Priority settlement for new vehicles.",
          documents: "New Vehicle Invoice, RC, Driving License."
        }
      }
    ]
  };

  return (
    <>
    <InnerHeader />
    <div className="policy-section">
      <h2 className="premium-header">Explore Our Insurance Policies</h2>
      
      <div className="tab-container">
        <button 
          className={`tab-btn ${category === "twoWheeler" ? "active" : ""}`} 
          onClick={() => setCategory("twoWheeler")}
        >
          Two Wheeler
        </button>
        <button 
          className={`tab-btn ${category === "fourWheeler" ? "active" : ""}`} 
          onClick={() => setCategory("fourWheeler")}
        >
          Four Wheeler
        </button>
      </div>

      <div className="policy-grid">
        {policyData[category].map((item, index) => (
          <div key={index} className="policy-card" onClick={() => setSelectedPolicy(item)}>
            <div className="policy-icon-wrapper">{item.icon}</div>
            <div className="policy-info">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- SCROLLABLE DIALOG BOX --- */}
      {selectedPolicy && (
        <div className="modal-overlay" onClick={() => setSelectedPolicy(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <div className="header-top">
                <span className="modal-icon-large">{selectedPolicy.icon}</span>
                <h2>{selectedPolicy.title} Details</h2>
                <button className="close-btn" onClick={() => setSelectedPolicy(null)}>&times;</button>
              </div>
            </div>

            <div className="modal-scroll-area">
              <div className="detail-row">
                <strong>Minimum Amount</strong>
                <p>{selectedPolicy.details.minAmount}</p>
              </div>
              <div className="detail-row">
                <strong>Tenure Options</strong>
                <p>{selectedPolicy.details.tenure}</p>
              </div>
              <div className="detail-row">
                <strong>What is Covered?</strong>
                <p>{selectedPolicy.details.coverage}</p>
              </div>
              <div className="detail-row">
                <strong>Claims Process</strong>
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
                <p>* Disclaimer: Terms and conditions apply. Policy values are subject to IDV and location.</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-apply-btn" onClick={handleSubmit}>Apply Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
}
