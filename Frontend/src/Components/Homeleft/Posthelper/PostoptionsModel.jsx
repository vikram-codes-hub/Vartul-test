import React from 'react'

const PostOptionsModal = ({ isOpen, onClose, username }) => {
  if (!isOpen) return null

  const handleOptionClick = (action) => {
    console.log(`${action} clicked`)
    onClose()
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          className="rounded-xl w-80 max-w-sm mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          {/* Options List */}
          <div className="divide-y divide-gray-200">
            <button 
              className="w-full py-4 px-6 text-left transition-colors text-red-500 font-semibold"
              onClick={() => handleOptionClick('report')}
            >
              Report
            </button>
            <button 
              className="w-full py-4 px-6 text-left transition-colors text-red-500"
              onClick={() => handleOptionClick('unfollow')}
            >
              Unfollow @{username}
            </button>
            <button 
              className="w-full py-4 px-6 text-left transition-colors"
              onClick={() => handleOptionClick('add_to_favorites')}
            >
              Add to favorites
            </button>
            <button 
              className="w-full py-4 px-6 text-left transition-colors"
              onClick={() => handleOptionClick('copy_link')}
            >
              Copy link
            </button>
            <button 
              className="w-full py-4 px-6 text-left transition-colors"
              onClick={() => handleOptionClick('share_to')}
            >
              Share to...
            </button>
            <button 
              className="w-full py-4 px-6 text-left transition-colors"
              onClick={() => handleOptionClick('about_account')}
            >
              About this account
            </button>
            
            {/* Cancel Button */}
            <button 
              className="w-full py-4 px-6 text-left hover:bg-gray-50 transition-colors font-medium"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PostOptionsModal
