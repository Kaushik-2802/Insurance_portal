import express from "express";
import User from "../models/User.js";
import multer from "multer"; 
import path from "path";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image formats are supported!"), false);
    }
};

const upload = multer({ storage, fileFilter });

// ─── ROUTE TO GET PROFILE DETAILS ───
router.get("/profile",authMiddleware, async (req, res) => {
    try {
        const userId=req.user.userId;

        if (!userId) {
            return res.status(400).json({ message: "No user ID provided!" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found in database!" });
        }
        
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
});

// ─── ROUTE TO UPDATE PROFILE DETAILS ───
router.put("/profile/update",authMiddleware, upload.single("profileImage"), async (req, res) => {
    try {
        const userId=req.user.userId;

        if (!userId) {
            return res.status(400).json({ message: "No user ID provided for update!" });
        }

        const updateData = {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            mobile: req.body.mobile,
            street: req.body.street,
            city: req.body.city,
            country: req.body.country,
            pincode: req.body.pincode,
        };

        if (req.file) {
            updateData.profileImage = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        Object.keys(updateData).forEach(
            key => (updateData[key] === undefined || updateData[key] === "") && delete updateData[key]
        );

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found in database!" });
        }

        return res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser
        });

    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
});

export default router;