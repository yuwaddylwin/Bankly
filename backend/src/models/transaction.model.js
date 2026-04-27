// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: Number,
  fee: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);