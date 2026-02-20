import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://rebuy-api.onrender.com/api";

/* CACHE */
let cachedVariants = [];
let cacheTime = null;
const CACHE_DURATION = 10 * 60 * 1000;

const MAX_VARIANTS = 5;
const SUBTITLE = "Filtered by";

/* HELPERS */
const s = (v) => (v ? v.toString() : "");

export default function HomeRoundButtons() {
  const navigate = useNavigate();

  const [variants, setVariants] = useState([]);

  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);
  const userInteractingRef = useRef(false);

  useEffect(() => {
    loadVariants();
  }, []);

  const loadVariants = async () => {
    if (
      cacheTime &&
      Date.now() - cacheTime < CACHE_DURATION &&
      cachedVariants.length
    ) {
      setVariants(cachedVariants);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/variants/visible`);
      const data = await res.json();

      const fetched = data.variants || [];

      cachedVariants = fetched;
      cacheTime = Date.now();

      setVariants(fetched);
    } catch (e) {
      console.log("Variants error 👉", e);
    }
  };

  /* AUTO SCROLL */
  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [variants]);

  const startAutoScroll = () => {
    stopAutoScroll();

    autoScrollRef.current = setInterval(() => {
      if (!scrollRef.current || userInteractingRef.current) return;

      const el = scrollRef.current;

      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + 0.7;

      if (next >= max) {
        stopAutoScroll();

        setTimeout(() => {
          if (!scrollRef.current) return;
          scrollRef.current.scrollLeft = 0;
          startAutoScroll();
        }, 2000);

        return;
      }

      el.scrollLeft = next;
    }, 16);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  if (!variants.length) return null;

  const showVariants = variants.slice(0, MAX_VARIANTS);

  return (
    <div style={{ height: 140 }}>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide"
        onMouseDown={() => (userInteractingRef.current = true)}
        onMouseUp={() => (userInteractingRef.current = false)}
        onMouseLeave={() => (userInteractingRef.current = false)}
        onTouchStart={() => (userInteractingRef.current = true)}
        onTouchEnd={() => (userInteractingRef.current = false)}
      >
        {showVariants.map((variant, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07 }}
          >
            <TapScaleCard
              title={s(variant.variantName)}
              imageUrl={s(variant.variantImage)}
              onTap={() =>
                navigate(`/variant/${s(variant.variantName)}`)
              }
            />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: showVariants.length * 0.07 }}
        >
          <ViewAllCard onTap={() => navigate("/variants")} />
        </motion.div>
      </div>
    </div>
  );
}

function TapScaleCard({ title, imageUrl, onTap }) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={onTap}
      className="relative rounded-2xl overflow-hidden cursor-pointer"
      style={{ width: 90, height: 130, marginRight: 12 }}
    >
      <img
        src={imageUrl}
        alt=""
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-0 left-0 right-0 h-11 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute bottom-1 left-1 right-1 rounded-full backdrop-blur-md bg-white/70 text-center py-1">
        <div className="text-[9px]">{title}</div>
        <div className="text-[7px] text-black/60">{SUBTITLE}</div>
      </div>
    </motion.div>
  );
}

function ViewAllCard({ onTap }) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={onTap}
      className="rounded-2xl flex items-center justify-center cursor-pointer"
      style={{
        width: 90,
        height: 130,
        marginRight: 12,
        background: "#F2F0FF",
      }}
    >
      <span className="text-xs font-semibold">VIEW ALL</span>
    </motion.div>
  );
}