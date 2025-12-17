import express from "express";
import { mkdir, rm, writeFile } from "fs/promises";
import directoriesData from "../directoriesDB.json" with {type: "json"};
import filesData from "../filesDB.json" with {type: "json"};
import validateIdMiddleware from "../Middlewares/validateIdMiddleware.js";

const router = express.Router();

router.param("id", validateIdMiddleware);
router.param("parDirId", validateIdMiddleware);

router.get("/", async (req, res) => {
  const user = req.user;
  const directoryData = directoriesData.find((directory) => directory.id === user.rootDirectory);
  if (!directoryData) {
    return res.status(404).json({
      success: false,
      message: "Directory Not Found!"
    })
  }
  const files = directoryData.files.map((id) => filesData.find((file) => file.id === id))
  const directories = directoryData.directories.map((id) => directoriesData.find((directory) => directory.id === id))
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

router.get("/:id", async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const directoryData = directoriesData.find((directory) => directory.id === id && directory.userId === user.id );
  if (!directoryData) {
    return res.status(404).json({
      success: false,
      message: "Directory Not Found!"
    })
  }
  const files = directoryData.files.map((fileId) => filesData.find((file) => file.id === fileId))
  const directories = directoryData.directories.map((id) => directoriesData.find((directory) => directory.id === id))
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

router.post("/", async (req, res, next) => {
  const user = req.user;
  const { foldername } = req.body;
  const parentDirectory = directoriesData.find((directory) => directory.id === user.rootDirectory);
  if (!parentDirectory) {
    return res.status(404).json({
      success: false,
      message: "Parent Directory Not Found!"
    });
  }
  const parDirId = parentDirectory.id;
  try {
    const dirId = crypto.randomUUID();
    await mkdir(`./Storage/${dirId}`);
    directoriesData.push({
      id: dirId,
      name: foldername,
      parentDir: parDirId,
      userId: user.id,
      files: [],
      directories: [],
      lastModified: Date.now()
    });
    parentDirectory.directories.push(dirId);
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    return res.status(200).json({ success: true, message: "Folder Created Successfully" });
  } catch (err) {
    next(err);
  }
});

router.post("/:parDirId", async (req, res, next) => {
  const user = req.user;
  const { foldername } = req.body;
  const parDirId = req.params.parDirId;
  const parentDirectory = directoriesData.find((directory) => directory.id === parDirId && directory.userId === user.id );
  if (!parentDirectory) {
    return res.status(404).json({
      success: false,
      message: "Parent Directory Not Found!"
    });
  }
  try {
    const dirId = crypto.randomUUID();
    await mkdir(`./Storage/${dirId}`);
    directoriesData.push({
      id: dirId,
      name: foldername,
      parentDir: parDirId,
      userId: user.id,
      files: [],
      directories: [],
      lastModified: Date.now()
    });
    parentDirectory.directories.push(dirId);
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    return res.status(200).json({ success: true, message: "Folder Created Successfully" });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const { newDirectoryName } = req.body;
  if(!newDirectoryName || newDirectoryName.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "New directory name is required"
    });
  }
  const directory = directoriesData.find((directory) => directory.id === id && directory.userId === user.id );
  if (!directory) {
    return res.json({
      success: false,
      message: "Directory Not Found!"
    });
  }
  try {
    directory.name = newDirectoryName;
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
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