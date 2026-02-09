import express from "express";
import { deleteSharedDirectory, deleteSharedFile, fetchResourceUsers, generateToken, getSharedDirectoryFiles, getSharedFilesAndDirectories, getSharedUsers, renameSharedDirectory, renameSharedFile, revokeAccess, updateRole, validateTokenAndViewDirectory, validateTokenAndViewFile, viewFile } from "../Controllers/shareController.js";
import { checkShareAuth, checkAuth } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/generate-token", checkAuth, generateToken);
router.get("/file/:token",checkShareAuth , validateTokenAndViewFile);
router.get("/directory/:token", checkShareAuth, validateTokenAndViewDirectory);
router.get("/directory", checkAuth, getSharedFilesAndDirectories);
router.get("/directory/:dirId/view", checkAuth, getSharedDirectoryFiles);
router.get("/file/:fileId/view", checkAuth, viewFile);
router.post("/shared-users", checkAuth, getSharedUsers);
router.patch("/file/:fileId", checkAuth, renameSharedFile);
router.patch("/update-role", checkAuth, updateRole);
router.delete("/file/:fileId", checkAuth, deleteSharedFile);
router.patch("/directory/:dirId", checkAuth, renameSharedDirectory);
router.delete("/directory/:dirId", checkAuth, deleteSharedDirectory);
router.get("/:resourceType/:resourceId/manage", checkAuth, fetchResourceUsers);
router.delete("/revoke", checkAuth, revokeAccess)

export default router;