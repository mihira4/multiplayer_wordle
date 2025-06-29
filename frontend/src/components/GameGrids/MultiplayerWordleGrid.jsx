"use client"

import { useState, useEffect, useRef } from "react"
import "./MultiplayerWordleGrid.css"
import { BASE_URL } from "../../../helper"
import { getSocket } from "../../store/socket"

const MultiplayerWordleGrid = ({
  wordLength = 5,
  gameStarted = false,
  multiplayerAction,
  roomCode,
  onNewGame,
}) => {
  const [grid, setGrid] = useState([])
  const [currentRow, setCurrentRow] = useState(0)
  const [currentCol, setCurrentCol] = useState(0)
  const [targetWord, setTargetWord] = useState("")
  const [letterStates, setLetterStates] = useState({})
  const [gameOver, setGameOver] = useState(false)
  const [invalidWordMessage, setInvalidWordMessage] = useState("")
  const [shakeRow, setShakeRow] = useState(-1)
  const [players, setPlayers] = useState([]) // New state for players list
  const [playerName, setPlayerName] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [lobbyChat, setLobbyChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [roomLeaderboard, setRoomLeaderboard] = useState([]);

  const hasFetched = useRef(false)
  const socket = getSocket()

  const gridRef = useRef(null)

  const sendLobbyMessage = () => {
  if (chatInput.trim()) {
    socket.emit("newMessage", {roomCode, text: chatInput.trim() });
    setChatInput("");
  }
};

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};


useEffect(() => {
  if (gameStarted) setStartTime(Date.now());
}, [gameStarted]);

  // Initialize grid when component mounts or wordLength changes
  useEffect(() => {
    const createRoom = () => {
      socket.emit("createRoom", {wordLength, roomCode }, (response) => {
        if (response.success) {
          setTargetWord(response.word)
          setPlayerName(response.playerName);
        } else {
          alert("Failed to create room")
        }
      })
    }

    const handleMessage = (msg) => {
    setLobbyChat((prev) => [...prev, msg]);
  };

    const joinRoom = () => {
      socket.emit("joinRoom", {roomCode }, (response) => {
        if (response.success) {
          setTargetWord(response.word);
          setPlayerName(response.playerName);
        } else {
          alert("Failed to join room")
        }
      })
    }

    socket.on("playerJoined", (response) => {
      // Update players list
      setNotificationMessage(response.message);
         setTimeout(() => {
         setNotificationMessage("");
          }, 5000);
      console.log("Players updated:", response.players)
      console.log("is it an array?", Array.isArray(response.players))
      setPlayers(response.players)
    })

    socket.on("joinedRoom",(data)=>{
      console.log("joined room notif now");
      setNotificationMessage(data.message);
         setTimeout(() => {
         setNotificationMessage("");
          }, 5000);
        })

    socket.on("guessedNotif",(data)=>{
         setNotificationMessage(data.message);
         setTimeout(() => {
         setNotificationMessage("");
          }, 5000);
        })

    socket.emit("messageHistory",{roomCode},(response)=>{
      setLobbyChat(response);
    })

    socket.on("messages", handleMessage);

    socket.on("getRoomLeaderboard", (leaderboard) => {
    setRoomLeaderboard(leaderboard);
  });

    socket.on("restartGame", (response) => {
      if (response.success) {
        setTargetWord(response.word)

        // Reset all game state
        const newGrid = Array(6)
          .fill()
          .map(() =>
            Array(wordLength)
              .fill()
              .map(() => ({
                letter: "",
                state: "empty",
              })),
          )

        setGrid(newGrid)
        setCurrentRow(0)
        setCurrentCol(0)
        setLetterStates({})
        setGameOver(false)
        setInvalidWordMessage("")
        setShakeRow(-1)
        setRoomLeaderboard([]);
      } else {
        alert("Failed to restart game")
      }
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
    
    return () => {
    socket.off("messages", handleMessage); // Clean up on unmount
  };

  }, [wordLength])

  useEffect(() => {
    if (gameStarted && gridRef.current) {
      gridRef.current.focus()
    }
  }, [gameStarted])

  const handleKeyPress = (event) => {
    if (
    !gameStarted ||
    gameOver ||
    document.activeElement.tagName === "INPUT" ||
    document.activeElement.tagName === "TEXTAREA"
  ) {
    return;
  }
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
        const time = formatTime(Date.now() - startTime);
        const newGrid = [...grid]
        newGrid[currentRow].forEach((cell) => (cell.state = "correct"))
        setGrid(newGrid)
        setGameOver(true)

        socket.emit("guessedWord",{roomCode,time});
        

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

  const handleRestartGame = () => {
    socket.emit("restartGame", { roomCode, wordLength })
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
            <div key={player.id} className={`player-item ${player.name === playerName ? "current-player" : ""}`}>
              <div className="player-avatar">{player.name ? player.name.charAt(0).toUpperCase() : "?"}</div>
              <span className="player-name">
                {player.name || "Anonymous"}
                {player.name === playerName && " (You)"}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Unified Game Controls */}
    {gameStarted && (
      <div className="game-controls-corner">
        {multiplayerAction === "create" && (
          <button className="control-btn restart-btn" onClick={handleRestartGame}>
            <span className="btn-text">Restart</span>
          </button>
        )}
        <button className="control-btn new-game-btn" onClick={onNewGame}>
          <span className="btn-text">New Game</span>
        </button>
      </div>
    )}

    {/* Game Status Messages */}
    {gameOver && <div className="game-over-message">🎉 You guessed the word correctly!</div>}
    {invalidWordMessage && <div className="invalid-word-message">{invalidWordMessage}</div>}
    {notificationMessage && (
      <div className="notification-banner">{notificationMessage}</div>
    )}

    {/* Word Grid */}
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

    {/* Game Instructions + Keyboard */}
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

    {/* ✅ Lobby Chat Section */}
    <div className="lobby-chat-container">
      <h3 className="lobby-title">💬 Lobby Chat</h3>
      <div className="lobby-chat-box">
        {lobbyChat.map((msg, index) => (
          <div
            key={index}
            className={`lobby-chat-message ${msg.sender === playerName ? "own-message" : "other-message"}`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="lobby-chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendLobbyMessage()}
        />
        <button onClick={sendLobbyMessage}>Send</button>
      </div>
    </div>

    <div className="leaderboard-container">
  <h3>🏅 Room Leaderboard</h3>
  <table>
    <thead>
      <tr>
        <th>Position</th>
        <th>Player</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      {roomLeaderboard.map((entry, index) => (
        <tr key={index}>
          <td>{entry.position}</td>
          <td>{entry.name}</td>
          <td>{entry.time}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  </div>


)
}
export default MultiplayerWordleGrid
