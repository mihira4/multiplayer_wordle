"use client"

import { useState, useEffect, useRef } from "react"
import "./MultiplayerWordleGrid.css"
import { BASE_URL } from "../../../helper"
import { getSocket } from "../../store/socket"

const MultiplayerWordleGrid = ({ wordLength = 5, gameStarted = false, playerName, multiplayerAction, roomCode }) => {
  const [grid, setGrid] = useState([])
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)
  const [targetWord, setTargetWord] = useState("")
  const [letterStates, setLetterStates] = useState({})
  const [gameOver, setGameOver] = useState(false)
  const [invalidWordMessage, setInvalidWordMessage] = useState("")
  const [shakeRow, setShakeRow] = useState(-1)
  const [players, setPlayers] = useState([]) // New state for players list
  const hasFetched = useRef(false)
  const socket = getSocket()

  const gridRef = useRef(null)

  // Initialize grid when component mounts or wordLength changes
  useEffect(() => {
    const createRoom = () => {
      socket.emit("createRoom", { playerName, wordLength, roomCode }, (response) => {
        if (response.success) {
          setTargetWord(response.word)
        } else {
          alert("Failed to create room")
        }
      })
    }

    const joinRoom = () => {
      socket.emit("joinRoom", { playerName, roomCode }, (response) => {
        console.log("heres the response ---> ", response)
        if (response.success) {
          console.log("here's the response.word ---->", response.word)
          setTargetWord(response.word)
        } else {
          alert("Failed to join room")
        }
      })
    }

    socket.on("playerJoined", (response) => {
      // Update players list
      console.log("Players updated:", response.players)
      console.log("is it an array?", Array.isArray(response.players));
      setPlayers(response.players)
    })

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
    console.log(multiplayerAction)
    if (multiplayerAction === "create") createRoom()
    else joinRoom()
    setGrid(newGrid)
    setCurrentRow(0)
    setCurrentCol(0)
    setLetterStates({})
  }, [wordLength])

  useEffect(() => {
    if (gameStarted && gridRef.current) {
      gridRef.current.focus()
    }
  }, [gameStarted])

  const handleKeyPress = (event) => {
    if (!gameStarted || gameOver) return
    const key = event.key.toLowerCase()

    if (key === "enter") {
      handleSubmitRow()
    } else if (key === "backspace") {
      handleBackspace()
    } else if (key.match(/[a-z]/) && key.length === 1) {
      handleLetterInput(key.toUpperCase())
    }
  }

  const showInvalidWordMessage = (message) => {
    setInvalidWordMessage(message)
    setShakeRow(currentRow)

    setTimeout(() => {
      setInvalidWordMessage("")
      setShakeRow(-1)
    }, 2000)
  }

  const handleLetterInput = (letter) => {
    if (gameOver) return

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
    if (gameOver) return

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

  const handleSubmitRow = async () => {
    if (currentCol === wordLength && targetWord.length === wordLength) {
      const guess = grid[currentRow].map((c) => c.letter).join("")
      if (guess === targetWord) {
        const newGrid = [...grid]
        newGrid[currentRow].forEach((cell) => (cell.state = "correct"))
        setGrid(newGrid)
        setGameOver(true)
        return
      }
      try {
        const res = await fetch(`${BASE_URL}/word/isValid/${guess}/${wordLength}`)
        const data = await res.json()

        if (!data.valid) {
          showInvalidWordMessage("Not in word list")
          return
        }
      } catch (err) {
        console.error("Error validating word:", err)
        showInvalidWordMessage("Something went wrong")
        return
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

      setTimeout(() => {
        setLetterStates(newLetterStates)
        setCurrentRow(currentRow + 1)
        setCurrentCol(0)
      }, wordLength * 100) // Delay based on word length for smooth completion
    }
  }

  const getCellClass = (cell, rowIndex, colIndex) => {
    let className = "grid-cell"

    if (cell.state === "empty") {
      className += " cell-empty"
    } else if (cell.state === "filled") {
      className += " cell-filled"
    } else if (cell.state === "correct") {
      className += " cell-correct cell-reveal"
    } else if (cell.state === "present") {
      className += " cell-present cell-reveal"
    } else if (cell.state === "absent") {
      className += " cell-absent cell-reveal"
    }

    // Add current cell highlight
    if (rowIndex === currentRow && colIndex === currentCol && gameStarted) {
      className += " cell-current"
    }

    return className
  }

  const getRowClass = (rowIndex) => {
    let className = "grid-row"
    if (shakeRow === rowIndex) {
      className += " row-shake"
    }
    return className
  }

  return (
    <div ref={gridRef} className="wordle-grid-container" tabIndex={0} onKeyDown={handleKeyPress}>
      {/* Players Lobby Display */}
      {players.length > 0 && (
        <div className="players-lobby">
          <h3 className="lobby-title">Players in Lobby ({players.length})</h3>
          <div className="players-list">
            {players.map((player) => (
              <div
                key={player.id}
                className={`player-item ${player.name === playerName ? "current-player" : ""}`}
              >
                <div className="player-avatar">
                  {player.name ? player.name.charAt(0).toUpperCase() : "?"}
                </div>
                <span className="player-name">
                  {player.name || "Anonymous"}
                  {player.name === playerName && " (You)"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Game over message shown on top */}
      {gameOver && <div className="game-over-message">🎉 You guessed the word correctly!</div>}

      {/* Invalid word message */}
      {invalidWordMessage && <div className="invalid-word-message">{invalidWordMessage}</div>}

      <div className="wordle-grid" style={{ "--word-length": wordLength }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className={getRowClass(rowIndex)}>
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(cell, rowIndex, colIndex)}
                style={{
                  animationDelay: cell.state !== "empty" && rowIndex <= currentRow ? `${colIndex * 0.2}s` : "0s",
                }}
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
                className={`key ${letterStates[letter] ? `key-${letterStates[letter]}` : "key-unused"}`}
              >
                {letter}
              </div>
            ))}
          </div>

          {process.env.NODE_ENV === "development" && targetWord && (
            <p style={{ textAlign: "center", marginTop: "1rem" }}>🔍 Target Word: {targetWord}</p>
          )}
        </>
      )}
    </div>
  )
}

export default MultiplayerWordleGrid
