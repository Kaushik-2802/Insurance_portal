const mongoose=require("mongoose")

const loginSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            select:false
        }
    },
    {
        timestamps:true
    }
)

const Login=mongoose.model("Login",loginSchema)
export default Login;