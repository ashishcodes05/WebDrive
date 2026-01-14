import express from "express";
import checkAuth from "../Middlewares/auth.js";
import { createUser, getUser, loginUser, logoutUser, logoutAllDevices } from "../Controllers/userController.js";
const router = express.Router();

router.get("/", checkAuth, getUser);
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", checkAuth, logoutUser);
router.post("/logoutAll", checkAuth, logoutAllDevices);

export default router;