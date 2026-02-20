import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getStories } from "@/services/storyApi";
import StoryViewer from "@/components/Story"; // ✅ STORY VIEWER

import logo from "@/assets/logo/name.webp";
import defaultLogo from "@/assets/logo/newlogo.webp";

export default function Navbar() {
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);

  const [openStory, setOpenStory] = useState(false); // ✅ MODAL STATE

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await getStories();
      setStories(data || []);
    } catch (err) {
      console.log("Stories error 👉", err);
    } finally {
      setLoadingStories(false);
    }
  };

  const hasStory = !loadingStories && stories.length > 0;

  return (
    <>
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/40 border-b border-white/30">
        <div className="h-[60px] px-4 flex items-center">

          {/* ☰ MENU */}
          <GlassIcon onClick={() => navigate("/menu")}>
            <Hamburger />
          </GlassIcon>

          <div className="flex-1" />

          {/* ⭐ STORY */}
          <motion.div
            whileTap={{ scale: 0.92 }}
            onClick={() => hasStory && setOpenStory(true)} // ✅ OPEN VIEWER
            className="cursor-pointer"
          >
            {hasStory ? (
              <div className="w-[38px] h-[38px] rounded-full bg-green-400 p-[2px]">
                <div className="w-full h-full rounded-full bg-black overflow-hidden">
                  <img
                    src={stories[0]?.media || defaultLogo}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="w-[38px] h-[38px] rounded-full bg-white flex items-center justify-center shadow">
                <img
                  src={defaultLogo}
                  alt="logo"
                  className="w-[26px]"
                />
              </div>
            )}
          </motion.div>

          {/* 🖼️ LOGO */}
          <img
            src={logo}
            alt="logo"
            className="h-[32px] mx-2"
          />

          <div className="flex-1" />

          {/* 🔔 NOTIFICATION */}
          <GlassIcon onClick={() => navigate("/notifications")}>
            <NotificationBell />
          </GlassIcon>

        </div>
      </div>

      {/* ✅ STORY VIEWER MODAL */}
      {openStory && (
        <StoryViewer
          stories={stories}
          initialIndex={0}
          onClose={() => setOpenStory(false)}
        />
      )}
    </>
  );
}

/* ================= ICONS ================= */

function Hamburger() {
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="w-[20px] h-[2px] bg-black rounded-full" />
      <div className="w-[20px] h-[2px] bg-black rounded-full" />
    </div>
  );
}

function NotificationBell() {
  return <span className="text-[18px]">🔔</span>;
}

function GlassIcon({ children, onClick }) {
  return (
    <motion.div
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="
        w-[42px] h-[42px]
        rounded-full
        bg-white/60
        backdrop-blur-lg
        border border-white/40
        flex items-center justify-center
        shadow-sm
        cursor-pointer
      "
    >
      {children}
    </motion.div>
  );
}