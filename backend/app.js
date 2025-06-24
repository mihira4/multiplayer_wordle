import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./db.js";

dotenv.config();

const app = express();

app.use(cors);
app.use(express.json());