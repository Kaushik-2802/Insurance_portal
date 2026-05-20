import express from "express";
import User from "../models/User.js";
import multer from "multer"; // 1. Imported Multer
import path from "path";

const router = express.Router();

// 2. Configure where and how multer handles uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure an empty 'uploads' folder exists in your backend root!
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
// Maps to: http://localhost:5000/api/profile
router.get("/profile", async (req, res) => {
    try {
        const { userId } = req.query; 

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
// Maps to: http://localhost:5000/api/profile/update
router.put("/profile/update", upload.single("profileImage"), async (req, res) => {
    try {
        const { userId } = req.query; 

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

        // Clean out empty properties so they don't overwrite database fields with null strings
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