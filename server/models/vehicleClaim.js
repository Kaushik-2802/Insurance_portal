import mongoose from "mongoose";

const vehicleClaimSchema = new mongoose.Schema({
  policyNo: { type: String, required: true, trim: true }, // Maps to refNo from InsuranceDetails
  date: { type: Date, required: true },
  mobileNo: { type: String, required: true, trim: true },
  incidentType: { type: String, required: true }, // Dynamic: Accepts 'Theft', 'Accident', etc. without enum limits
  supportDocs: { type: String, required: true },
  status: { type: String, default: "Pending", enum: ["Pending", "Verified", "Rejected"] }
}, { timestamps: true });

export default mongoose.model("VehicleClaim", vehicleClaimSchema);