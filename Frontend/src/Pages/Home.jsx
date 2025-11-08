import React from 'react'
import Hero from '../Components/Homeleft/Hero'
import Postforhome from '../Components/Homeleft/Postforhome'
import Homeright from '../Components/Homeright/Homeright'

const Home = () => {
  return (
    <div className="flex bg-black min-h-screen">
   
      
   
      <div className="flex-1 ml-0 lg:ml-[250px] overflow-x-hidden">

   
        <div >
         <Hero/>
        </div>
        
        {/* Posts Feed */}
        <div className="max-w-2xl ">
          <Postforhome />
        </div>
      </div>
      <Homeright/>
    </div>
  )
}

export default Home
