import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

import { initializeSocket } from "./socket.js";

import { connectDb } from "./db.js";
import authRoutes from "./routes/authRoutes.js"
import wordRoutes from "./routes/wordRoutes.js"


dotenv.config();

const app = express();
const server = http.createServer(app);
initializeSocket(server);

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/word", wordRoutes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, async () => {
  await connectDb();
  console.log(`🚀 Server running on port ${PORT}`);
});