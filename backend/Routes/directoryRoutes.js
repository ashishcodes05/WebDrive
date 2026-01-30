import express from "express";
import validateIdMiddleware from "../Middlewares/validateIdMiddleware.js";
import { createDirectory, deleteDirectoryById, getDirectoryById, renameDirectory } from "../Controllers/directoryController.js";
import { requirePermission } from "../Middlewares/permissionMiddleware.js";
import { PERMISSIONS } from "../Auth/permissions.js";

const router = express.Router();

router.param("id", validateIdMiddleware);
router.param("parDirId", validateIdMiddleware);

router.get("/{:id}", requirePermission(PERMISSIONS.FOLDER_READ_SELF), getDirectoryById);
router.post("/{:parDirId}", requirePermission(PERMISSIONS.FOLDER_CREATE_SELF), createDirectory);
router.patch("/:id", requirePermission(PERMISSIONS.FOLDER_UPDATE_SELF), renameDirectory);
router.delete("/:id", requirePermission(PERMISSIONS.FOLDER_DELETE_SELF), deleteDirectoryById);

export default router;