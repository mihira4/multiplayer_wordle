import fs from "fs";

const load=(fileName)=>{
    try {
    const data = fs.readFileSync(fileName, "utf8");
    return data
      .split("\n")
      .map((word) => word.trim().toUpperCase())
      .filter(Boolean);
  } catch (err) {
    console.error(` Failed to load ${fileName}:`, err.message);
    return [];
  }
}

export const fourLetter=load("4letters.txt");
export const fiveLetter=load("5letters.txt");
export const sixLetter=load("6letters.txt");
export const sevenLetter=load("7letters.txt");

console.log("loaded all words");