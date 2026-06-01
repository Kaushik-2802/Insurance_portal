import mongoose from "mongoose";

const travelInsuranceSchema = new mongoose.Schema(
  {
    policyNo: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    travelType: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    members: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

const TravelInsurance = mongoose.model("TravelInsurance", travelInsuranceSchema);
export default TravelInsurance;