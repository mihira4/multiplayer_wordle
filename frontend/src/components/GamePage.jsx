"use client"

import { useState } from "react"
import WordleGrid from "./WordleGrid"
import "./GamePage.css"
import Header from "./Header"

const GamePage = () => {
  const [wordLength, setWordLength] = useState(5)
  const [gameStarted, setGameStarted] = useState(false)
  const [showSettings, setShowSettings] = useState(true)

  const handleStartGame = () => {
    setGameStarted(true)
    setShowSettings(false)
  }

  const handleNewGame = () => {
    setGameStarted(false)
    setShowSettings(true)
  }

  return (
    <div className="game-page">
      <Header/>
      <div className="game-header">
       

        {gameStarted && (
          <button className="new-game-btn" onClick={handleNewGame}>
            New Game
          </button>
        )}
      </div>

      {showSettings && (
        <div className="game-settings">
          <div className="settings-card">
            <h2>Game Settings</h2>

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

            <div className="difficulty-info">
              <p className="difficulty-text">
                {wordLength === 4 && "Easy - Perfect for beginners"}
                {wordLength === 5 && "Classic - The original Wordle experience"}
                {wordLength === 6 && "Hard - For experienced players"}
                {wordLength === 7 && "Expert - Ultimate challenge"}
              </p>
            </div>

            <button className="start-button" onClick={handleStartGame}>
              Start Game
            </button>
          </div>
        </div>
      )}

      {gameStarted && <WordleGrid wordLength={wordLength} gameStarted={gameStarted} />}
    </div>
  )
}

export default GamePage;
