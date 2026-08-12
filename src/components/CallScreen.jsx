import React from "react";
import { motion } from "framer-motion";

import callIcon from "@/assets/socialicons/1.webp";
import whatsappIcon from "@/assets/socialicons/6.webp";

/* =========================================================
   CALL SUPPORT
   Converted from Flutter CallScreen
   Path:
   src/components/CallScreen.jsx
========================================================= */

const PHONE = "+918270149856";

const callNumber = () => {
  window.location.href = `tel:${PHONE}`;
};

const openWhatsApp = () => {
  const message = "Hi, I'm Re2Buy app user 👋";
  const url = `https://wa.me/918270149856?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank", "noopener,noreferrer");
};

function IconCircle({ src, alt }) {
  return (
    <div
      className="
        flex h-[38px] w-[38px] shrink-0
        items-center justify-center
        rounded-full
        bg-white/95
        shadow-[0_4px_10px_rgba(0,0,0,0.04)]
      "
    >
      <img
        src={src}
        alt={alt}
        className="h-5 w-5 object-contain"
      />
    </div>
  );
}

export default function CallScreen() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 28,
        scale: 0.94,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="
        w-full
        px-4
        font-['AnekTamil',sans-serif]
        flex
        justify-center
      "
    >
      <div
        className="
          relative
          w-full
          max-w-[520px]
          overflow-hidden
          rounded-[18px]
          border border-white/45
          bg-[#FFF3E0]/80
          p-4
          shadow-[0_8px_18px_rgba(0,0,0,0.03)]
          backdrop-blur-[14px]
        "
      >
        {/* =================================================
            CALL + WHATSAPP
        ================================================= */}

        <div className="flex items-center">
          {/* CALL */}
          <button
            type="button"
            onClick={callNumber}
            className="
              group
              flex min-w-0
              flex-1
              items-center
              rounded-[14px]
              text-left
              outline-none
              transition-transform
              duration-200
              active:scale-[0.98]
            "
            aria-label="Call Support"
          >
            <IconCircle
              src={callIcon}
              alt="Call"
            />

            <div className="ml-2.5 min-w-0">
              <div
                className="
                  text-[13px]
                  font-bold
                  leading-tight
                  text-black
                "
              >
                Call Support
              </div>

              <div
                className="
                  mt-0.5
                  text-[11px]
                  leading-tight
                  text-black/55
                "
              >
                அழைக்கவும்
              </div>
            </div>
          </button>

          {/* DIVIDER */}
          <div className="mx-3 h-9 w-px shrink-0 bg-black/10" />

          {/* WHATSAPP */}
          <button
            type="button"
            onClick={openWhatsApp}
            className="
              group
              flex min-w-0
              flex-1
              items-center
              justify-end
              rounded-[14px]
              text-right
              outline-none
              transition-transform
              duration-200
              active:scale-[0.98]
            "
            aria-label="WhatsApp"
          >
            <div className="mr-2.5 min-w-0">
              <div
                className="
                  text-[13px]
                  font-bold
                  leading-tight
                  text-black
                "
              >
                WhatsApp
              </div>

              <div
                className="
                  mt-0.5
                  text-[11px]
                  leading-tight
                  text-black/55
                "
              >
                வாட்ஸ்அப்
              </div>
            </div>

            <IconCircle
              src={whatsappIcon}
              alt="WhatsApp"
            />
          </button>
        </div>

        {/* =================================================
            HELP / PHONE
        ================================================= */}

        <div
          className="
            mt-3.5
            flex w-full
            items-center
            justify-center
            rounded-[14px]
            bg-white/55
            px-3
            py-2.5
          "
        >
          <span
            className="
              text-[12.5px]
              font-bold
              text-black/85
            "
          >
            Help
          </span>

          <span className="mx-2.5 text-[13px] text-black/35">
            |
          </span>

          <button
            type="button"
            onClick={callNumber}
            className="
              text-[13px]
              font-semibold
              tracking-[0.2px]
              text-black/85
              outline-none
              transition-opacity
              hover:opacity-70
              active:opacity-50
            "
          >
            +91 82701 49856
          </button>
        </div>
      </div>
    </motion.div>
  );
}