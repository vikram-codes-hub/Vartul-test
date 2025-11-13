import Post from '../Models/Post_model.js'
import User from "../Models/User.js";
import cloudinary from "../Config/cloudinary.js";


// ==============================
//  CREATE POST
// ==============================
export const createPost = async (req, res) => {
  try {
    const { caption, media, mediaType } = req.body;
    const userId = req.user._id;

    if (!media) {
      return res.status(400).json({ success: false, error: "Media is required" });
    }

    let mediaUrl;

    // Upload image
    if (mediaType === "image") {
      const uploadRes = await cloudinary.uploader.upload(media);
      mediaUrl = uploadRes.secure_url;
    }
    // Upload video
    else if (mediaType === "video") {
      const uploadRes = await cloudinary.uploader.upload(media, {
        resource_type: "video",
      });
      mediaUrl = uploadRes.secure_url;
    }
    else {
      return res.status(400).json({ success: false, error: "Invalid media type" });
    }

    // Create post
    const newPost = await Post.create({
      userId,
      caption,
      mediaUrl,
      mediaType,
    });

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, error: "Failed to create post" });
  }
};



// ==============================
// FEED POSTS (FOLLOWING + SELF)
// ==============================
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get who the user follows
    const user = await User.findById(userId).select("following");

    const followinglist = user.following || [];
    followinglist.push(userId); // include own posts

    // Pagination
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const pageSize = Math.max(5, parseInt(req.query.pageSize || "10"));
    const skip = (page - 1) * pageSize;

    // Fetch feed posts
    const posts = await Post.find({ userId: { $in: followinglist } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate("userId", "username profilePic")
      .lean();

    // Total feed posts
    const totalPosts = await Post.countDocuments({
      userId: { $in: followinglist }
    });

    res.status(200).json({
      success: true,
      posts,
      meta: {
        page,
        pageSize,
        totalPosts,
        hasMore: skip + posts.length < totalPosts,
      },
    });

  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ success: false, error: "Failed to fetch feed" });
  }
};



// ==============================
// GET USER POSTS
// ==============================
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ success: false, error: "Failed to fetch user posts" });
  }
};



// ==============================
// LIKE / UNLIKE A POST
// ==============================
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });

  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ success: false, error: "Failed to like post" });
  }
};



// ==============================
//  COMMENT ON POST
// ==============================
export const commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    post.comments.push({
      userId,
      text,
      createdAt: new Date(),
    });

    await post.save();

    res.json({ success: true, message: "Comment added", comments: post.comments });

  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, error: "Failed to comment on post" });
  }
};



// ==============================
// DELETE POST
// ==============================
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    // Only the owner can delete
    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(postId);

    res.json({ success: true, message: "Post deleted successfully" });

  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, error: "Failed to delete post" });
  }
};
