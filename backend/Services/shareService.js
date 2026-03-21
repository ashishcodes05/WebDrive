import crypto from "crypto";
import Share from "../Models/shareModel.js";

class ShareService {
    async generateToken(resourceId, resourceType, userId, permissionRole) {
        const token = crypto.randomBytes(32).toString('hex');
        await Share.deleteMany({ resourceId, resourceType, userId });
        const share = {
            resourceId,
            resourceType,
            userId,
            role: permissionRole,
            token
        };
        await Share.create(share);
        return token;
    }

    async validateToken(token) {
        const share = await Share.findOne({ token }).lean();
        return share;
    }
}

export default new ShareService();