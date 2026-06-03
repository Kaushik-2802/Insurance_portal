import express from "express";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import insuranceDetails from "../models/InsuranceDetails.js";

const router = express.Router();

const generatePolicyRef = () => `POL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

// =========================================================================
// UPDATED HELPER FUNCTION: Securely parses tenure and dynamic object keys
// =========================================================================
const createActivePolicy = async (policyRef, paymentAmount, methodUsed, userId, vehicleInfo = {}, tenure = 1) => {
  const userProfile = await User.findById(userId);
  
  const fullName = userProfile 
    ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
    : "Chiru Chiru";

  const startDate = new Date();
  const endDate = new Date();
  
  // ✅ READS PASSED TENURE: Safe integer parsing from req.body source
  const parsedTenure = parseInt(tenure, 10) || 1;
  endDate.setFullYear(endDate.getFullYear() + parsedTenure);

  const generatedTxnId = "TXN" + Math.floor(100000000000 + Math.random() * 900000000000);

  const activePolicy = new insuranceDetails({
    userId: userId, 
    refNo: policyRef,
    name: fullName,
    startDate: startDate,
    endDate: endDate,
    vehicleType: vehicleInfo.vehicleType || "Two Wheeler",
    // Compatibility fallbacks for frontend vehicle key combinations
    bikeModel: vehicleInfo.bikeModel || vehicleInfo.model || "Livo", 
    regNo: vehicleInfo.regNo || vehicleInfo.registrationNumber || "TS 08 FX 5612",      
    insuredValue: vehicleInfo.insuredValue || "₹2,85,000",
    amount: paymentAmount.toString().startsWith('₹') ? paymentAmount : `₹${Number(paymentAmount).toLocaleString('en-IN')}`,
    paymentMethod: methodUsed.toUpperCase(),
    transactionId: generatedTxnId
  });

  await activePolicy.save();
  return activePolicy;
};

// =========================================================================
// API ROUTES 
// =========================================================================

// 1. Credit Card Gateway
router.post("/credit-card", async (req, res) => {
  try {
    const { number, name, expiry, cvv, userId, model, bikeModel, registrationNumber, regNo, vehicleType, tenure, amount, insuredValue } = req.body;

    if (!number || !name || !expiry || !cvv || !userId) {
      return res.status(400).json({ success: false, message: "Missing required fields, including userId" });
    }
    const cleanCard = number.replace(/\s/g, '');
    const policyRef = generatePolicyRef();
    
    const cardAmount = amount ? amount : 700.00; 

    const newPayment = new Payment({
      amount: typeof cardAmount === 'string' ? parseFloat(cardAmount.replace(/[^0-9.]/g, '')) : cardAmount,
      paymentMethod: "credit-card",
      status: "SUCCESS",
      policyReferenceNumber: policyRef,
      paymentDetails: {
        cardHolderName: name,
        lastFourDigits: cleanCard.slice(-4)
      }
    });
    await newPayment.save();

    const vehicleInfo = { 
      bikeModel: bikeModel || model, 
      regNo: regNo || registrationNumber, 
      vehicleType, 
      insuredValue 
    };
    
    // ✅ Tenure passed directly from request body
    await createActivePolicy(policyRef, cardAmount, "CREDIT-CARD", userId, vehicleInfo, tenure);

    return res.status(200).json({ success: true, policyReferenceNumber: policyRef });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Initialize UPI Payment
router.post("/upi/initiate", async (req, res) => {
  try {
    const { upiId, amount } = req.body;
    if (!upiId) {
      return res.status(400).json({ success: false, message: "upiId is required." });
    }
    const policyRef = generatePolicyRef();
    const newPayment = new Payment({
      amount: amount || 700.00, 
      paymentMethod: "upi",
      status: "PENDING",
      policyReferenceNumber: policyRef,
      paymentDetails: { upiId }
    });

    await newPayment.save();
    return res.status(201).json({ success: true, policyReferenceNumber: policyRef });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Confirm UPI Payment
router.post("/upi/confirm", async (req, res) => {
  try {
    const { policyReferenceNumber, userId, model, bikeModel, registrationNumber, regNo, vehicleType, tenure, insuredValue } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required to tie the transaction." });
    }

    const payment = await Payment.findOne({ policyReferenceNumber });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    payment.status = "SUCCESS";
    await payment.save();

    const vehicleInfo = { 
      bikeModel: bikeModel || model, 
      regNo: regNo || registrationNumber, 
      vehicleType, 
      insuredValue 
    };
    
    // ✅ Tenure passed directly from request body
    await createActivePolicy(policyReferenceNumber, payment.amount || 700.00, "UPI", userId, vehicleInfo, tenure);

    return res.status(200).json({ success: true, message: "Payment verified" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Net Banking Gateway
router.post("/net-banking/verify", async (req, res) => {
  try {
    const { account, ifsc, holder, userId, model, bikeModel, registrationNumber, regNo, vehicleType, tenure, amount, insuredValue } = req.body;
    if (!account || !ifsc || !holder || !userId) {
      return res.status(400).json({ success: false, message: "All fields are required, including userId!!" });
    }
    const policyRef = generatePolicyRef();
    const netBankingAmount = amount ? amount : 700.00;

    const newPayment = new Payment({
      amount: typeof netBankingAmount === 'string' ? parseFloat(netBankingAmount.replace(/[^0-9.]/g, '')) : netBankingAmount,
      paymentMethod: "net-banking",
      status: "SUCCESS",
      policyReferenceNumber: policyRef,
      paymentDetails: {
        cardHolderName: holder,
        bankAccountMasked: `******${account.slice(-4)}`
      }
    });
    await newPayment.save();

    const vehicleInfo = { 
      bikeModel: bikeModel || model, 
      regNo: regNo || registrationNumber, 
      vehicleType, 
      insuredValue 
    };
    
    // ✅ Tenure passed directly from request body
    await createActivePolicy(policyRef, netBankingAmount, "NET-BANKING", userId, vehicleInfo, tenure);

    return res.status(200).json({ success: true, policyReferenceNumber: policyRef });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Fetch Summary Endpoint
router.get("/summary/:policyRef", async (req, res) => {
  try {
    const { policyRef } = req.params;
    const policy = await insuranceDetails.findOne({ refNo: policyRef });

    if (!policy) {
      return res.status(404).json({ success: false, message: "No final insurance policy found for this reference." });
    }

    return res.status(200).json({
      success: true,
      policyReferenceNumber: policy.refNo,
      ownerName: policy.name,
      bikeModel: policy.bikeModel, 
      registrationNo: policy.regNo,
      insuredValue: policy.insuredValue,
      startTime: new Date(policy.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + " | 10:00 AM",
      endTime: new Date(policy.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + " | 11:59 PM",
      paymentAmount: policy.amount,
      paymentMethod: policy.paymentMethod,
      transactionId: policy.transactionId
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Fetch All Active Policies for Dashboard Profile Viewing 
router.get("/user-policies/:userId", async (req, res) => {
  try {
    const { userId } = req.params; 
    const activePolicies = await insuranceDetails.find({ userId }).sort({ createdAt: -1 });

    const formattedPolicies = activePolicies.map(policy => ({
      id: policy.refNo,
      holder: policy.name,
      category: policy.vehicleType, 
      vehicle: `${policy.bikeModel} (${policy.regNo})`,
      premium: policy.amount,
      expiry: new Date(policy.endDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: "Active"
    }));

    return res.status(200).json({ success: true, policies: formattedPolicies });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;