import mongoose, { Types } from "mongoose";
import User from "../Models/userModel.js";
import Directory from "../Models/directoryModel.js";

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
        if(!name || !email || !password){
            return res.status(400).json({success: false, message: "All fields are required"});
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
        return res.status(201).json({success: true, message: "User Registered Successfully"});
    } catch (err) {
        await session.abortTransaction(); //rollback
        console.log(err);
        if(err.code === 121){
            return res.status(400).json({success: false, message: "Invalid Inputs"});
        } else if(err.code === 11000){
            if(err.keyPattern && err.keyPattern.email){
                return res.status(409).json({success: false, message: "User already exists"});
            }
        }
        next(err);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({success: false, message: "All fields are required"});
        }
        const user = await User.findOne({email, password}).select("_id");
        if(!user){
            return res.status(401).json({success: false, message: "Invalid credentials"});
        }
        res.cookie("userId", user.id, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 * 7// 7 day
        });
        return res.status(200).json({success: true, message: "Login Successful"});
    } catch (err) {
        next(err);
    }
}

export const logoutUser = (req, res) => {
    res.clearCookie("userId");
    return  res.status(200).json({success: true, message: "Logout Successful"});
}