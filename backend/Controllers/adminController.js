import User from "../Models/userModel.js";
import adminService from "../Services/adminService.js";
import sessionManager from "../Services/sessionManager.js";
import userService from "../Services/userService.js";
import directoryService from "../Services/directoryService.js";
import fileService from "../Services/fileService.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await adminService.getAllUsersWithActiveStatus();
        return res.status(200).json({ success: true, users: allUsers });
    } catch (err) {
        next(err);
    }
}

export const forceLogout = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const selectedUser = await User.findById(userId);
        if (selectedUser.role === 'admin' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Cannot logout an admin user" });
        }
        await sessionManager.deleteAllSessions(userId);
        res.status(200).json({ success: true, message: "User has been logged out from all devices" });
    } catch (err) {
        next(err);
    }
}

export const forceDelete = async (req, res, next) => {
    try {
        const { userId } = req.params;
        await userService.deleteCompleteAccount(userId);
        return res.status(200).json({ success: true, message: "User has been deleted successfully" });
    } catch (err) {
        next(err);
    }
}

export const toggleStatus = async (req, res, next) => {
    try {
        const { userId } = req.params;
        await adminService.toggleUserStatus(userId, req.user.id);
        return res.status(200).json({ success: true, message: "User Status has been changed successfully" });
    } catch (err) {
        next(err);
    }
}

export const changeRole = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        await adminService.changeUserRole(userId, role, req.user.role, req.user.id);
        return res.status(200).json({ success: true, message: "User Role has been changed successfully" });
    } catch (err) {
        next(err);
    }
}

//Controllers to manage user's files and directories

export const getDirectoryContents = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("rootDirectory").lean();
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const parentDirectoryId = req.params?.dirId ? req.params?.dirId : user.rootDirectory.toString();
        const { files, directories } = await directoryService.getDirectoryContents(parentDirectoryId, userId);
        return res.status(200).json({ success: true, files, directories });
    } catch (err) {
        next(err) 
    }
}

export const renameDirectory = async (req, res, next) => {
    try {
        const { userId, dirId } = req.params;
        const { newDirectoryName } = req.body;
        const isExists = await directoryService.renameDirectory(dirId, userId, newDirectoryName);
        if (!isExists) {
            return res.status(404).json({ success: false, message: "Directory not found" });
        }
        return res.status(200).json({ success: true, message: "Directory renamed Successfully" });
    } catch (err) {
        next(err);
    }
}

export const deleteDirectory = async (req, res, next) => {
    try {
        const { userId, dirId } = req.params;
        const isExists = await directoryService.deleteDirectory(dirId, userId);
        if (!isExists) {
            return res.status(404).json({ success: true, message: "Directory not found" });
        }
        return res.status(200).json({ success: true, message: "Directory deleted successfully" });
    } catch (err) {
        next(err);
    }
}

export const viewFile = async (req, res, next) => {
    try {
        const { userId, fileId } = req.params;
        const { action } = req.query;
        const result = await fileService.getFileMetaDataAndPath(fileId, userId);
        if(!result){
            return res.status(404).json({ success: false, message: "File not found"});
        }
        const { fileData, filePath } = result;
        if (action && action === "download") {
            return res.download(filePath, fileData.name);
        }
        res.sendFile(filePath, (err) => {
            if (res.headersSent) return;
            if (err) {
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            } else {
                res.status(200).end();
            }
        });
        
    } catch (err) {
        next(err);
    }
}

export const renameFile = async(req, res, next) => {
    try {
        const { userId, fileId } = req.params;
        const { newFilename } = req.body;
        const updatedData = await fileService.renameFile(fileId, userId, newFilename);
        if(!updatedData){
            return res.status(404).json({ success: false, message: "File not found"});
        }
        return res.status(200).json({ success: true, message: "File renamed Successfully"});
    } catch(err){
        next(err);
    }
}

export const deleteFile = async(req, res, next) => {
    try {
        const { userId, fileId } = req.params;
        const isExists = await fileService.deleteFile(fileId, userId);
        if(!isExists){
            return res.status(404).json({ success: false, message: "File not found"});
        }
        return res.status(200).json({ success: true, message: "File renamed Successfully"});
    } catch(err){
        next(err);
    }
}

export const getUser = async(req, res, next) => {
    try {
        const { userId } = req.params;
        if(!userId){
            return res.status(401).json({ success: false, message: "Invalid Input"});
        }
        const user = await User.findById(userId).select("email picture").lean();
        return res.status(200).json({ success: true, user});
    } catch(err){
        next(err);
    }
}