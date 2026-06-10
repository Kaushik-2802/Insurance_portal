import mongoose from "mongoose";

const querySchema=new mongoose.Schema(
    {
        fullName:{
            type:String,
            trim:true
        },
        email:{
            type:String,
            trim:true,
            lowercase:true
        },
        textContent:{
            type:String,
            trim:true
        },
    },
    {
        timestamps:true
    }
);

const Query=mongoose.model("Query",querySchema)
export default Query;