import Post from "../Models/Post_model.js";
import User from "../Models/User.js";
import cloudinary from "../Config/cloudinary.js";


// ==============================
// CREATE POST
// ==============================
export const createPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { caption, media, mediaType } = req.body;

    if (!media || !mediaType) {
      return res.status(400).json({
        success: false,
        error: "Media and mediaType are required",
      });
    }

    let uploadResult;

    if (mediaType === "image") {
      uploadResult = await cloudinary.uploader.upload(media, {
        folder: "vartul/posts",
      });
    } else if (mediaType === "video") {
      uploadResult = await cloudinary.uploader.upload(media, {
        resource_type: "video",
        folder: "vartul/posts",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "Invalid media type",
      });
    }

    const post = await Post.create({
      userId,
      caption,
      mediaUrl: uploadResult.secure_url,
      mediaType,
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { postsCount: 1 } },
      { new: true }
    );
   


    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ success: false, error: "Failed to create post" });
  }
};


// ==============================
// FEED POSTS (FOLLOWING + SELF)
// ==============================
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("following");

    const followingList = user.following || [];
    followingList.push(userId);

    const page = Math.max(1, parseInt(req.query.page || "1"));
    const pageSize = Math.max(5, parseInt(req.query.pageSize || "10"));
    const skip = (page - 1) * pageSize;

    const posts = await Post.find({ userId: { $in: followingList } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate("userId", "username profilePic")
      .lean();

    const totalPosts = await Post.countDocuments({
      userId: { $in: followingList },
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
    console.error("Feed error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch feed" });
  }
};


// ==============================
// GET USER POSTS
// ==============================
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 });

      const postcount=await User.findById(userId).select("postsCount");
      console.log("User post count:", postcount.postsCount);
    res.json({ success: true, posts, postCount: postcount.postsCount });
  } catch (error) {
    console.error("User posts error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch user posts" });
  }
};


// ==============================
// LIKE / UNLIKE POST
// ==============================
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ success: false, error: "Failed to like post" });
  }
};


// ==============================
// COMMENT ON POST
// ==============================
export const commentOnPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: "Comment cannot be empty",
      });
    }

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

    res.json({ success: true, comments: post.comments });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ success: false, error: "Failed to add comment" });
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

    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized",
      });
    }

    await Post.findByIdAndDelete(postId);
    
      await User.findByIdAndUpdate(userId, {
  $inc: { postsCount: 1 }
});

    res.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, error: "Failed to delete post" });
  }
};
