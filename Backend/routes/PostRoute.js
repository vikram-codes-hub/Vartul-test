import express from "express";
import { isLoggedIn } from "../Middelwares/Isloggeddin.js";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  commentOnPost,
  deletePost,
} from '../Controllers/Postcontroller.js'

const postRouter = express.Router();

// Create Post
postRouter.post("/", isLoggedIn, createPost);

// Get feed posts
postRouter.get("/feed", isLoggedIn, getFeedPosts);

// Get user posts
postRouter.get("/user/:id", isLoggedIn, getUserPosts);

// Like/Unlike post
postRouter.post("/like/:postId", isLoggedIn, likePost);

// Comment
postRouter.post("/comment/:postId", isLoggedIn, commentOnPost);

// Delete post
postRouter.delete("/:postId", isLoggedIn, deletePost);

export default postRouter;
