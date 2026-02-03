import crypto from "crypto";
import Share from "../Models/shareModel.js";
import File from "../Models/fileModel.js"
import { FILE } from "dns";

export const generateToken = async(req, res, next) => {
    const { fileId, permission } = req.body;
    if(!fileId || !permission){
        return res.status(401).json({success: false, message: "Invalid input"});
    }
    const token = crypto.randomBytes(16).toString("hex");
    await Share.deleteMany({ fileId });
    await Share.create({ token, fileId , userId: req.user._id, role : permission });
    return res.status(200).json({ success: true, token});
}

export const validateTokenAndViewFile = async(req, res, next) => {
    try {
        const { token } = req.params;
        const share = await Share.findOne({ token });
        if(!share){
            return res.status(200).json({ success: false, message: "Invalid token" })
        }
        const user = req.user;
        const fileId = share.fileId;
        const fileData = await File.findById(fileId).select("extension").lean();
        if(!fileData){
            return res.status(404).json({success: false, message: "File Not Found"});
        }
        await File.updateOne({_id: fileId, "sharedWith.userId" : {$ne: user._id}}, { $push : { sharedWith: { userId: user._id, role: share.role}}, $set: { isShared: true }});
        res.sendFile(`${process.cwd()}/Storage/${fileId}${fileData.extension}`, (err) => {
            if (res.headersSent) return;
            if (err) {
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            } else {
                res.status(200).end();
            }
        })
        
    } catch (err){
        next(err);
    }
}

export const getSharedFiles = async(req, res, next) => {
    try {
        const user = req.user;
        const sharedFilesWithMe = await File.find({ "sharedWith.userId": user._id })
            .populate("sharedWith.userId", "email picture")
            .populate("userId", "email picture")
            .lean();
        const sharedFilesWithOthers = await File.find({ isShared: true, userId: req.user._id })
            .populate("sharedWith.userId", "email picture")
            .populate("userId", "email picture")
            .lean();
        return res.status(200).json({ success: true, files: [...sharedFilesWithMe, ...sharedFilesWithOthers] });
    } catch(err){
        next(err);
    }
}

export const viewFile = async(req, res, next) => {
    try {
        const user = req.user;
        const { fileId } = req.params;
        const { action } = req.query;
        const fileData = await File.findOne({ _id: fileId, "sharedWith.userId": user._id });
        if(!fileData){
            return res.status(404).json({ success: false, message: "File Not Found"});
        }
        if(action && action === 'download'){
            return res.download(`${process.cwd()}/Storage/${fileId}${fileData.extension}`, fileData.name);
        }
        return res.sendFile(`${process.cwd()}/Storage/${fileId}${fileData.extension}`, (err) => {
            if (res.headersSent) return;
            if (err) {
                console.log(err)
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            } else {
                res.status(200).end();
            }
        })
    } catch (err){
        console.log(err)
        next(err);
    }
}

export const renameSharedFile = async(req, res, next) => {
    try {
        const user = req.user;
        const { fileId } = req.params;
        const { newFilename } = req.body;
        const fileData = await File.findOne({ _id: fileId, "sharedWith.userId": user._id });
        if(!fileData){
            return res.status(404).json({ success: false, message: "File Not Found"});
        }
        const role = fileData.sharedWith.find((u) => u.userId.toString() === user._id.toString()).role;
        if(role === "viewer"){
            return res.status(401).json({ success: false, message: "You don't have permission to rename this file"});
        }
        await File.updateOne({ _id: fileId, "sharedWith.userId": user._id }, { name: newFilename });
        return res.status(200).json({ success: true, message: "File renamed Successfully"});
    } catch(err){
        next(err);
    }
}

export const deleteSharedFile = async(req, res, next) => {
    try {
        const user = req.user;
        const { fileId } = req.params;
        const fileData = await File.findOne({ _id: fileId, "sharedWith.userId": user._id });
        if(!fileData){
            return res.status(404).json({ success: false, message: "File Not Found"});
        }
        const role = fileData.sharedWith.find((u) => u.userId.toString() === user._id.toString()).role;
        if(role === "viewer"){
            return res.status(401).json({ success: false, message: "You don't have permission to delete this file"});
        }
        await rm(`./Storage/${fileId}${fileData.extension}`);
        await fileData.deleteOne();
        return res.status(200).json({ success: true, message: "File deleted Successfully"});
    } catch(err) {
        next(err);
    }
}

export const updateRole = async(req, res, next) => {
    try {
        const { fileId, userId, role } = req.body;
        const fileData = await File.findOneAndUpdate({_id: fileId, "sharedWith.userId": userId}, { "sharedWith.$.role": role });
        if(!fileData){
            return res.status(404).json({success: false, message: "File not found"});
        }
        return res.status(200).json({ success: true, message: "User role updated Successfully"});
    } catch(err){
        next(err);
    }
}