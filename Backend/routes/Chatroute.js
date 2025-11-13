import express from "express";
const chatRouter = express.Router();

import {
  sendMessage,
  getChatUsers,
  getMessages,
  deleteMessage,
  deleteConversation,
} from "../Controllers/MessageController.js";

import { isLoggedIn } from "../Middelwares/Isloggeddin.js";

// 💬 Send message
chatRouter.post("/send/:userId", isLoggedIn, sendMessage);

// 👥 Get sidebar users
chatRouter.get("/users", isLoggedIn, getChatUsers);

// 📩 Get messages with pagination
chatRouter.get("/messages/:selecteduserId", isLoggedIn, getMessages);

// ❌ Delete a single message
chatRouter.delete("/delete/message/:messageId", isLoggedIn, deleteMessage);

// ❌ Delete whole conversation
chatRouter.delete("/delete/conversation/:userId", isLoggedIn, deleteConversation);

export default chatRouter;
