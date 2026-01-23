import { createContext, useContext, useState } from "react";
import {
  getStoriesFeedApi,
  getMyStoriesApi,
  viewStoryApi
} from "../api/StoryApi"
import { toast } from "react-hot-toast";

export const StoryContext = createContext();

export const useStory = () => useContext(StoryContext);

const StoryContextProvider = ({ children }) => {
  const [stories, setStories] = useState([]); // feed stories
  const [myStories, setMyStories] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH STORIES FEED
  ========================= */
  const fetchStoriesFeed = async () => {
    try {
      setLoading(true);
      const { data } = await getStoriesFeedApi();

      if (data.success) {
        setStories(data.stories);
      }
    } catch (err) {
      console.error("Fetch stories failed", err);
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FETCH MY STORIES
  ========================= */
  const fetchMyStories = async () => {
    try {
      const { data } = await getMyStoriesApi();
      if (data.success) {
        setMyStories(data.stories);
      }
    } catch (err) {
      console.error("Fetch my stories failed", err);
    }
  };

  /* =========================
     VIEW STORY
  ========================= */
  const viewStory = async (storyId) => {
    try {
      await viewStoryApi(storyId);

      // Optimistic UI update
      setStories((prev) =>
        prev.map((userStory) => ({
          ...userStory,
          stories: userStory.stories.map((s) =>
            s._id === storyId
              ? { ...s, viewed: true }
              : s
          )
        }))
      );
    } catch (err) {
      console.error("View story failed", err);
    }
  };

  const value = {
    stories,
    myStories,
    loading,
    fetchStoriesFeed,
    fetchMyStories,
    viewStory
  };

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
};

export default StoryContextProvider;
