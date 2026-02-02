import express from "express";
import { generateToken, getSharedFiles, validateTokenAndViewFile } from "../Controllers/shareController.js";
import { checkShareAuth, checkAuth } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/generate-token", checkAuth, generateToken);
router.get("/file/:token",checkShareAuth , validateTokenAndViewFile);
router.get("/files", getSharedFiles);

export default router;