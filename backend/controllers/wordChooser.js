import User from "../models/user.js";
import dotenv from 'dotenv'; 
import fs from "fs";
import { fourLetter,fiveLetter,sevenLetter,sixLetter } from "./wordToArray.js";
//console.log(sevenLetter);
const wordAccToLength=async(length)=>{
    switch (length){
        case 4:
            return fourLetter;
        case 5:
            return fiveLetter;
        case 6:
            return sixLetter;
        case 7:
            return sevenLetter;
        default:
            return [];
    }
}

// not for api, just a function (for socket)
export const generateWord = async (wordLength) => {
    console.log(wordLength);
    const words = await wordAccToLength(wordLength);

    const randomIndex = Math.floor(Math.random() * words.length);
    let randomWord = words[randomIndex];
    console.log(randomWord);
    // randomWord = randomWord.toUpperCase();
    return randomWord;
}

export const getWord = async (req, resp) => {
    try {
        const wordLength = parseInt(req.params.wordLength);
        const words = await wordAccToLength(wordLength);
        if (!words || words.length === 0) {
      return resp.status(404).json({ error: "No words found for this length" });
    }
            const randomIndex = Math.floor(Math.random() * words.length);
            let randomWord = words[randomIndex];
            randomWord = randomWord.toUpperCase();
            resp.setHeader('Content-Type', 'application/json');
            return resp.status(200).json({word: randomWord});
        
    } catch (error) {
        console.log("error in finding a random word", error);
        // resp.json({"error": error.message});
    }
}

export const validWord=async(req,resp)=>{
    const guess=req.params.word;
    const length=parseInt(req.params.wordLength);
    //const file=`${length}letters.txt`;
    const words=await wordAccToLength(length);
    // fs.readFile(file, "utf8", (err, data) => {
    // if (err) {
    //   console.error("Error reading word list:", err);
    //   return resp.status(500).json({ valid: false, error: err.message });
    // }

    // const validWords = data
    //   .split("\n")
    //   .map((w) => w.trim().toUpperCase())
    //   .filter(Boolean);

    const isValid = words.includes(guess);

    resp.status(200).json({ valid: isValid });
  }
