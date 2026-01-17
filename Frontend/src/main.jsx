import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ChatContextProvider from './Context/Chat.jsx'
import { Provider } from 'react-redux'
import { store } from './store'
import UserContextProvider from './Context/Usercontext.jsx'
import { PostProvider } from './Context/PostContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
       <UserContextProvider>
        <PostProvider>
         <ChatContextProvider>
          <App />
         </ChatContextProvider>
       </PostProvider>
      </UserContextProvider>
     </BrowserRouter>
    </Provider>
  </StrictMode>,
)
