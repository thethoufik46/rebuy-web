import React, { useEffect, useRef, useState } from "react";

export default function StoryViewer({ stories = [], initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const timerRef = useRef(null);
  const videoRef = useRef(null);

  const story = stories[currentIndex];
  const isVideo = story?.mediaType === "video";

  /* ================= LOAD STORY ================= */

  useEffect(() => {
    clearTimer();

    if (!story) return;

    if (story.mediaType === "image") {
      timerRef.current = setTimeout(nextStory, 20000);
    }

    if (story.mediaType === "video" && videoRef.current) {
      const video = videoRef.current;

      video.currentTime = 0;
      video.muted = isMuted;
      video.play().catch(() => {});

      const handleEnded = () => nextStory();
      video.addEventListener("ended", handleEnded);

      return () => video.removeEventListener("ended", handleEnded);
    }
  }, [currentIndex, story]);

  /* ================= TIMER ================= */

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  /* ================= NAVIGATION ================= */

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onClose?.();
    }
  };

  /* ================= CONTROLS ================= */

  const togglePause = () => {
    if (!story) return;

    if (isVideo && videoRef.current) {
      const video = videoRef.current;

      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    } else {
      if (isPaused) {
        timerRef.current = setTimeout(nextStory, 20000);
      } else {
        clearTimer();
      }
    }

    setIsPaused((p) => !p);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  /* ================= PRESS / HOLD ================= */

  const pressStart = () => togglePause();
  const pressEnd = () => togglePause();

  if (!story) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div
        className="relative w-full h-full flex items-center justify-center"
        onMouseDown={pressStart}
        onMouseUp={pressEnd}
        onTouchStart={pressStart}
        onTouchEnd={pressEnd}
      >
        <div className="w-[360px] aspect-[9/16] bg-black relative">
          {story.mediaType === "image" ? (
            <img
              src={story.media}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              src={story.media}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
          )}
        </div>

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-10 right-6 text-white text-2xl"
        >
          ✕
        </button>

        {/* VIDEO CONTROLS */}
        {isVideo && (
          <div className="absolute top-10 left-6 flex gap-3">
            <button
              onClick={toggleMute}
              className="text-white text-xl"
            >
              {isMuted ? "🔇" : "🔊"}
            </button>

            <button
              onClick={togglePause}
              className="text-white text-xl"
            >
              {videoRef.current?.paused ? "▶" : "⏸"}
            </button>
          </div>
        )}

        {/* TITLE GLASS */}
        <div
          className="
            absolute bottom-10 left-6 right-6
            backdrop-blur-xl
            bg-white/15
            border border-white/30
            rounded-2xl
            py-3 px-4
            text-white text-center
          "
        >
          {story.title || ""}
        </div>
      </div>
    </div>
  );
}