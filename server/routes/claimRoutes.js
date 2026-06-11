import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import TravelClaim from "../models/TravelClaim.js";
import VehicleClaim from "../models/vehicleClaim.js";
import TravelInsurance from "../models/TravelInsurance.js";
import InsuranceDetails from "../models/InsuranceDetails.js";
import SettledClaim from "../models/settledClaim.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/claims/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, {
                recursive: true
            });
        }
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const uniqueSuffix =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9);
        cb(null, file.fieldname +"-" +uniqueSuffix +path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// 1. VERIFY CLAIM ELIGIBILITY

router.post("/verify-claim-eligibility",authMiddleware,async (req, res) => {
        try {

            const { policyNumber } = req.body;
            const userId = req.user.userId;
            if (!policyNumber) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Policy number is required."
                });
            }
            const cleanToken = policyNumber.trim();
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            const isTravel = cleanToken.toUpperCase().startsWith("TRV");

            if (isTravel) {
                const travelPolicy =await TravelInsurance.findOne({
                        policyNo: cleanToken
                    });
                if (!travelPolicy) {
                    return res.status(404).json({
                        success: false,
                        message:"Travel policy not found."
                    });
                }
                if (travelPolicy.userId.toString()!== userId) {
                    return res.status(403).json({
                        success: false,
                        message:"This travel policy does not belong to your account."
                    });
                }
                return res.status(200).json({
                    success: true,
                    vehicleType:"Travel Insurance"
                });
            }
             else {

                const vehiclePolicy = await InsuranceDetails.findOne({
                        refNo: cleanToken
                    });
                if (!vehiclePolicy) {
                    return res.status(404).json({
                        success: false,
                        message:"Motor policy not found."
                    });
                }
                if (vehiclePolicy.userId.toString()!==userId) {
                    return res.status(403).json({
                        success: false,
                        message:"This policy does not belong to your account."
                    });
                }
                return res.status(200).json({
                    success: true,
                    vehicleType: vehiclePolicy.vehicleType
                });
            }
        } catch (error) {
            console.error("Verification engine exception:",error);
            return res.status(500).json({
                success: false,
                message:"Internal verification component exception."
            });
        }
    }
);

// 2. TRAVEL CLAIM SUBMIT

router.post("/submit",authMiddleware,upload.array("supportDocs"),async (req, res) => {
        try {
            const {policyNo,date,mobileNo,incidentType} = req.body;
            if (!policyNo ||!date ||!mobileNo ||!incidentType) {
                return res.status(400).json({
                    success: false,
                    message:"Missing mandatory parameters."
                });
            }
            const activePolicy =
                await TravelInsurance.findOne({
                    policyNo: policyNo.trim()
                });

            if (!activePolicy) {

                return res.status(404).json({
                    success: false,
                    message:`Travel policy '${policyNo}' not found.`
                });
            }
            if (!req.files || req.files.length === 0) {

                return res.status(400).json({
                    success: false,
                    message: "Please upload supporting documents."
                });
            }

            const filePathString =req.files.map(file => file.filename).join(", ");
            const newTravelClaim =new TravelClaim({
                    policyNo:  policyNo.trim(),
                    date: new Date(date),
                    mobileNo: mobileNo.trim(),
                    incidentType,
                    supportDocs:filePathString,
                    status: "Pending"
                });

            const savedClaim = await newTravelClaim.save();
            return res.status(201).json({
                success: true,
                message:"Travel claim submitted successfully.",
                claimId: savedClaim._id,
                data: savedClaim
            });

        } catch (error) {
            console.error("Travel claim error:",error);
            return res.status(500).json({
                success: false,
                message:"Internal server error.",
                error: error.message
            });
        }
    }
);

