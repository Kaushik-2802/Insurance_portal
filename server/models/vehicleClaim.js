import mongoose from "mongoose"

const vehicleClaimSchema=new mongoose.Schema(
    {
        policyNo:{
            type:String,
            required:true,
            trim:true
        },
        mobileNo:{
            type:String,
            required:true,
            trim:true
        },
        Date:{
            type:Date,
            required:true
        },
        natureOfIncident:{
            type:String,
            required:true,
            trim:true
        },
        evidence:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

const vehicleClaim=mongoose.model("vehicleClaim",vehicleClaimSchema)
export default vehicleClaim;