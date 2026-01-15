import { model, Schema } from "mongoose";

const otpSchema = new Schema({
    email: {
        type: String,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please provide a valid email"
        ],
        unique: true,
        lowercase: true,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
}, { strict: "throw"});

const Otp = model("Otp", otpSchema);

export default Otp;