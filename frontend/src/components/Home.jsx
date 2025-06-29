// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Home.css";

// const Home = () => {
//   const [username, setUsername] = useState("");
//   const [roomCode, setRoomCode] = useState("");
//   const [wordLength, setWordLength] = useState(5);
//   const navigate = useNavigate();

//   const handleCreateRoom = () => {
//     if (!username) return alert("Please enter your name");
//     const generatedRoom = Math.random().toString(36).substring(2, 7).toUpperCase();
//     navigate(`/game/${generatedRoom}?name=${username}&length=${wordLength}`);
//   };

//   const handleJoinRoom = () => {
//     if (!username || !roomCode) return alert("Please fill all fields");
//     navigate(`/game/${roomCode.toUpperCase()}?name=${username}&length=${wordLength}`);
//   };

//   return (
//     <div className="home-container">
//       <h1>🟩 Multiplayer Wordle</h1>
//       <input
//         type="text"
//         placeholder="Enter your name"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         className="home-input"
//       />
//       <select
//         value={wordLength}
//         onChange={(e) => setWordLength(Number(e.target.value))}
//         className="home-select"
//       >
//         {[4, 5, 6, 7].map((len) => (
//           <option key={len} value={len}>{len}-Letter Words</option>
//         ))}
//       </select>
//       <div className="room-section">
//         <input
//           type="text"
//           placeholder="Enter Room Code"
//           value={roomCode}
//           onChange={(e) => setRoomCode(e.target.value)}
//           className="home-input"
//         />
//         <button onClick={handleJoinRoom} className="home-button">Join Room</button>
//       </div>
//       <div className="divider">or</div>
//       <button onClick={handleCreateRoom} className="home-button primary">Create New Room</button>
//     </div>
//   );
// };

// export default Home;

// "use client"

import { useState } from "react"
import "./Home.css"
import { useNavigate } from "react-router-dom";


const HomePage = () => {
  const [selectedLength, setSelectedLength] = useState(5)
  
  const navigate = useNavigate();
  const handleStartGame = () => {
    console.log(`Starting game with ${selectedLength} letter words`);
    navigate("/game");
    // Add your game start logic here
  }

  return (
    <div className="home-container">
      <div className="home-card">
        
<h1 className="wordle-title">
  <span className="letter-green">W</span>
  <span className="letter-yellow">O</span>
  <span className="letter-gray">R</span>
  <span className="letter-green">D</span>
  <span className="letter-yellow">L</span>
  <span className="letter-gray">E</span>
</h1>
        

        <p className="subtitle">Choose your challenge and start playing</p>

        <div className="form-group">
          <label className="form-label">Word Length</label>
          <select
            className="form-select"
            value={selectedLength}
            onChange={(e) => setSelectedLength(Number(e.target.value))}
          >
            <option value={4}>4 Letters</option>
            <option value={5}>5 Letters</option>
            <option value={6}>6 Letters</option>
            <option value={7}>7 Letters</option>
          </select>
        </div>

        <div className="difficulty-info">
          <p className="difficulty-text">
            {selectedLength === 4 && "Easy - Perfect for beginners"}
            {selectedLength === 5 && "Classic - The original Wordle experience"}
            {selectedLength === 6 && "Hard - For experienced players"}
            {selectedLength === 7 && "Expert - Ultimate challenge"}
          </p>
        </div>

        <button className="start-button" onClick={handleStartGame}>
          Start Game
        </button>

      </div>
    </div>
  )
}

export default HomePage
