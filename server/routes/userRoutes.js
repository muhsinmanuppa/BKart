import express from "express";
import { loginUser, updatePassword } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.put("/update-password", updatePassword); // Changed from POST to PUT

export default router;