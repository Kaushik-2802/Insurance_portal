const mongoose=require("mongoose")

const travelInsuranceSchema=new mongoose.Schema(
    {
        vehicleType:{
            type:String,
            enum:["Two Wheeler","Four Wheeler"],
            required:true
        },
        destination:{
            type:String,
            required:true,
            trim:true
        },
        takeOffDate:{
            type:Date,
            required:true
        },
        returnDate:{
            type:Date,
            required:true
        }
    },
    {
        timestamps:true
    }
);

const TravelInsurance=mongoose.model("TravelInsurance",travelInsuranceSchema)
export default TravelInsurance;