import express from "express";
import { getUserByAccount } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/account/:accountNumber", getUserByAccount);

// For QR
router.get("/qr/:accountNumber", async (req, res) => {
  try {
    const user = await User.findOne({
      accountNumber: req.params.accountNumber,
    }).select("fullName accountNumber");

    if (!user) return res.status(404).json({ message: "Not found" });

    res.json({
      accountNumber: user.accountNumber,
      fullName: user.fullName,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
