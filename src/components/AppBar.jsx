// src/components/AppBar.jsx

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Reusable AppBar
 *
 * - Top: Sticky AppBar
 * - Left: Glass-style back button
 * - Center: Page title
 * - Right: Optional actions
 * - Bottom-right: Scroll-to-top button after scrolling
 *
 * @param {string|React.ReactNode} title
 * @param {function} onBack
 * @param {React.ReactNode} actions
 * @param {string} className
 */

export default function AppBar({
  title,
  onBack,
  actions,
  className = "",
}) {
  const navigate = useNavigate();

  const [showTopButton, setShowTopButton] = useState(false);

  /* =========================================================
     BACK
  ========================================================= */

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  /* =========================================================
     SCROLL DETECTION
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop;

      setShowTopButton(scrollTop > 450);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =========================================================
     SCROLL TO TOP
  ========================================================= */

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* =====================================================
          TOP APP BAR
      ===================================================== */}

      <header
        className={`
          sticky
          top-0
          z-50
          w-full
          border-b
          border-white/60
          bg-[#E9E9FF]/90
          backdrop-blur-xl
          ${className}
        `}
      >
        <div
          className="
            mx-auto
            flex
            h-[68px]
            w-full
            max-w-[1280px]
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {/* =================================================
              LEFT — BACK BUTTON
          ================================================= */}

          <motion.button
            type="button"
            onClick={handleBack}
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.9,
            }}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/90
              bg-white/70
              text-[#29252F]
              shadow-[0_8px_30px_rgba(100,80,130,0.07)]
              backdrop-blur-xl
              transition-all
              duration-200
              hover:bg-white
              hover:shadow-[0_10px_32px_rgba(100,80,130,0.11)]
              active:scale-90
            "
            aria-label="Go back"
          >
            <svg
              className="h-[21px] w-[21px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M19 12H5"
                strokeLinecap="round"
              />

              <path
                d="M12 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>

          {/* =================================================
              CENTER — TITLE
          ================================================= */}

          <div className="mx-3 min-w-0 flex-1 text-center">
            {typeof title === "string" ? (
              <span
                className="
                  block
                  truncate
                  text-[20px]
                  font-bold
                  tracking-[-0.03em]
                  text-black
                "
              >
                {title}
              </span>
            ) : (
              title
            )}
          </div>

          {/* =================================================
              RIGHT — ACTIONS
          ================================================= */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-end
            "
          >
            {actions || null}
          </div>
        </div>
      </header>

      {/* =====================================================
          SCROLL TO TOP BUTTON
      ===================================================== */}

      <AnimatePresence>
        {showTopButton && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            initial={{
              opacity: 0,
              scale: 0.7,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.7,
              y: 20,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.06,
            }}
            whileTap={{
              scale: 0.9,
            }}
            className="
              fixed
              bottom-6
              right-5
              z-[100]
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/90
              bg-white/80
              text-[#29252F]
              shadow-[0_10px_35px_rgba(80,60,120,0.16)]
              backdrop-blur-2xl
              transition-all
              hover:bg-white
              sm:bottom-7
              sm:right-7
            "
            aria-label="Scroll to top"
            title="Back to top"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M5 12l7-7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M12 19V6"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}