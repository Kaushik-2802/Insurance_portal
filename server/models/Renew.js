import mongoose from "mongoose";

const renewSchema=new mongoose.Schema(
    {
        vehicleType:{
            type:String,
            enum:["Two Wheeler","Four Wheeler"],
            required:true
        },
        name:{
            type:String,
            required:true,
            trim:true
        },
        regNo:{
            type:String,
            required:true,
            trim:true
        },
        policyNo:{
            type:String,
            required:true,
            trim:true
        },
        address:{
            type:String,
            trim:true
        }
    },
    {
        timestamps:true
    }
)

const Renew=mongoose.model("Renew",renewSchema)
export default Renew;