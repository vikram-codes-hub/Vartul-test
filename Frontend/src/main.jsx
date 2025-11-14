import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ChatContextProvider from './Context/Chat.jsx'
import { Provider } from 'react-redux'
import { store } from './store'
import UserContextProvider from './Context/Usercontext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
     <UserContextProvider>
        <ChatContextProvider>
          <App />
        </ChatContextProvider>
     </UserContextProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
