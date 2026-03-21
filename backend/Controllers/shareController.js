import crypto from "crypto";
import Share from "../Models/shareModel.js";
import File from "../Models/fileModel.js"
import Permission from "../Models/permissionModel.js";
import Directory from "../Models/directoryModel.js";
import shareService from "../Services/shareService.js";
import permissionService from "../Services/permissionService.js";
import storageService from "../Services/storageService.js";
import directoryService from "../Services/directoryService.js";
import fileService from "../Services/fileService.js";

export const generateToken = async(req, res, next) => {
    try {
        const { resourceId, resourceType, permission } = req.body;
        if(!resourceId || !resourceType || !permission){
            return res.status(401).json({success: false, message: "Invalid input"});
        }
        const token = await shareService.generateToken(resourceId, resourceType, req.user._id, permission);
        return res.status(200).json({ success: true, token});
    } catch(err){
        next(err);
    }
}

export const validateTokenAndViewFile = async(req, res, next) => {
    try {
        const { token } = req.params;
        const share = await shareService.validateToken(token);
        if(!share){
            return res.status(200).json({ success: false, message: "Invalid token" })
        }
        const user = req.user;
        const fileId = share.resourceId;
        const fileData = await File.findById(fileId).select("extension").lean();
        if(!fileData){
            return res.status(404).json({success: false, message: "File Not Found"});
        }
        await permissionService.grantTokenAccess(share, user._id);
        res.sendFile(storageService.getFilePath(fileId, fileData.extension), (err) => {
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

export const validateTokenAndViewDirectory = async(req, res, next) => {
    try {
        const { token } = req.params;
        const share = await shareService.validateToken(token);
        if(!share){
            return res.status(200).json({ success: false, message: "Invalid token" })
        }
        const user = req.user;
        const directoryId = share.resourceId;
        const directoryData = await Directory.findById(directoryId).select("_id").lean();
        if(!directoryData){
            return res.status(404).json({success: false, message: "Directory Not Found"});
        }
        await permissionService.grantTokenAccess(share, user._id);
        const isViewer = share.role === "viewer";
        return res.redirect(`http://localhost:5173/share/directory/${directoryId}/view?view=${isViewer}`);
    } catch(err){
        next(err);
    }
}

export const getSharedDirectoryFiles = async(req, res, next) => {
    try {
        const { dirId: directoryId } = req.params;
        const hasPermission = await Permission.findOne({ resourceId: directoryId, resourceType: "directory", userId: req.user._id }).select("_id").lean();
        if(!hasPermission){
            return res.status(403).json({ success: false, message: "Forbidden: You don't have the required permission"});
        }
        const files = await File.find({ parentDirectoryId: directoryId }).populate("userId", "email picture _id").lean();
        const directories = await Directory.find({ parentDirectoryId: directoryId }).populate("userId", "email picture _id").lean();
        return res.status(200).json({ success: true, files, directories});
    } catch(err){
        next(err);
    }
}

export const getSharedFilesAndDirectories = async(req, res, next) => {
    try {
        const user = req.user;
        const { files, directories } = await permissionService.getSharedResources(user._id);
        return res.status(200).json({ success: true, files, directories });
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
        const ownerPermission = await Permission.findOne({ resourceId: fileId, resourceType: "file", role: "owner" }).lean();
        const ownerId = ownerPermission.userId;
        const result = await fileService.getFileMetaDataAndPath(fileId, ownerId);
        if(!result){
            return res.status(404).json({ success: false, message: "File Not Found"});
        }
        const { fileData, filePath } = result;
        if(action && action === 'download'){
            return res.download(filePath, fileData.name);
        }
        return res.sendFile(filePath, (err) => {
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

export const renameSharedFile = async(req, res, next) => {
    try {
        const user = req.user;
        const { fileId } = req.params;
        const { newFilename } = req.body;
        const filePermission = await Permission.findOne({ resourceId: fileId, userId: user._id, resourceType: "file", role: "editor" }).lean();
        if(!filePermission){
            return res.status(403).json({ success: false, message: "Forbidden: You don't have permission to rename this file"});
        }
        const ownerPermission = await Permission.findOne({ resourceId: fileId, resourceType: "file", role: "owner" }).lean();
        const ownerId = ownerPermission.userId;
        const updatedFile = await fileService.renameFile(fileId, ownerId, newFilename);
        if(!updatedFile){
            return res.status(404).json({ success: false, message: "File Not Found"});
        }
        return res.status(200).json({ success: true, message: "File renamed Successfully"});
    } catch(err){
        next(err);
    }
}

export const deleteSharedFile = async(req, res, next) => {
    try {
        const user = req.user;
        const { fileId } = req.params;
        const filePermission = await Permission.findOne({ resourceId: fileId, userId: user._id, resourceType: "file", role: "editor" });
        if(!filePermission){
            return res.status(403).json({ success: false, message: "Forbidden: You don't have permission to delete this file"});
        }
        const ownerPermission = await Permission.findOne({ resourceId: fileId, resourceType: "file", role: "owner" }).lean();
        const ownerId = ownerPermission.userId;
        const fileData = await fileService.deleteFile(fileId, ownerId);
        if(!fileData){
            return res.status(404).json({ success: false, message: "File Not Found"});
        }
        return res.status(200).json({ success: true, message: "File deleted Successfully"});
    } catch(err) {
        next(err);
    }
}

export const renameSharedDirectory = async(req, res, next) => {
    try {
        const dirId = req.params.dirId;
        const { newDirectoryName } = req.body;
        const user = req.user;
        const hasPermission = await Permission.findOne({resourceId: dirId, resourceType: "directory", userId: user._id, role: "editor"});
        if(!hasPermission){
            return res.status(403).json({success: false, message: "Forbidden: You don't have permission"});
        }
        const ownerPermission = await Permission.findOne({ resourceId: dirId, resourceType: "directory", role: "owner" }).lean();
        const ownerId = ownerPermission.userId;
        await directoryService.renameDirectory(dirId, ownerId, newDirectoryName);
        return res.status(200).json({ success: true, message: "Directory renamed Successfully"});
    } catch(err){
        next(err);
    }
}

export const deleteSharedDirectory = async(req, res, next) => {
    try {
        const dirId = req.params.dirId;
        const user = req.user;
        const hasPermission = await Permission.findOne({resourceId: dirId, resourceType: "directory", userId: user._id, role: "editor"});
        if(!hasPermission){
            return res.status(403).json({success: false, message: "Forbidden: You don't have permission"});
        }
        const ownerPermission = await Permission.findOne({ resourceId: dirId, resourceType: "directory", role: "owner" }).lean();
        const ownerId = ownerPermission.userId;
        await directoryService.deleteDirectory(dirId, ownerId);
        return res.status(200).json({ success: true, message: "Directory deleted Successfully"});
    } catch (err){
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

export const fetchResourceUsers = async(req, res, next) => {
    try {
        const { resourceId, resourceType } = req.params;
        const user = req.user;
        const hasPermission = await Permission.findOne({ resourceId, resourceType, userId: user._id, role: "owner" }).select("_id").lean();
        if(!hasPermission){
            return res.status(403).json({success: false, message: "Forbidden: You don't have the required permission"});
        }
        const permissions = await Permission.find({ resourceId, resourceType }).populate("userId", "_id email picture").lean();
        const users = permissions.map((p) => {
            return {
                userId: p.userId._id.toString(),
                email: p.userId.email,
                picture: p.userId.picture,
                role: p.role
            }
        });
        return res.status(200).json({ success: true, users });
    } catch(err){
        next(err);
    }
}

export const revokeAccess = async(req, res, next) => {
    try {
        const user = req.user;
        const { resourceId, userId } = req.body;
        if(!resourceId || !userId){
            return res.status(401).json({ success: false, message: "Invalid Input" });
        }
        const hasAccess = await permissionService.checkAccess(user._id, resourceId, "owner");
        if(!hasAccess){
            return res.status(403).json({ success: false, message: "Forbidden: You don't have the required permission"});
        }
        await permissionService.revokeTokenAccess(resourceId, "file", userId, user._id);
        return res.status(200).json({ success: true, message: "The Access of the resource for the selected user has been revoked"});
    } catch(err){
        next(err);
    }
}

