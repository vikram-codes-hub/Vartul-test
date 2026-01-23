import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { HiDotsHorizontal } from "react-icons/hi"
import PostOptionsModal from './PostoptionsModel'

const Posthelper = ({ profile, username, postImage, likes, caption, isOwnPost = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(likes || 0)
  const [showFullCaption, setShowFullCaption] = useState(false)

  const handleDotsClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleLikeClick = () => {
    setIsLiked(!isLiked)
    if (!isLiked) {
      setLikesCount(likesCount + 1)
    } else {
      setLikesCount(likesCount - 1)
    }
  }

  const handleSaveClick = () => {
    setIsSaved(!isSaved)
    if (!isSaved) {
      toast.success('Post saved!')
    } else {
      toast.info('Post removed from saved')
    }
  }

  const handleShareClick = () => {
    toast.info('Share functionality coming soon!')
  }

  // Truncate caption if longer than 100 characters
  const truncatedCaption = caption && caption.length > 100 
    ? caption.substring(0, 100) + '...' 
    : caption

  return (
    <div className='w-full bg-black border border-gray-800 rounded-lg mb-4 overflow-hidden'>
      {/* Header section */}
      <div className='flex items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-3'>
          <img 
            className='w-8 h-8 rounded-full object-cover cursor-pointer' 
            src={profile || 'https://via.placeholder.com/32'} 
            alt="Profile" 
          />
          <p className='font-semibold text-sm text-white cursor-pointer hover:text-gray-300'>
            {username || 'user'}
          </p>
        </div>
        <button 
          onClick={handleDotsClick}
          className='text-gray-400 hover:text-white transition-colors p-1'
        >
          <HiDotsHorizontal className='w-6 h-6' />
        </button>
      </div>
      
      {/* Post image section */}
      <div className='w-full'>
        <img 
          className='w-full h-auto object-cover' 
          src={postImage || 'https://via.placeholder.com/600x600'} 
          alt="Post content"
          onDoubleClick={handleLikeClick}
        />
      </div>
      
      {/* Post interactions section */}
      <div className='px-4 pt-3 pb-2'>
        {/* Action buttons */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-4'>
            {/* Like button */}
            <button onClick={handleLikeClick} className='hover:opacity-70 transition-opacity'>
              {isLiked ? (
                <svg className='w-7 h-7 text-red-500 fill-red-500' viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg className='w-7 h-7 text-white' fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
            
            {/* Comment button */}
            <button className='hover:opacity-70 transition-opacity'>
              <svg className='w-7 h-7 text-white' fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            
            {/* Share button */}
            <button onClick={handleShareClick} className='hover:opacity-70 transition-opacity'>
              <svg className='w-7 h-7 text-white' fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {/* Save button */}
          <button onClick={handleSaveClick} className='hover:opacity-70 transition-opacity'>
            {isSaved ? (
              <svg className='w-6 h-6 text-white fill-white' viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
            ) : (
              <svg className='w-6 h-6 text-white' fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Likes count */}
        {likesCount > 0 && (
          <div className='mb-2'>
            <p className='font-semibold text-sm text-white'>
              {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
            </p>
          </div>
        )}
        
        {/* Caption */}
        {caption && (
          <div className='mb-1'>
            <p className='text-sm text-white'>
              <span className='font-semibold mr-2'>{username || 'user'}</span>
              <span className='text-white'>
                {showFullCaption ? caption : truncatedCaption}
              </span>
              {caption.length > 100 && (
                <button 
                  onClick={() => setShowFullCaption(!showFullCaption)}
                  className='text-gray-400 ml-1 hover:text-gray-300'
                >
                  {showFullCaption ? 'less' : 'more'}
                </button>
              )}
            </p>
          </div>
        )}
        
        {/* View comments */}
        <button className='text-gray-400 text-sm mb-2 hover:text-gray-300'>
          View all 24 comments
        </button>
        
        {/* Time ago */}
        <p className='text-gray-500 text-xs mb-3'>2 HOURS AGO</p>
        
        {/* Add comment */}
        <div className='flex items-center gap-3 pt-3 border-t border-gray-800'>
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className='flex-1 text-sm bg-transparent text-white outline-none placeholder-gray-500'
          />
          <button className='text-blue-500 text-sm font-semibold hover:text-blue-400'>
            Post
          </button>
        </div>
      </div>

      {/* Post Options Modal */}
      <PostOptionsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        username={username}
      />
    </div>
  )
}

export default Posthelper