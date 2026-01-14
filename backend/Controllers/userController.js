import mongoose, { Types } from "mongoose";
import User from "../Models/userModel.js";
import Directory from "../Models/directoryModel.js";
import Session from "../Models/sessionModel.js";

export const getUser = (req, res) => {
    const user = req.user;
    return res
        .status(200)
        .json({
            success: true,
            message: "User Data Fetched Successfully",
            user: { name: user.name, email: user.email },
        });
};

export const createUser = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        session.startTransaction();
        const userId = new Types.ObjectId();
        const directoryId = new Types.ObjectId();
        await User.insertOne({
            _id: userId,
            name,
            email,
            password,
            rootDirectory: directoryId
        })
        await Directory.insertOne({
            _id: directoryId,
            name: `root-${email}`,
            parentDir: null,
            userId,
        })
        await session.commitTransaction();
        return res.status(201).json({ success: true, message: "User Registered Successfully" });
    } catch (err) {
        await session.abortTransaction(); //rollback
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