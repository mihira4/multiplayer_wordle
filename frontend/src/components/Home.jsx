import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [wordLength, setWordLength] = useState(5);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!username) return alert("Please enter your name");
    const generatedRoom = Math.random().toString(36).substring(2, 7).toUpperCase();
    navigate(`/game/${generatedRoom}?name=${username}&length=${wordLength}`);
  };

  const handleJoinRoom = () => {
    if (!username || !roomCode) return alert("Please fill all fields");
    navigate(`/game/${roomCode.toUpperCase()}?name=${username}&length=${wordLength}`);
  };

  return (
    <div className="home-container">
      <h1>🟩 Multiplayer Wordle</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="home-input"
      />
      <select
        value={wordLength}
        onChange={(e) => setWordLength(Number(e.target.value))}
        className="home-select"
      >
        {[4, 5, 6, 7].map((len) => (
          <option key={len} value={len}>{len}-Letter Words</option>
        ))}
      </select>
      <div className="room-section">
        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="home-input"
        />
        <button onClick={handleJoinRoom} className="home-button">Join Room</button>
      </div>
      <div className="divider">or</div>
      <button onClick={handleCreateRoom} className="home-button primary">Create New Room</button>
    </div>
  );
};

export default Home;
