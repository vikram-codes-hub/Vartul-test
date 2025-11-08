import React, { useContext } from 'react'
import { ChatContext } from '../Context/Chat'
import Chatleft from '../Components/Chat/Chatleft'
import Chatright from '../Components/Chat/Chatright'
import Chatrightsm from '../Components/Chat/Chatrightsm'

const Chat = () => {
  const { selectedChat } = useContext(ChatContext)

  return (
    <div className='flex h-screen overflow-hidden bg-black'>
      {/* Mobile View */}
      <div className='md:hidden w-full'>
        {!selectedChat ? (
          <Chatleft />
        ) : (
          <Chatrightsm />
        )}
      </div>

      {/* Desktop View - Show both side by side */}
      <div className='hidden md:flex w-full'>
        <Chatleft />
        {selectedChat && <Chatright />}
      </div>
    </div>
  )
}

export default Chat