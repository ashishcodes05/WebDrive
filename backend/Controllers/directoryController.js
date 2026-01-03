import { rm } from "fs/promises";
import Directory from "../Models/directoryModel.js";
import File from "../Models/fileModel.js";

export const getDirectoryById = async (req, res, next) => {
  try {
    const user = req.user;
    const id = req.params.id || user.rootDirectory.toString();
    const directoryData = await Directory.findOne({ _id: id, userId: user._id }).lean();
    if (!directoryData) {
      return res.status(404).json({
        success: false,
        message: "Directory Not Found!"
      })
    }
    const files = await File.find({ parDirId: id }).lean();
    const directories = await Directory.find({ parentDir: id }).lean();
    return res.status(200).json({
      success: true,
      message: "Directory Found!",
      directoryData: {
        ...directoryData,
        files,
        directories
      }
    });
  } catch (err) {
    next(err);
  }
}

export const createDirectory = async (req, res, next) => {
  const user = req.user;
  const { foldername } = req.body;
  const parDirId = req.params.parDirId || user.rootDirectory.toString();
  const parentDirectory = await Directory.findOne({ _id: parDirId, userId: user._id }).lean();
  if (!parentDirectory) {
    return res.status(404).json({
      success: false,
      message: "Parent Directory Not Found!"
    });
  }
  try {
    await Directory.insertOne({
      name: foldername,
      parentDir: parDirId,
      userId: user._id,
    });
    return res.status(200).json({ success: true, message: "Folder Created Successfully" });
  } catch (err) {
    next(err);
  }
}

export const renameDirectory = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const { newDirectoryName } = req.body;
  if (!newDirectoryName || newDirectoryName.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "New directory name is required"
    });
  }
  try {
    await Directory.updateOne({ _id: id, userId: user._id }, { $set: { name: newDirectoryName } })
    return res.json({
      success: true,
      message: "Directory renamed successfully"
    });
  } catch (err) {
    next(err);
  }
}

const deleteHandler = async (directoryData, user) => {
  const filesData = await File.find({ parDirId: directoryData._id }).select("_id extension").lean();
  const fileIds = [];
  for (const file of filesData) {
    fileIds.push(file._id);
    await rm(`./Storage/${file._id.toString()}${file.extension}`);
  }
  const directoriesData = await Directory.find({ parentDir: directoryData._id }).select("_id").lean();
  let data = { files: [], directories: [] };
  const directoryIds = [];
  for (const directory of directoriesData) {
    directoryIds.push(directory._id);
    const result = await deleteHandler(directory, user);
    data = { files: [...data.files, ...result.files], directories: [...data.directories, ...result.directories] }
  }
  return { files: [...fileIds, ...data.files], directories: [...directoryIds, ...data.directories] };
}

export const deleteDirectoryById = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  try {
    const directoryData = await Directory.findOne({ _id: id, userId: user._id }).select("_id").lean();
    if (!directoryData) {
      return res.status(404).json({ success: false, message: "Directory Not Found" });
    }
    const data = await deleteHandler(directoryData, user);
    if (data.files.length != 0) {
      await File.deleteMany({ _id: { $in: data.files } });
    }
    if (data.directories.length != 0) {
      await Directory.deleteMany({ _id: { $in: data.directories } });
    }
    await Directory.deleteOne({ _id: directoryData._id, userId: user._id });
    return res.status(200).json({ success: true, message: "Directory Deleted Successfully" });
  } catch (err) {
    next(err);
  }
}