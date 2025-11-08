import React, { useRef, useState, useEffect } from 'react'
import Story from './Story'
import { dummyStories } from '../../assets/Storydummydata'
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";

const Hero = () => {
  const scrollContainerRef = useRef(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)

  //checling to show scroll or not
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      
      setShowLeftButton(scrollLeft > 0)
      
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    
    if (container) {
      container.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      
      return () => {
        container.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative mt-6 ml-4">
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scroll-smooth scrollbar-hide"
      >
        <div className="flex w-max">
          {dummyStories.map((story, index) => (
            <div
              key={story.id ?? index}
              className="-ml-[26px] sm:ml-2 md:ml-1 flex-none min-w-[33.333%] sm:min-w-[15%] md:min-w-[19.666%]"
            >
              <Story image={story.image} username={story.username} />
            </div>
          ))}
        </div>
      </div>
      
      {showLeftButton && (
        <div className="hidden md:block absolute top-12 left-7 -translate-y-1/2">
          <FaCircleChevronLeft 
            onClick={scrollLeft}
            className='text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors drop-shadow-lg'
          />
        </div>
      )}
      
      {showRightButton && (
        <div className="hidden md:block absolute top-12 right-6 -translate-y-1/2">
          <FaCircleChevronRight 
            onClick={scrollRight}
            className='text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors drop-shadow-lg'
          />
        </div>
      )}
    </div>
  )
}

export default Hero