import mongoose from "mongoose";

const querySchema=new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            trim:true,
            lowercase:true
        },
        textContent:{
            type:String,
            required:true,
            trim:true
        },
    },
    {
        timestamps:true
    }
);

const Query=mongoose.model("Query",querySchema)
export default Query;