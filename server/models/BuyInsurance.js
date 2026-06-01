import mongoose from "mongoose";

const buyInsuranceSchema=mongoose.Schema(
    {
        insuranceType:{
            type:String,
            enum:["Two Wheeler","Four Wheeler"],
            required:true
        },
        manufacturer:{
            type:String,
            required:true,
            trim:true
        },
        model:{
            type:String,
            required:true,
            trim:true
        },
        registration:{
            type:String,
            required:true,
            trim:true
        },
        dlNo:{
            type:String,
            required:true,
            trim:true
        },
        engineNo:{
            type:String,
            required:true,
            trim:true
        },
        chasisNo:{
            type:String,
            required:true,
            trim:true
        },
        dateOfPurchase:{
            type:Date,
            required:true
        },
        supportingDocuments:[
            {
                type:String
            }
        ]
    },
    {
        timestamps:true
    }
);

const BuyInsurance=mongoose.model("BuyInsurance",buyInsuranceSchema)
export default BuyInsurance;