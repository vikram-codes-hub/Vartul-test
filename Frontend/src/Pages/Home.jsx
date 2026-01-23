import React from "react";
import Hero from "../Components/Homeleft/Hero";
import Postforhome from "../Components/Homeleft/Postforhome";
import Homeright from "../Components/Homeright/Homeright";

const Home = () => {
  return (
    <div className="flex bg-black min-h-screen text-white">
      {/* CENTER FEED */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-[470px] pt-6 pb-20">
          <Hero />
          <Postforhome />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <Homeright />
    </div>
  );
};

export default Home;
