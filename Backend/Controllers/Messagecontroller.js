import Message from "../Models/Message.js";
import Conversation from "../Models/Conversation.js";
import cloudinary from "../Config/cloudinary.js";
import { io, UserSocketMap } from "../Server.js"
import User from "../Models/User.js";

export const sendMessage = async (req, res) => {
  try {
    const { image, text } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.userId;

    // 1 Find or create conversation between sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        lastMessage: text || "Media message",
      });
    }

    let mediaUrl = null;
    let messageType = "text";

    //  Handle media upload 
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      mediaUrl = uploadRes.secure_url;
      messageType = "image";
    }

    //  Create message linked to this conversation
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      messageType,
      text,
      mediaUrl,
    });

    //  Update conversation’s last message preview
    conversation.lastMessage = text || "Media message";
    await conversation.save();

    //  Emit real-time message to receiver
    const receiverSocketId = UserSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.json({ success: true, message });
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to send message" });
  }
};


//get users for sidebar
export const getChatUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all users except current
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    const unseenMessages = {};

    //  Count unseen messages
    await Promise.all(
      filteredUsers.map(async (user) => {
        const messages = await Message.find({
          senderId: user._id,
          receiverId: userId,
          isRead: false,
        });

        if (messages.length > 0) {
          unseenMessages[user._id] = messages.length;
        }
      })
    );

    //  Build result with unseenCount, isOnline, lastSeen
    const result = filteredUsers.map((user) => ({
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic,
      unseenCount: unseenMessages[user._id] || 0,
      isOnline: !!UserSocketMap[user._id], //  online if present in socket map
      lastSeen: user.lastSeen || null, //  last seen time
    }));

    res.status(200).json({ success: true, users: result });
  } catch (error) {
    console.error("Error fetching chat users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch chat users",
    });
  }
};
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
