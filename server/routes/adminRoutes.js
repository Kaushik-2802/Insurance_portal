import express from "express";
import TravelClaim from "../models/TravelClaim.js"; 
import VehicleClaim from "../models/vehicleClaim.js"; 
import SettledClaim from "../models/SettledClaim.js"; 
import Query from "../models/query.js"

const router = express.Router();

const calculateDisbursalAmount = (claim) => {

  const rawPremium = claim.policyPrice || claim.amountClaimed || claim.claimAmount;
  let premiumCost = 2828.00;

  if (rawPremium) {
    if (typeof rawPremium === "number") {
      premiumCost = rawPremium;
    } else {
      const cleanString = rawPremium.toString().replace(/[₹$,]/g, "").trim();
      const parsedValue = parseFloat(cleanString);
      if (!isNaN(parsedValue)) premiumCost = parsedValue;
    }
  } else {

    const token = (claim.policyNo || claim.policy || "").toUpperCase();
    if (claim.type === "Travel" || token.startsWith("TRV")) {
      premiumCost = 850.00; 
    }
  }

  let basePayout = 0;
  
  if (premiumCost < 1000) {
    basePayout = 45000;  
  } else if (premiumCost >= 1000 && premiumCost <= 3000) {
    basePayout = 120000;
  } else {
    basePayout = 250000; 
  }

  const structuralVariance = Math.floor(Math.random() * 900) - 450; 
  
  return basePayout + structuralVariance;
};

// ROUTE 1: Extract Inbound Form Documents (Unified From Both Collections)

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

      return {
        id: claim.id || claim._id?.toString(),
        policyNo: token,
        user: claim.name || `Policy Holder (${claim.mobileNo || claim.mobile || "N/A"})`,
        type: parsedClassification,
        docs: claim.status || "Pending",
        incidentType: claim.incidentType || claim.reason || "Not specified",
        amount: calculateDisbursalAmount(claim), // Injected Tier Disbursal Calculation Engine
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
      message: "Data access tracking layer fault. Unable to stream dynamic document rows.",
      error: error.message
    });
  }
});


// ROUTE 2: Commit Status Updates & Handle "Settled" Records Creation

router.put("/realtime-claims/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { action, txHash } = req.body; 

    if (!action || !["Verified", "Rejected", "Pending", "Settled"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing action identifier variable state target."
      });
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
      return res.status(404).json({
        success: false,
        message: `Transaction Aborted: Claims token record reference '${id}' was not discovered.`
      });
    }

    const claimObj = targetDocument.toObject();

    if (action !== "Settled") {
      targetDocument.status = action;
      await targetDocument.save();
      
      return res.status(200).json({
        success: true,
        message: `Status synchronized successfully to: ${action}`,
        updatedDocument: targetDocument
      });
    }

    const token = claimObj.policyNo || claimObj.policy || "N/A";
    const normalizedToken = token.toUpperCase();
    
    const displayType = (originType === "travel" || claimObj.type === "Travel" || normalizedToken.startsWith("TRV")) 
      ? "Travel Insurance Block" 
      : "Vehicle Insurance File";

    const distributedPayout = calculateDisbursalAmount(claimObj);
    const userLabel = claimObj.name || `Policy Holder (${claimObj.mobileNo || claimObj.mobile || "N/A"})`;

    await SettledClaim.create({
      originalClaimId: id,
      policyNo: token,
      user: userLabel,
      type: displayType,
      incidentType: claimObj.incidentType || claimObj.reason || "Not specified",
      amount: distributedPayout,
      txHash: txHash || "0xUNASSIGNED_SYSTEM_TRACE"
    });


    await ModelReference.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Database record successfully settled and archived inside permanent tracking tables.",
      deletedFromQueue: true
    });

  } catch (error) {
    console.error("Administrative transaction modifier failure execution log:", error);
    return res.status(500).json({
      success: false,
      message: "Internal schema fallback error during data persistence routines.",
      error: error.message
    });
  }
});


router.get("/settled-history/:userName", async (req, res) => {
  try {
    const { userName } = req.params;
    const history = await SettledClaim.find({ user: userName }).sort({ settledAt: -1 });
    
    return res.status(200).json({
      success: true,
      settlements: history
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not read historic ledger files",
      error: error.message
    });
  }
});

// query-route: sending user queries
router.post("/user-queries",async (req,res)=>{
  try{
    const {name,email,query} = req.body;
    const newQuery=new Query({fullName:name,email:email,textContent:query})
    await newQuery.save()
    res.status(200).json({
      success:true,
      message:"Data send to admin"
    })
  }
  catch(e){
    console.error(e)
    return res.status(500).json({
      success:false,
      message:"could not post message to admin",
      error: e.message
    });
  }
})

//
router.get("/user-message", async (req, res) => {
  try {
    const queryData = await Query.find({}).sort({ createdAt: -1 });

    if (queryData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No queries available"
      });
    }

    res.status(200).json({
      success: true,
      queries: queryData
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Couldn't fetch data from server",
      error: e.message
    });
  }
});

export default router;