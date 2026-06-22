import express from "express";
import TravelClaim from "../models/TravelClaim.js"; 
import VehicleClaim from "../models/vehicleClaim.js"; 
import SettledClaim from "../models/SettledClaim.js"; 
import Query from "../models/query.js";

const router = express.Router();

/**
 * Optimizes the final settlement payout to track directly against what the user claimed.
 * Run ONCE per settlement execution.
 */
const calculateDisbursalAmount = (claim) => {
  const rawClaimValue = claim.claimAmount ?? claim.amountClaimed ?? claim.amount ?? claim.policyPrice;
  let userClaimedAmount = 0;

  if (rawClaimValue !== undefined && rawClaimValue !== null) {
    if (typeof rawClaimValue === "number") {
      userClaimedAmount = rawClaimValue;
    } else {
      const cleanString = rawClaimValue.toString().replace(/[₹$,]/g, "").trim();
      const parsedValue = parseFloat(cleanString);
      if (!isNaN(parsedValue)) userClaimedAmount = parsedValue;
    }
  }

  if (userClaimedAmount <= 0) {
    const token = (claim.policyNo || claim.policy || "").toUpperCase();
    return (claim.type === "Travel" || token.startsWith("TRV")) ? 15000 : 45000;
  }

  // Deduct a small safe percentage to keep it near but strictly under the user request
  const reductionPercentage = 0.03 + (Math.random() * 0.03); // Stable 3% - 6% deduction
  let calculatedPayout = userClaimedAmount * (1 - reductionPercentage);

  const absoluteSafetyBuffer = 200 + Math.floor(Math.random() * 300); 
  calculatedPayout = Math.min(calculatedPayout, userClaimedAmount - absoluteSafetyBuffer);

  return Math.floor(calculatedPayout);
};

// --- ROUTE 1: Extract Inbound Form Documents (Static Amounts Displayed) ---
router.get("/realtime-claims", async (req, res) => {
  try {
    const travelClaims = await TravelClaim.find();
    const vehicleClaims = await VehicleClaim.find();
    
    const combinedClaims = [
      ...travelClaims.map(c => {
        const obj = c.toObject();
        return { ...obj, id: obj.id || obj._id?.toString(), productOrigin: "travel" };
      }),
      ...vehicleClaims.map(c => {
        const obj = c.toObject();
        return { ...obj, id: obj.id || obj._id?.toString(), productOrigin: "vehicle" };
      })
    ];

    combinedClaims.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });
    
    const mappedClaims = combinedClaims.map(claim => {
      const token = claim.policyNo || claim.policy || "N/A";
      const normalizedToken = token.toUpperCase();
      let parsedClassification = "Vehicle Insurance File";
      
      if (claim.productOrigin === "travel" || claim.type === "Travel" || normalizedToken.startsWith("TRV")) {
        parsedClassification = "Travel Insurance Block";
      }

      // FIX: Grab user's exact input field value directly so it remains static while waiting in queue
      const stableInputAmount = claim.claimAmount ?? claim.amountClaimed ?? claim.amount ?? 0;

      return {
        id: claim.id || claim._id?.toString(),
        policyNo: token,
        user: claim.name || `Policy Holder (${claim.mobileNo || claim.mobile || "N/A"})`,
        type: parsedClassification,
        docs: claim.status || "Pending",
        incidentType: claim.incidentType || claim.reason || "Not specified",
        amount: stableInputAmount, // Stays rock solid here
        date: claim.date ? new Date(claim.date).toLocaleDateString() : "N/A"
      };
    });

    return res.status(200).json({
      success: true,
      count: mappedClaims.length,
      claims: mappedClaims
    });
  } catch (error) {
    console.error("Dashboard engine collection retrieval exception:", error);
    return res.status(500).json({
      success: false,
      message: "Data access layer error.",
      error: error.message
    });
  }
});

// --- ROUTE 2: Commits Status Changes & Generates Fixed Settlement Record ---
router.put("/realtime-claims/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { action, txHash, customPayout } = req.body; // Added customPayout listener payload flag

    if (!action || !["Verified", "Rejected", "Pending", "Settled"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action state variable." });
    }

    let targetDocument = null;
    let ModelReference = null;
    let originType = "";

    targetDocument = await TravelClaim.findById(id);
    if (targetDocument) {
      ModelReference = TravelClaim;
      originType = "travel";
    } else {
      targetDocument = await VehicleClaim.findById(id);
      if (targetDocument) {
        ModelReference = VehicleClaim;
        originType = "vehicle";
      }
    }

    if (!targetDocument) {
      return res.status(404).json({ success: false, message: "Claims reference token not discovered." });
    }

    const claimObj = targetDocument.toObject();

    if (action !== "Settled") {
      targetDocument.status = action;
      await targetDocument.save();
      return res.status(200).json({ success: true, updatedDocument: targetDocument });
    }

    const token = claimObj.policyNo || claimObj.policy || "N/A";
    const normalizedToken = token.toUpperCase();
    
    const displayType = (originType === "travel" || claimObj.type === "Travel" || normalizedToken.startsWith("TRV")) 
      ? "Travel Insurance Block" 
      : "Vehicle Insurance File";

    // FIXED LOCK MECHANISM: Use the single value calculated on the frontend. Falling back safely if missing.
    const finalCalculatedPayout = customPayout ? Number(customPayout) : calculateDisbursalAmount(claimObj);
    const userLabel = claimObj.name || `Policy Holder (${claimObj.mobileNo || claimObj.mobile || "N/A"})`;

    // Save permanently inside the archive collection
    await SettledClaim.create({
      originalClaimId: id,
      policyNo: token,
      user: userLabel,
      type: displayType,
      incidentType: claimObj.incidentType || claimObj.reason || "Not specified",
      amount: finalCalculatedPayout, 
      txHash: txHash || "0xUNASSIGNED_SYSTEM_TRACE"
    });

    // Remove from active queue checklist entirely
    await ModelReference.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Database record successfully settled and archived.",
      deletedFromQueue: true
    });

  } catch (error) {
    console.error("Administrative transaction modifier failure:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Remaining query and history code endpoints stay the same...
router.get("/settled-history/:userName", async (req, res) => {
  try {
    const { userName } = req.params;
    const history = await SettledClaim.find({ user: userName }).sort({ settledAt: -1 });
    return res.status(200).json({ success: true, settlements: history });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/user-queries", async (req, res) => {
  try {
    const { name, email, query } = req.body;
    const newQuery = new Query({ fullName: name, email: email, textContent: query });
    await newQuery.save();
    res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/user-message", async (req, res) => {
  try {
    const queryData = await Query.find({}).sort({ createdAt: -1 });
    if (queryData.length === 0) return res.status(404).json({ success: false });
    res.status(200).json({ success: true, queries: queryData });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;