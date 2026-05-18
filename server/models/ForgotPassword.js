const mongoose=require("mongoose")

const forgotSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            trim:true
        },
        newPassword:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
);

const ForgotPassword=mongoose.model("ForgotPassword",forgotSchema)
export default ForgotPassword;