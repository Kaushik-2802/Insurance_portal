import mongoose from "mongoose";

const SettledClaimSchema = new mongoose.Schema(
  {
    originalClaimId: { type: String, required: true },
    policyNo: { type: String, required: true },
    user: { type: String, required: true },
    type: { type: String, required: true },
    incidentType: { type: String, default: "Not specified" },
    amount: { type: Number, required: true },
    txHash: { type: String, required: true },
    status: { type: String, default: "Settled" },
    settledAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("SettledClaim", SettledClaimSchema);