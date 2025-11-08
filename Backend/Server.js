import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./Config/db.js";
import redisClient from "./Config/redis.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes (example)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Database Connection
connectDb();

//connect to Redis
if (redisClient.isOpen) {
  console.log("Redis client is ready!");
}


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
