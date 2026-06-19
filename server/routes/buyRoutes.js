import express from "express";
import crypto from "crypto";
import mongoose from "mongoose"; 
import BuyInsurance from "../models/BuyInsurance.js"; 
import InsuranceDetails from "../models/InsuranceDetails.js"; 
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import TravelInsurance from "../models/TravelInsurance.js"

const router = express.Router();

// POST: http://localhost:5000/api/insurance/create-policy

router.post("/create-policy",authMiddleware, async (req, res) => {
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

router.get("/verify-policy/:policyNo",authMiddleware, async (req, res) => {
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

router.put("/renew-policy",authMiddleware, async (req, res) => {
  try {

    const { policyNo, amount, address } = req.body;

    if (!policyNo) {
      return res.status(400).json({
        success: false,
        message: "Policy reference number required."
      });
    }

    const targetPolicy = await InsuranceDetails.findOne({
      refNo: policyNo
    });

    if (!targetPolicy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    // CURRENT POLICY END DATE
    const oldEndDate = new Date(targetPolicy.endDate);

    // CREATE NEW DATE OBJECT
    const newEndDate = new Date(oldEndDate.getTime());

    // ADD 1 YEAR
    newEndDate.setFullYear(
      newEndDate.getFullYear() + 1
    );

    console.log("Old End Date:", oldEndDate);
    console.log("New End Date:", newEndDate);

    // UPDATE POLICY
    targetPolicy.endDate = newEndDate;

    // OPTIONAL
    targetPolicy.amount =
      amount || targetPolicy.amount;

    targetPolicy.deliveryAddress =
      address || "Digital delivery only";

    await targetPolicy.save();

    return res.status(200).json({
      success: true,
      message: "Policy renewed successfully!",
      policy: targetPolicy
    });

  } catch (error) {

    console.error("Renewal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Renewal failed",
      error: error.message
    });
  }
});


// POST: Verify Policy and Phone Compatibility For Filing Claims

router.post("/verify-claim-eligibility", authMiddleware, async (req, res) => {
  try {
    const { policyNumber } = req.body;
    const userId = req.user.id; 

    if (!policyNumber) {
      return res.status(400).json({
        success: false,
        message: "Policy tracking token is required for validation."
      });
    }

    const cleanPolicyNum = policyNumber.trim();
    const isTravelPolicy = cleanPolicyNum.toUpperCase().startsWith("TRV");

    if (isTravelPolicy) {
      const activeTravelPolicy = await TravelInsurance.findOne({
        policyNo: cleanPolicyNum,
        userId: userId 
      });

      if (!activeTravelPolicy) {
        return res.status(404).json({
          success: false,
          message: "No active travel policy found matching this profile setup."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Travel security identity criteria successfully mapped.",
        destination: activeTravelPolicy.destination || "Valid Travel Policy"
      });

    } else {
      const activeVehiclePolicy = await InsuranceDetails.findOne({
        refNo: cleanPolicyNum,
      });
      const userRecord = await User.findById(userId);

      if (!activeVehiclePolicy || !userRecord) {
        return res.status(404).json({
          success: false,
          message: "Incorrect policy number or profile link. Please enter correct details."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Vehicle security identity criteria successfully mapped.",
        vehicleType: activeVehiclePolicy.vehicleType 
      });
    }

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