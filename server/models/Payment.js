const mongoose=require("mongoose");

const paymentSchema=new mongoose.Schema(
    {
        cardNumber:{
            type:String,
            required:true,
            trim:true,
            minlength:16,
            maxlength:16
        },
        cardHolderName:{
            type:String,
            required:true,
            trim:true
        },
        expiry:{
            type:String,
            required:true,
            match:[/^(0[1-9]|1[0-2])\/\d{2}$/]
        },
        cvv:{
            type:String,
            required:true,
            minlength:3,
            maxlength:4
        }

    },
    {
        timestamps:true
    }
)

const Payment=mongoose.model("Payment",paymentSchema)
export default Payment;