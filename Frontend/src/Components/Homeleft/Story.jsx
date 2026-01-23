import React from 'react'

const Story = ({ image, username }) => {
  return (
    <div className="flex flex-col items-center space-y-1 cursor-pointer group">
      {/* Story Ring with Gradient */}
      <div className="relative">
        <div className="w-[66px] h-[66px] rounded-full p-[2.5px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 group-hover:scale-105 transition-transform duration-200">
          <div className="w-full h-full rounded-full p-[3px] bg-black">
            <img
              src={image}
              alt={username}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Username */}
      <p className="text-xs text-white max-w-[70px] truncate">
        {username}
      </p>
    </div>
  )
}

export default Story