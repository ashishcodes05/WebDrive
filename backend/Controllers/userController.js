import mongoose, { Types } from "mongoose";
import User from "../Models/userModel.js";
import Directory from "../Models/directoryModel.js";
import File from "../Models/fileModel.js";
import { rm } from "fs/promises";
import redisClient from "../Configs/redis.js"

export const getUser = (req, res) => {
    const user = req.user;
    return res
        .status(200)
        .json({
            success: true,
            message: "User Data Fetched Successfully",
            user: { id: user._id, name: user.name, email: user.email, picture: user.picture, hasPassword: user.hasPassword, isDisabled: user.isDisabled, role: user.role },
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
        const sid = req.signedCookies.sid;
        if(sid){
            await redisClient.del(`session:${sid}`);
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const user = await User.findOne({ email }).select("_id password isDisabled");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        if(user.isDisabled){
            return res.status(401).json({ success: false, message: "Your Account is disabled. Please contact the administrator." });
        }
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        //restricting number of devices into 2
        const allSessions = await redisClient.ft.search("session:userIdIdx", `@userId:{${user.id}}`, {
            RETURN : []
        });
        if(allSessions.total >= 2){
            await redisClient.del(allSessions.documents[0].id);
        }

        const sessionId = crypto.randomUUID()
        const newSession = {
            id: sessionId,
            userId : user._id
        }
        await redisClient.json.set(`session:${sessionId}`, "$", newSession);
        await redisClient.expire(`session:${sessionId}`, 7 * 24 * 60 * 60);
        res.cookie("sid", sessionId, {
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
        await redisClient.del(`session:${sid}`)
        res.clearCookie("sid");
        return res.status(200).json({ success: true, message: "Logout Successful" });
    } catch (err){
        next(err)
    }
}

export const logoutAllDevices = async(req, res, next) => {
    try {
        const user = req.user;
        const allSessions = await redisClient.ft.search("session:userIdIdx", `@userId:{${user.id}}`, {
            RETURN : []
        });
        const sessions = allSessions.documents.map((doc) => doc.id);
        await redisClient.del(sessions);
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
        await redisClient.del(`session:${sessionId}`);
        await Directory.deleteMany({userId: user._id});
        const files = await File.find({userId: user._id});
        for(const {id, extension} of files){
            await rm(`./Storage/${id}${extension}`);
        }
        await File.deleteMany({userId: user._id})
        await user.deleteOne();
        return res.status(200).json({success: true, message: "User Deleted Successfully"});
    } catch (err){
        next(err);
    }
}
