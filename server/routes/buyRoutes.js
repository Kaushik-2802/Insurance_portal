import express from "express";
import crypto from "crypto";
// Make sure these paths match your real directory structure precisely
import BuyInsurance from "../models/BuyInsurance.js"; 
import InsuranceDetails from "../models/InsuranceDetails.js"; 

const router = express.Router();

// POST: http://localhost:5000/api/insurance/create-policy
router.post("/create-policy", async (req, res) => {
  try {
    const {
      userId,
      activeForm,
      manufacturer,
      model,
      drivingLicense,
      purchaseDate,
      registrationNumber,
      engineNumber,
      chasisNumber,
      amount,
      paymentMethod,
      transactionId
    } = req.body;

    // 1. Validation fallback check
    if (!registrationNumber || !model || !manufacturer) {
      return res.status(400).json({
        success: false,
        message: "Required core field profiles are missing (Registration, Model, or Manufacturer)."
      });
    }

    // 2. Format variables matching your database schema expectations
    const insuranceType = activeForm === "bike" ? "Two Wheeler" : "Four Wheeler";
    
    // Compute dynamic coverage expiration spans (1 year)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);
    
    // Unique policy string generation
    const generatedRefNo = "POL-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    // 3. Save directly to your detailed policy summary tracking collection
    const finalPolicy = new InsuranceDetails({
      userId: userId || new mongoose.Types.ObjectId(), // fallback token if userId isn't active
      refNo: generatedRefNo,
      name: `${insuranceType} Insurance (${manufacturer})`,
      startDate,
      endDate,
      vehicleType: insuranceType,
      bikeModel: model, 
      regNo: registrationNumber,
      amount: amount || "₹1,850",
      paymentMethod: paymentMethod || "Wallet Gateway",
      transactionId: transactionId || "TXN-" + crypto.randomBytes(6).toString("hex").toUpperCase()
    });

    const savedPolicy = await finalPolicy.save();

    // OPTIONAL: If you also want to log raw leads inside your buyInsuranceSchema collection simultaneously:
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
    await leadLog.save();

    // 4. Return unified success payload back to React
    return res.status(201).json({
      success: true,
      message: "Insurance policy written and stored successfully!",
      policy: savedPolicy
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

export default router;