import crypto from "crypto";
import Share from "../Models/shareModel.js";
import File from "../Models/fileModel.js"
import Permission from "../Models/permissionModel.js";
import Directory from "../Models/directoryModel.js";

export const generateToken = async(req, res, next) => {
    try {
        const { resourceId, resourceType, permission } = req.body;
        if(!resourceId || !resourceType || !permission){
            return res.status(401).json({success: false, message: "Invalid input"});
        }
        const token = crypto.randomBytes(16).toString("hex");
        await Share.deleteMany({ resourceId });
        await Share.create({ token, resourceId , resourceType, userId: req.user._id, role : permission });
        return res.status(200).json({ success: true, token});
    } catch(err){
        next(err);
    }
}

export const validateTokenAndViewFile = async(req, res, next) => {
    try {
        const { token } = req.params;
        const share = await Share.findOne({ token }).lean();
        if(!share){
            return res.status(200).json({ success: false, message: "Invalid token" })
        }
        const user = req.user;
        const fileId = share.resourceId;
        const fileData = await File.findById(fileId).select("extension parentDirectoryId").lean();
        if(!fileData){
            return res.status(404).json({success: false, message: "File Not Found"});
        }
        await Permission.create({ resourceId: share.resourceId, resourceType: share.resourceType, userId: user._id, parentDirectoryId: fileData.parentDirectoryId, role: share.role });
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

export const getSharedFilesAndDirectories = async(req, res, next) => {
    try {
        const user = req.user;
        const parDirId = req.params.dirId || user.rootDirectory;
        const filePermissions = await Permission.find({ userId: user._id, resourceType: "file", parentDirectoryId: parDirId }).lean();
        const fileIds = filePermissions.map((perm) => perm.resourceId);
        const filesData = await File.find({ _id: { $in: fileIds } }).lean();
        const filesWithPermissions = filesData.map((file) => {
            const permission = filePermissions.find((perm) => perm.resourceId.toString() === file._id.toString());
            return {
                ...file,
                role: permission.role
            };
        });
        const dirPermissions = await Permission.find({ userId: user._id, resourceType: "directory", parentDirectoryId: parDirId }).lean();
        const dirIds = dirPermissions.map((perm) => perm.resourceId);
        const directoriesData = await Directory.find({ _id: { $in: dirIds } }).lean();
        const directoriesWithPermissions = directoriesData.map((directory) => {
            const permission = dirPermissions.find((perm) => perm.resourceId.toString() === directory._id.toString());
            return {
                ...directory,
                role: permission.role
            };
        });
        return res.status(200).json({ success: true, files: filesWithPermissions, directories: directoriesWithPermissions });
    } catch(err){
        next(err);
    }
}

export const getSharedUsers = async(req, res, next) => {
    try {
        const { resources } = req.body;
        const sharedUsers = {};
        const resourceIds = resources.map((resource) => resource.resourceId);
        const hasAccess = await Permission.findOne({ resourceId: { $in : resourceIds }, userId: req.user._id });
        if(!hasAccess){
            return res.status(403).json({ success: false, message: "No records found"});
        }
        const resourcePermissions = await Permission.find({ resourceId: { $in: resourceIds }}).populate("userId", "email picture").lean();
        for(const resourcePermission of resourcePermissions){
            const key = resourcePermission.resourceId.toString();
            if(!sharedUsers[key]){
                sharedUsers[key] = [];
            }
            sharedUsers[key].push({
                userId: resourcePermission.userId._id.toString(),
                email: resourcePermission.userId.email,
                picture: resourcePermission.userId.picture,
                role: resourcePermission.role
            })
        }
        return res.status(200).json({success: true, sharedUsers});
    } catch(err){
        next(err)
    }
}

export const viewFile = async(req, res, next) => {
    try {
        const user = req.user;
        const { fileId } = req.params;
        const { action } = req.query;
        const filePermission = await Permission.findOne({ resourceId: fileId, userId: user._id, resourceType: "file" }).lean();
        if(!filePermission){
            return res.status(404).json({ success: false, message: "File Not Found"});
        }
        const fileData = await File.findById(fileId).lean();
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
        const filePermission = await Permission.findOne({ resourceId: fileId, userId: user._id, resourceType: "file", role: "editor" }).lean();
        if(!filePermission){
            return res.status(403).json({ success: false, message: "Forbidden: You don't have permission to rename this file"});
        }
        await File.updateOne({ _id: fileId }, { name: newFilename });
        return res.status(200).json({ success: true, message: "File renamed Successfully"});
    } catch(err){
        next(err);
    }
}

export const deleteSharedFile = async(req, res, next) => {
    try {
        const user = req.user;
        const { fileId } = req.params;
        const filePermission = await Permission.findOne({ resourceId: fileId, userId: user._id, resourceType: "file", role: "editor" }).lean();
        if(!filePermission){
            return res.status(403).json({ success: false, message: "Forbidden: You don't have permission to delete this file"});
        }
        const fileData = await File.findById(fileId).select("extension").lean();
        if(!fileData){
            return res.status(404).json({success: false, message: "File Not Found"});
        }
        await rm(`./Storage/${fileId}${fileData.extension}`);
        await File.deleteOne({ _id: fileId });
        return res.status(200).json({ success: true, message: "File deleted Successfully"});
    } catch(err) {
        next(err);
    }
}

export const updateRole = async(req, res, next) => {
    try {
        const user = req.user;
        const { resourceId, userId, role } = req.body;
        const currentUserPermission = await Permission.findOne({ resourceId, userId: user._id }).select("role").lean();
        if(currentUserPermission.role !== "owner"){
            return res.status(403).json({ message: "Forbidden: You don't have the permission"});
        }
        const permission = await Permission.findOneAndUpdate({ resourceId, userId}, { role });
        if(!permission){
            return res.status(404).json({ message: "permission not found"});
        }
        return res.status(200).json({ success: true, message: "User role updated successfully" });
    } catch(err){
        next(err);
    }
}

export const getSharedFolders = async(req, res, next) => {
    try {
        const user = req.user;
        const sharedFoldersWithMe = await File.find({ "sharedWith.userId": user._id })
            .populate("sharedWith.userId", "email picture")
            .populate("userId", "email picture")
            .lean();
        const sharedFoldersWithOthers = await File.find({ isShared: true, userId: req.user._id })
            .populate("sharedWith.userId", "email picture")
            .populate("userId", "email picture")
            .lean();
        return res.status(200).json({ success: true, files: [...sharedFoldersWithMe, ...sharedFoldersWithOthers] });
    } catch(err){
        next(err);
    }
}
