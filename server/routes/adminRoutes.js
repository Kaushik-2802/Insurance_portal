import express from "express";
import TravelClaim from "../models/TravelClaim.js"; 
import VehicleClaim from "../models/vehicleClaim.js"; // FIX 1: Import your separate Vehicle Claim model

const router = express.Router();

// =========================================================================
// ROUTE 1: Extract Inbound Form Documents (Unified From Both Collections)
// GET: http://localhost:5000/api/admin/realtime-claims
// =========================================================================
router.get("/realtime-claims", async (req, res) => {
  try {
    // FIX 2: Query both separate collections simultaneously
    const travelClaims = await TravelClaim.find();
    const vehicleClaims = await VehicleClaim.find();
    
    // FIX 3: Combine them into a single array while tagging their origin
    const combinedClaims = [
      ...travelClaims.map(c => ({ ...c.toObject(), productOrigin: "travel" })),
      ...vehicleClaims.map(c => ({ ...c.toObject(), productOrigin: "vehicle" }))
    ];

    // FIX 4: Sort them collectively so the newest claims across BOTH types appear first
    combinedClaims.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Maps database fields to the flat data structures expected by the frontend UI
    const mappedClaims = combinedClaims.map(claim => {
      const token = claim.policyNo ? claim.policyNo.toUpperCase() : "";
      let parsedClassification = "Vehicle Insurance File";
      
      if (claim.productOrigin === "travel" || token.startsWith("TRV")) {
        parsedClassification = "Travel Insurance Block";
      }

      return {
        id: claim._id.toString(),
        policyNo: claim.policyNo,
        user: `Policy Holder (${claim.mobileNo})`,
        type: parsedClassification,
        docs: claim.status || "Pending",
        incidentType: claim.incidentType || "Not specified",
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

// =========================================================================
// ROUTE 2: Commit Status Updates to MongoDB (Checks Both Collections)
// PUT: http://localhost:5000/api/admin/realtime-claims/:id/status
// =========================================================================
router.put("/realtime-claims/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // Expects "Verified" or "Rejected"

    if (!action || !["Verified", "Rejected", "Pending"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing action identifier variable state target."
      });
    }

    // FIX 5: Attempt to find and update in the Travel collection first
    let modifiedDocument = await TravelClaim.findByIdAndUpdate(
      id,
      { $set: { status: action } },
      { new: true, runValidators: true }
    );

    // FIX 6: If it wasn't found in Travel, attempt to update it in the Vehicle collection
    if (!modifiedDocument) {
      modifiedDocument = await VehicleClaim.findByIdAndUpdate(
        id,
        { $set: { status: action } },
        { new: true, runValidators: true }
      );
    }

    if (!modifiedDocument) {
      return res.status(404).json({
        success: false,
        message: `Transaction Aborted: Claims token record reference '${id}' was not discovered inside active schema indices.`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Database field parameter sync execution finalized.",
      updatedDocument: modifiedDocument
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

export default router;