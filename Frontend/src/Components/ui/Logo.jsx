import React from 'react'
import { Link } from 'react-router-dom'
import img from '../../assets/vezzra-removebg-preview.png'

const Logo = ({ className = '', showText = true, textSize = 'text-2xl', linkTo = '/' }) => {
  return (
    <Link to={linkTo} className={`flex items-center gap-3 hover:scale-105 transition-transform duration-200 ${className}`}>
      <img 
        className='h-16 w-auto object-contain' 
        src={img} 
        alt="VARTUL Logo" 
      />
      {showText && (
        <div className={`font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent ${textSize}`}>
          VARTUL
        </div>
      )}
    </Link>
  )
}

export default Logo