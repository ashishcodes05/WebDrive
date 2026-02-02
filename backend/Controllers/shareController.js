import crypto from "crypto";
import Share from "../Models/shareModel.js";
import File from "../Models/fileModel.js"

export const generateToken = async(req, res, next) => {
    const { fileId } = req.body;
    if(!fileId){
        return res.status(401).json({success: false, message: "Invalid input"});
    }
    const token = crypto.randomBytes(16).toString("hex");
    await Share.deleteMany({ fileId });
    await Share.create({ token, fileId , userId: req.user._id });
    return res.status(200).json({ success: true, token});
}

export const validateTokenAndViewFile = async(req, res, next) => {
    try {
        const { token } = req.params;
        const share = await Share.findOne({ token });
        if(!share){
            return res.status(200).json({ success: false, message: "Invalid token" })
        }
        const fileId = share.fileId;
        const fileData = await File.findById(fileId);
        if(!fileData){
            return res.status(404).json({success: false, message: "File Not Found"});
        }
        fileData.isShared = true;
        await fileData.save();
        res.sendFile(`${process.cwd()}/Storage/${fileId}${fileData.extension}`, (err) => {
            if (res.headersSent) return;
            if (err) {
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            } else {
                res.status(200).end();
            }
        })
        
    } catch (err){
        console.log(err.errorResponse.errInfo.details.schemaRulesNotSatisfied)
        console.log(err.errorResponse.errInfo.details.schemaRulesNotSatisfied)
        next(err);
    }
}

export const getSharedFiles = async(req, res, next) => {
    try {
        const user = req.user;
        const sharedTokens = await Share.find({ userId: user.id }).select("fileId").lean();
        const fileIds = [];
        for(const { fileId } of sharedTokens){
            fileIds.push(fileId);
        }
        const files = await File.find({_id: {$in : fileIds}, isShared: true}).lean();
        return res.status(200).json({ success: true, files});
    } catch(err){
        next(err);
    }
}