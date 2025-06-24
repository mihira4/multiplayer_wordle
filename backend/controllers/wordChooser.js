import User from "../models/user.js";
import dotenv from 'dotenv'; 
import fs from "fs";

export const getWord = async (req, resp) => {
    try {
        const wordLength = req.params.wordLength;
        const fileName = `${wordLength}letters.txt`;
        // const words = loadStrings(fileName);
        
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
            console.error('Error reading file:', err);
            return;
            }
            const words = data.split('\n').map(word => word.trim()).filter(Boolean); //converted all words into array
            const size = words.length;
            
            const randomIndex = Math.floor(Math.random() * size);
            let randomWord = words[randomIndex];
            randomWord = randomWord.toUpperCase();
            resp.setHeader('Content-Type', 'application/json');
            return resp.status(200).json({word: randomWord});
        })
    } catch (error) {
        console.log("error in finding a random word", error);
        // resp.json({"error": error.message});
    }
}

export const validWord=async(req,resp)=>{
    const guess=req.params.word;
    const length=req.params.wordLength;
    const file=`${length}letters.txt`;
    
    fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading word list:", err);
      return resp.status(500).json({ valid: false, error: err.message });
    }

    const validWords = data
      .split("\n")
      .map((w) => w.trim().toUpperCase())
      .filter(Boolean);

    const isValid = validWords.includes(guess);

    resp.status(200).json({ valid: isValid });
  });
};
