import { createContext, useContext, useState } from "react";
import axios from "axios";
import { Usercontext } from "./Usercontext";
import User from "../../../Backend/Models/User";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const {token, setuser}=useContext(Usercontext)



  const authHeader = {
    headers: {
      token,
    },
  };

  // ==============================
  // FETCH FEED POSTS
  // ==============================
  const fetchFeedPosts = async (reset = false) => {
    try {
      if (loading) return;

      setLoading(true);

      const currentPage = reset ? 1 : page;

      const res = await axios.get(
        `/api/post/feed?page=${currentPage}&pageSize=10`,
        authHeader
      );

      const newPosts = res.data.posts;

      setFeedPosts((prev) =>
        reset ? newPosts : [...prev, ...newPosts]
      );

      setHasMore(res.data.meta.hasMore);
      setPage(currentPage + 1);
    } catch (error) {
      console.error("Fetch feed error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // FETCH USER POSTS (PROFILE GRID)
  // ==============================
  const fetchUserPosts = async (userId) => {
    try {
      const res = await axios.get(
        `/api/post/user/${userId}`,
       {headers: { token } }
      );
      setUserPosts(res.data.posts);
    } catch (error) {
      console.error("Fetch user posts error:", error);
    }
  };

  // ==============================
  // CREATE POST
  // ==============================
  const createPost = async ({ caption, media, mediaType }) => {
    try {
    
      const res = await axios.post(
        "/api/post/create",
        { caption, media, mediaType },
        { headers: { token } }
      );
  
       const newPost = res.data.post;
      // Add post to feed instantly
      setFeedPosts((prev) => [newPost, ...prev]);
        setUserPosts((prev) => [newPost, ...prev]);
        setuser((prev) => ({
    ...prev,
    postsCount: prev.postsCount + 1,
  }));
      return res.data.post;
    } catch (error) {
      console.error("Create post error:", error);
      throw error;
    }
  };

  // ==============================
  // LIKE / UNLIKE POST
  // ==============================
  const toggleLike = async (postId) => {
    try {
      const res = await axios.put(
        `/api/post/like/${postId}`,
        {},
        authHeader
      );

      setFeedPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: res.data.liked
                  ? [...post.likes, "temp"]
                  : post.likes.slice(0, -1),
              }
            : post
        )
      );

      return res.data;
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  // ==============================
  // COMMENT ON POST
  // ==============================
  const commentOnPost = async (postId, text) => {
    try {
      const res = await axios.post(
        `/api/post/comment/${postId}`,
        { text },
        authHeader
      );

      setFeedPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: res.data.comments }
            : post
        )
      );
     


      return res.data;
    } catch (error) {
      console.error("Comment error:", error);
    }
  };

  return (
    <PostContext.Provider
      value={{
        feedPosts,
        userPosts,
        loading,
        hasMore,
        fetchFeedPosts,
        fetchUserPosts,
        createPost,
        toggleLike,
        commentOnPost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);
