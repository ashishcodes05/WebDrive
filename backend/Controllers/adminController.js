import User from "../Models/userModel.js";
import Directory from "../Models/directoryModel.js";
import Session from "../Models/sessionModel.js";
import File from "../Models/fileModel.js";
import { rm } from "fs/promises";

export const getAllUsers = async(req, res, next) => {
    try {
        if(req.user.role !== 'Admin' && req.user.role !== 'Manager'){
            return res.status(403).json({success: false, meesage: "Access Denied"});
        }
        const existingSessions = await Session.find().lean()
        const activeUsers = new Set(existingSessions.map(({userId}) => userId.toString()));
        const users = await User.find().select("_id name email picture role isDisabled").lean();
        const allUsers = users.map((user) => {
            user.isLoggedIn = activeUsers.has(user._id.toString())
            return user;
        })
        return res.status(200).json({success: true, users: allUsers});
    } catch(err){
        next(err);
    }
}

export const forceLogout = async(req, res, next) => {
    try {
        if(req.user.role !== "Admin" && req.user.role !== "Manager"){
            return res.status(403).json({success: false, message: "Access Denied"});
        }
        const { userId } = req.params;
        const selectedUser = await User.findById(userId);
        if(selectedUser.role === 'Admin' && req.user.role !== 'Admin'){
            return res.status(403).json({success: false, message: "Cannot logout an admin user"});
        }
        await Session.deleteMany({ userId });
        res.status(200).json({success: true, message: "User has been logged out from all devices"});
    } catch (err){
        next(err);
    }
}

export const forceDelete = async(req, res, next) => {
    try {
        if(req.user.role !== "Admin"){
            return res.status(403).json({success: false, message: "Access Denied"});
        }
        const { userId } = req.params;
        const files =  await File.find({ userId }).select("extension");
        for(const {id, extension} of files){
            await rm(`./Storage/${id}${extension}`);
        }
        await File.deleteMany({ userId });
        await Directory.deleteMany({ userId });
        await User.findByIdAndDelete(userId);
        await Session.deleteMany({ userId });
        return res.status(200).json({success: true, message: "User has been deleted successfully"});
    } catch(err){
        next(err);
    }
}

export const toggleStatus = async(req, res, next) => {
    try {
        if(req.user.role !== "Admin" && req.user.role !== "Manager"){
            return res.status(403).json({success: false, message: "Access Denied"});
        }
        const { userId } = req.params;
        if(req.user.id === userId){
            return res.status(401).json({ success: false, message: "You can't change the status of Yourself"});
        }
        const selectedUser = await User.findById(userId);
        selectedUser.isDisabled = !selectedUser.isDisabled;
        await selectedUser.save();
        return res.status(200).json({ success: true, message: "User Status has been changed successfully"});
    } catch (err) {
        next(err);
    }
}