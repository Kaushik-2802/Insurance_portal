import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

// Temporary memory cache to store OTP codes
const otpStore = new Map();

const sendOtpEmail = async (targetEmail, otpCode) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port:process.env.SMTP_PORT,
    secure:false,
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS, 
    },
    tls:{
        rejectUnauthorized:false,
        minVersion: "TLSv1.2"
    }
  });

  const mailOptions = {
    from: `"CTS Secure Auth System" <${process.env.SMTP_FROM}>`,
    to: targetEmail,
    subject: "Your Password Reset OTP Code",
    html: `
      <div style="font-family: sans-serif; padding: 20px; max-width: 500px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested a password reset. Use the 6-digit verification code below. It will expire in 5 minutes.</p>
        <div style="background: #f3f4f6; font-size: 24px; font-weight: bold; letter-spacing: 6px; text-align: center; padding: 15px; margin: 20px 0; color: #4f46e5; border-radius: 4px;">
          ${otpCode}
        </div>
        <p style="font-size: 12px; color: #666;">If you did not request this change, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ROUTE 1: FORGOT PASSWORD (Generate & Mail OTP)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body; 

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email address" });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(email.toLowerCase(), { otp, expiresAt });
    await sendOtpEmail(email.toLowerCase(), otp);

    return res.status(200).json({ message: "OTP code sent to your email successfully" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal server error occurred" });
  }
});

// ROUTE 2: RESET PASSWORD (Verify Code & Mutate MongoDB Record)
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All form payload parameters are mandatory" });
    }

    const cachedRecord = otpStore.get(email.toLowerCase());
    if (!cachedRecord) {
      return res.status(400).json({ message: "No active password reset session found for this email" });
    }

    if (Date.now() > cachedRecord.expiresAt) {
      otpStore.delete(email.toLowerCase()); 
      return res.status(400).json({ message: "OTP code has expired. Please request a new one" });
    }

    if (cachedRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid verification code provided" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: hashedNewPassword },
      { new: true }  
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Target user configuration profile not found" });
    }

    otpStore.delete(email.toLowerCase());

    return res.status(200).json({ message: "Your database credentials updated successfully" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Failed to update security parameters inside storage engine" });
  }
});

export default router;