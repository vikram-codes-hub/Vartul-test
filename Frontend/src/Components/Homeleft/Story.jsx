import React from 'react'

const Story =({ image, username })=> {
  return (
    <div>
      
    <div className="flex flex-col items-center space-y-1 cursor-pointer ">
      <div className="w-22 h-22 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 to-yellow-400">
        <img
          src={image}
          alt={username}
          className="w-full h-full rounded-full border-2 border-white object-cover"
        />
      </div>
      <p className="text-[14px] max-w-[60px] text-white truncate font-medium">{username}</p>
    </div>
  
    </div>
  )
}

export default Story
