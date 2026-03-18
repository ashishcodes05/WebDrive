import { downloadAndSaveFile, driveAuthClient, fetchUserFromGoogle } from "../Services/googleAuthService.js";
import { fetchUserFromGithub } from "../Services/githubAuthService.js";
import File from "../Models/fileModel.js";
import otpManager from "../Services/otpManager.js";
import sessionManager from "../Services/sessionManager.js";
import userService from "../Services/userService.js";

export const sendOtp = async (req, res) => {
    const { email } = req.body;
    const response = await otpManager.sendVerificationCode(email);
    return res.status(201).json(response);
}

export const verifyOtp = async (req, res, next) => {
    try {
        const { email, enteredOtp } = req.body;
        const isVerified = await otpManager.verifyOtp(enteredOtp, email);
        if (!isVerified) {
            return res.status(401).json({ success: false, message: "Invalid OTP" });
        }
        return res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (err) {
        next(err);
    }
}

export const googleLogin = async (req, res, next) => {
    try {
        const sessionId = req.signedCookies.sid;
        const { code } = req.body;
        const { name, email, picture } = await fetchUserFromGoogle(code);
        if (sessionId) {
            await sessionManager.deleteSession(sessionId);
        }
        const newSessionId = await userService.handleOAuthLogin(name, email, picture);
        res.cookie("sid", newSessionId, {
            httpOnly: true,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000 * 7
        })
        return res.status(201).json({ success: true, message: "User LoggedIn Successfully" });
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

export const githubRedirectURI = async (req, res) => {
    const client_id = process.env.GITHUB_CLIENT_ID;
    const redirect_uri = process.env.GITHUB_REDIRECT_URI;
    const params = new URLSearchParams({
        client_id,
        redirect_uri,
        scope: "user:email"
    })
    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}

export const githubLogin = async (req, res, next) => {
    try {
        const sid = req.signedCookies.sid;
        const { code } = req.query;
        if (sid) {
            await sessionManager.deleteSession(sid);
        }
        const { name, email, picture } = await fetchUserFromGithub(code);
        const newSessionId = await userService.handleOAuthLogin(name, email, picture);
        res.cookie("sid", newSessionId, {
            httpOnly: true,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000 * 7
        })
        return res.redirect("http://localhost:5173/");
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

export const importFromGoogleDrive = async (req, res, next) => {
    const { files, accessToken } = req.body;
    const { dirId } = req.params;
    const user = req.user;
    if (!files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No files provided",
        });
    }
    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: "Access token missing",
        });
    }
    await driveAuthClient.getTokenInfo(accessToken);
    let savedFiles = [];
    for(const file of files){
        const savedFile = await downloadAndSaveFile(file, accessToken);
        savedFiles.push(savedFile);
    }
    savedFiles = savedFiles.map((file) => {
        file.parentDirectoryId = dirId ? dirId : user.rootDirectory;
        file.userId = user._id;
        return file;
    })
    await File.insertMany(savedFiles);
    return res.status(200).json({
        success: true,
        message: "Files imported successfully",
        files: savedFiles,
    });
}