import express from "express";
import { deleteSharedFile, generateToken, getSharedFilesAndDirectories, getSharedUsers, renameSharedFile, updateRole, validateTokenAndViewFile, viewFile } from "../Controllers/shareController.js";
import { checkShareAuth, checkAuth } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/generate-token", checkAuth, generateToken);
router.get("/file/:token",checkShareAuth , validateTokenAndViewFile);
router.get("/directory/{:dirId}", checkAuth, getSharedFilesAndDirectories);
router.get("/file/:fileId/view", checkAuth, viewFile);
router.post("/shared-users", checkAuth, getSharedUsers);
router.patch("/file/:fileId", checkAuth, renameSharedFile);
router.patch("/update-role", checkAuth, updateRole);
router.delete("/file/:fileId", checkAuth, deleteSharedFile);

export default router;