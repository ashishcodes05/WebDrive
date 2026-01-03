import { ObjectId } from "mongodb";
import { client } from "../Configs/db.js";

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
    const session = client.startSession();
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({success: false, message: "All fields are required"});
        }
        const db = req.db;
        const found = await db.collection("users").findOne({email});
        if(found){
            return res.status(409).json({success: false, message: "User already exists"});
        }
        session.startTransaction();
        const userId = new ObjectId();
        const directoryId = new ObjectId();
        await db.collection("users").insertOne({
            _id: userId,
            name,
            email,
            password,
            rootDirectory: directoryId 
        })
        await db.collection("directories").insertOne({
            _id: directoryId,
            name: `root-${email}`,
            parentDir: null,
            userId,
        })
        await session.commitTransaction();
        return res.status(201).json({success: true, message: "User Registered Successfully"});
    } catch (err) {
        await session.abortTransaction(); //rollback
        if(err.code === 121){
            return res.status(400).json({success: false, message: "Invalid Inputs"});
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
        const db = req.db;
        const user = await db.collection("users").findOne({email, password});
        if(!user){
            return res.status(401).json({success: false, message: "Invalid credentials"});
        }
        res.cookie("userId", user._id.toString(), {
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