// 3. VEHICLE CLAIM SUBMIT
router.post("/vehicle/submit",authMiddleware,upload.array("supportDocs"),async (req, res) => {
        try {
            const {registration,date,mobileNo,incidentType} = req.body;

            if (!registration ||!date ||!mobileNo ||!incidentType) {
                return res.status(400).json({
                    success: false,
                    message:"Missing mandatory parameters."
                });
            }

            const activePolicy = await InsuranceDetails.findOne({
                    refNo: registration.trim()
                });

            if (!activePolicy) {
                return res.status(404).json({
                    success: false,
                    message:`Vehicle policy '${registration}' not found.`
                });
            }

            if (!req.files ||req.files.length === 0) {

                return res.status(400).json({
                    success: false,
                    message:"Please upload supporting documents."
                });
            }

            const filePathString =req.files.map(file => file.filename).join(", ");
            const newVehicleClaim =new VehicleClaim({

                    policyNo: registration.trim(),
                    date: new Date(date),
                    mobileNo: mobileNo.trim(),
                    incidentType,
                    supportDocs: filePathString,
                    status: "Pending"
                });

            const savedClaim =await newVehicleClaim.save();

            return res.status(201).json({
                success: true,
                message:"Vehicle claim submitted successfully.",
                claimId: savedClaim._id,
                data: savedClaim
            });

        } catch (error) {

            console.error("Vehicle claim error:",error);

            return res.status(500).json({
                success: false,
                message:"Internal server error.",
                error: error.message
            });
        }
    }
);

// 5. GET: FETCH CLAIMS FOR LOGGED-IN USER USING JWT
router.get("/user-track",authMiddleware,async (req, res) => {
       
        try {
            const userId = req.user.userId;
            const userTravelPolicies = await TravelInsurance.find({userId});

            const userVehiclePolicies = await InsuranceDetails.find({
                    userId
                });

            const travelPolicyNumbers = userTravelPolicies.map(p => p.policyNo);

            const vehiclePolicyNumbers = userVehiclePolicies.map(p => p.refNo);
            const [travelClaims,vehicleClaims,settledClaims] = await Promise.all([

                TravelClaim.find({
                    policyNo: {
                        $in: travelPolicyNumbers
                    }
                }),
                VehicleClaim.find({
                    policyNo: {
                        $in: vehiclePolicyNumbers
                    }
                }),
                SettledClaim.find({
                    policyNo: {
                        $in: [
                            ...travelPolicyNumbers,
                            ...vehiclePolicyNumbers
                        ]
                    }
                })
            ]);

            const combined = [
                ...travelClaims.map(c => ({
                    _id: c._id,
                    policyNo: c.policyNo,
                    createdAt: c.createdAt,
                    flowType: "travel",
                    reason: c.incidentType,
                    status: c.status || "Pending",
                    requestedAmount: c.requestedAmount || c.amount || 15000,
                    approvedAmount: c.status?.toLowerCase() === "approved" ? ( c.requestedAmount ||c.amount ||15000) : 0,
                    txHash: null
                })),
                ...vehicleClaims.map(c => ({
                    _id: c._id,
                    policyNo: c.policyNo,
                    createdAt: c.createdAt,
                    flowType: "vehicle",
                    reason: c.incidentType,
                    status: c.status || "Pending",
                    requestedAmount: c.requestedAmount || c.amount ||45000,
                    approvedAmount: c.status?.toLowerCase() === "approved" ? ( c.requestedAmount || c.amount || 45000) : 0,
                    txHash: null
                })),
                ...settledClaims.map(c => ({
                    _id: c._id,
                    originalClaimId: c.originalClaimId,
                    policyNo: c.policyNo,
                    createdAt: c.settledAt || c.createdAt,
                    flowType:c.type?.toLowerCase().includes("travel") ? "travel": "vehicle",
                    reason: c.incidentType || "General Claim",
                    status: c.status || "Settled",
                    requestedAmount:c.amount,
                    approvedAmount:c.amount,
                    txHash:c.txHash
                }))
            ];
            combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return res.status(200).json(combined);
        } catch (error) {

            console.error("User tracking engine aggregation exception:", error);
            return res.status(500).json([]);
        }
    }
);

export default router;