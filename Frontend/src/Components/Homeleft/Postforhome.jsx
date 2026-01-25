import { useEffect } from "react";
import { usePost } from "../../context/PostContext";
import Posthelper from "./Posthelper/Posthelper";

const Postforhome = () => {
  const { feedPosts, fetchFeedPosts, loading, hasMore } = usePost();

  useEffect(() => {
    fetchFeedPosts(true);
  }, []);

  return (
    <div className="space-y-6">
      {feedPosts.map((post) => (
        <Posthelper key={post._id} post={post} />
      ))}

      {loading && (
        <p className="text-center text-gray-500">Loading...</p>
      )}

      {!hasMore && feedPosts.length > 0 && (
        <p className="text-center text-gray-500 py-8">
          You’re all caught up 🎉
        </p>
      )}
    </div>
  );
};

export default Postforhome;
