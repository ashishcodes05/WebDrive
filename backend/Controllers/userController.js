import mongoose, { Types } from "mongoose";
import User from "../Models/userModel.js";
import Directory from "../Models/directoryModel.js";
import Session from "../Models/sessionModel.js";
import File from "../Models/fileModel.js";

export const getUser = (req, res) => {
    const user = req.user;
    return res
        .status(200)
        .json({
            success: true,
            message: "User Data Fetched Successfully",
            user: { name: user.name, email: user.email, picture: user.picture, hasPassword: user.hasPassword },
        });
};

export const createUser = async (req, res, next) => {
    const mongooseSession = await mongoose.startSession();
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        mongooseSession.startTransaction();
        const userId = new Types.ObjectId();
        const directoryId = new Types.ObjectId();
        await User.insertOne({
            _id: userId,
            name,
            email,
            password,
            rootDirectory: directoryId
        }, {mongooseSession})
        await Directory.insertOne({
            _id: directoryId,
            name: `root-${email}`,
            parentDirectoryId: null,
            userId,
        }, {mongooseSession})
        await mongooseSession.commitTransaction();
        return res.status(201).json({ success: true, message: "User Registered Successfully" });
    } catch (err) {
        await mongooseSession.abortTransaction(); //rollback
        console.log(err);
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

export const loginUser = async (req, res, next) => {
    try {
        const sessionId = req.signedCookies.sid;
        if(sessionId){
            await Session.findByIdAndDelete(sessionId);
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const user = await User.findOne({ email }).select("_id password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
        //restricting number of devices into 2
        const existingSessions = await Session.find({userId: user._id});
        console.log(existingSessions.length)
        if(existingSessions.length >= 2){
            await existingSessions[0].deleteOne();
        }
        const newSession = await Session.create({ userId: user._id });
        res.cookie("sid", newSession.id, {
            httpOnly: true,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000 * 7// 7 day
        });
        return res.status(200).json({ success: true, message: "Login Successful" });
    } catch (err) {
        next(err);
    }
}

export const logoutUser = async(req, res) => {
    try {
        const { sid } = req.signedCookies;
        await Session.deleteOne({_id: sid});
        res.clearCookie("sid");
        return res.status(200).json({ success: true, message: "Logout Successful" });
    } catch (err){
        next(err)
    }
}

export const logoutAllDevices = async(req, res, next) => {
    try {
        const user = req.user;
        await Session.deleteMany({userId: user._id});
        return res.status(200).json({ success: true, message: "Logout Successfully from all devices" });
    } catch (err){
        next(err);
    }
}

export const updateUserProfile = async(req, res, next) => {
    try {
        const user = req.user;
        const { newName } = req.body;
        const updatedUser = await User.findByIdAndUpdate(user.id, { name: newName }, {runValidators: true, new: true});
        return res.status(200).json({success: true, message: "UserName has been changed successfully", user: updatedUser})
    } catch(err){
        next(err)
    }
}

export const updatePassword = async(req, res, next) => {
    try {
        const user = req.user;
        if(!user.hasPassword){
            const { newPassword } = req.body;
            user.password = newPassword;
            await user.save();
            return res.status(200).json({success: true, message: "Password has been updated Successfully"});
        }
        const { newPassword, currentPassword } = req.body;
        const isValid = await user.comparePassword(currentPassword);
        if(!isValid){
            return res.status(401).json({success: false, message: "Current Password is incorrect"});
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json({success: true, message: "Password has been updated Successfully"});
    } catch(err){
        next(err)
    }
}

export const deleteUser = async(req, res, next) => {
    try {
        const user = req.user;
        const sessionId = req.signedCookies.sid;
        await Session.findByIdAndDelete(sessionId);
        await Directory.deleteMany({userId: user._id});
        await File.deleteMany({userId: user._id});
        await user.deleteOne();
        return res.status(200).json({success: true, message: "User Deleted Successfully"});
    } catch (err){
        next(err);
    }
}