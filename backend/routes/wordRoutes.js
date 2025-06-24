import express from "express";
import { getWord } from "../controllers/wordChooser.js";

const router = express.Router();

router.get("/getWord/:wordLength", getWord);

export default router;