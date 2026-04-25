import express from "express";
import { getUserByAccount } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/account/:accountNumber", getUserByAccount);

export default router;