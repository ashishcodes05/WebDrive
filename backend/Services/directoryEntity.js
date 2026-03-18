import { Types } from "mongoose";

class DirectoryEntity {
    constructor(name, parentDirectoryId, userId) {
        this._id = new Types.ObjectId();
        this.name = name;
        this.parentDirectoryId = parentDirectoryId;
        this.userId = userId;
    }

    generatePermissions(sharedUsers) {
        const permissions = [];
        permissions.push({
            resourceId: this._id,
            resourceType: "directory",
            userId: this.userId,
            role: "owner"
        })
        for(const u of sharedUsers){
            permissions.push({
                resourceId: this._id,
                resourceType: "directory",
                userId: u.userId,
                role: u.role
            })
        }
        return permissions;
    }

    toDatabaseObject(){
        return {
            _id: this._id,
            name: this.name,
            parentDirectoryId: this.parentDirectoryId,
            userId: this.userId,
        };
    }
}

export default DirectoryEntity;