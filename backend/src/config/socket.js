const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const AppError = require("../utils/AppError");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    global.io = io;

    // JWT Authentication
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new AppError("Authentication Token missing..", 401));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            next(new AppError("Invalid or Expired Token", 401));
        }
    });

    // Handling the connection
    io.on("connection", (socket) => {
        const userId = socket.user.id;
        socket.join(`user:${userId}`);

        if (socket.user.role === 'admin') {
            socket.join("role:admin");
        }

        console.log(`User ${userId} connected.`);

        socket.on("disconnect", () => {
            console.log(`User ${userId} disconnected.`);
        });
    });

    return io;
};

module.exports = initializeSocket;
