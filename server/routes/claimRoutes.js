import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import TravelClaim from "../models/TravelClaim.js";
import VehicleClaim from "../models/vehicleClaim.js"; 
import TravelInsurance from "../models/TravelInsurance.js";
import InsuranceDetails from "../models/InsuranceDetails.js";
// FIX 1: Ensure capital 'S' matches filesystem casing perfectly
import SettledClaim from "../models/settledClaim.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/claims/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// =========================================================================
// 1. POST: Policy Eligibility Verification Gateway
// =========================================================================
router.post("/verify-claim-eligibility", async (req, res) => {
    try {
        const { policyNumber, linkedMobile } = req.body;

        if (!policyNumber || !linkedMobile) {
            return res.status(400).json({ success: false, message: "Missing code or telephone input references." });
        }

        const cleanToken = policyNumber.trim();
        const isTravel = cleanToken.toUpperCase().startsWith("TRV");

        if (isTravel) {
            const travelPolicy = await TravelInsurance.findOne({ policyNo: cleanToken });
            if (!travelPolicy) {
                return res.status(404).json({ success: false, message: "Travel reference profile missing in database records." });
            }
            return res.status(200).json({ success: true, vehicleType: "Travel Insurance" });
        } else {
            const vehiclePolicy = await InsuranceDetails.findOne({ refNo: cleanToken });
            if (!vehiclePolicy) {
                return res.status(404).json({ success: false, message: "Motor policy reference missing in active database records." });
            }
            return res.status(200).json({ success: true, vehicleType: vehiclePolicy.vehicleType });
        }
    } catch (error) {
        console.error("Verification engine exception:", error);
        res.status(500).json({ success: false, message: "Internal verification component exception." });
    }
});

// =========================================================================
// 2. POST: Travel Claims Inbound Ingestion Pipeline
// =========================================================================
router.post("/submit", upload.array("supportDocs"), async (req, res) => {
    try {
        const { policyNo, date, mobileNo, incidentType } = req.body;

        if (!policyNo || !date || !mobileNo || !incidentType) {
            return res.status(400).json({
                success: false,
                message: "Missing mandatory parameters. All textual input targets required."
            });
        }

        const activePolicy = await TravelInsurance.findOne({ policyNo: policyNo.trim() });

        if (!activePolicy) {
            return res.status(404).json({
                success: false,
                message: `Claim Filing Rejected: The travel policy number '${policyNo}' does not exist in our active database.`
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Claim filing denied. Please upload at least one supporting document."
            });
        }

        const filePathString = req.files.map(file => file.filename).join(", ");

        const newTravelClaim = new TravelClaim({
            policyNo: policyNo.trim(),
            date: new Date(date),
            mobileNo: mobileNo.trim(),
            incidentType,
            supportDocs: filePathString,
            status: "Pending"
        });

        const savedClaim = await newTravelClaim.save();

        res.status(201).json({
            success: true,
            message: "Travel insurance claim successfully verified and submitted.",
            claimId: savedClaim._id,
            data: savedClaim
        });

    } catch (error) {
        console.error("Internal processing fault in Claim Routing Layer: ", error);
        res.status(500).json({
            success: false,
            message: "Internal system fallback execution fault during claim archiving operations.",
            error: error.message
        });
    }
});

