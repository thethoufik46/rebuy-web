
// src/pages/user/home/HomeBanner.jsx

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import "./HomeBanner.css";

/* =========================================================
   BANNER VIDEO
   ========================================================= */

const BANNER_VIDEO =
  "https://scleasing.dk/wp-content/uploads/2026/07/SCL-Hjemmeside-banner-2026.mp4";

/* =========================================================
   HOME BANNER
   ========================================================= */

export default function HomeBanner() {
  const videoRef = useRef(null);

  const [videoLoaded, setVideoLoaded] = useState(false);

  /*
   * Desktop only video.
   *
   * Mobile:
   * - Video is NOT rendered
   * - Video is NOT loaded
   * - Video is NOT played
   *
   * Desktop:
   * - Video renders normally
   * - Autoplay enabled
   */
  const [isDesktop, setIsDesktop] = useState(false);

  /*
   * Banner starts visible every time website/page opens.
   *
   * No sessionStorage.
   * No localStorage.
   * No cookie.
   *
   * Once user scrolls, banner hides for this page mount.
   */
  const [showBanner, setShowBanner] = useState(true);

  /* =======================================================
     DESKTOP / MOBILE DETECTION
  ======================================================= */

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 769px)"
    );

    const updateDevice = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateDevice();

    mediaQuery.addEventListener(
      "change",
      updateDevice
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateDevice
      );
    };
  }, []);

  /* =======================================================
     AUTOPLAY VIDEO
     DESKTOP ONLY
  ======================================================= */

  useEffect(() => {
    /*
     * Mobile:
     * Completely skip video logic.
     */
    if (!isDesktop || !showBanner) {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    /* -----------------------------------------------
       Desktop autoplay settings
    ----------------------------------------------- */

    video.muted = true;
    video.defaultMuted = true;

    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute(
      "webkit-playsinline",
      ""
    );

    /* -----------------------------------------------
       PLAY VIDEO
    ----------------------------------------------- */

    const startVideo = async () => {
      try {
        video.muted = true;

        await video.play();
      } catch (error) {
        console.log(
          "Autoplay blocked:",
          error
        );
      }
    };

    /* Try immediately */

    startVideo();

    /* Try when video is ready */

    const handleCanPlay = () => {
      setVideoLoaded(true);

      startVideo();
    };

    video.addEventListener(
      "canplay",
      handleCanPlay
    );

    video.addEventListener(
      "loadeddata",
      handleCanPlay
    );

    /* -----------------------------------------------
       Desktop fallback
    ----------------------------------------------- */

    const retryVideo = () => {
      startVideo();
    };

    window.addEventListener(
      "touchstart",
      retryVideo,
      {
        once: true,
        passive: true,
      }
    );

    window.addEventListener(
      "click",
      retryVideo,
      {
        once: true,
      }
    );

    /* -----------------------------------------------
       CLEANUP
    ----------------------------------------------- */

    return () => {
      video.pause();

      video.removeEventListener(
        "canplay",
        handleCanPlay
      );

      video.removeEventListener(
        "loadeddata",
        handleCanPlay
      );

      window.removeEventListener(
        "touchstart",
        retryVideo
      );

      window.removeEventListener(
        "click",
        retryVideo
      );
    };
  }, [isDesktop, showBanner]);

  /* =======================================================
     HIDE BANNER ON USER SCROLL
  ======================================================= */

  useEffect(() => {
    if (!showBanner) {
      return;
    }

    let scrolling = false;

    const handleScroll = () => {
      if (scrolling) {
        return;
      }

      scrolling = true;

      window.requestAnimationFrame(() => {
        const scrollTop =
          window.scrollY ||
          window.pageYOffset ||
          0;

        /*
         * Hide after small amount of scrolling.
         */

        if (scrollTop > 40) {
          setShowBanner(false);
        }

        scrolling = false;
      });
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [showBanner]);

  /* =======================================================
     HIDE BANNER
  ======================================================= */

  const hideBanner = () => {
    const video = videoRef.current;

    if (video) {
      video.pause();
    }

    setShowBanner(false);
  };

  /* =======================================================
     SCROLL DOWN
  ======================================================= */

  const scrollDown = () => {
    const nextPosition =
      window.innerHeight;

    hideBanner();

    requestAnimationFrame(() => {
      window.scrollTo({
        top: nextPosition,
        behavior: "smooth",
      });
    });
  };

  /* =======================================================
     EXPLORE LISTINGS
  ======================================================= */

  const exploreListings = () => {
    const nextPosition =
      window.innerHeight;

    hideBanner();

    requestAnimationFrame(() => {
      window.scrollTo({
        top: nextPosition,
        behavior: "smooth",
      });
    });
  };

  /* =======================================================
     SELL VEHICLE
  ======================================================= */

  const sellVehicle = () => {
    hideBanner();

    window.location.href = "/post";
  };

  /* =======================================================
     BANNER HIDDEN
  ======================================================= */

  if (!showBanner) {
    return null;
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section
      className="
        re2buy-banner
        relative
        h-screen
        min-h-[650px]
        w-full
        overflow-hidden
      "
    >
      {/* ===================================================
          VIDEO BACKGROUND
          
          IMPORTANT:
          Video is rendered ONLY on desktop.
          
          Mobile:
          No <video> element at all.
          So mobile will not download/play the video.
      =================================================== */}

      <div className="re2buy-banner-video-layer">

        {isDesktop && (
          <video
            ref={videoRef}
            className={`
              re2buy-banner-video
              ${
                videoLoaded
                  ? "re2buy-video-ready"
                  : ""
              }
            `}
            src={BANNER_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            onLoadedData={() => {
              setVideoLoaded(true);
            }}
          />
        )}

        {/* =================================================
            DARK OVERLAY
        ================================================= */}

        <div
          className="
            re2buy-banner-dark-overlay
          "
        />

        {/* =================================================
            TOP OVERLAY
        ================================================= */}

        <div
          className="
            re2buy-banner-top-overlay
          "
        />

        {/* =================================================
            BOTTOM OVERLAY
        ================================================= */}

        <div
          className="
            re2buy-banner-bottom-overlay
          "
        />

      </div>

      {/* ===================================================
          HERO CONTENT
      =================================================== */}

      <div className="re2buy-banner-content">

        <motion.div
          className="
            re2buy-banner-content-inner
          "
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >

          {/* =================================================
              SMALL TEXT
          ================================================= */}

          <motion.div
            className="
              re2buy-banner-small-text
            "
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
          >
            India's trusted marketplace
          </motion.div>

          {/* =================================================
              MAIN TITLE
          ================================================= */}

          <motion.h1
            className="
              re2buy-banner-title
            "
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            Find your dream
            <br />

            <span>
              vehicle today
            </span>
          </motion.h1>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <motion.p
            className="
              re2buy-banner-description
            "
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.4,
            }}
          >
            Buy and sell verified cars,
            bikes, property and electronics
            with confidence.
          </motion.p>

          {/* =================================================
              CTA
          ================================================= */}

          <motion.div
            className="
              re2buy-banner-actions
            "
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.55,
            }}
          >

            {/* ---------------------------------------------
                EXPLORE
            --------------------------------------------- */}

            <button
              type="button"
              className="
                re2buy-banner-main-button
              "
              onClick={exploreListings}
            >
              <span>
                Explore Listings
              </span>

              <span
                className="
                  re2buy-button-arrow
                "
              >
                ↗
              </span>
            </button>

            {/* ---------------------------------------------
                SELL
            --------------------------------------------- */}

            <button
              type="button"
              className="
                re2buy-banner-outline-button
              "
              onClick={sellVehicle}
            >
              Sell Your Vehicle
            </button>

          </motion.div>

        </motion.div>

      </div>

      {/* ===================================================
          SCROLL INDICATOR
      =================================================== */}

      <button
        type="button"
        className="
          re2buy-banner-scroll
        "
        onClick={scrollDown}
        aria-label="Scroll down"
      >

        <span
          className="
            re2buy-scroll-label
          "
        >
          SCROLL
        </span>

        <span
          className="
            re2buy-scroll-track
          "
        >

          <motion.span
            className="
              re2buy-scroll-dot
            "
            animate={{
              y: [
                0,
                65,
                0,
              ],
              opacity: [
                1,
                0.35,
                1,
              ],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

        </span>

      </button>

    </section>
  );
}
