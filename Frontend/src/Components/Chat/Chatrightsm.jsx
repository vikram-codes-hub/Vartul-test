import React, { useContext } from 'react'
import { ChatContext } from '../../Context/Chat'
import { IoCallOutline, IoChevronBack } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { messages } from '../../assets/Storydummydata';

const Chatrightsm = () => {
  const { selectedChat, setSelectedChat } = useContext(ChatContext)

  const handleBack = () => {
    setSelectedChat(null)
  }

  return (
    <div className='bg-black w-full flex flex-col h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center px-4 py-3 border-b border-gray-800 bg-black'>
        <div className='flex items-center gap-3 flex-1'>
          <button 
            onClick={handleBack}
            className='p-1 hover:bg-gray-900 rounded-full transition-colors'
            aria-label='Back'
          >
            <IoChevronBack className='w-6 h-6 text-white' />
          </button>
          <img 
            className='w-9 h-9 rounded-full object-cover' 
            src={selectedChat?.profile} 
            alt={selectedChat?.name || 'User'} 
          />
          <div className='flex-1 min-w-0'>
            <p className='font-semibold text-white text-sm truncate'>{selectedChat?.name}</p>
            <p className='text-xs text-gray-400 truncate'>Demo_777</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-2'>
          <button 
            className='p-2 hover:bg-gray-900 rounded-full transition-colors'
            aria-label='Voice call'
          >
            <IoCallOutline className='w-5 h-5 text-white' />
          </button>
          <button 
            className='p-2 hover:bg-gray-900 rounded-full transition-colors'
            aria-label='Video call'
          >
            <FaVideo className='w-5 h-5 text-white' />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-black">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 mb-3 ${
              message.isMe ? "justify-end" : "justify-start"
            }`}
          >
            {/* Show avatar only for other user */}
            {!message.isMe && (
              <img
                className="w-6 h-6 rounded-full object-cover mb-1 flex-shrink-0"
                src={message.sender.avatar}
                alt={message.sender.name}
              />
            )}
            <div
              className={`px-3 py-2 rounded-3xl max-w-[75%] ${
                message.isMe ? "bg-blue-500 text-white" : "bg-gray-800 text-white"
              }`}
            >
              <p className="text-sm leading-relaxed break-words">{message.text}</p>
            </div>
            {/* Show my avatar on right side */}
            {message.isMe && (
              <img
                className="w-6 h-6 rounded-full object-cover mb-1 flex-shrink-0"
                src={message.sender.avatar}
                alt={message.sender.name}
              />
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className='px-3 py-2 border-t border-gray-800 bg-black'>
        <div className='flex items-center gap-2'>
          {/* Emoji Button */}
          <button className='p-2 hover:bg-gray-900 rounded-full transition-colors flex-shrink-0'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <circle cx='12' cy='12' r='10' strokeWidth='2'/>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01'/>
            </svg>
          </button>
          
          {/* Input Field */}
          <input 
            className='flex-1 bg-transparent border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-600' 
            type="text" 
            placeholder='Message...' 
          />
          
          {/* Image Button */}
          <button className='p-2 hover:bg-gray-900 rounded-full transition-colors flex-shrink-0'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/>
            </svg>
          </button>
          
          {/* Like Button */}
          <button className='p-2 hover:bg-gray-900 rounded-full transition-colors flex-shrink-0'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chatrightsm