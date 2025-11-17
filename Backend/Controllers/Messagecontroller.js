import Conversation from "../Models/Conversation.js";
import Message from "../Models/Chat.js";
import cloudinary from "../Config/cloudinary.js";
import { getIO, UserSocketMap } from "../Utils/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { image, text, video } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.userId;

    // 1. Find or Create Conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        lastMessage: text || "Media message",
        lastMessageAt: Date.now(),
      });
    }

    let mediaUrl = null;
    let messageType = "text";

    // 2. Media Uploads
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      mediaUrl = uploadRes.secure_url;
      messageType = "image";
    }

    if (video) {
      const uploadRes = await cloudinary.uploader.upload(video, {
        resource_type: "video",
      });
      mediaUrl = uploadRes.secure_url;
      messageType = "video";
    }

    // 3. Create a message
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      messageType,
      text,
      mediaUrl,
    });

    // 4. Update conversation lastMessage
    if (text) conversation.lastMessage = text;
    else if (messageType === "image") conversation.lastMessage = "Image";
    else if (messageType === "video") conversation.lastMessage = "Video";

    conversation.lastMessageAt = Date.now();
    await conversation.save();

    // 5. Real-time Socket Emit
    const io = getIO();
    const receiverSocketId = UserSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    return res.json({ success: true, message });

  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send message",
    });
  }
};


// Get chat users for sidebar (only users who chatted with current user)
export const getChatUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    //  Find all messages involving the current user
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });

    //  Extract unique user IDs who chatted with me
    const chatUserIds = new Set();

    messages.forEach(msg => {
      if (msg.senderId.toString() !== userId.toString()) {
        chatUserIds.add(msg.senderId.toString());
      }
      if (msg.receiverId.toString() !== userId.toString()) {
        chatUserIds.add(msg.receiverId.toString());
      }
    });

    // Convert Set → Array
    const userIds = Array.from(chatUserIds);

    // If no chats yet
    if (userIds.length === 0) {
      return res.status(200).json({ success: true, users: [], unseenMessages: {} });
    }

    // 3. Fetch user details
    const users = await User.find({ _id: { $in: userIds } }).select("-password");

    // 4. Count unseen messages for each chat user
    const unseenMessages = {};

    await Promise.all(
      users.map(async (user) => {
        const count = await Message.countDocuments({
          senderId: user._id,
          receiverId: userId,
          isRead: false,
        });

        if (count > 0) {
          unseenMessages[user._id] = count;
        }
      })
    );

    res.status(200).json({
      success: true,
      users,
      unseenMessages
    });

  } catch (error) {
    console.error("Error fetching chat users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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




