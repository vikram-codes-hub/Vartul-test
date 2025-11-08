import React from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from './Pages/Home'
import Reels from './Pages/Reels'
import Settings from './Pages/Settings'
import Chat from './Pages/Chat'
import Sidebar from './Components/Sidebar'
import Aboutus from './Pages/Aboutus'
import Twt_Token from './Pages/Twt_Token'
import Dashboard from './Pages/Dashboard'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import ProfileSetup from './Pages/ProfileSetup'

import Footer from './Pages/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Myprofile from './Pages/Myprofile'


const App = () => {
  const location = useLocation()
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const hideFooter = location.pathname.startsWith('/chat') || 
                    location.pathname === '/login' || 
                    location.pathname === '/signup' ||
                    location.pathname === '/profile-setup'
  
  // Check if sidebar should be hidden
  const hideSidebar = location.pathname === '/login' || 
                      location.pathname === '/signup' || 
                      location.pathname === '/profile-setup'
  
  return (
    <div className='flex flex-col'>
      <div>
        <ToastContainer/>
        {!hideSidebar && <Sidebar/>}
        <Routes>
          {/* Public routes */}
          <Route path='/login' element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login/>}/>
          <Route path='/signup' element={isAuthenticated ? <Navigate to="/profile-setup" /> : <Signup/>}/>
          
          {/* Protected routes */}
          <Route path='/profile-setup' element={isAuthenticated ? <ProfileSetup/> : <Navigate to="/login" />}/>
          <Route path='/' element={isAuthenticated ? <Home/> : <Navigate to="/login" />}/>
          <Route path='/reels' element={isAuthenticated ? <Reels/> : <Navigate to="/login" />}/>
          <Route path='/settings' element={isAuthenticated ? <Settings/> : <Navigate to="/login" />}/>
          <Route path='/chat' element={isAuthenticated ? <Chat/> : <Navigate to="/login" />}/>
          <Route path='/about-us' element={isAuthenticated ? <Aboutus/> : <Navigate to="/login" />}/>
          <Route path='/twt_token' element={isAuthenticated ? <Twt_Token/> : <Navigate to="/login" />}/>
          <Route path='/dashboard' element={isAuthenticated ? <Dashboard/> : <Navigate to="/login" />}/>
          <Route path='/setting' element={isAuthenticated ? <Settings/> : <Navigate to="/login" />}/>
          <Route path='/profile' element={isAuthenticated ? <Myprofile/> : <Navigate to="/login" />}/>
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default App
