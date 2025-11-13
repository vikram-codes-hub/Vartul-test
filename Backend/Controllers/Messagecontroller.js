import Message from '../Models/Chat.js'

import cloudinary from "../Config/cloudinary.js";
import { getIO, UserSocketMap } from "../Utils/socket.js";
import User from "../Models/User.js";

export const sendMessage = async (req, res) => {
  try {
    const { image, text,video} = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.userId;

    // Find or create conversation between sender and receiver
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
    if(video){
      const uploadRes = await cloudinary.uploader.upload(video, { resource_type: "video" });
      mediaUrl = uploadRes.secure_url;
      messageType = "video";
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
    if (text) conversation.lastMessage = text;
    else if (messageType === "image") conversation.lastMessage = "Image";
    else if (messageType === "video") conversation.lastMessage = "Video";
    await conversation.save();

    //  Emit real-time message to receiver
    const receiverSocketId = UserSocketMap[receiverId];
    const io = getIO();
    if (receiverSocketId && io) {
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
  try {
    const myId = req.user._id;
    const selectedUserId = req.params.selecteduserId;

   //imporntant  //send api like this----------  Frontend  send ?page=1&pageSize=50
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const pageSize = Math.max(20, parseInt(req.query.pageSize || "50", 10));
    const skip = (page - 1) * pageSize;

    //  Mark incoming messages as read (messages sent by selectedUser -> me)
  
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, isRead: false },
      { $set: { isRead: true } }
    );

    //  Fetch messages between the two users,old to new
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    })
      .sort({ createdAt: 1 })//oldesr to newest
      .skip(skip)
      .limit(pageSize)
      .populate("senderId", "username profilePic _id")   
      .populate("receiverId", "username profilePic _id")
      .lean();

    //  Count total messages for UI pagination
    const totalMessages = await Message.countDocuments({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    res.json({
      success: true,
      messages,
      meta: {
        page,
        pageSize,
        totalMessages,
        hasMore: skip + messages.length < totalMessages,
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};



//  Delete a single message
export const deleteMessage = async (req, res) => {
 try {

  const {messageId} = req.params;
  const userId = req.user._id;

  const message = await Message.findById(messageId);

  if (!message) {
    return res.status(404).json({ success: false, error: "Message not found" });
  }

  //  Only sender can delete the message
  if(message.senderId.toString()!=userId.toString()){
    return res.status(403).json({ success: false, error: "Unauthorized to delete this message" });
  }

  await Message.findByIdAndDelete(messageId);
  //emit the socker event to notify receiver about deletion
  const recieverId = UserSocketMap[message.receiverId];
  const io = getIO();
  if (recieverId && io) {
    io.to(recieverId).emit("messageDeleted", { messageId });
  }

  // tell sender own socket to update the ui
  const senderSocketId = UserSocketMap[userId];
  if (senderSocketId && io) {
    io.to(senderSocketId).emit("messageDeleted", { messageId });
  }
  res.json({ success: true, message: "Message deleted successfully" });
 } catch (error) {
  
 }
};



//  Delete a whole conversation thread
export const deleteConversation = async (req, res) => {
  try {
    const myId = req.user._id;
    const otherUserId = req.params.userId;

    const conversation = await Conversation.findOne({
      participants: { $all: [myId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, error: "Conversation not found" });
    }

    // Delete all messages
    await Message.deleteMany({ conversationId: conversation._id });

    // Delete conversation
    await Conversation.findByIdAndDelete(conversation._id);

    // Notify other user
    const receiverSocketId = UserSocketMap[otherUserId];
    const io = getIO();
    if (receiverSocketId && io) {
      io.to(receiverSocketId).emit("conversationDeleted", { userId: myId });
    }

    res.json({ success: true, message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ success: false, error: "Failed to delete conversation" });
  }
};




