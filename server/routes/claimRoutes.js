import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import TravelClaim from "../models/TravelClaim.js";
import TravelInsurance from "../models/TravelInsurance.js";
import BuyInsurance from "../models/BuyInsurance.js";

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
                message: `Claim Filing Rejected: The policy number '${policyNo}' does not exist in our active database.`
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

router.post("/vehicle/submit", upload.array("supportDocs"), async (req, res) => {
    try {
        const { registration, date, mobileNo, incidentType } = req.body;

        if (!registration || !date || !mobileNo || !incidentType) {
            return res.status(400).json({
                success: false,
                message: "Missing mandatory parameters. All textual input targets required."
            });
        }

        const activePolicy = await BuyInsurance.findOne({ registration: registration.trim() });

        if (!activePolicy) {
            return res.status(404).json({
                success: false,
                message: `Claim Filing Rejected: The vehicle registration '${registration}' does not exist in our active database.`
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Claim filing denied. Please upload at least one supporting document."
            });
        }

        const filePathString = req.files.map(file => file.filename).join(", ");

        const newVehicleClaim = new TravelClaim({
            policyNo: registration.trim(),
            date: new Date(date),
            mobileNo: mobileNo.trim(),
            incidentType,
            supportDocs: filePathString
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

export default router;