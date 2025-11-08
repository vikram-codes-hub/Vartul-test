import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { HiDotsHorizontal } from "react-icons/hi";
import PostOptionsModal from './PostoptionsModel'
import { RiTelegram2Line } from "react-icons/ri";

// console.log(shareimg);
const Posthelper = ({profile, username, postImage, likes, caption, isOwnPost = false}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(likes || 0)

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

  return (
    <div className='flex flex-col mx-auto mt-6 rounded-lg w-full max-w-[35rem]'>
      {/* Header section */}
      <div className='w-full'>
        <div className='flex items-center justify-between p-4'>
          <div className='flex gap-3 items-center'>
            <img 
              className='w-10 h-10 rounded-full object-cover' 
              src={profile || 'https://via.placeholder.com/40x40'} 
              alt="Profile" 
            />
            <p className='font-semibold text-sm'>{username || 'Vikram singh'}</p>
          </div>
          <button 
            onClick={handleDotsClick}
            className='text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-full '
          >
            <HiDotsHorizontal className='w-5 h-5' />
          </button>
        </div>
      </div>
      
      {/* Post image section - aligned with profile circle */}
      <div className='w-full'>
        <img 
          className='w-full h-auto object-cover rounded-lg' 
          src={postImage || 'https://via.placeholder.com/560x400'} 
          alt="Post content" 
        />
      </div>
      
      {/* Post interactions section */}
      <div className='p-4'>
        {/* Action buttons */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-4'>
            {/* Like button */}
            <svg 
              className={`w-6 h-6 cursor-pointer transition-colors ${
                isLiked ? 'text-red-500 fill-red-500' : ' hover:text-gray-500'
              }`}
              fill={isLiked ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              onClick={handleLikeClick}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            
            {/* Comment button */}
            <svg className='w-6 h-6 cursor-pointer hover:text-gray-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            
            {/* Share button */}
          <RiTelegram2Line 
            className='w-6 h-6 cursor-pointer hover:text-gray-500' 
            onClick={handleShareClick} 
          />
          </div>
          
          {/* Save button */}
          <svg 
            className={`w-6 h-6 cursor-pointer transition-colors ${
              isSaved ? ' fill-white' : 'text-gray-600 hover:text-gray-500'
            }`}
            fill={isSaved ? "currentColor" : "none"} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            onClick={handleSaveClick}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        
        {/* Likes count */}
        <div className='mb-2'>
          <p className='font-semibold text-sm'>{likesCount} likes</p>
        </div>
        
        {/* Caption */}
        <div className='mb-2'>
          <p className='text-sm'>
            <span className='font-semibold'>{username || 'user'}</span>
            <span className='ml-2'>{caption || 'No caption'}</span>
          </p>
        </div>
        
        {/* More caption */}
        <div className='mb-3'>
          <button className='text-gray-500 text-sm'>... more</button>
        </div>
        
        {/* View comments */}
        <div className='mb-3'>
          <button className='text-gray-500 text-sm'>View all comments</button>
        </div>
        
        {/* Add comment */}
        <div className='flex items-center justify-between mt-6'>
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className='flex-1 text-sm outline-none placeholder-gray-500'
          />
          <button className='text-blue-500 text-sm font-semibold'>Post</button>
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