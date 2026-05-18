const mongoose=require("mongoose")

const travelClaimSchema=new mongoose.Schema(
    {
        policyNo:{
            type:String,
            required:true,
            trim:true
        },
        date:{
            type:Date,
            required:true
        },
        mobileNo:{
            type:String,
            required:true
        },
        incidentType:{
            type:String,
            enum:["Medical Emergency","Trip Delay","Lost Baggage","Passport Loss"],
            required:true
        },
        supportDocs:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

const TravelClaim=mongoose.model("TravelClaim",travelClaimSchema)
export default TravelClaim;