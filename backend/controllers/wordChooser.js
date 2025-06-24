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

export const getWord = async (req, resp) => {
    try {
        const wordLength = parseInt(req.params.wordLength);
        //console.log(wordLength);
        //const file = `${wordLength}letters.txt`;
        // const words = loadStrings(fileName);
        const words= await wordAccToLength(wordLength);
        //console.log(words);
        if (!words || words.length === 0) {
      return resp.status(404).json({ error: "No words found for this length" });
    }
        // fs.readFile(fileName, 'utf8', (err, data) => {
        //     if (err) {
        //     console.error('Error reading file:', err);
        //     return;
        //     }
        //     const words = data.split('\n').map(word => word.trim()).filter(Boolean); //converted all words into array
        //     const size = words.length;
            
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
