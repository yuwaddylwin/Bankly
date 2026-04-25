import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import transferRoutes from "./routes/transfer.route.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/transfer", transferRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);


app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});