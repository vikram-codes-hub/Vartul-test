import express from 'express';
import "dotenv/config";
import http from 'http';
import cors from "cors";
import { connectDb } from './lib/db.js';
import userRouter from './Routes/UserRoute.js';
import messageRouter from './Routes/Messageroute.js';
import { Server } from 'socket.io';
import User from './Models/User.js'

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Socket.io setup
export const io = new Server(server, {
  cors: { origin: "*" }
});

// Store mapping of userId => socketId
export const UserSocketMap = {};

// Socket.io connection handler
io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.log("❌ No userId provided in handshake");
    return;
  }

  console.log("🟢 User connected:", userId);

  //  Add user to socket map
  UserSocketMap[userId] = socket.id;

  //  Update user's lastSeen to "now" (connected)
  try {
    await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
  } catch (err) {
    console.error("⚠️ Error updating lastSeen on connect:", err.message);
  }

  // 3 Emit all online user IDs
  io.emit("getOnlineUsers", Object.keys(UserSocketMap));

  //  Handle disconnection
  socket.on("disconnect", async () => {
    console.log("🔴 User disconnected:", userId);

    delete UserSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(UserSocketMap));

    //  Update lastSeen when user goes offline
    try {
      await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
      console.log(`🕓 Updated lastSeen for ${userId}`);
    } catch (err) {
      console.error("⚠️ Error updating lastSeen on disconnect:", err.message);
    }
  });

  //  Message relay
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = UserSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        senderId,
        message,
      });
    }
  });
});

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// DB connection and server start
await connectDb();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default server;
