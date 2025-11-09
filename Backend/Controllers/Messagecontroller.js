// messageController.js
import Message from "../Models/Message.js";
import Conversation from "../Models/Conversation.js";
import cloudinary from "../Config/cloudinary.js"; // for media uploads

//  Send a new message (text, image, video, etc.)
export const sendMessage = async (req, res) => {
  // Creates or finds a conversation between sender & receiver
  // Saves new message and updates conversation lastMessage
};

//get users for sidebar
export const getChatUsers = async (req, res) => {
    
}
//  Get all messages between two users (conversation chat)
export const getMessages = async (req, res) => {
  // Fetches all messages by conversationId or between two users
  // Sorted by time (oldest → newest)
};

//  Mark all messages as read when user opens chat
export const markAsRead = async (req, res) => {
  // Updates isRead = true for all messages where receiver is current user
  // Also resets unread count in conversation
};

//  Delete a single message
export const deleteMessage = async (req, res) => {
  // Allows sender to delete their own message
  // Removes message and optionally updates lastMessage in conversation
};

//  Get all conversations for the logged-in user (Inbox view)
export const getConversations = async (req, res) => {
  // Fetches all conversations where current user is a participant
  // Populates the other user's info and last message preview
};

//  Delete a whole conversation thread
export const deleteConversation = async (req, res) => {
  // Deletes a conversation and its associated messages
  // Or marks as deleted for that user (soft delete option)
};

//  Upload chat media (image, video, file)
export const uploadChatMedia = async (req, res) => {
  // Handles file uploads using Cloudinary
  // Returns secure media URL to be used when sending a message
};

//  Get total unread message count for the logged-in user
export const getUnreadCount = async (req, res) => {
  // Counts all unread messages across all conversations
  // Returns total count for notification badges
};

//  Emit realtime message event (for socket.io)
export const emitMessage = async (req, res) => {
  // Optional: Triggers socket event to deliver message instantly
};

//  Receive new incoming message event (socket listener)
export const receiveMessage = async (req, res) => {
  // Optional: Handles receiving messages in realtime via socket
};
