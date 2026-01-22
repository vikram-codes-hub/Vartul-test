import React, { useContext, useEffect, useState } from 'react'
import { Settings } from 'lucide-react'
import SettingsModal from '../Components/Myprofile/Settingmodel';
import { useNavigate } from 'react-router-dom';
import { Usercontext } from '../Context/Usercontext';
import { usePost } from '../Context/PostContext';

const Myprofile = () => {
  const navigate = useNavigate()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { user, loading, fetchStats, stats } = useContext(Usercontext);
  const { userPosts, fetchUserPosts } = usePost();
  

  useEffect(() => {
    if (user?._id) {
      fetchStats(user._id);
      fetchUserPosts(user._id);
    }
  }, [user]);

  // Navigate to post URL instead of opening modal with state
  const handlePostClick = (postId) => {
    navigate(`/p/${postId}`);
  };

  return (
    <div className="w-full bg-black min-h-screen text-white">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8 pb-12">
        <div className="flex items-start gap-8 md:gap-24">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 md:p-1">
              <img
                src={user?.profilePic}
                className="w-full h-full rounded-full object-cover border-2 md:border-4 border-black"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            {/* Username and Buttons */}
            <div className="flex items-center gap-3 md:gap-5 mb-5">
              <h1 className="text-lg md:text-xl font-light">{user.username}</h1>
              <button onClick={() => navigate("/edit-profile")} className="bg-gray-700 hover:bg-gray-600 px-3 md:px-6 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition">
                Edit profile
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 px-3 md:px-6 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition">
                View archive
              </button>
              <button
                className="hover:opacity-70 transition"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings size={24} />
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mb-5">
              <div>
                <span className="font-semibold">{stats.posts}</span>
                <span className="text-gray-400 ml-1">posts</span>
              </div>
              <div>
                <span className="font-semibold">{stats.followers}</span>
                <span className="text-gray-400 ml-1">followers</span>
              </div>
              <div>
                <span className="font-semibold">{stats.following}</span>
                <span className="text-gray-400 ml-1">following</span>
              </div>
            </div>

            {/* Name and Bio */}
            <div>
              <p className="font-semibold mb-1">{user.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Highlights */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8">
        <div className="flex gap-12 overflow-x-auto">
          {/* Highlight 1 */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gray-600 to-gray-700 p-0.5">
              <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-2xl font-bold">♂️</span>
              </div>
            </div>
            <span className="text-xs mt-2">F💗</span>
          </div>

          {/* Highlight 2 */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gray-600 to-gray-700 p-0.5">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                className="w-full h-full rounded-full object-cover"
                alt="Highlight"
              />
            </div>
            <span className="text-xs mt-2">me💗</span>
          </div>

          {/* Add New Highlight */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-20 h-20 rounded-full border-2 border-gray-700 flex items-center justify-center hover:border-gray-500 transition cursor-pointer">
              <span className="text-4xl text-gray-500">+</span>
            </div>
            <span className="text-xs mt-2">New</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-800 md:ml-[10rem] lg:ml-80">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex justify-center md:justify-start">
            <button className="px-8 py-3 border-t border-white flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z" />
              </svg>
              <span className="text-xs font-semibold hidden md:inline">POSTS</span>
            </button>
            <button className="px-8 py-3 text-gray-500 flex items-center gap-2 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" />
              </svg>
              <span className="text-xs font-semibold hidden md:inline">REELS</span>
            </button>
            <button className="px-8 py-3 text-gray-500 flex items-center gap-2 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 5l7 7-7 7M12 5l7 7-7 7" strokeWidth="2" />
              </svg>
              <span className="text-xs font-semibold hidden md:inline">SAVED</span>
            </button>
            <button className="px-8 py-3 text-gray-500 flex items-center gap-2 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" strokeWidth="2" />
                <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" strokeWidth="2" />
              </svg>
              <span className="text-xs font-semibold hidden md:inline">TAGGED</span>
            </button>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-1">
        <div className="grid grid-cols-3 gap-1">

          {userPosts.length === 0 && (
            <p className="col-span-3 text-center text-gray-500 mt-10">
              No posts yet
            </p>
          )}

          {userPosts.map((post) => (
            <div
              key={post._id}
              onClick={() => handlePostClick(post._id)}
              className="aspect-square bg-gray-900 relative overflow-hidden cursor-pointer group"
            >
              {/* IMAGE / VIDEO */}
              {post.mediaType === "image" ? (
                <img
                  src={post.mediaUrl}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={post.mediaUrl}
                  className="w-full h-full object-cover"
                  muted
                />
              )}

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6">

                {/* LIKES */}
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="font-bold text-white">
                    {post.likes.length}
                  </span>
                </div>

                {/* COMMENTS */}
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                  <span className="font-bold text-white">
                    {post.comments.length}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}

export default Myprofile