import mongoose from "mongoose";

const adminSchema=new mongoose.Schema(
    {
        claimId:{
            type:String,
            required:true,
            unique:true
        },
        customerName:{
            type:String,
            required:true
        },
        status:{
            type:String,
            enum:["Pending","Approved","Rejected","Auditing"],
            default:'Pending'
        },
        missingRequirements:[{
            documentType:{
                type:String,
                required:true
            },
            status:{
                type:String,
                enum:["Missing","Uploaded","Verified"],
                default:"Missing"
            }
        }],
        payoutLiquidity:{
            stabilityPercentage:{
                type:Number,
                default:98.4
            },
            statusLabel:{
                type:String,
                default:'Stable'
            },
            approvedPaymentAmount:{
                type:Number,
                required:true
            }
        }
    },
    {
        timestamps:true
    }
)
const Admin=mongoose.model("Admin",adminSchema)
export default Admin;