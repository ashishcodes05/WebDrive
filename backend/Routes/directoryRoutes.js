import express from "express";
import { rm } from "fs/promises";
import validateIdMiddleware from "../Middlewares/validateIdMiddleware.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.param("id", validateIdMiddleware);
router.param("parDirId", validateIdMiddleware);

router.get("/{:id}", async (req, res, next) => {
  try {
    const user = req.user;
    const db = req.db;
    const id = req.params.id ? new ObjectId(req.params.id) : user.rootDirectory;
    const directoryData = await db.collection("directories").findOne({ _id: id, userId: user._id });
    if (!directoryData) {
      return res.status(404).json({
        success: false,
        message: "Directory Not Found!"
      })
    }
    const files = await db.collection("files").find({ parDirId: id }).toArray();
    const directories = await db.collection("directories").find({ parentDir: id }).toArray();
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
});

router.post("/{:parDirId}", async (req, res, next) => {
  const user = req.user;
  const { foldername } = req.body;
  const db = req.db;
  const parDirId = req.params.parDirId ? new ObjectId(req.params.parDirId) : user.rootDirectory;
  const parentDirectory = await db.collection("directories").findOne({ _id: parDirId, userId: user._id })
  if (!parentDirectory) {
    return res.status(404).json({
      success: false,
      message: "Parent Directory Not Found!"
    });
  }
  try {
    await db.collection("directories").insertOne({
      name: foldername,
      parentDir: parDirId,
      userId: user._id,
    });
    return res.status(200).json({ success: true, message: "Folder Created Successfully" });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const db = req.db;
  const { newDirectoryName } = req.body;
  if (!newDirectoryName || newDirectoryName.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "New directory name is required"
    });
  }
  try {
    await db.collection("directories").updateOne({ _id: new ObjectId(id), userId: user._id }, { $set: { name: newDirectoryName } })
    return res.json({
      success: true,
      message: "Directory renamed successfully"
    });
  } catch (err) {
    next(err);
  }
});

const deleteHandler = async (directoryData, user, db) => {
  const filesData = await db.collection("files").find({ parDirId: directoryData._id }, { projection: { _id: 1, extension: 1 } }).toArray();
  const fileIds = [];
  for (const file of filesData) {
    fileIds.push(file._id);
    await rm(`./Storage/${file._id.toString()}${file.extension}`);
  }
  const directoriesData = await db.collection("directories").find({ parentDir: directoryData._id }, { projection: { _id: 1 } }).toArray();
  let data = { files: [], directories: [] };
  const directoryIds = [];
  for (const directory of directoriesData) {
    directoryIds.push(directory._id);
    const result = await deleteHandler(directory, user, db);
    data = { files: [...data.files, ...result.files], directories: [...data.directories, ...result.directories] }
  }
  return { files: [...fileIds, ...data.files], directories: [...directoryIds, ...data.directories] };
}

router.delete("/:id", async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const db = req.db;
  try {
    const directoryData = await db.collection("directories").findOne({ _id: new ObjectId(id), userId: user._id });
    if (!directoryData) {
      return res.status(404).json({ success: false, message: "Directory Not Found" });
    }
    const data = await deleteHandler(directoryData, user, db);
    if (data.files.length != 0) {
      await db.collection("files").deleteMany({ _id: { $in: data.files } });
    }
    if (data.directories.length != 0) {
      await db.collection("directories").deleteMany({ _id: { $in: data.directories } });
    }
    await db.collection("directories").deleteOne({ _id: directoryData._id, userId: user._id });
    return res.status(200).json({ success: true, message: "Directory Deleted Successfully" });
  } catch (err) {
    next(err);
  }
})

export default router;