import React from 'react'
import img1 from '../../assets/profile_alison.png'
import { dummySuggested } from '../../assets/Storydummydata'

const Homeright = () => {
  return (
    <div className='hidden lg:block w-full md:w-[280px] lg:w-[320px] md:mr-4 lg:mr-18 mt-6 md:mt-8 lg:mt-10 md:px-4 lg:px-0 relative'>
      {/* User Profile Section */}
      <div className='flex justify-between items-center p-2 mb-4 md:mb-5'>
        <div className='flex items-center flex-1'>
          <img className='w-12 h-12 md:w-14 md:h-14 rounded-full object-cover' src={img1} alt="Profile" />
          <div className='flex flex-col ml-2 md:ml-3 flex-1'>
            <p className='font-semibold text-sm'>Demo 1</p>
            <p className='font-normal text-xs md:text-sm text-gray-500'>Demo1@gmail.com</p>
          </div>
        </div>
        <button className='text-blue-500 font-semibold text-xs hover:text-blue-700 transition-colors'>
          Switch
        </button>
      </div>

      {/* Suggested for you Section */}
      <div className='mb-4'>
        <div className='flex justify-between items-center px-1 mb-3'>
          <p className='text-gray-500 font-semibold text-sm'>Suggested for you</p>
          <button className='text-gray-900 font-semibold text-xs hover:text-gray-600 transition-colors'>
            See All
          </button>
        </div>

        {/* Suggestions List */}
        <div className='space-y-2 md:space-y-3'>
          {dummySuggested.map((suggestion, index) => (
            <div key={index} className='flex justify-between items-center px-1 py-1.5 md:py-2 rounded-lg transition-colors'>
              <div className='flex items-center flex-1'>
                <img 
                  className='w-8 h-8 rounded-full object-cover' 
                  src={suggestion.profile} 
                  alt={`${suggestion.username} profile`} 
                />
                <div className='flex flex-col ml-2 md:ml-3 flex-1 min-w-0'>
                  <p className='font-semibold text-sm truncate'>
                    {suggestion.username}
                  </p>
                  <p className='font-normal text-xs truncate'>
                    {suggestion.followedBy ? `Followed by ${suggestion.followedBy}` : 'Suggested for you'}
                  </p>
                </div>
              </div>
              <button className='text-blue-500 font-semibold text-xs hover:text-blue-700 transition-colors ml-2 flex-shrink-0'>
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className='mt-6 md:mt-8 px-1'>
        <div className='text-xs text-gray-400 space-y-1'>
          <div className='flex flex-wrap gap-1'>
            <span>About ·</span>
            <span>Help ·</span>
            <span>Press ·</span>
            <span>API ·</span>
            <span>Jobs ·</span>
            <span>Privacy ·</span>
            <span>Terms ·</span>
          </div>
          <div className='flex flex-wrap gap-1'>
            <span>Locations ·</span>
            <span>Language ·</span>
            <span>Meta Verified</span>
          </div>
        </div>
        <p className='text-xs text-gray-400 mt-4'>© 2025 Vartul FROM MANIPAL</p>
      </div>

      {/* Messenger UI Component */}
      <div className='fixed bottom-6 right-6 z-50'>
        <div className='flex items-center bg-gray-800 rounded-full p-2 shadow-lg'>
          <div className='flex space-x-2'>
            <div className='w-10 h-10 rounded-full bg-white flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </div>
            <div className='w-10 h-10 rounded-full bg-green-500 flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z" clipRule="evenodd" />
              </svg>
            </div>
            <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <path d="M12 2C6.486 2 2 6.262 2 11.5c0 2.545 1.088 4.988 3 6.772v4.228l4.833-2.416C10.498 20.7 11.246 21 12 21c5.514 0 10-4.262 10-9.5S17.514 2 12 2zm0 2c4.411 0 8 3.365 8 7.5S16.411 19 12 19c-.53 0-1.043-.072-1.533-.207L7.8 20.387V17.63C5.844 16.27 4 14.035 4 11.5 4 7.365 7.589 4 12 4z" />
              </svg>
            </div>
            <div className='w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homeright