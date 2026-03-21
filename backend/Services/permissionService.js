import Directory from "../Models/directoryModel.js";
import File from "../Models/fileModel.js";
import Permission from "../Models/permissionModel.js";

class PermissionService {
    constructor(){
        this.roleHierarchy = {
            "owner": 3,
            "editor": 2,
            "viewer": 1
        };
    }

    async checkAccess(userId, resourceId, requiredRole){
        const permission = await Permission.findOne ({ userId, resourceId }).lean();
        if (!permission) {
            return false;
        }
        requiredRole = requiredRole.toLowerCase();
        const userRole = permission.role.toLowerCase();
        return this.roleHierarchy[userRole] >= this.roleHierarchy[requiredRole];
    }

    async #grantTokenAccessToSubdirectories(resources, directoryId, userId, role){
        const files = await File.find({ parentDirectoryId: directoryId }).select("_id").lean();
        for(const file of files){
            resources.push({
                resourceId: file._id,
                resourceType: "file",
                userId,
                role
            })
        }
        const directories = await Directory.find({ parentDirectoryId: directoryId }).select("_id").lean();
        for(const directory of directories){
            resources.push({
                resourceId: directory._id,
                resourceType: "directory",
                userId,
                role
            })
            await this.#grantTokenAccessToSubdirectories(resources, directory._id, userId, role);
        }
    }

    async grantTokenAccess(shareData, userId){
        const isExists = await Permission.findOne({ resourceId: shareData.resourceId, resourceType: shareData.resourceType, userId }).select("_id").lean();
        if (isExists) {
            return;
        }
        const permission = {
            userId,
            resourceId: shareData.resourceId,
            resourceType: shareData.resourceType,
            role: shareData.role,
            isRoot: true
        };
        await Permission.create(permission);
        if(shareData.resourceType === "directory"){
            const resources = [];
            await this.#grantTokenAccessToSubdirectories(resources, shareData.resourceId, userId, shareData.role);
            await Permission.insertMany(resources);
        }
    }

    async #recursiveRevokeTokenAccess(directoryId, resourceIds){
        const fileIds = (await File.find({ parentDirectoryId: directoryId }).select("_id").lean()).map((file) => file._id);
        resourceIds.push(...fileIds);
        const dirIds = (await Directory.find({ parentDirectoryId: directoryId }).select("_id").lean()).map((dir) => dir._id);
        resourceIds.push(...dirIds);
        for(const dirId of dirIds){
            await this.#recursiveRevokeTokenAccess(dirId, resourceIds);
        }
    }

    async revokeTokenAccess(resourceId, resourceType, targetUserId, requestingUserId){
        const hasAccess = await this.checkAccess(requestingUserId, resourceId, "owner");
        if (!hasAccess) {
            throw new Error("ACCESS_DENIED");
        }
        await Permission.deleteOne({ resourceId, resourceType, userId: targetUserId });
        if (resourceType === "directory") {
            const resourceIds = [];
            await this.#recursiveRevokeTokenAccess(resourceId, resourceIds);
            await Permission.deleteMany({ resourceId: { $in: resourceIds }, userId: targetUserId });
        }
    }

    async getSharedResources(userId){
        const filePermissions = await Permission.find({ userId, resourceType: "file", isRoot: true, role: {$ne: "owner"} }).lean();
        const fileIds = filePermissions.map((perm) => perm.resourceId);
        const filesData = await File.find({ _id: { $in: fileIds } }).populate("userId", "email picture").lean();
        const filesWithPermissions = filesData.map((file) => {
            const permission = filePermissions.find((perm) => perm.resourceId.toString() === file._id.toString());
            return {
                ...file,
                role: permission.role
            };
        });
        const dirPermissions = await Permission.find({ userId, resourceType: "directory", isRoot: true, role: {$ne: "owner"} }).lean();
        const dirIds = dirPermissions.map((perm) => perm.resourceId);
        const directoriesData = await Directory.find({ _id: { $in: dirIds } }).populate("userId", "email picture").lean();
        const directoriesWithPermissions = directoriesData.map((directory) => {
            const permission = dirPermissions.find((perm) => perm.resourceId.toString() === directory._id.toString());
            return {
                ...directory,
                role: permission.role
            };
        });
        return { files: filesWithPermissions, directories: directoriesWithPermissions };
    }
}

export default new PermissionService();