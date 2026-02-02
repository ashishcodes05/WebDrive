import express from "express";
import { githubLogin, githubRedirectURI, googleLogin, importFromGoogleDrive, sendOtp, verifyOtp } from "../Controllers/authController.js";
import {checkAuth }from "../Middlewares/authMiddleware.js";
const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/google-login", googleLogin);
router.get("/github", githubRedirectURI);
router.get("/github/callback", githubLogin);
router.post("/import/google-drive/{:dirId}", checkAuth, importFromGoogleDrive);

export default router;