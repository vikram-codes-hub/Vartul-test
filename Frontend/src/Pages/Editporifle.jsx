import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    bio: "",
    website: "",
    profilePic: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setFormData({
          username: data.user.username || "",
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          bio: data.user.bio || "",
          website: data.user.website || "",
          profilePic: data.user.profilePic || ""
        });
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold mb-6">Edit profile</h1>

        {/* Profile header */}
        <div className="flex items-center justify-between bg-[#262626] rounded-2xl p-4 mb-8">
          <div className="flex items-center gap-4">
            <img
              src={
                formData.profilePic ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
              }
              className="w-14 h-14 rounded-full object-cover"
              alt="profile"
            />
            <div>
              <div className="font-semibold">{formData.username}</div>
              <div className="text-sm text-gray-400">
                {formData.firstName} {formData.lastName}
              </div>
            </div>
          </div>

          <button className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg text-sm font-semibold">
            Change photo
          </button>
        </div>
        

      

        {/* firstname */}
        <div>
            <label className="block text-sm font-semibold mb-2">Firstname</label>
             <textarea
            name="bio"
            rows="1"
            maxLength={40}
            value={formData.bio}
            onChange={handleChange}
            className="w-full bg-[#262626] rounded-xl px-4 py-3 resize-none outline-none"
          />
        </div>

        {/* lastname */}
        <div>
            <label className="block text-sm font-semibold mb-2">Lastname</label>
             <textarea
            name="bio"
            rows="1"
            maxLength={40}
            value={formData.bio}
            onChange={handleChange}
            className="w-full bg-[#262626] rounded-xl px-4 py-3 resize-none outline-none"
          />
        </div>

       

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Bio</label>
          <textarea
            name="bio"
            rows="3"
            maxLength={150}
            value={formData.bio}
            onChange={handleChange}
            className="w-full bg-[#262626] rounded-xl px-4 py-3 resize-none outline-none"
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {formData.bio.length} / 150
          </div>
        </div>

      
        {/* Gender */}
        <div className="mb-10">
          <label className="block text-sm font-semibold mb-2">Gender</label>
          <select className="w-full bg-[#262626] rounded-xl px-4 py-3 outline-none">
            <option>Male</option>
            <option>Female</option>
            <option>Prefer not to say</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
