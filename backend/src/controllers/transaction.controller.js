import Transaction from "../models/transaction.model.js";

export const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "fullName accountNumber")
      .populate("receiver", "fullName accountNumber")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};