"use client"

import { useState, useEffect } from "react"
import "./WordleGrid.css"

const WordleGrid = ({ wordLength = 5, gameStarted = false }) => {
  const [grid, setGrid] = useState([])
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)

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
  }, [wordLength])

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

  const handleSubmitRow = () => {
    if (currentCol === wordLength) {
      // Here you would check the word against the target word
      // For demo purposes, we'll just move to the next row
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
      <div className="game-instructions">
        <p>Type letters and press Enter to submit your guess</p>
        <p>Use Backspace to delete letters</p>
      </div>
    )}
  </div>
);
}

export default WordleGrid;
