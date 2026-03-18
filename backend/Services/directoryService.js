import Directory from "../Models/directoryModel.js";
import File from "../Models/fileModel.js";
import Permission from "../Models/permissionModel.js";
import DirectoryEntity from "./directoryEntity.js";
import storageService from "./storageService.js";

class DirectoryService {
    async getDirectoryContents(directoryId, userId){
        const directoryData = await Directory.findOne({ _id: directoryId, userId }).lean();
        if (!directoryData) {
            throw new Error("DIRECTORY_NOT_FOUND");
        }
        const files = await File.find({ parentDirectoryId: directoryId }).populate("userId", "email picture").lean();
        const directories = await Directory.find({ parentDirectoryId: directoryId }).populate("userId", "email picture").lean();
        return { files, directories };
    }

    async createDirectory(name, parentDirectoryId, userId){
        const parentDirectory = await Directory.findOne({ _id: parentDirectoryId, userId }).lean();
        if (!parentDirectory) {
            throw new Error("PARENT_DIRECTORY_NOT_FOUND");
        }
        const newDirectory = new DirectoryEntity(name, parentDirectoryId, userId);
        const sharedUsers = await Permission.find({ resourceId: parentDirectoryId, role: { $ne : "owner"} }).select("userId role").lean();
        const permissions = newDirectory.generatePermissions(sharedUsers);
        await Permission.insertMany(permissions);
        return await Directory.create(newDirectory.toDatabaseObject());
    }

    async renameDirectory(directoryId, userId, newName){
        const directoryData = await Directory.findOne({_id: directoryId, userId}).lean();
        if(!directoryData) return null;
        const updatedDirectory = await Directory.updateOne({_id: directoryId, userId}, {name: newName}, {new: true});
        return updatedDirectory;
    }

    async #recursiveDelete(directoryId, userId){
        const filesData = await File.find({ parentDirectoryId: directoryId, userId }).select("_id extension").lean();
        const fileIds = [];
        for (const file of filesData) {
            fileIds.push(file._id);
            await storageService.deletePhysicalFile(file._id, file.extension);
        }
        const directoriesData = await Directory.find({ parentDirectoryId: directoryId, userId }).select("_id").lean();
        let data = { files: [], directories: [] };
        const directoryIds = [];
        for (const directory of directoriesData) {
            directoryIds.push(directory._id);
            const result = await this.#recursiveDelete(directory._id, userId);
            data = { files: [...data.files, ...result.files], directories: [...data.directories, ...result.directories] }
        }
        return { files: [...fileIds, ...data.files], directories: [...directoryIds, ...data.directories] };
    }

    async deleteDirectory(directoryId, userId){
        const directoryData = await Directory.findOne({ _id: directoryId, userId }).select("_id").lean();
        if (!directoryData) {
            throw new Error("DIRECTORY_NOT_FOUND");
        }
        const data = await this.#recursiveDelete(directoryData._id, userId);
        if (data.files.length != 0) {
            await File.deleteMany({ _id: { $in: data.files } });
        }
        if (data.directories.length != 0) {
            await Directory.deleteMany({ _id: { $in: data.directories } });
        }
        await Directory.deleteOne({ _id: directoryData._id, userId: userId });
    }
}
export default new DirectoryService();