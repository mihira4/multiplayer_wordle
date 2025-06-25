import { io } from "socket.io-client";
import { BASE_URL } from "../../helper";

let socket = null;

export const initializeSocket = (token) => {
    if (socket) {
        console.warn("Socket already initialized. Use updateSocketToken for changes.");
        return socket;
    }

    socket = io(`${BASE_URL}`, {
        auth: { token },
        reconnection: true, // Enable auto-reconnection
        reconnectionAttempts: 5, // Number of reconnection attempts
        reconnectionDelay: 1000, // Delay between attempts in milliseconds
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });

    return socket;
};


export const updateSocketToken = (token) => {
    if (!socket) {
        console.error("Socket not initialized. Call initializeSocket first.");
        return;
    }

    socket.auth = { token }; // Update the token in auth
    socket.disconnect(); // Disconnect the socket
    socket.connect(); // Reconnect with the updated token
};

export const getSocket = () => {
    return socket;
};

export const reinitializeSocket = () => {
    const token = localStorage.getItem("token");
    if (token) {
        initializeSocket(token);
    } else {
        console.warn("No token found in localStorage. Socket will not be reinitialized.");
    }
};
