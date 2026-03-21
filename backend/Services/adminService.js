import User from "../Models/userModel.js";
import sessionManager from "./sessionManager.js";

class AdminService {
    constructor(){
        this.roleLevels = { owner: 4, admin: 3, manager: 2, user: 1 };
        this.permissibleRoles = ["admin", "manager", "user"];
        this.permissibleChange = {
            owner: ["admin", "manager", "user"],
            admin: ["admin", "manager", "user"],
            manager: ["manager", "user"]
        }
    }

    async getAllUsersWithActiveStatus(){
        const activeSessions = await sessionManager.getAllActiveSessions();
        const activeUserIds = new Set(activeSessions.map((session) => session.userId));
        const users = await User.find().select("_id name email picture role isDisabled").lean();
        return users.map((user) => {
            user.isLoggedIn = activeUserIds.has(user._id.toString());
            return user;
        });
    }

    async toggleUserStatus(targetUserId, requestingUserId) {
        if (targetUserId === requestingUserId) {
            throw new Error("CANNOT_MODIFY_SELF");
        }
        const selectedUser = await User.findById(targetUserId);
        if (!selectedUser) {
            throw new Error("USER_NOT_FOUND");
        }
        if(!selectedUser.isDisabled){
            await sessionManager.deleteAllSessions(targetUserId);
        }
        selectedUser.isDisabled = !selectedUser.isDisabled;
        await selectedUser.save();
    }

    async changeUserRole(targetUserId, newRole, requestingUserRole, requestingUserId) {
        if (targetUserId === requestingUserId) {
            throw new Error("CANNOT_MODIFY_SELF");
        }
        if (!this.permissibleRoles.includes(newRole)) {
            throw new Error("INVALID_ROLE");
        }
        const selectedUser = await User.findById(targetUserId);
        if (!selectedUser) {
            throw new Error("USER_NOT_FOUND");
        }
        if (this.roleLevels[requestingUserRole] < this.roleLevels[selectedUser.role]) {
            throw new Error("INSUFFICIENT_PERMISSIONS");
        }
        if (!this.permissibleChange[requestingUserRole].includes(newRole)) {
            throw new Error("ROLE_CHANGE_NOT_ALLOWED");
        }
        selectedUser.role = newRole;
        await selectedUser.save();
    }
}


export default new AdminService();