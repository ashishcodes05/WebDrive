import path from "path"

class FileEntity {
    constructor(rawFile, userId, parentDirectoryId) {
        this._id = rawFile._id;
        this.name = rawFile.originalname;
        this.extension = path.extname(rawFile.originalname);
        this.size = rawFile.size;
        this.userId = userId;
        this.parentDirectoryId = parentDirectoryId;
        this.permissions = [];
    }

    generatePermissions(sharedUsers) {
        this.permissions.push({
            resourceId: this._id,
            resourceType: "file",
            userId: this.userId,
            role: "owner"
        })
        for(const u of sharedUsers){
            this.permissions.push({
                resourceId: this._id,
                resourceType: "file",
                userId: u.userId,
                role: u.role
            })
        }
    }

    toDatabaseObject() {
        return {
            _id: this._id,
            name: this.name,
            extension: this.extension,
            size: this.size,
            userId: this.userId,
            parentDirectoryId: this.parentDirectoryId
        }
    }
}

export default FileEntity; 