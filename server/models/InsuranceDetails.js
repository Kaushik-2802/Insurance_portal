const mongoose=require("monmgoose")

const insuranceDetailsSchema=new mongoose.Schema({
    refNo:{
        type:String,
        required:true,
        trim:true
    },
    name:{
        type:String,
        required:true,
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    vehicleType:{
        type:String,
        enum:["Two Wheeler","Four Wheeler"],
        required:true
    },
    regNo:{
        type:String,
        required:true,
        trim:true
    },
    amount:{
        type:String,
        required:true,
        trim:true
    }
},
    {
        timestamps:true
    }
)

const InsuranceDetails=mongoose.model("InsuranceDetails",insuranceDetailsSchema)
export default InsuranceDetails;