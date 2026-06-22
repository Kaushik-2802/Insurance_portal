import mongoose from "mongoose";

const vehicleClaimSchema = new mongoose.Schema({
  policyNo: { type: String, required: true, trim: true }, 
  date: { type: Date, required: true },
  mobileNo: { type: String, required: true, trim: true },
  incidentType: { type: String, required: true },
  claimAmount: { type: Number, required: true },
  supportDocs: { type: String, required: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Verified", "Rejected"] }
}, { timestamps: true });

export default mongoose.model("VehicleClaim", vehicleClaimSchema);