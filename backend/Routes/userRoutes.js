import express from "express";
import checkAuth from "../Middlewares/authMiddleware.js";
import { createUser, getUser, loginUser, logoutUser, logoutAllDevices, updateUserProfile, updatePassword, deleteUser } from "../Controllers/userController.js";
import { requirePermission } from "../Middlewares/permissionMiddleware.js";
import { PERMISSIONS } from "../Auth/permissions.js";
const router = express.Router();

router.get("/", checkAuth, requirePermission(PERMISSIONS.USER_READ_SELF), getUser);
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", checkAuth, requirePermission(PERMISSIONS.AUTH_LOGOUT_SELF), logoutUser);
router.post("/logoutAll", checkAuth, requirePermission(PERMISSIONS.AUTH_LOGOUT_ALL_SELF), logoutAllDevices);
router.patch("/update-profile", checkAuth, requirePermission(PERMISSIONS.USER_UPDATE_SELF), updateUserProfile);
router.patch("/update-password", checkAuth, requirePermission(PERMISSIONS.USER_UPDATE_SELF), updatePassword);
router.delete("/delete-account", checkAuth, requirePermission(PERMISSIONS.USER_DELETE_SELF), deleteUser);

export default router;