import User from "../Models/userModel.js";
import userService from "../Services/userService.js";
import sessionManager from "../Services/sessionManager.js";

export const getUser = (req, res) => {
    const user = req.user;
    return res
        .status(200)
        .json({
            success: true,
            message: "User Data Fetched Successfully",
            user: { id: user._id, name: user.name, email: user.email, picture: user.picture, hasPassword: user.hasPassword, isDisabled: user.isDisabled, role: user.role },
        });
};

export const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        await userService.registerUser(name, email, password);
        return res.status(201).json({ success: true, message: "User Registered Successfully" });
    } catch (err) {
        if (err.code === 121) {
            return res.status(400).json({ success: false, message: "Invalid Inputs" });
        } else if (err.code === 11000) { //Unique Indexing error
            if (err.keyPattern && err.keyPattern.email) {
                return res.status(409).json({ success: false, message: "User already exists" });
            }
        }
        next(err);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const sid = req.signedCookies.sid;
        if(sid){
            await sessionManager.deleteSession(sid);
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const userId = await userService.validateLogin(email, password)
        if(!userId){
            return res.status(401).json({ success: false, message: "Invalid Credentials"})
        }
        await sessionManager.enforceDeviceLimit(userId, 2);
        const sessionId = await sessionManager.createSession(userId);
        res.cookie("sid", sessionId, {
            httpOnly: true,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000 * 7// 7 day
        });
        return res.status(200).json({ success: true, message: "Login Successful" });
    } catch (err) {
        next(err);
    }
}

export const logoutUser = async(req, res) => {
    try {
        const { sid } = req.signedCookies;
        await sessionManager.deleteSession(sid);
        res.clearCookie("sid");
        return res.status(200).json({ success: true, message: "Logout Successful" });
    } catch (err){
        next(err)
    }
}

export const logoutAllDevices = async(req, res, next) => {
    try {
        const user = req.user;
        await sessionManager.deleteAllSessions(user._id);
        return res.status(200).json({ success: true, message: "Logout Successfully from all devices" });
    } catch (err){
        next(err);
    }
}

export const updateUserProfile = async(req, res, next) => {
    try {
        const user = req.user;
        const { newName } = req.body;
        const updatedUser = await User.findByIdAndUpdate(user.id, { name: newName }, {runValidators: true, new: true});
        return res.status(200).json({success: true, message: "UserName has been changed successfully", user: updatedUser})
    } catch(err){
        next(err)
    }
}

export const updatePassword = async(req, res, next) => {
    try {
        const user = req.user;
        const { newPassword, currentPassword } = req.body;
        await userService.updatePassword(user._id, { currentPassword, newPassword });
        return res.status(200).json({success: true, message: "Password has been updated Successfully"});
    } catch(err){
        next(err)
    }
}

export const deleteUser = async(req, res, next) => {
    try {
        const user = req.user;
        const sessionId = req.signedCookies.sid;
        await sessionManager.deleteSession(sessionId);
        await userService.deleteCompleteAccount(user._id);
        return res.status(200).json({success: true, message: "User Deleted Successfully"});
    } catch (err){
        next(err);
    }
}
