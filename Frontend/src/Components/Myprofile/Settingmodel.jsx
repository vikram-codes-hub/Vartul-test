import React from 'react'

const SettingsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm  modal-overlay  bg-opacity-60 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-[#262626] rounded-2xl w-full max-w-md mx-4" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="divide-y divide-gray-700">
          <button className="w-full py-4 px-6 text-white hover:bg-[#363636] transition text-center rounded-t-2xl">
            Apps and websites
          </button>
          <button className="w-full py-4 px-6 text-white hover:bg-[#363636] transition text-center">
            QR code
          </button>
          <button className="w-full py-4 px-6 text-white hover:bg-[#363636] transition text-center">
            Notifications
          </button>
          <button className="w-full py-4 px-6 text-white hover:bg-[#363636] transition text-center">
            Settings and privacy
          </button>
          <button className="w-full py-4 px-6 text-white hover:bg-[#363636] transition text-center">
            Supervision
          </button>
          <button className="w-full py-4 px-6 text-white hover:bg-[#363636] transition text-center">
            Login activity
          </button>
          <button className="w-full py-4 px-6 text-white hover:bg-[#363636] transition text-center">
            Log Out
          </button>
          <button 
            className="w-full py-4 px-6 text-white hover:bg-[#363636] transition text-center rounded-b-2xl" 
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;