import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: {}, 
  },
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis Cloud successfully!");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});


export default redisClient;
