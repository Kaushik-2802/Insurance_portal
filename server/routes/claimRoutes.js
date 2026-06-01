import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import TravelClaim from "../models/TravelClaim.js";
import TravelInsurance from "../models/TravelInsurance.js"; // <-- CRITICAL: Import the master policy model

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

// --- POST ROUTE: SUBMIT WITH STRICT DATABASE VERIFICATION ---
router.post("/submit", upload.array("supportDocs"), async (req, res) => {
    try {
        const { policyNo, date, mobileNo, incidentType } = req.body;

        // 1. Structural Parameters Check
        if (!policyNo || !date || !mobileNo || !incidentType) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing mandatory parameters. All textual input targets required." 
            });
        }

        // 2. ABSOLUTE VERIFICATION GUARD: Check if the policy exists in our records
        const activePolicy = await TravelInsurance.findOne({ policyNo: policyNo.trim() });

        if (!activePolicy) {
            return res.status(404).json({
                success: false,
                message: `Claim Filing Rejected: The policy number '${policyNo}' does not exist in our active database.`
            });
        }

        // 3. Document Check
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Claim filing denied. Please upload at least one supporting document." 
            });
        }

        const filePathString = req.files.map(file => file.filename).join(", ");

        // 4. Save the Verified Claim
        const newTravelClaim = new TravelClaim({
            policyNo: policyNo.trim(),
            date: new Date(date),
            mobileNo: mobileNo.trim(),
            incidentType,
            supportDocs: filePathString
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

export default router;