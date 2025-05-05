import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "./models/User.js";
import Message from "./models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: ["http://localhost:5173"] },
});

// Store online users
const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A User Connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle message read receipts
  socket.on("messageRead", async (messageId) => {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { read: true },
        { new: true }
      );

      // Notify sender that the message has been read
      io.emit("updateMessageStatus", updatedMessage);
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", async () => {
    console.log("A User disconnected!", socket.id);

    if (!userId) return; // Prevent errors if userId is missing

    try {
      await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
    } catch (error) {
      console.error("Error updating last seen:", error);
    }

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
