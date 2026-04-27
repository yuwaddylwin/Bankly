import express from "express";
import { getTransactions} from "../controllers/transaction.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, (req, res, next) => {
  console.log("📦 Transaction route hit");
  next();
}, getTransactions);

export default router;