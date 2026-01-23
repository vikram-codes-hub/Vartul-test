import React, { useRef, useState, useEffect } from "react";
import Story from "./Story";
import { dummyStories } from "../../assets/Storydummydata";

const Hero = () => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    scrollRef.current?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      scrollRef.current?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (dir) => {
    scrollRef.current.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full bg-black overflow-hidden">
      {/* LEFT BUTTON */}
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full items-center justify-center shadow z-10"
        >
          ‹
        </button>
      )}

      {/* STORIES */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto py-4 scrollbar-hide"
      >
        {dummyStories.map((story, i) => (
          <Story key={i} image={story.image} username={story.username} />
        ))}
      </div>

      {/* RIGHT BUTTON */}
      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full items-center justify-center shadow z-10"
        >
          ›
        </button>
      )}
    </div>
  );
};

export default Hero;
