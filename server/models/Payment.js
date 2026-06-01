import mongoose from "mongoose"; // Changed to ES Module import

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
    paymentDetails: {
      cardHolderName: String,
      lastFourDigits: String, 
      upiId: String,
      bankAccountMasked: String
    }
  },
  { timestamps: true }
);

// Changed to ES Module default export
export default mongoose.model("Payment", paymentSchema);