import express from "express";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import insuranceDetails from "../models/InsuranceDetails.js";

const router = express.Router();

const generatePolicyRef = () => `POL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

// =========================================================================
// FIXED HELPER FUNCTION: Now explicitly queries by the incoming userId
// =========================================================================
const createActivePolicy = async (policyRef, paymentAmount, methodUsed, userId) => {
  // FIX: Look up the explicit user document by ID instead of using findOne({})
  const userProfile = await User.findById(userId);
  
  // Fallback string if the user profile cannot be located
  const fullName = userProfile 
    ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
    : "Chiru Chiru";

  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  const generatedTxnId = "TXN" + Math.floor(100000000000 + Math.random() * 900000000000);

  const activePolicy = new insuranceDetails({
    userId: userId, // Correctly assigns the modern user identification link
    refNo: policyRef,
    name: fullName,
    startDate: startDate,
    endDate: endDate,
    vehicleType: "Two Wheeler",
    bikeModel: "Royal Enfield Himalayan 450", 
    regNo: "TS-09-EA-1234",
    insuredValue: "₹2,85,000",
    amount: `₹${paymentAmount.toFixed(2)}`,
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
    // Added userId extraction from the request body
    const { number, name, expiry, cvv, userId } = req.body;

    if (!number || !name || !expiry || !cvv || !userId) {
      return res.status(400).json({ success: false, message: "Missing required fields, including userId" });
    }
    const cleanCard = number.replace(/\s/g, '');
    const policyRef = generatePolicyRef();
    const cardAmount = 700.00; 

    const newPayment = new Payment({
      amount: cardAmount,
      paymentMethod: "credit-card",
      status: "SUCCESS",
      policyReferenceNumber: policyRef,
      paymentDetails: {
        cardHolderName: name,
        lastFourDigits: cleanCard.slice(-4)
      }
    });
    await newPayment.save();

    // Pass the userId into the policy generator
    await createActivePolicy(policyRef, cardAmount, "CREDIT-CARD", userId);

    return res.status(200).json({ success: true, policyReferenceNumber: policyRef });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Initialize UPI Payment
router.post("/upi/initiate", async (req, res) => {
  try {
    const { upiId } = req.body;
    if (!upiId) {
      return res.status(400).json({ success: false, message: "upiId is required." });
    }
    const policyRef = generatePolicyRef();
    const newPayment = new Payment({
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
    const { policyReferenceNumber, userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required to tie the transaction." });
    }

    const payment = await Payment.findOne({ policyReferenceNumber });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    payment.status = "SUCCESS";
    await payment.save();

    // Now properly using the incoming userId parameter downstream
    await createActivePolicy(policyReferenceNumber, payment.amount, "UPI", userId);

    return res.status(200).json({ success: true, message: "Payment verified" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Net Banking Gateway
router.post("/net-banking/verify", async (req, res) => {
  try {
    // Added userId extraction here as well
    const { account, ifsc, holder, userId } = req.body;
    if (!account || !ifsc || !holder || !userId) {
      return res.status(400).json({ success: false, message: "All fields are required, including userId!!" });
    }
    const policyRef = generatePolicyRef();
    const netBankingAmount = 700.00;

    const newPayment = new Payment({
      amount: netBankingAmount,
      paymentMethod: "net-banking",
      status: "SUCCESS",
      policyReferenceNumber: policyRef,
      paymentDetails: {
        cardHolderName: holder,
        bankAccountMasked: `******${account.slice(-4)}`
      }
    });
    await newPayment.save();

    // Pass the userId into the policy generator
    await createActivePolicy(policyRef, netBankingAmount, "NET-BANKING", userId);

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

// 6. Fetch All Active Policies for Dashboard Profile Viewing (FIXED ROUTE ROUTING PARAMS)
router.get("/user-policies/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Changed endpoint path line to accept target variable parameter properly
    
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