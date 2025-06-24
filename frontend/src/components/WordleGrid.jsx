import { useState, useEffect } from "react"
import "./WordleGrid.css"
import { BASE_URL } from "../../helper"

const WordleGrid = ({ wordLength = 5, gameStarted = false }) => {
  const [grid, setGrid] = useState([])
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)
  const [targetWord, setTargetWord] = useState("")
  const [letterStates, setLetterStates] = useState({})

  // Initialize grid when component mounts or wordLength changes
  useEffect(() => {
    const newGrid = Array(6)
      .fill()
      .map(() =>
        Array(wordLength)
          .fill()
          .map(() => ({
            letter: "",
            state: "empty", // empty, filled, correct, present, absent
          })),
      )
    setGrid(newGrid)
    setCurrentRow(0)
    setCurrentCol(0)
    setLetterStates({})
  }, [wordLength])

  useEffect(() => {
  const fetchWord = async () => {
    if (!gameStarted) return;

    try {
      const res = await fetch(`${BASE_URL}/word/getWord/${wordLength}`); // 👈 use backticks + inject variable
      const data = await res.json();
      //console.log(res.text());
      console.log(data);
      setTargetWord(data.word);
    } catch (error) {
      console.error("Failed to fetch word:", error);
    }
  };

  fetchWord();
}, [gameStarted, wordLength]); // 👈 also add wordLength as a dependency

  // Handle keyboard input
  const handleKeyPress = (event) => {
  if (!gameStarted) return;
  const key = event.key.toLowerCase();

  if (key === "enter") {
    handleSubmitRow();
  } else if (key === "backspace") {
    handleBackspace();
  } else if (key.match(/[a-z]/) && key.length === 1) {
    handleLetterInput(key.toUpperCase());
  }
};

    

  const handleLetterInput = (letter) => {
    if (currentCol < wordLength && currentRow < 6) {
      const newGrid = [...grid]
      newGrid[currentRow][currentCol] = {
        letter: letter,
        state: "filled",
      }
      setGrid(newGrid)
      setCurrentCol(currentCol + 1)
    }
  }

  const handleBackspace = () => {
    if (currentCol > 0) {
      const newGrid = [...grid]
      newGrid[currentRow][currentCol - 1] = {
        letter: "",
        state: "empty",
      }
      setGrid(newGrid)
      setCurrentCol(currentCol - 1)
    }
  }

  const handleSubmitRow = async() => {
    if (currentCol === wordLength && targetWord.length === wordLength) 
     
    {
      const guess = grid[currentRow].map(c => c.letter).join('');
      try {
      const res = await fetch(`${BASE_URL}/word/isValid/${guess}/${wordLength}`);
      const data = await res.json();

      if (!data.valid) {
        alert("❌ Not a valid word!");
        return; // Don't process further if invalid
      }
    } catch (err) {
      console.error("Error validating word:", err);
      alert("Something went wrong while validating the word.");
      return;
    }
      const newGrid = [...grid]
      const usedRow = newGrid[currentRow]
      const newLetterStates = { ...letterStates }
      const targetArr = targetWord.split("")

      // Mark correct
      usedRow.forEach((cell, i) => {
        if (cell.letter === targetArr[i]) {
          cell.state = "correct"
          newLetterStates[cell.letter] = "correct"
          targetArr[i] = null
        }
      })

      // Mark present or absent
      usedRow.forEach((cell, i) => {
        if (cell.state === "correct") return

        if (targetArr.includes(cell.letter)) {
          cell.state = "present"
          if (newLetterStates[cell.letter] !== "correct") {
            newLetterStates[cell.letter] = "present"
          }
          targetArr[targetArr.indexOf(cell.letter)] = null
        } else {
          cell.state = "absent"
          if (!newLetterStates[cell.letter]) {
            newLetterStates[cell.letter] = "absent"
          }
        }
      })

      setGrid(newGrid)
      setLetterStates(newLetterStates)
      setCurrentRow(currentRow + 1)
      setCurrentCol(0)
    }
  }

  const getCellClass = (cell, rowIndex, colIndex) => {
    let className = "grid-cell"

    if (cell.state === "empty") {
      className += " cell-empty"
    } else if (cell.state === "filled") {
      className += " cell-filled"
    } else if (cell.state === "correct") {
      className += " cell-correct"
    } else if (cell.state === "present") {
      className += " cell-present"
    } else if (cell.state === "absent") {
      className += " cell-absent"
    }

    // Add current cell highlight
    if (rowIndex === currentRow && colIndex === currentCol && gameStarted) {
      className += " cell-current"
    }

    return className
  }

  return (
    <div
      className="wordle-grid-container"
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <div className="wordle-grid" style={{ "--word-length": wordLength }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(cell, rowIndex, colIndex)}
              >
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      {gameStarted && (
        <>
          <div className="game-instructions">
            <p>Type letters and press Enter to submit your guess</p>
            <p>Use Backspace to delete letters</p>
          </div>

          <div className="keyboard">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
              <div
                key={letter}
                className={`key ${
                  letterStates[letter]
                    ? `key-${letterStates[letter]}`
                    : "key-unused"
                }`}
              >
                {letter}
              </div>
            ))}
          </div>

          {process.env.NODE_ENV === "development" && targetWord && (
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
              🔍 Target Word: {targetWord}
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default WordleGrid