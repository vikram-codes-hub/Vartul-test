import React, { useContext } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

import Home from "./Pages/Home";
import Reels from "./Pages/Reels";
import Settings from "./Pages/Settings";
import Chat from "./Pages/Chat";
import Sidebar from "./Components/Sidebar";
import Aboutus from "./Pages/Aboutus";
import Twt_Token from "./Pages/Twt_Token";
import Dashboard from "./Pages/Dashboard";
import ProfileSetup from "./Pages/ProfileSetup";
import Myprofile from "./Pages/Myprofile";
import AuthPage from "./Pages/Authpage";

import Footer from "./Pages/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Usercontext } from "./Context/Usercontext";
import BasicInfo from "./Pages/Basicinfo";
import InterestsSetup from "./Pages/InterestsSetup";
import ProfilePicture from "./Pages/ProfilePicture";
import EditProfile from "./Pages/Editporifle";
import PostModal from "./Components/Postmodel";


const App = () => {
  const location = useLocation();
  const { authuser, authMode } = useContext(Usercontext);

  // Hide Sidebar on auth + profile setup pages
  const hideSidebar =
    location.pathname === "/auth" ||
    location.pathname === "/profile-setup/basic-info"||
    location.pathname === "/profile-setup/interests"||
    location.pathname === "/profile-setup/profile-picture";

  // Hide footer on specific pages
  const hideFooter =
    location.pathname.startsWith("/chat") ||
    location.pathname === "/auth" ||
    location.pathname === "/profile-setup/basic-info"||
    location.pathname === "/profile-setup/interests"||
    location.pathname === "/profile-setup/profile-picture";

  return (
    <div className="flex flex-col">
      <ToastContainer />

      {/* Sidebar */}
      {!hideSidebar && <Sidebar />}

      {/* Routes */}
      <Routes>

        {/* Public Route — Combined Login/Signup */}
      <Route
  path="/auth"
  element={
    authuser
      ? authuser.profileCompleted
        ? <Navigate to="/" />
        : <Navigate to="/profile-setup/basic-info" />
      : <AuthPage />
  }
/>


        {/* Protected Routes */}
        {/* {after the signup these routes to fill info these three} */}
       <Route path="/profile-setup/basic-info" element={authuser ?<BasicInfo/> : <Navigate to="/auth" />} />
<Route path="/profile-setup/interests" element={authuser ? <InterestsSetup/> : <Navigate to="/auth" />} />
<Route path="/profile-setup/profile-picture" element={authuser ? <ProfilePicture/>: <Navigate to="/auth" />} />

        <Route
          path="/"
          element={authuser ? <Home /> : <Navigate to="/auth" />}
        />
        <Route
          path="/reels"
          element={authuser ? <Reels /> : <Navigate to="/auth" />}
        />
        <Route
          path="/settings"
          element={authuser ? <Settings /> : <Navigate to="/auth" />}
        />
        <Route path="/p/:postId" element={<PostModal />} />
       
        <Route
          path="/chat"
          element={authuser ? <Chat /> : <Navigate to="/auth" />}
        />
        <Route
          path="/about-us"
          element={authuser ? <Aboutus /> : <Navigate to="/auth" />}
        />
        <Route
          path="/twt_token"
          element={authuser ? <Twt_Token /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dashboard"
          element={authuser ? <Dashboard /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile"
          element={authuser ? <Myprofile /> : <Navigate to="/auth" />}
        />
        <Route
          path="/edit-profile"
          element={authuser ? <EditProfile/> : <Navigate to="/auth" />}
        />
      </Routes>

      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
};

export default App;
