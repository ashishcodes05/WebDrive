import Directory from "../Models/directoryModel.js";
import File from "../Models/fileModel.js";
import Permission from "../Models/permissionModel.js";
import FileEntity from "./fileEntity.js";
import storageService from "./storageService.js";

class FileService {
    async getFileMetaDataAndPath(fileId, userId){
        const fileData = await File.findOne({_id: fileId, userId }).select("name extension").lean();
        if(!fileData) return null;
        const filePath = storageService.getFilePath(fileId, fileData.extension);
        return {fileData, filePath};
    }

    async processUploads(uploadedFiles, userId, parentDirectoryId){
        const directoryData = await Directory.findOne({_id: parentDirectoryId, userId});
        if (!directoryData) {
            throw new Error("PARENT_DIRECTORY_NOT_FOUND");
        }
        const sharedUsers = await Permission.find({ resourceId: parentDirectoryId, role: {$ne: "owner"}}).select("userId role").lean();
        const filesData = [];
        const permissionData = [];
        uploadedFiles.forEach((file) => {
            const fileEntity = new FileEntity(file, userId, parentDirectoryId);
            const permissions = fileEntity.generatePermissions(sharedUsers);
            filesData.push(fileEntity.toDatabaseObject());
            permissionData.push(...permissions);
        });
        await File.insertMany(filesData);
        await Permission.insertMany(permissionData);
    }

    async renameFile(fileId, userId, newName){
        const fileData = await File.findOne({_id: fileId, userId}).select("extension").lean();
        if(!fileData) return null;
        const newExtension = path.extname(newName);
        if(newExtension !== fileData.extension){
            throw new Error("EXTENSION_MISMATCH");
        }
        const updatedFile = await File.updateOne({_id: fileId, userId}, {name: newName}, {new: true});
        return updatedFile;
    }

    async deleteFile(fileId, userId){
        const fileData = await File.findOne({_id: fileId, userId}).select("extension").lean();
        if(!fileData) return null;
        await File.deleteOne({_id: fileId, userId});
        await storageService.deletePhysicalFile(fileId, fileData.extension);
        return fileData;
    }
}

export default new FileService();