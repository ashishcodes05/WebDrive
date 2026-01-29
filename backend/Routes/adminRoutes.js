import express from "express";
import { toggleStatus, forceDelete, forceLogout, getAllUsers } from "../Controllers/adminController.js";

const router = express.Router();

router.get("/getAllUsers", getAllUsers);
router.post("/force-logout/:userId", forceLogout);
router.patch("/toggle-status/:userId", toggleStatus);
router.delete("/force-delete/:userId", forceDelete);

export default router;