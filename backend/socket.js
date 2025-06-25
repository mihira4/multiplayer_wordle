import { Server } from "socket.io";

let users = [];

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
    
        socket.on("disconnect", () => {
          console.log("❌ A user disconnected:", socket.id);
          io.emit("getUsers", users);
        });
      });
    
      return io;
}