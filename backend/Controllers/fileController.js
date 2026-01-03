import { rm } from "fs/promises";
import path from "path";
import { ObjectId } from "mongodb";

export const getFileById = async(req, res) => {
  const user = req.user;
  const { id } = req.params;
  const db = req.db;
  const fileData = await db.collection("files").findOne({_id: new ObjectId(id), userId: user._id});
  if (!fileData) {
    return res.status(404).json({
      success: false,
      message: "File Not Found"
    })
  }
  const { action } = req.query;
  if (action && action === "download") {
    // res.set("Content-Disposition", `attachment; filename=${fileData.filename}`);
    return res.download(`${process.cwd()}/Storage/${id}${fileData.extension}`, fileData.filename);
  }
  res.sendFile(`${process.cwd()}/Storage/${id}${fileData.extension}`, (err) => {
    if (res.headersSent) return;
    if (err) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    } else {
      res.status(200).end();
    }
  });
}

export const uploadFiles = async (req, res, next) => {
  try {
    const user = req.user;
    const parDirId = req.params.parDirId ? new ObjectId(req.params.parDirId) : user.rootDirectory;
    const db = req.db;
    const directoryData = await db.collection("directories").findOne({_id: parDirId, userId: user._id});
    if (!directoryData) {
      return res.status(404).json({
        success: false,
        message: "Parent Directory Not Found"
      });
    }
    const uploadedFiles = req.files?.uploadedFiles;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }
    const filesData = [];
    uploadedFiles.forEach((file) => {
      const { _id } = file;
      const { originalname: filename } = file;
      const extension = path.extname(file.originalname);
      const { size } = file;
      filesData.push({
        _id,
        parDirId,
        userId: user._id,
        filename,
        extension,
        size,
      })
    })
    await db.collection("files").insertMany(filesData);
    return res.status(201).json({ success: true, message: "Files Uploaded Successfully" });
  } catch (err) {
    next(err);
  }
}

export const renameFileById = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const { newFilename } = req.body;
  const db = req.db;
  if (!newFilename) {
    return res.status(400).json({
      success: false,
      message: "New filename is required"
    });
  }
  try {
    const result = await db.collection("files").updateOne({_id: new ObjectId(id), userId: user._id}, {$set: {filename: newFilename}});
    if(result.matchedCount == 0){
      return res.status(200).json({ success: false, message: "File Not Found" });
    }
    return res.status(200).json({ success: true, message: "Renamed Successfully" });
  } catch (err) {
    next(err);
  }
}

export const deleteFileById = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const db = req.db;
  try {
    const fileData = await db.collection('files').findOne({_id: new ObjectId(id), userId: user._id});
    if(!fileData){
      return res.json({ success: false, message: "file not found" });
    }
    await db.collection('files').deleteOne({_id: new ObjectId(id)});
    await rm(`./Storage/${id}${fileData.extension}`);
    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    next(err);
  }
}