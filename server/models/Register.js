const mongoose=require("mongoose")

const registerSchema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            reuqired:true,
            trim:true
        },
        middleName:{
            type:String,
            trim:true
        },
        lastName:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            reuqired:true,
            trim:true,
            unique:true,
            lowercase:true,
            trim:true,
            validate:{
                validator:function(v){
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
                },
                message:props=>`${props.value} is not a valid email address!`
            }
        },
        mobile:{
            type:String,
            reuqired:true,
            trim:true,
            match:[/^\+[1-9]\d{6,14}$/]
        },
        street:{
            type:String,
            reuqired:true,
            trim:true
        },
        city:{
            type:String,
            reuqired:true,
            trim:true
        },
        pincode:{
            type:String,
            reuired:true,
            trim:true,
            match:[/^\d{6}$/]
        },
        password:{
            type:String,
            required:true,
            select:false
        },
        profileImage:{
            type:String,
            default:'placeholder.jpg'
        }
    },
    {
        timestamps:true
    }
)
const Register=mongoose.model("Register",registerSchema)
export default Register;