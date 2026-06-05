import express from "express";
import crypto from "crypto";
import mongoose from "mongoose"; 
import BuyInsurance from "../models/BuyInsurance.js"; 
import InsuranceDetails from "../models/InsuranceDetails.js"; 
import User from "../models/User.js";

const router = express.Router();

// POST: http://localhost:5000/api/insurance/create-policy

router.post("/create-policy", async (req, res) => {
  try {
    const {
      activeForm,
      manufacturer,
      model,
      drivingLicense,
      purchaseDate,
      registrationNumber,
      engineNumber,
      chasisNumber
    } = req.body;


    if (!registrationNumber || !model || !manufacturer) {
      return res.status(400).json({
        success: false,
        message: "Required core field profiles are missing (Registration, Model, or Manufacturer)."
      });
    }

    const insuranceType = activeForm === "bike" ? "Two Wheeler" : "Four Wheeler";


    const leadLog = new BuyInsurance({
      insuranceType,
      manufacturer,
      model,
      registration: registrationNumber,
      dlNo: drivingLicense || "N/A",
      engineNo: engineNumber || "N/A",
      chasisNo: chasisNumber || "N/A",
      dateOfPurchase: purchaseDate ? new Date(purchaseDate) : new Date()
    });
    
    const savedLead = await leadLog.save();

 
    return res.status(201).json({
      success: true,
      message: "Insurance application registered. Proceed to payment gateway authorization.",
      lead: savedLead
    });

  } catch (error) {
    console.error("Backend failed handling policy saving sequence:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server data processing failure.",
      error: error.message
    });
  }
});


// GET: http://localhost:5000/api/insurance/verify-policy/:policyNo

router.get("/verify-policy/:policyNo", async (req, res) => {
  try {
    const { policyNo } = req.params;
    const policy = await InsuranceDetails.findOne({ refNo: policyNo });
    if (!policy) {
      return res.status(404).json({ success: false, message: "Policy number not found. Please verify your document entry" });
    }
    return res.status(200).json({ success: true, policy });
  } catch (error) {
    console.error("Policy verification error:", error);
    return res.status(500).json({ success: false, message: "Server error during validation trace.", error: error.message });
  }
});


// PUT: http://localhost:5000/api/insurance/renew-policy

router.put("/renew-policy", async (req, res) => {
  try {
    const { policyNo, amount, address } = req.body;
    if (!policyNo) {
      return res.status(400).json({ success: false, message: "Policy reference number required for tracking." });
    }
    const targetPolicy = await InsuranceDetails.findOne({ refNo: policyNo });
    if (!targetPolicy) {
      return res.status(404).json({ success: false, message: "Policy reference number is missing" });
    }
    const baseDate = new Date(targetPolicy.endDate) > new Date() ? new Date(targetPolicy.endDate) : new Date();
    const extendedEndDate = new Date(baseDate);
    extendedEndDate.setFullYear(extendedEndDate.getFullYear() + 1);
    
    const updatedPolicy = await InsuranceDetails.findOneAndUpdate(
      { refNo: policyNo },
      {
        $set: {
          startDate: new Date(),
          endDate: extendedEndDate,
          amount: amount || targetPolicy.amount,
          deliveryAddress: address || "Digital delivery only"
        }
      },
      { new: true }
    );
    return res.status(200).json({ success: true, message: "Insurance protection policy coverage successfully renewed!", policy: updatedPolicy });
  } catch (error) {
    console.error("Policy updating processing block failure:", error);
    return res.status(500).json({ success: false, message: "Failed to update target policy framework state parameters.", error: error.message });
  }
});


// POST: Verify Policy and Phone Compatibility For Filing Claims

router.post("/verify-claim-eligibility", async (req, res) => {
  try {
    const { policyNumber, linkedMobile } = req.body;

    if (!policyNumber || !linkedMobile) {
      return res.status(400).json({
        success: false,
        message: "Both policy tracking token and registered mobile are required for validation."
      });
    }

    const activePolicy = await InsuranceDetails.findOne({
      refNo: policyNumber.trim(),
    });
    
    const mobileNo = await User.findOne({
      mobile: linkedMobile
    });

    if (!activePolicy || !mobileNo) {
      return res.status(404).json({
        success: false,
        message: "Incorrect policy number or mobile number. Please enter correct details."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Security identity criteria successfully mapped.",
      vehicleType: activePolicy.vehicleType 
    });

  } catch (error) {
    console.error("Claim eligibility tracking system fault:", error);
    return res.status(500).json({
      success: false,
      message: "Internal record tracing pipeline disruption.",
      error: error.message
    });
  }
});

export default router;