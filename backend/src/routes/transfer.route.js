import express from "express";
import { transferMoney } from "../controllers/transfer.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, transferMoney); // ✅ FIXED

export default router;