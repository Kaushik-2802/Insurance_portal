import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer"
import jwt from "jsonwebtoken"

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

// Route for registering a new user
router.post("/register",upload.single("profileImage"), async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ msg: "User already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let finalImagePath = 'placeholder.jpg'; 
        if (req.file) {
            finalImagePath = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const newUser = new User({
            ...req.body,
            password: hashedPassword,
            profileImage: finalImagePath
        });

        await newUser.save();
        return res.status(201).json({ msg: "User created successfully" });

    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
});

// Route for login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ msg: "User not found. Invalid email" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ msg: "Password does not match. Please enter correct password" });
        }
        const token=jwt.sign({userId:user._id,email:user.email},"LTI_INSURANCE_IS_THE_BEST",{expiresIn:"7d"})

        return res.status(200).json({ msg: "Successful login",token,userId: user._id });

    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
});

export default router;