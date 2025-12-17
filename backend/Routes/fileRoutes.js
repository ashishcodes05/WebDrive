import express from "express";
import { open, rename, rm, writeFile } from "fs/promises";
import path from "path";
import filesData from "../filesDB.json" with {type: "json"};
import directoriesData from "../directoriesDB.json" with {type: "json"};
import mime from "mime-types";
import multer from "multer";
import validateIdMiddleware from "../Middlewares/validateIdMiddleware.js";

const router = express.Router();

router.param("id", validateIdMiddleware);
router.param("parDirId", validateIdMiddleware);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Storage/')
  },
  filename: function (req, file, cb) {
    const id = crypto.randomUUID();
    const extension = path.extname(file.originalname);
    file.id = id;
    cb(null, `${id}${extension}`);
  }
})

const upload = multer({ storage: storage })

router.get("/:id", (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const fileData = filesData.find((file) => file.id === id && directoriesData.find((directory) => directory.id === file.parDirId && directory.userId === user.id));
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
});

router.post("/", upload.fields([{ name: "uploadedFiles", maxCount: 10 }]), async (req, res, next) => {
  try {
    const user = req.user;
    const parentDirectory = directoriesData.find((directory) => directory.id === user.rootDirectory);
    const parDirId = parentDirectory.id;
    if (!parentDirectory) {
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
    uploadedFiles.forEach((file) => {
      const { id } = file;
      const { originalname: filename } = file;
      const extension = path.extname(file.originalname);
      const { size } = file;
      const lastModified = Date.now();
      filesData.push({
        id,
        parDirId,
        filename,
        extension,
        size,
        lastModified
      })
      parentDirectory.files.push(id);
    })
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    res.status(201).json({ success: true, message: "Files Uploaded Successfully" });
  } catch (err) {
    next(err);
  }
});

router.post("/:parDirId", upload.fields([{ name: "uploadedFiles", maxCount: 10 }]), async (req, res, next) => {
  try {
    const user = req.user;
    const parDirId = req.params.parDirId;
    const directoryData = directoriesData.find((directory) => directory.id === parDirId && directory.userId === user.id);
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
    uploadedFiles.forEach((file) => {
      const { id } = file;
      const { originalname: filename } = file;
      const extension = path.extname(file.originalname);
      const { size } = file;
      const lastModified = Date.now();
      filesData.push({
        id,
        parDirId,
        filename,
        extension,
        size,
        lastModified
      })
      directoryData.files.push(id);
    })
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    res.status(201).json({ success: true, message: "Files Uploaded Successfully" });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const { newFilename } = req.body;
  if (!newFilename) {
    return res.status(400).json({
      success: false,
      message: "New filename is required"
    });
  }
  let fileData = filesData.find((file) => file.id === id && directoriesData.find((directory) => directory.id === file.parDirId && directory.userId === user.id));
  if (!fileData) {
    return res.status(404).json({ success: false, message: "File Not Found" });
  }
  fileData.filename = newFilename;
  try {
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    res.status(200).json({ success: true, message: "Renamed Successfully" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  const fileIdx = filesData.findIndex((file) => file.id === id && directoriesData.find((directory) => directory.id === file.parDirId && directory.userId === user.id));
  if (fileIdx == -1) {
    return res.status(404).json({
      success: false,
      message: "File Not Found"
    });
  }
  try {
    const fileData = filesData[fileIdx];
    const directoryData = directoriesData.find((directory) => directory.id === fileData.parDirId);
    directoryData.files = directoryData.files.filter((fileId) => fileId !== id);
    await rm(`./Storage/${id}${fileData.extension}`);
    filesData.splice(fileIdx, 1);
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./directoriesDB.json", JSON.stringify(directoriesData));
    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;