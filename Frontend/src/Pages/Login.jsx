import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '../store/authSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // For demo purposes, we'll just simulate a login
    // In a real app, you would make an API call here
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      dispatch(setUser({
        username: formData.email.split('@')[0],
        profilePicture: null
      }));
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-2xl rounded-lg overflow-hidden">
        {/* Left side - Logo and brand */}
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center bg-black relative overflow-hidden">
          {/* Main logo */}
          <div className="relative z-10 flex flex-col items-center">
            <img 
              src="/src/assets/vezzra-removebg-preview.png" 
              alt="Vezzra Logo" 
              className="w-64 h-64 mb-6 object-contain"
            />
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to Vartul</h2>
            <p className="text-gray-400 text-center max-w-xs">Connect with friends and share your moments in a beautiful way</p>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-500 filter blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-purple-500 filter blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-pink-500 filter blur-xl"></div>
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-black">
          <div className="mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">Vartul</h1>
            <p className="text-gray-300 font-light">Sign in to connect with your network</p>
          </div>
          
          <button className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 1.8c4.529 0 8.2 3.671 8.2 8.2 0 4.529-3.671 8.2-8.2 8.2-4.529 0-8.2-3.671-8.2-8.2 0-4.529 3.671-8.2 8.2-8.2zm-2 4.5v7.4l6-3.7-6-3.7z"></path>
            </svg>
            Continue with Facebook
          </button>
          
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-800"></div>
            <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
            <div className="flex-grow h-px bg-gray-800"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email or Phone</label>
              <input
                id="email"
                type="text"
                name="email"
                placeholder="Enter your email or phone number"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                <a href="#" className="text-xs text-blue-400 hover:text-purple-400 transition-colors duration-300">Forgot password?</a>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md font-medium shadow-md ${
                  loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                } transition-all duration-300`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-purple-400 transition-colors duration-300 font-medium">Create Account</Link>
            </p>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm font-medium mb-4">Get the mobile app</p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="transition-transform hover:scale-105 duration-300">
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-10" />
              </a>
              <a href="#" className="transition-transform hover:scale-105 duration-300">
                <img src="https://developer.microsoft.com/store/badges/images/English_get-it-from-MS.png" alt="Get it from Microsoft" className="h-10" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;