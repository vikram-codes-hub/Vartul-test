import React, { useState } from "react";
import img1 from "../../assets/profile_alison.png";
import { dummySuggested } from "../../assets/Storydummydata";

const Homeright = () => {
  const [follow, setFollow] = useState({});

  const footerLinks = [
    ["About", "Help", "Press", "API", "Jobs", "Privacy"],
    ["Terms", "Locations", "Language", "Meta Verified"]
  ];

  return (
    <div className="hidden xl:block w-[320px] sticky top-0 h-screen overflow-y-auto py-8 px-2">
      <div className="w-full">
        {/* Current user */}
        <div className="flex justify-between items-center mb-5 px-2">
          <div className="flex items-center gap-3">
            <img src={img1} className="w-11 h-11 rounded-full object-cover" alt="Profile" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Demo1</p>
              <p className="text-xs text-gray-400 truncate">demo1@gmail.com</p>
            </div>
          </div>
          <button className="text-xs text-blue-400 font-semibold hover:text-white transition-colors">
            Switch
          </button>
        </div>

        {/* Suggestions header */}
        <div className="flex justify-between items-center mb-4 px-2">
          <p className="text-sm text-gray-400 font-semibold">Suggested for you</p>
          <button className="text-xs text-white font-semibold hover:text-gray-300 transition-colors">
            See All
          </button>
        </div>

        {/* Suggested users */}
        <div className="space-y-3 mb-6">
          {dummySuggested.map((u, i) => (
            <div key={i} className="flex justify-between items-center px-2 py-1 hover:bg-white/5 rounded-lg transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img 
                  src={u.profile} 
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0" 
                  alt={u.username}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {u.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {u.followedBy || "Suggested for you"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFollow({ ...follow, [i]: !follow[i] })}
                className={`text-xs font-semibold flex-shrink-0 ml-2 transition-colors ${
                  follow[i] ? "text-gray-400 hover:text-gray-300" : "text-blue-400 hover:text-blue-300"
                }`}
              >
                {follow[i] ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-10 px-2 space-y-3">
          {footerLinks.map((row, idx) => (
            <div key={idx} className="flex flex-wrap gap-x-2 gap-y-1">
              {row.map((link, i) => (
                <React.Fragment key={link}>
                  <a 
                    href="#" 
                    className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    {link}
                  </a>
                  {i < row.length - 1 && (
                    <span className="text-[11px] text-gray-600">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
          
          <p className="text-[11px] text-gray-600 mt-4">
            © 2025 VARTUL FROM MANIPAL
          </p>
        </div>
      </div>
    </div>
  );
};

export default Homeright;