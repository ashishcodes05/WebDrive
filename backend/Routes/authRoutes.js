import express from "express";
import { googleLogin, sendOtp, verifyOtp } from "../Controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/google-login", googleLogin);

export default router;