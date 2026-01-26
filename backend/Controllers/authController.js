import mongoose, { Types } from "mongoose";
import Directory from "../Models/directoryModel.js";
import Otp from "../Models/otpModel.js";
import Session from "../Models/sessionModel.js";
import User from "../Models/userModel.js";
import { fetchUserFromGoogle } from "../Services/googleAuthService.js";
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

export const googleLogin = async(req, res) => {
    const sessionId = req.signedCookies.sid;
    const { code } = req.body;
    const { name, email, picture } = await fetchUserFromGoogle(code);
    if(sessionId){
        await Session.findByIdAndDelete(sessionId);
    }
    const user = await User.findOne({ email });
    if(user){
        if(!picture){
            user.picture = picture;
            await user.save();
        }
        const existingSessions = await Session.find({userId: user._id});
        if(existingSessions.length >= 2){
            await existingSessions[0].deleteOne();
        }
        const newSession = await Session.create({ userId: user._id });
        res.cookie("sid", newSession.id, {
            httpOnly: true,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000 * 7
        })
        return res.status(200).json({ success: true, message: "User Logged in successfully"})
    }
    const mongooseSession = await mongoose.startSession();
    try {
        mongooseSession.startTransaction();
        const userId = new Types.ObjectId();
        const directoryId = new Types.ObjectId();
        await User.insertOne({
            _id: userId,
            name,
            email,
            picture,
            hasPassword: false,
            rootDirectory: directoryId
        }, {mongooseSession})
        await Directory.insertOne({
            _id: directoryId,
            name: `root-${email}`,
            parentDirectoryId: null,
            userId,
        }, {mongooseSession})
        await mongooseSession.commitTransaction();
        const newSession = await Session.create({ userId });
        res.cookie("sid", newSession.id, {
            httpOnly: true,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000 * 7
        })
        return res.status(201).json({success: true, message: "User LoggedIn Successfully"});
    } catch (err) {
        await mongooseSession.abortTransaction();
        console.log(err.errorResponse.errInfo.details.schemaRulesNotSatisfied[0].additionalProperties);
        console.log(err.errorResponse.errInfo.details.schemaRulesNotSatisfied[1].missingProperties);
        if (err.code === 121) {
            return res.status(400).json({ success: false, message: "Invalid Inputs" });
        } else if (err.code === 11000) { //Unique Indexing error
            if (err.keyPattern && err.keyPattern.email) {
                return res.status(409).json({ success: false, message: "User already exists" });
            }
        }
        next(err);
    }
}