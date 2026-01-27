import express from "express";
import { githubLogin, githubRedirectURI, googleLogin, sendOtp, verifyOtp } from "../Controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/google-login", googleLogin);
router.get("/github", githubRedirectURI);
router.get("/github/callback", githubLogin);

export default router;