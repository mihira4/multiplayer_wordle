import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./db.js";
import authRoutes from "./routes/authRoutes.js"

dotenv.config();

const app = express();

app.use(cors);
app.use(express.json());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 6007;
app.listen(PORT, async () => {
  await connectDb();
  console.log(`🚀 Server running on port ${PORT}`);
});