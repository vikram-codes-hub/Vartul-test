import react, { useState } from 'react'

export const ChatContext = react.createContext()

const ChatContextProvider = (props) => {
      const [selectedChat, setSelectedChat] =useState(null);
      console.log(selectedChat)
const value={
selectedChat,setSelectedChat
}

return (
    <ChatContext.Provider value={value}>
        {props.children}
    </ChatContext.Provider>
)
}

export default ChatContextProvider