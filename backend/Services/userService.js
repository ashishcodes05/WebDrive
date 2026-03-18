import Directory from "../Models/directoryModel.js";
import File from "../Models/fileModel.js";
import User from "../Models/userModel.js";
import sessionManager from "./sessionManager.js";
import storageService from "./storageService.js";

class UserService {
    async registerUser(name, email, password){
        const mongooseSession = await mongoose.startSession();
        try {
            mongooseSession.startTransaction();
            const userId = new Types.ObjectId();
            const directoryId = new Types.ObjectId();
            await User.insertOne({
                _id: userId,
                name,
                email,
                password,
                rootDirectory: directoryId
            }, {mongooseSession})
            await Directory.insertOne({
                _id: directoryId,
                name: `root-${email}`,
                parentDirectoryId: null,                                                                                                                                                                                  
                userId,
            }, {mongooseSession})
            await mongooseSession.commitTransaction();
        } catch (err) {
            await mongooseSession.abortTransaction();
            throw err;
        } finally {
            mongooseSession.endSession();
        }
    }

    async validateLogin(email, password){
        const user = await User.findOne({ email }).select("_id password isDisabled");
        if (!user) return null;
        if (user.isDisabled) throw new Error("ACCOUNT_DISABLED");
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) return null;
        return user._id;
    }

    async updatePassword(userId, {currentPassword, newPassword}){
        const user = await User.findById(userId).select("password").lean();
        if(!user.hasPassword){
            if(!newPassword){
                throw new Error("NEW_PASSWORD_REQUIRED");
            }
            await User.updateOne({_id: userId}, {password: newPassword});
            return true;
        }
        const isValidPassword = await user.comparePassword(currentPassword);
        if(!isValidPassword){
            throw new Error("INVALID_CURRENT_PASSWORD");
        }
        await User.updateOne({_id: userId}, {password: newPassword});
        return true;
    }

    async deleteCompleteAccount(userId){
        const mongooseSession = await mongoose.startSession();
        try {
            mongooseSession.startTransaction();
            await Directory.deleteMany({ userId }, {mongooseSession});
            const files = await File.find({ userId }).select("extension _id").lean();
            for(const { _id, extension } of files){
                await storageService.deletePhysicalFile(_id.toString(), extension);
            }
            await File.deleteMany({ userId }, {mongooseSession});
            await User.deleteOne({ _id: userId }, {mongooseSession});
            await mongooseSession.commitTransaction();
        } catch (err) {
            await mongooseSession.abortTransaction();
            throw err;
        } finally {
            mongooseSession.endSession();
        }
    }

    async handleOAuthLogin(name, email, picture){
        const user = await User.findOne({ email });
        if(user && user.isDisabled){
            throw new Error("ACCOUNT_DISABLED");
        }
        if (user) {
            if (!user.picture) {
                user.picture = picture;
                await user.save();
            }
            await sessionManager.enforceDeviceLimit(user._id, 2);
            const sessionId = await sessionManager.createSession(user._id);
            return sessionId;
        }
        const mongooseSession = await mongoose.startSession();
        try {
            mongooseSession.startTransaction();
            const userId = new Types.ObjectId();
            const directoryId = new Types.ObjectId();
            await User.insertOne({
                _id: userId,
                name,
                email,
                picture,
                hasPassword: false,
                rootDirectory: directoryId
            }, { mongooseSession })
            await Directory.insertOne({
                _id: directoryId,
                name: `root-${email}`,
                parentDirectoryId: null,
                userId,
            }, { mongooseSession })
            await mongooseSession.commitTransaction();
            return await sessionManager.createSession(userId);
        } catch (err) {
            await mongooseSession.abortTransaction();
            throw err;
        } finally {
            mongooseSession.endSession();
        }
    }
}

export default new UserService();