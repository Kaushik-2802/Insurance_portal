import express from "express";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import insuranceDetails from "../models/InsuranceDetails.js"; // Standard import

const router = express.Router();

const generatePolicyRef = () => `POL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

const createActivePolicy = async (policyRef, paymentAmount, methodUsed) => {
  const userProfile = await User.findOne({}) || { firstName: "Aditya", lastName: "Vardhan" };
  const fullName = `${userProfile.firstName} ${userProfile.lastName}`.trim();

  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);


  const generatedTxnId = "TXN" + Math.floor(100000000000 + Math.random() * 900000000000);

  const activePolicy = new insuranceDetails({
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


// API ROUTES

// 1. Credit Card Gateway
router.post("/credit-card", async (req, res) => {
  try {
    const { number, name, expiry, cvv } = req.body;

    if (!number || !name || !expiry || !cvv) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
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

    await createActivePolicy(policyRef, cardAmount, "CREDIT-CARD");

    return res.status(200).json({ success: true, policyReferenceNumber: policyRef });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});


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

router.post("/upi/confirm", async (req, res) => {
  try {
    const { policyReferenceNumber } = req.body;
    const payment = await Payment.findOne({ policyReferenceNumber });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    payment.status = "SUCCESS";
    await payment.save();

    await createActivePolicy(policyReferenceNumber, payment.amount, "UPI");

    return res.status(200).json({ success: true, message: "Payment verified" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/net-banking/verify", async (req, res) => {
  try {
    const { account, ifsc, holder } = req.body;
    if (!account || !ifsc || !holder) {
      return res.status(400).json({ success: false, message: "All fields are required!!" });
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

    await createActivePolicy(policyRef, netBankingAmount, "NET-BANKING");

    return res.status(200).json({ success: true, policyReferenceNumber: policyRef });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

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

export default router;