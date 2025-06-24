import express from "express";
import { getWord,validWord } from "../controllers/wordChooser.js";

const router = express.Router();

router.get("/getWord/:wordLength", getWord);
router.get("/isValid/:word/:wordLength", validWord);

export default router;