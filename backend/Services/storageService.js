import { rm } from "fs/promises";
import path from "path"

class StorageService {
    constructor(){
        this.basePath = process.cwd();
    }
    getFilePath(id, extension){
        return path.join(this.basePath, "Storage", `${id}${extension}`)
    }
    async deletePhysicalFile(id, extension){
        const filePath = this.getFilePath(id, extension);
        await rm(filePath);
    }
}

export default new StorageService();