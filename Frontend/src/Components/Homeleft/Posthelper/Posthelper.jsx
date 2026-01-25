import React, { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";

import PostOptionsModal from "./PostoptionsModel";
import { usePost } from "../../../context/PostContext";

const Posthelper = ({ post }) => {
  const { toggleLike, commentOnPost } = usePost();

  const user = post.userId;
  const likesCount = post.likes.length;
  const isInitiallyLiked = post.likes.includes(
    JSON.parse(localStorage.getItem("user"))?._id
  );

  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLikeClick = () => {
    setIsLiked((prev) => !prev);
    toggleLike(post._id);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    commentOnPost(post._id, commentText);
    setCommentText("");
  };

  const truncatedCaption =
    post.caption && post.caption.length > 100
      ? post.caption.substring(0, 100) + "..."
      : post.caption;

  return (
    <div className="w-full bg-black border border-gray-800 rounded-lg overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={user.profilePic || "/default-avatar.png"}
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="font-semibold text-sm text-white">
            {user.username}
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)}>
          <HiDotsHorizontal className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* MEDIA */}
      <div className="w-full">
        {post.mediaType === "image" ? (
          <img
            src={post.mediaUrl}
            className="w-full object-cover"
            onDoubleClick={handleLikeClick}
          />
        ) : (
          <video
            src={post.mediaUrl}
            controls
            className="w-full object-cover"
          />
        )}
      </div>

      {/* ACTIONS */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-4 mb-2">
          <button onClick={handleLikeClick}>
            {isLiked ? (
              <svg className="w-7 h-7 fill-red-500 text-red-500" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* LIKES */}
        {likesCount > 0 && (
          <p className="font-semibold text-sm text-white mb-1">
            {likesCount} likes
          </p>
        )}

        {/* CAPTION */}
        {post.caption && (
          <p className="text-sm text-white mb-1">
            <span className="font-semibold mr-2">{user.username}</span>
            {showFullCaption ? post.caption : truncatedCaption}
            {post.caption.length > 100 && (
              <button
                onClick={() => setShowFullCaption((p) => !p)}
                className="text-gray-400 ml-1"
              >
                {showFullCaption ? "less" : "more"}
              </button>
            )}
          </p>
        )}

        {/* COMMENTS */}
        <button className="text-gray-400 text-sm mb-2">
          View all {post.comments.length} comments
        </button>

        {/* ADD COMMENT */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-800">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-sm text-white outline-none"
          />
          <button
            onClick={handleCommentSubmit}
            className="text-blue-500 font-semibold text-sm"
          >
            Post
          </button>
        </div>
      </div>

      <PostOptionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        username={user.username}
      />
    </div>
  );
};

export default Posthelper;
