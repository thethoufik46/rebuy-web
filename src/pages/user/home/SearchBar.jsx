import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar({
  value,
  onChange,
  suggestions = [],
  onSuggestionTap,
}) {
  const brands = ["BMW", "Audi", "Crysta", "Swift", "Ertiga", "Thar", "Fortuner"];

  const [animatedHint, setAnimatedHint] = useState("");
  const [brandIndex, setBrandIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const word = brands[brandIndex];

      if (!isDeleting) {
        if (charIndex < word.length) {
          setCharIndex((prev) => prev + 1);
          setAnimatedHint(word.substring(0, charIndex + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 800);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((prev) => prev - 1);
          setAnimatedHint(word.substring(0, charIndex - 1));
        } else {
          setIsDeleting(false);
          setBrandIndex((prev) => (prev + 1) % brands.length);
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, [charIndex, isDeleting, brandIndex]);

  return (
    <div className="w-full">
      {/* 🔍 SEARCH BAR */}
      <div className="px-2 py-2">
        <div
          className="
            flex items-center
            rounded-full
            bg-white/50
            backdrop-blur-xl
            border border-white/40
            shadow-sm
            px-3
            h-[42px]
          "
        >
          <span className="text-slate-500 text-sm mr-2">🔍</span>

          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Search ${animatedHint}`}
            className="
              flex-1
              bg-transparent
              outline-none
              text-sm
              placeholder:text-slate-400
            "
          />
        </div>
      </div>

      {/* 🔽 SUGGESTIONS */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="
              mx-6
              rounded-2xl
              bg-white/60
              backdrop-blur-xl
              border border-white/40
              shadow-lg
              max-h-[260px]
              overflow-y-auto
            "
          >
            {suggestions.map((item, index) => (
              <div
                key={index}
                onClick={() => onSuggestionTap(item)}
                className="
                  flex items-center
                  gap-2
                  px-3
                  py-2
                  text-xs
                  cursor-pointer
                  hover:bg-white/40
                "
              >
                <span>🏷️</span>
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
