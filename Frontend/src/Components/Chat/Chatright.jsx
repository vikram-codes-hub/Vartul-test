import React, { useContext } from 'react'
import { ChatContext } from '../../Context/Chat'
import { IoCallOutline } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { messages } from '../../assets/Storydummydata';

const Chatright = () => {
  const { selectedChat } = useContext(ChatContext)

  return (
    <div className='bg-black border-l border-gray-800 w-[920px] flex flex-col h-screen'>
      {/* Header */}
      <div className='flex justify-between px-6 py-4 gap-4 border-b border-gray-800 bg-black'>
        <div className='flex items-center gap-3'>
          <img 
            className='w-11 h-11 rounded-full object-cover cursor-pointer' 
            src={selectedChat?.profile} 
            alt={selectedChat?.name || 'User'} 
          />
          <div>
            <p className='font-semibold text-white cursor-pointer'>{selectedChat?.name}</p>
            <p className='text-sm text-gray-400 cursor-pointer'>Demo_777</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-4'>
          <button 
            className='p-2 hover:bg-gray-900 cursor-pointer rounded-full transition-colors'
            aria-label='Voice call'
          >
            <IoCallOutline className='w-6 h-6 text-white' />
          </button>
          <button 
            className='p-2 hover:bg-gray-900 cursor-pointer rounded-full transition-colors'
            aria-label='Video call'
          >
            <FaVideo className='w-6 h-6 text-white' />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-black">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 mb-4 ${
              message.isMe ? "justify-end" : "justify-start"
            }`}
          >
            {/* Show avatar only for other user */}
            {!message.isMe && (
              <img
                className="w-7 h-7 rounded-full object-cover mb-1"
                src={message.sender.avatar}
                alt={message.sender.name}
              />
            )}
            <div
              className={`px-4 py-2 rounded-3xl max-w-sm ${
                message.isMe ? "bg-blue-500 text-white" : "bg-gray-800 text-white"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
            {/* Show my avatar on right side */}
            {message.isMe && (
              <img
                className="w-7 h-7 rounded-full object-cover mb-1"
                src={message.sender.avatar}
                alt={message.sender.name}
              />
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className='px-6 py-3 border-t border-gray-800 bg-black'>
        <div className='flex items-center gap-3'>
          {/* Emoji Button */}
          <button className='p-2 hover:bg-gray-900 rounded-full transition-colors'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <circle cx='12' cy='12' r='10' strokeWidth='2'/>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01'/>
            </svg>
          </button>
          
          {/* Input Field */}
          <input 
            className='flex-1 bg-transparent border border-gray-700 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600' 
            type="text" 
            placeholder='Message...' 
          />
          
          {/* Action Buttons */}
          <button className='p-2 hover:bg-gray-900 rounded-full transition-colors'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'/>
            </svg>
          </button>
          
          <button className='p-2 hover:bg-gray-900 rounded-full transition-colors'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/>
            </svg>
          </button>
          
          <button className='p-2 hover:bg-gray-900 rounded-full transition-colors'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'/>
            </svg>
          </button>
          
          <button className='p-2 hover:bg-gray-900 rounded-full transition-colors'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chatright