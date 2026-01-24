// src/components/Hero.jsx
import React, { useRef, useState, useEffect, useContext } from "react";
import Story from "./Story";
import { StoryContext } from "../../Context/StoryContext";
import { uploadStoryApi } from "../../api/storyApi";

const Hero = () => {
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    stories,
    myStories,
    loading,
    fetchStoriesFeed,
    fetchMyStories,
  } = useContext(StoryContext);

  useEffect(() => {
    fetchStoriesFeed();
    fetchMyStories();
  }, []);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    ref?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      ref?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [stories, myStories]);

  const scroll = (dir) => {
    scrollRef.current.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  /* =========================
     ADD STORY FLOW
  ========================= */
  const handleAddStoryClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const closePreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploading(false);
  };

const handleShareStory = async () => {
  if (!selectedFile || uploading) return;

  try {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    await uploadStoryApi(formData);

    closePreview();
    fetchStoriesFeed();
    fetchMyStories();
  } catch (err) {
    console.error("Story upload failed:", err);
    alert("Failed to upload story");
    setUploading(false);
  }
};


  if (loading) return null;

  const hasMyStories = myStories.length > 0;
  const allStories = stories || [];

  return (
    <>
      {/* ================= PREVIEW ================= */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <button onClick={closePreview} className="text-white text-lg">
              ✕
            </button>
            <button
              onClick={handleShareStory}
              disabled={uploading}
              className={`font-semibold ${
                uploading ? "text-gray-400" : "text-blue-500"
              }`}
            >
              {uploading ? "Uploading..." : "Share"}
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {selectedFile.type.startsWith("image") ? (
              <img
                src={previewUrl}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                autoPlay
                className="max-h-full max-w-full"
              />
            )}
          </div>
        </div>
      )}

      {/* ================= STORY BAR ================= */}
      <div className="relative w-full bg-black overflow-hidden">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full items-center justify-center shadow z-10"
          >
            ‹
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto py-4 px-4 scrollbar-hide"
        >
          {!hasMyStories && (
            <div
              className="flex flex-col items-center space-y-1 cursor-pointer"
              onClick={handleAddStoryClick}
            >
              <div className="relative">
                <div className="w-[66px] h-[66px] rounded-full border-2 border-dashed border-gray-500">
                  <img
                    src="/default-avatar.png"
                    className="w-full h-full rounded-full opacity-50"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                  +
                </div>
              </div>
              <p className="text-xs text-white">Add Story</p>
            </div>
          )}

          {allStories.map((userStories) => (
            <Story key={userStories.userId} userStories={userStories} />
          ))}
        </div>

        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full items-center justify-center shadow z-10"
          >
            ›
          </button>
        )}
      </div>
    </>
  );
};

export default Hero;
