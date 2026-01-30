import User from "../Models/userModel.js";
import Directory from "../Models/directoryModel.js";
import Session from "../Models/sessionModel.js";
import File from "../Models/fileModel.js";
import { rm } from "fs/promises";

export const getAllUsers = async(req, res, next) => {
    try {
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
        const { userId } = req.params;
        const selectedUser = await User.findById(userId);
        if(selectedUser.role === 'admin' && req.user.role !== 'admin'){
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
        const { userId } = req.params;
        if(req.user.id === userId){
            return res.status(401).json({ success: false, message: "You can't change the status of Yourself"});
        }
        const selectedUser = await User.findById(userId);
        if(selectedUser.isDisabled === false){
            await Session.deleteMany({ userId });
        }
        selectedUser.isDisabled = !selectedUser.isDisabled;
        await selectedUser.save();
        return res.status(200).json({ success: true, message: "User Status has been changed successfully"});
    } catch (err) {
        next(err);
    }
}

const permissibleChange = {
    owner: ["admin", "manager", "user"],
    admin: ["admin", "manager", "user"],
    manager: ["manager", "user"]
}

const permissibleRoles = ["admin", "manager", "user"];

const roleLevels = {
    owner: 4,
    admin: 3,
    manager: 2,
    user: 1
}

export const changeRole = async(req, res, next) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if(userId === req.user.id){
            return res.status(401).json({ success: false, message: "Forbidden: You cannot change your own role"});
        }
        if(!permissibleRoles.includes(role)){
            return res.status(401).json({ success: false, message: "Invalid Role"});
        }
        const selectedUser = await User.findById(userId);
        if(roleLevels[req.user.role] < roleLevels[selectedUser.role]){
            return res.status(401).json({ success: false, message: "You cannot modify a user with equal or higher role"});
        }
        if(!permissibleChange[req.user.role].includes(role)){
            return res.status(401).json({ success: false, message: "You cannot change role to the specified role"});
        }
        selectedUser.role = role;
        await selectedUser.save();
        return res.status(200).json({ success: true, message: "User Role has been changed successfully"});
    } catch(err) {
        next(err);
    }
}