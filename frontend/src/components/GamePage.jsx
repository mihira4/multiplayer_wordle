"use client"

import { useState, useEffect } from "react"
import WordleGrid from "./GameGrids/WordleGrid"
import "./GamePage.css"
import Header from "./Header"
import { useNavigate } from "react-router-dom"
import MultiplayerWordleGrid from "./GameGrids/MultiplayerWordleGrid"

const GamePage = () => {
  const navigate = useNavigate()
  const [wordLength, setWordLength] = useState(5)
  const [gameStarted, setGameStarted] = useState(false)
  const [showSettings, setShowSettings] = useState(true)
  const [gameMode, setGameMode] = useState("single") // "single" or "multiplayer"
  const [multiplayerAction, setMultiplayerAction] = useState("") // "create" or "join"
  const [roomCode, setRoomCode] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [showCopyNotification, setShowCopyNotification] = useState(false)

  const handleStartGame = () => {
    setGameStarted(true)
    setShowSettings(false)
  }

  const handleNewGame = () => {
    setGameStarted(false)
    setShowSettings(true)
    setGameMode("single")
    setMultiplayerAction("")
    setRoomCode("")
    setPlayerName("")
  }

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreateRoom = () => {
    const newRoomCode = generateRoomCode()
    setRoomCode(newRoomCode)
    setMultiplayerAction("create")
  }

  const handleCopyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setShowCopyNotification(true)
    } catch (err) {
      console.error("Failed to copy room code:", err)
    }
  }

  // Hide copy notification after 2 seconds
  useEffect(() => {
    if (showCopyNotification) {
      const timer = setTimeout(() => {
        setShowCopyNotification(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showCopyNotification])

  const canStartGame = () => {
    if (gameMode === "single") return true
    if (gameMode === "multiplayer") {
      if (multiplayerAction === "create") return playerName.trim() !== ""
      if (multiplayerAction === "join") return playerName.trim() !== "" && roomCode.trim() !== ""
    }
    return false
  }

  return (
    <div className="game-page">
      <Header />
      <div className="game-header">{/* Remove the new game button from here */}</div>

      {/* Copy Notification */}
      {showCopyNotification && (
        <div className="copy-notification">
          <span>Room code copied!</span>
        </div>
      )}

      {showSettings && (
        <div className="game-settings">
          <div className="settings-card">
            <h2>Game Settings</h2>

            <div className="form-group">
              <label className="form-label">Game Mode</label>
              <select
                className="form-select"
                value={gameMode}
                onChange={(e) => {
                  setGameMode(e.target.value)
                  setMultiplayerAction("")
                  setRoomCode("")
                  setPlayerName("")
                }}
              >
                <option value="single">Single Player</option>
                <option value="multiplayer">Multiplayer</option>
              </select>
            </div>

            {gameMode === "multiplayer" && (
              <>
                <div className="form-group">
                  <label className="form-label">Player Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={20}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Multiplayer Options</label>
                  <div className="multiplayer-buttons">
                    <button
                      className={`multiplayer-option-btn ${multiplayerAction === "create" ? "active" : ""}`}
                      onClick={handleCreateRoom}
                    >
                      Create Room
                    </button>
                    <button
                      className={`multiplayer-option-btn ${multiplayerAction === "join" ? "active" : ""}`}
                      onClick={() => {
                        setMultiplayerAction("join")
                        setRoomCode("")
                      }}
                    >
                      Join Room
                    </button>
                  </div>
                </div>

                {multiplayerAction === "create" && roomCode && (
                  <div className="room-code-display">
                    <label className="form-label">Room Code</label>
                    <div className="room-code">
                      <span className="room-code-text">{roomCode}</span>
                      <button className="copy-btn" onClick={handleCopyRoomCode}>
                        Copy
                      </button>
                    </div>
                    <p className="room-code-info">Share this code with your friends!</p>
                  </div>
                )}

                {multiplayerAction === "join" && (
                  <div className="form-group">
                    <label className="form-label">Room Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter room code"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      maxLength={6}
                    />
                  </div>
                )}
              </>
            )}

            {gameMode === "single" ||
              (multiplayerAction === "create" && (
                <div className="form-group">
                  <label className="form-label">Word Length</label>
                  <select
                    className="form-select"
                    value={wordLength}
                    onChange={(e) => setWordLength(Number(e.target.value))}
                  >
                    <option value={4}>4 Letters</option>
                    <option value={5}>5 Letters</option>
                    <option value={6}>6 Letters</option>
                    <option value={7}>7 Letters</option>
                  </select>
                </div>
              ))}

            {(gameMode === "single" || multiplayerAction === "create") && (
              <div className="difficulty-info">
                <p className="difficulty-text">
                  {wordLength === 4 && "Easy - Perfect for beginners"}
                  {wordLength === 5 && "Classic - The original Wordle experience"}
                  {wordLength === 6 && "Hard - For experienced players"}
                  {wordLength === 7 && "Expert - Ultimate challenge"}
                </p>
              </div>
            )}

            <button
              className={`start-button ${!canStartGame() ? "disabled" : ""}`}
              onClick={handleStartGame}
              disabled={!canStartGame()}
            >
              {gameMode === "single" ? "Start Game" : "Start Multiplayer Game"}
            </button>
          </div>
        </div>
      )}

      {gameStarted && gameMode === "single" && <WordleGrid wordLength={wordLength} gameStarted={gameStarted} />}

      {gameStarted && gameMode !== "single" && (
        <MultiplayerWordleGrid
          wordLength={wordLength}
          gameStarted={gameStarted}
          playerName={playerName}
          multiplayerAction={multiplayerAction}
          roomCode={roomCode}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  )
}

export default GamePage
