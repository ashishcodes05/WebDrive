import express from "express";
import { generateToken, validateTokenAndViewFile } from "../Controllers/shareController.js";

const router = express.Router();

router.post("/generate-token", generateToken);
router.get("/file/:token", validateTokenAndViewFile);

export default router;