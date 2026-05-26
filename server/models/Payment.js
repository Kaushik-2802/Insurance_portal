const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      default: 700.00
    },
    paymentMethod: {
      type: String,
      enum: ["credit-card", "upi", "net-banking"],
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING"
    },
    policyReferenceNumber: {
      type: String,
      unique: true,
      required: true
    },
    // Meta logs safely stored (No CVV or complete raw cards)
    paymentDetails: {
      cardHolderName: String,
      lastFourDigits: String, 
      upiId: String,
      bankAccountMasked: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);