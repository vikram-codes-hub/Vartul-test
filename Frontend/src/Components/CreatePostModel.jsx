import { useRef, useState } from "react";
import { usePost } from "../Context/PostContext";


const CreatePostModal = ({ open, onClose }) => {
  const fileRef = useRef(null);
  const { createPost } = usePost();

  const [preview, setPreview] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // ==============================
  // FILE SELECT
  // ==============================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaType(file.type.startsWith("video") ? "video" : "image");

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ==============================
  // SHARE POST
  // ==============================
  const handleShare = async () => {
    if (!preview) return;

    try {
      setLoading(true);
      await createPost({ caption, media: preview, mediaType });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="bg-[#262626] w-[500px] rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <span className="text-white font-semibold">Create new post</span>
          <button onClick={onClose} className="text-white text-xl">✕</button>
        </div>

        {/* BODY */}
        {!preview ? (
          <div className="h-[420px] flex flex-col items-center justify-center text-white">
            <div className="text-5xl mb-4">📷</div>
            <p className="mb-4">Drag photos and videos here</p>

            <button
              onClick={() => fileRef.current.click()}
              className="bg-blue-500 px-4 py-2 rounded font-semibold"
            >
              Select from computer
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              hidden
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="flex h-[420px]">

            {/* PREVIEW */}
            <div className="w-1/2 bg-black flex items-center justify-center">
              {mediaType === "image" ? (
                <img src={preview} className="max-h-full object-contain" />
              ) : (
                <video src={preview} controls className="max-h-full" />
              )}
            </div>

            {/* CAPTION */}
            <div className="w-1/2 p-4 flex flex-col">
              <textarea
                placeholder="Write a caption..."
                className="bg-transparent text-white resize-none outline-none flex-1"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />

              <button
                onClick={handleShare}
                disabled={loading}
                className="mt-3 bg-blue-500 py-2 rounded font-semibold disabled:opacity-50"
              >
                {loading ? "Sharing..." : "Share"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