// =========================================================================
// 3. POST: Vehicle Claims Inbound Ingestion Pipeline
// =========================================================================
router.post("/vehicle/submit", upload.array("supportDocs"), async (req, res) => {
    try {
        const { registration, date, mobileNo, incidentType } = req.body;

        if (!registration || !date || !mobileNo || !incidentType) {
            return res.status(400).json({
                success: false,
                message: "Missing mandatory parameters. All textual input targets required."
            });
        }

        const activePolicy = await InsuranceDetails.findOne({ refNo: registration.trim() });

        if (!activePolicy) {
            return res.status(404).json({
                success: false,
                message: `Claim Filing Rejected: The vehicle policy code '${registration}' does not exist in our active tracking details.`
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Claim filing denied. Please upload at least one supporting document."
            });
        }

        const filePathString = req.files.map(file => file.filename).join(", ");

        const newVehicleClaim = new VehicleClaim({
            policyNo: registration.trim(),
            date: new Date(date),
            mobileNo: mobileNo.trim(),
            incidentType,
            supportDocs: filePathString,
            status: "Pending"
        });

        const savedClaim = await newVehicleClaim.save();

        res.status(201).json({
            success: true,
            message: "Vehicle insurance claim successfully verified and submitted.",
            claimId: savedClaim._id,
            data: savedClaim
        });

    } catch (error) {
        console.error("Internal processing fault in Claim Routing Layer: ", error);
        res.status(500).json({
            success: false,
            message: "Internal system fallback execution fault during vehicle claim archiving operations.",
            error: error.message
        });
    }
});

// =========================================================================
// 4. ADMIN ENDPOINTS: Sync Panel Data Rows From Respective Collections
// =========================================================================
router.get("/admin/realtime-claims", async (req, res) => {
    try {
        const travelClaims = await TravelClaim.find();
        const vehicleClaims = await VehicleClaim.find();

        const combinedClaims = [
            ...travelClaims.map(c => ({ ...c.toObject(), typeKey: "travel" })),
            ...vehicleClaims.map(c => ({ ...c.toObject(), typeKey: "vehicle" }))
        ];

        combinedClaims.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const formattedClaims = await Promise.all(
            combinedClaims.map(async (claim) => {
                const token = claim.policyNo ? claim.policyNo.trim() : "";
                let holderName = "Unknown Holder";
                let insuranceType = "Vehicle Insurance";

                try {
                    if (claim.typeKey === "travel") {
                        const travelPolicy = await TravelInsurance.findOne({ policyNo: token });
                        insuranceType = "Travel Insurance";
                        if (travelPolicy) {
                            holderName = travelPolicy.holderName || travelPolicy.name || `Holder (${travelPolicy.mobileNo || claim.mobileNo})`;
                        } else {
                            holderName = `Holder (${claim.mobileNo}) [Unlinked]`;
                        }
                    } else {
                        const vehiclePolicy = await InsuranceDetails.findOne({ refNo: token });
                        if (vehiclePolicy) {
                            insuranceType = vehiclePolicy.vehicleType || "Vehicle Insurance";
                            holderName = vehiclePolicy.holderName || vehiclePolicy.name || `Holder (${claim.mobileNo})`;
                        } else {
                            holderName = `Holder (${claim.mobileNo}) [Unlinked]`;
                        }
                    }
                } catch (dbErr) {
                    console.error(`Failed to cross-reference data for policy ${token}:`, dbErr);
                }

                return {
                    id: claim._id.toString(),
                    policyNo: token,
                    user: holderName,
                    type: insuranceType,
                    docs: claim.status || "Pending",
                    incidentType: claim.incidentType || "Not specified",
                    date: claim.date ? new Date(claim.date).toLocaleDateString() : "N/A"
                };
            })
        );

        res.status(200).json({ 
            success: true, 
            count: formattedClaims.length,
            claims: formattedClaims 
        });
    } catch (error) {
        console.error("Dashboard population ledger compilation fault:", error);
        res.status(500).json({ success: false, message: "Internal aggregation exception.", error: error.message });
    }
});

