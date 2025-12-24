import express from "express";
import { mkdir, rm, writeFile } from "fs/promises";
import directoriesData from "../directoriesDB.json" with {type: "json"};
import filesData from "../filesDB.json" with {type: "json"};
import validateIdMiddleware from "../Middlewares/validateIdMiddleware.js";
import { Db, ObjectId } from "mongodb";

const router = express.Router();

router.param("id", validateIdMiddleware);
router.param("parDirId", validateIdMiddleware);

router.get("/{:id}", async (req, res) => {
  const user = req.user;
  const db = req.db;
  const id = req.params.id || user.rootDirectory;
  const directoryData = await db.collection("directories").findOne({_id: new ObjectId(id), userId: user._id});
  if (!directoryData) {
    return res.status(404).json({
      success: false,
      message: "Directory Not Found!"
    })
  }
  const files = await db.collection("files").find({parDirId: new ObjectId(id), userId: user._id}).toArray();
  const directories = await db.collection("directories").find({parentDir: new ObjectId(id), userId: user._id}).toArray()
  return res.status(200).json({
    success: true,
    message: "Directory Found!",
    directoryData : {
      ...directoryData,
      files,
      directories
    }
  });
});

router.post("/{:parDirId}", async (req, res, next) => {
  const user = req.user;
  const { foldername } = req.body;
  const db = req.db;
  const parDirId = req.params.parDirId ? new ObjectId(req.params.parDirId) : user.rootDirectory;
  const parentDirectory = await db.collection("directories").findOne({_id: new ObjectId(parDirId), userId: user._id})
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
      lastModified: Date.now()
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
  if(!newDirectoryName || newDirectoryName.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "New directory name is required"
    });
  }
  try {
    await db.collection("directories").updateOne({_id: new ObjectId(id), userId: user._id}, {$set: {name: newDirectoryName }})
    return res.json({
      success: true,
      message: "Directory renamed successfully"
    });
  } catch (err) {
    next(err);
  }
});

const deleteHandler = async(dirId, userId) => {
  const dirIdx = directoriesData.findIndex((directory) => directory.id === dirId && directory.userId === userId);
  if(dirIdx === -1){
    return 0;
  }
  const directoryData = directoriesData[dirIdx];
  directoriesData.splice(dirIdx, 1);
  for(const fileId of directoryData.files){
    const fileIdx = filesData.findIndex((file) => file.id === fileId);
    await rm(`./Storage/${fileId}${filesData[fileIdx].extension}`);
    filesData.splice(fileIdx, 1);
  }
  for await (const directoryId of directoryData.directories){
    await deleteHandler(directoryId);
  }
  await rm(`./Storage/${dirId}`, { recursive: true });
  if(directoryData.parentDir){
    const parDirectoryData = directoriesData.find((directory) => directory.id === directoryData.parentDir);
    const idx = parDirectoryData?.directories.findIndex((directoryId) => directoryId === directoryData.id);
    parDirectoryData?.directories.splice(idx, 1);
  }
  return 1;
}

router.delete("/:id", async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  try {
    const flag = await deleteHandler(id, user.id);
    if(flag){
      await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
      await writeFile("./filesDB.json", JSON.stringify(filesData));
      res.json({success: true, message: "Directory Deleted Successfully"})
    } else {
      res.json({success: false, message: "Directory couldn't be deleted. Directory Not Found"})
    }
  } catch (err){
    next(err);
  }
})

export default router;