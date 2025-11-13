import Story from "../Models/Story.js";
import User from "../Models/User.js";
import cloudinary from "../Config/cloudinary.js";


// ==============================
// 📌 Create new story
// ==============================
export const createStory = async (req, res) => {
  try {
    // TODO: extract media + type
    // TODO: upload to cloudinary (image/video)
    // TODO: set expiresAt = now + 24 hours
    // TODO: save story to DB
    // TODO: return story
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ success: false, error: "Failed to create story" });
  }
};


// ==============================
// 📌 Get stories of following + self
// ==============================
export const getStories = async (req, res) => {
  try {
    // TODO: get current user
    // TODO: get following list
    // TODO: fetch stories of (following + self)
    // TODO: return stories sorted by time
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ success: false, error: "Failed to fetch stories" });
  }
};


// ==============================
// 📌 Mark story as viewed
// ==============================
export const viewStory = async (req, res) => {
  try {
    // TODO: extract storyId
    // TODO: add user to viewers[] only once
    // TODO: return updated
  } catch (error) {
    console.error("Error marking story viewed:", error);
    res.status(500).json({ success: false, error: "Failed to mark viewed" });
  }
};


// ==============================
// 📌 Delete a story (only owner)
// ==============================
export const deleteStory = async (req, res) => {
  try {
    // TODO: extract storyId
    // TODO: verify story belongs to user
    // TODO: delete from DB
    // TODO: return success
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ success: false, error: "Failed to delete story" });
  }
};


// ==============================
// 📌 Auto delete expired stories (CRON job optional)
// ==============================
export const deleteExpiredStories = async () => {
  try {
    // TODO: delete stories where expiresAt < now
  } catch (error) {
    console.error("Error deleting expired stories:", error);
  }
};
