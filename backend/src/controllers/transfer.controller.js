import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";
import mongoose from "mongoose";

export const transferMoney = async (req, res) => {
  const { receiverAcc, amount } = req.body;
  const senderId = req.user.id; // ✅ from token

  if (!receiverAcc) {
  throw new Error("Receiver account required");
}

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await User.findById(senderId).session(session);
    const receiver = await User.findOne({
      accountNumber: receiverAcc,
    }).session(session);

    if (!sender) throw new Error("Sender not found");
    if (!receiver) throw new Error("Receiver not found");

    if (sender.accountNumber === receiver.accountNumber) {
      throw new Error("Cannot transfer to yourself");
    }

    if (sender.balance < amount) {
      throw new Error("Insufficient balance");
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({ session });
    receiver.notifications.push({
    message: `You received ${amount} THB from ${sender.fullName}`,
    });

    await receiver.save({ session });

    const transactionId = "TXN" + Date.now();

    await Transaction.create(
      [
        {
          transactionId,
          sender: sender._id,
          receiver: receiver._id,
          amount,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Transfer successful",
      transactionId,
      receiver: {
        fullName: receiver.fullName,
        accountNumber: receiver.accountNumber,
      },
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};