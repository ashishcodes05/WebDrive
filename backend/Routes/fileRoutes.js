import express from "express";
import multer from "multer";
import validateIdMiddleware from "../Middlewares/validateIdMiddleware.js";
import { deleteFileById, getFileById, renameFileById, uploadFiles } from "../Controllers/fileController.js";
import path from "node:path"
import { Types } from "mongoose";
import { requirePermission } from "../Middlewares/permissionMiddleware.js";
import { PERMISSIONS } from "../Auth/permissions.js";

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

router.get("/:id", requirePermission(PERMISSIONS.FILE_READ_SELF), getFileById);
router.post("/{:parDirId}", requirePermission(PERMISSIONS.FILE_CREATE_SELF), upload.fields([{ name: "uploadedFiles", maxCount: 10 }]), uploadFiles);
router.patch("/:id", requirePermission(PERMISSIONS.FILE_UPDATE_SELF), renameFileById);
router.delete("/:id", requirePermission(PERMISSIONS.FILE_DELETE_SELF), deleteFileById);

export default router;