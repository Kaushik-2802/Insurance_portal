import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        middleName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            validate: {
                validator: function(v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: props => `${props.value} is not a valid email address!`
            }
        },
        mobile: {
            type: String,
            required: true,
            trim: true,
            // match: [/^\+[1-9]\d{6,14}$/]
        },
        street: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        country:{
            type: String,
            required: true,
            trim : true
        },
        pincode: {
            type: String,
            required: true, 
            trim: true,
            match: [/^\d{6}$/]
        },
        password: {
            type: String,
            required: true,
            select: false 
        },
        profileImage: {
            type: String,
            default: 'placeholder.jpg'
        }
    },
    {
        timestamps: true,
        collection: 'customer'
    }
);

const User = mongoose.model("User", userSchema);
export default User;