import express from "express";
import validateIdMiddleware from "../Middlewares/validateIdMiddleware.js";
import { createDirectory, deleteDirectoryById, getDirectoryById, renameDirectory } from "../Controllers/directoryController.js";

const router = express.Router();

router.param("id", validateIdMiddleware);
router.param("parDirId", validateIdMiddleware);

router.get("/{:id}", getDirectoryById);
router.post("/{:parDirId}", createDirectory);
router.patch("/:id", renameDirectory);
router.delete("/:id", deleteDirectoryById);

export default router;