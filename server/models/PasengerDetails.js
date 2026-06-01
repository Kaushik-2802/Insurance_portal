import mongoose from "mongoose";

const passengerDetailsSchema = new mongoose.Schema(
  {
    policyNo: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: String,
      required: true,
      trim: true
    },
    mobile: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const PassengerDetails = mongoose.model("PassengerDetails", passengerDetailsSchema);
export default PassengerDetails;