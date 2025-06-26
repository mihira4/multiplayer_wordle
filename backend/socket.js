import { Server } from "socket.io";
import { generateWord } from "./controllers/wordChooser.js";

let rooms = {};

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          allowedHeaders: ["Authorization"],
          credentials: true,
        },
      });

      io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("createRoom", async ({ playerName, wordLength, roomCode }, callback) => {

            console.log(`Room created with room code ${roomCode} by user ${socket.id}`);
            const word = await generateWord(wordLength);
            rooms[roomCode] = {
              players: [{ id: socket.id, name: playerName }],
              wordLength,
              word
            }
            socket.join(roomCode);
            socket.data.roomCode = roomCode;
            socket.data.playerName = playerName;

            callback({ success: true, roomCode, wordLength, word });
        })

        socket.on("joinRoom", ({playerName, roomCode }, callback) => {
            const room = rooms[roomCode];
            console.log(`Room joined with room code ${roomCode} by user ${socket.id}`);

           const alreadyJoined = room.players.some(player => player.id === socket.id);
            if (!alreadyJoined) {
              room.players.push({ id: socket.id, name: playerName });
            }
            console.log(room);
            const word = room.word;

            socket.join(roomCode);
            socket.data.roomCode = roomCode;
            socket.data.playerName = playerName;

            io.to(roomCode).emit("playerJoined", {players: room.players});

            callback({ success: true, roomCode, word});
        })

        socket.on("disconnect", () => {
          console.log("❌ A user disconnected:", socket.id);
        });
      });
    
      return io;
}