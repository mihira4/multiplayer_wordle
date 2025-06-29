import { Server } from "socket.io";
import { generateWord } from "./controllers/wordChooser.js";
import { verifySocketToken } from "./middleware/verifyToken.js";

let rooms = {};
let roomMessages={};

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          allowedHeaders: ["Authorization"],
          credentials: true,
        },
      });
      
      io.use(verifySocketToken);
      io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("createRoom", async ({wordLength, roomCode }, callback) => {
          const word = await generateWord(wordLength);
          const playerName = socket.user.username;
          console.log(`Room created with room code ${roomCode} by user ${playerName}`);
            rooms[roomCode] = {
              players: [{ id: socket.id, name: playerName }],
              wordLength,
              word
            }
            socket.join(roomCode);
            
            const room = rooms[roomCode];
            io.to(roomCode).emit("playerJoined", {players: room.players});

            callback({ success: true, roomCode, wordLength, word, playerName });
        })

        socket.on("joinRoom", ({ roomCode }, callback) => {
            const room = rooms[roomCode];
            const playerName = socket.user.username;
            console.log(`Room joined with room code ${roomCode} by user ${playerName}`);

           const alreadyJoined = room.players.some(player => player.name === playerName);
            if (!alreadyJoined) {
              room.players.push({ id: socket.id, name: playerName });
            }
            console.log(room);
            const word = room.word;

            socket.join(roomCode);

            const host=room.players[0].name;

            io.to(roomCode).emit("playerJoined", {players: room.players,message:`${playerName} joined!`});
            socket.emit("joinedRoom",{message:`you have joined ${host}'s room, welcome!`});
            callback({ success: true, roomCode, word, playerName});
        })

        socket.on("restartGame", async ({roomCode, wordLength}, callback) => {
          const room = rooms[roomCode];
          const word = await generateWord(wordLength);
          room.word = word;
          
          io.to(roomCode).emit("restartGame", {success: true, word});

          // callback({success: true, word});
        })

        socket.on("guessedWord",({roomCode})=>{
          const playerName=socket.user.username;
          socket.to(roomCode).emit("guessedNotif",{message:`${playerName} has guessed the word correctly!`});
        })

        socket.on("newMessage",({roomCode,text})=>{
          console.log("roomCode?", roomCode);
          console.log("data.text?",text);
          const sender=socket.user.username;
          const message={
            sender: sender,
            text: text,
            time:new Date().toISOString(),
          }
          if(!roomMessages[roomCode])
            roomMessages[roomCode]=[];//initialise kar do
          roomMessages[roomCode].push(message);
          io.to(roomCode).emit("messages",message);
        })

        socket.on("messageHistory",({roomCode},callback)=>{
          callback(roomMessages[roomCode]||[]);
        })
        
        socket.on("disconnect", () => {
          console.log("❌ A user disconnected:", socket.id);
        });
      });
    
      return io;
}