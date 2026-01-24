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
    const isValid = await storedOtp.compareOtp(enteredOtp);
    if(isValid){
        await storedOtp.deleteOne();
        return res.status(200).json({success: true, message: "Email verified successfully"})
    }
    return res.status(401).json({success: false, message: "Invalid OTP"});
}