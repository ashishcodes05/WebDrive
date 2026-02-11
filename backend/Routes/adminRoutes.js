import express from "express";
import { toggleStatus, forceDelete, forceLogout, getAllUsers, changeRole, getDirectoryContents, viewFile, renameDirectory, renameFile, deleteDirectory, deleteFile, getUser } from "../Controllers/adminController.js";
import { requirePermission } from "../Middlewares/permissionMiddleware.js";
import { PERMISSIONS } from "../Auth/permissions.js";
import validateIdMiddleware from "../Middlewares/validateIdMiddleware.js";

const router = express.Router();

router.param("userId", validateIdMiddleware);

router.get("/getAllUsers", requirePermission(PERMISSIONS.USER_VIEW), getAllUsers);
router.post("/force-logout/:userId", requirePermission(PERMISSIONS.AUTH_LOGOUT_ANY), forceLogout);
router.patch("/toggle-status/:userId", requirePermission(PERMISSIONS.USER_TOGGLE_STATUS), toggleStatus);
router.patch("/change-role/:userId", requirePermission(PERMISSIONS.USER_CHANGE_ROLE), changeRole);
router.delete("/force-delete/:userId", requirePermission(PERMISSIONS.USER_DELETE), forceDelete);
router.get("/user/:userId/directory/{:dirId}", requirePermission(PERMISSIONS.ADMIN_RESOURCE_OPERATIONS), getDirectoryContents);
router.get("/user/:userId/file/:fileId", requirePermission(PERMISSIONS.ADMIN_RESOURCE_OPERATIONS), viewFile);
router.patch("/user/:userId/directory/{:dirId}", requirePermission(PERMISSIONS.ADMIN_RESOURCE_OPERATIONS), renameDirectory);
router.patch("/user/:userId/file/:fileId", requirePermission(PERMISSIONS.ADMIN_RESOURCE_OPERATIONS), renameFile);
router.delete("/user/:userId/directory/:dirId", requirePermission(PERMISSIONS.ADMIN_RESOURCE_OPERATIONS), deleteDirectory);
router.delete("/user/:userId/file/:fileId", requirePermission(PERMISSIONS.ADMIN_RESOURCE_OPERATIONS), deleteFile);
router.get("/user/:userId", requirePermission(PERMISSIONS.ADMIN_RESOURCE_OPERATIONS), getUser);

export default router;