import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./Config/db.js";
import helmet from "helmet";
import redisclient from "./Config/redis.js";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { apiLimiter } from "./Middelwares/ratelimmiter.js";

dotenv.config();

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());

// Security middleware
app.use(helmet());
app.use(apiLimiter);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
export const io = new Server(server, {
  cors: {
    origin: "*", // Later replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("sendMessage", (data) => {
    // data = { senderId, receiverId, message }
    io.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Connect to database
connectDb();

// Connect to Redis

await redisclient.connect();

// Basic route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
