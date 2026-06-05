import mongoose from "mongoose";

const insuranceDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },
    refNo: {
      type: String,
      required: true,
      trim: true,
      unique: true 
    },
    name: {
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
    vehicleType: {
      type: String,
      enum: ["Two Wheeler", "Four Wheeler"],
      required: true
    },
    bikeModel: {
      type: String,
      required: true,
      default: "Royal Enfield Himalayan 450"
    },
    regNo: {
      type: String,
      required: true,
      trim: true
    },
    insuredValue: {
      type: String,
    },
    amount: {
      type: String,
      required: true,
      trim: true
    },
    paymentMethod: {
      type: String,
      required: true
    },
    transactionId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const InsuranceDetails = mongoose.model("InsuranceDetails", insuranceDetailsSchema);
export default InsuranceDetails;