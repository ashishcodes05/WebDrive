import express from "express";
import checkAuth from "../Middlewares/auth.js";
import { createUser, getUser, loginUser, logoutUser, logoutAllDevices, updateUserProfile, updatePassword, deleteUser, getAllUsers } from "../Controllers/userController.js";
const router = express.Router();

router.get("/", checkAuth, getUser);
router.get("/getAllUsers", getAllUsers);
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", checkAuth, logoutUser);
router.post("/logoutAll", checkAuth, logoutAllDevices);
router.patch("/update-profile", checkAuth, updateUserProfile);
router.patch("/update-password", checkAuth, updatePassword);
router.delete("/delete-account", checkAuth, deleteUser);

export default router;