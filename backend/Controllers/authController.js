import Otp from "../Models/otpModel.js";
import { sendEmail } from "../Services/sendEmailService.js";

export const sendOtp = async(req, res) => {
    const { email } = req.body;
    const response = await sendEmail(email);
    return res.status(201).json(response);
}

export const verifyOtp = async(req, res) => {
    const { email, enteredOtp } = req.body;
    const storedOtp = await Otp.findOne({email});
    if(enteredOtp === storedOtp.otp){
        return res.json({success: true, message: "Email verified successfully"})
    }
    return res.json({success: false, message: "Invalid OTP"});
}