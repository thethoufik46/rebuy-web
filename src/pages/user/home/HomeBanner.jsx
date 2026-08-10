// src/pages/user/home/HomeBanner.jsx

import React, { useEffect, useRef, useState } from "react";
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

  /* =======================================================
     FORCE AUTOPLAY
  ======================================================= */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = true;
    video.setAttribute("muted", "");

    const startVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log("Autoplay blocked:", error);
      }
    };

    startVideo();

    return () => {
      video.pause();
    };
  }, []);

  /* =======================================================
     SCROLL
  ======================================================= */

  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  /* =======================================================
     EXPLORE
  ======================================================= */

  const exploreListings = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  /* =======================================================
     SELL
  ======================================================= */

  const sellVehicle = () => {
    window.location.href = "/post";
  };

  return (
    <section className="re2buy-home-banner">

      {/* ===================================================
          VIDEO
      =================================================== */}

      <div className="re2buy-banner-video-layer">

        <video
          ref={videoRef}
          className={`
            re2buy-banner-video
            ${videoLoaded ? "re2buy-video-ready" : ""}
          `}
          src={BANNER_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          onLoadedData={() => {
            setVideoLoaded(true);
          }}
        />

        {/* =================================================
            DARK OVERLAY
        ================================================= */}

        <div className="re2buy-banner-dark-overlay" />

        {/* =================================================
            TOP OVERLAY
        ================================================= */}

        <div className="re2buy-banner-top-overlay" />

        {/* =================================================
            BOTTOM OVERLAY
        ================================================= */}

        <div className="re2buy-banner-bottom-overlay" />

      </div>

      {/* =====================================================
          HERO CONTENT
      ===================================================== */}

      <div className="re2buy-banner-content">

        <motion.div
          className="re2buy-banner-content-inner"

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
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          {/* =================================================
              SMALL TEXT
          ================================================= */}

          <motion.div
            className="re2buy-banner-small-text"

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
            className="re2buy-banner-title"

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
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Find your dream
            <br />
            <span>vehicle today</span>
          </motion.h1>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <motion.p
            className="re2buy-banner-description"

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
            Buy and sell verified cars, bikes,
            property and electronics with confidence.
          </motion.p>

          {/* =================================================
              CTA
          ================================================= */}

          <motion.div
            className="re2buy-banner-actions"

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

            <button
              type="button"
              className="re2buy-banner-main-button"
              onClick={exploreListings}
            >
              <span>
                Explore Listings
              </span>

              <span className="re2buy-button-arrow">
                ↗
              </span>
            </button>

            <button
              type="button"
              className="re2buy-banner-outline-button"
              onClick={sellVehicle}
            >
              Sell Your Vehicle
            </button>

          </motion.div>

        </motion.div>

      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <button
        type="button"
        className="re2buy-banner-scroll"
        onClick={scrollDown}
        aria-label="Scroll down"
      >

        <span className="re2buy-scroll-label">
          SCROLL
        </span>

        <span className="re2buy-scroll-track">

          <motion.span
            className="re2buy-scroll-dot"

            animate={{
              y: [0, 65, 0],
              opacity: [1, 0.35, 1],
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