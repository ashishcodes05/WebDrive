import express from "express";
import multer from "multer";
import validateIdMiddleware from "../Middlewares/validateIdMiddleware.js";
import { deleteFileById, getFileById, renameFileById, uploadFiles } from "../Controllers/fileController.js";
import path from "node:path"
import { Types } from "mongoose";

const router = express.Router();

router.param("id", validateIdMiddleware);
router.param("parDirId", validateIdMiddleware);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Storage/')
  },
  filename: function (req, file, cb) {
    const _id = new Types.ObjectId();
    const extension = path.extname(file.originalname);
    file._id = _id;
    cb(null, `${_id}${extension}`);
  }
})

const upload = multer({ storage: storage })

router.get("/:id", getFileById);
router.post("/{:parDirId}", upload.fields([{ name: "uploadedFiles", maxCount: 10 }]), uploadFiles);
router.patch("/:id", renameFileById);
router.delete("/:id", deleteFileById);

export default router;