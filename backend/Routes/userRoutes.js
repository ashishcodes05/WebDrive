import express from "express";
import checkAuth from "../Middlewares/auth.js";
import { createUser, getUser, loginUser, logoutUser } from "../Controllers/userController.js";
const router = express.Router();

router.get("/", checkAuth, getUser);
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", checkAuth, logoutUser);

export default router;