router.put("/admin/realtime-claims/:id/status", async (req, res) => {
    try {
        const { action } = req.body;
        const targetId = req.params.id;
        
        if (!action) {
            return res.status(400).json({ success: false, message: "Missing explicit state action parameter." });
        }

        let updated = await TravelClaim.findByIdAndUpdate(
            targetId, 
            { $set: { status: action } },
            { new: true }
        );

        if (!updated) {
            updated = await VehicleClaim.findByIdAndUpdate(
                targetId, 
                { $set: { status: action } },
                { new: true }
            );
        }

        if (!updated) {
            return res.status(404).json({ success: false, message: "Target document token entry missing across collections." });
        }

        res.status(200).json({ success: true, message: "Status adjusted successfully.", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// =========================================================================
// 5. GET: Fetch Unified Claims for Logged-In User matched via Policy/Mobile
// =========================================================================
router.get("/user-track", async (req, res) => {
    try {
        const { policyNo, mobileNo } = req.query;

        const sanitizedPolicy = policyNo && policyNo !== "undefined" && policyNo !== "null" ? policyNo.trim() : "";
        const sanitizedMobile = mobileNo && mobileNo !== "undefined" && mobileNo !== "null" ? mobileNo.trim() : "";

        // Fail-safe payload escape
        if (!sanitizedPolicy && !sanitizedMobile) {
            return res.status(200).json([]);
        }

        // 1. Standard active collections matching array criteria
        const activeClaimsQuery = [];
        if (sanitizedPolicy) {
            activeClaimsQuery.push({ policyNo: sanitizedPolicy });
        }
        if (sanitizedMobile) {
            activeClaimsQuery.push({ mobileNo: sanitizedMobile });
        }

        // 2. FIX 2: Dynamic search for SettledClaims to catch registration tokens (e.g. "TS 08 FX 5612")
        // and safely handle regex mappings on the compound user string cell
        const settledClaimsQuery = [];
        if (sanitizedPolicy) {
            settledClaimsQuery.push(
                { policyNo: sanitizedPolicy },
                // If front-end passes vehicle registration string, map against type text description fallback criteria
                { type: { $regex: sanitizedPolicy, $options: "i" } }
            );
        }
        if (sanitizedMobile) {
            settledClaimsQuery.push({ user: { $regex: sanitizedMobile, $options: "i" } });
        }

        // 3. Concurrently pull documents from all 3 data buckets
        const [travelClaims, vehicleClaims, settledClaims] = await Promise.all([
            TravelClaim.find({ $or: activeClaimsQuery }),
            VehicleClaim.find({ $or: activeClaimsQuery }),
            SettledClaim.find({ $or: settledClaimsQuery }) 
        ]);

        // 4. Uniformly normalize fields before pushing array down pipeline to TrackClaims.jsx
        const combined = [
            ...travelClaims.map(c => ({
                _id: c._id,
                policyNo: c.policyNo,
                createdAt: c.createdAt,
                flowType: "travel",
                reason: c.incidentType,
                status: c.status || "Pending",
                requestedAmount: c.requestedAmount || c.amount || 15000,
                approvedAmount: c.status?.toLowerCase() === "approved" ? (c.requestedAmount || c.amount || 15000) : 0,
                txHash: null
            })),
            ...vehicleClaims.map(c => ({
                _id: c._id,
                policyNo: c.policyNo,
                createdAt: c.createdAt,
                flowType: "vehicle",
                reason: c.incidentType,
                status: c.status || "Pending",
                requestedAmount: c.requestedAmount || c.amount || 45000,
                approvedAmount: c.status?.toLowerCase() === "approved" ? (c.requestedAmount || c.amount || 45000) : 0,
                txHash: null
            })),
            ...settledClaims.map(c => ({
                _id: c._id,
                originalClaimId: c.originalClaimId,
                policyNo: c.policyNo,
                createdAt: c.settledAt || c.createdAt,
                flowType: c.type?.toLowerCase().includes("travel") ? "travel" : "vehicle",
                reason: c.incidentType || "General Claim",
                status: c.status || "Settled", 
                requestedAmount: c.amount, 
                approvedAmount: c.amount,
                txHash: c.txHash 
            }))
        ];

        // Sort descending by chronological creation/settlement timeline
        combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json(combined);

    } catch (error) {
        console.error("User tracking engine aggregation exception:", error);
        return res.status(500).json([]);
    }
});

export default router;