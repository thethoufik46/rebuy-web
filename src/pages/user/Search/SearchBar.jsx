import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchPopup from "./SearchPopup";

const brands = [
  "BMW",
  "Audi",
  "Crysta",
  "Swift",
  "Ertiga",
  "Thar",
  "Fortuner",
  "KTM",
  "iPhone",
  "Laptop",
  "Home",
  "Land",
];

export default function SearchBar({
  value = "",
  onChange = () => {},
  allCars = [],
  onSearch,
}) {
  const [animatedHint, setAnimatedHint] =
    useState("");

  const [brandIndex, setBrandIndex] =
    useState(0);

  const [charIndex, setCharIndex] =
    useState(0);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [showPopup, setShowPopup] =
    useState(false);

  useEffect(() => {
    const word =
      brands[brandIndex];

    const speed = isDeleting
      ? 70
      : 120;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (
          charIndex <
          word.length
        ) {
          const next =
            charIndex + 1;

          setCharIndex(next);

          setAnimatedHint(
            word.substring(
              0,
              next
            )
          );
        } else {
          setTimeout(() => {
            setIsDeleting(true);
          }, 800);
        }
      } else {
        if (charIndex > 0) {
          const next =
            charIndex - 1;

          setCharIndex(next);

          setAnimatedHint(
            word.substring(
              0,
              next
            )
          );
        } else {
          setIsDeleting(false);

          setBrandIndex(
            (prev) =>
              (prev + 1) %
              brands.length
          );
        }
      }
    }, speed);

    return () =>
      clearTimeout(timer);
  }, [
    brandIndex,
    charIndex,
    isDeleting,
  ]);

  const handleSubmit = (
    query,
    matchedCars
  ) => {
    onChange(query);

    if (onSearch) {
      onSearch(
        query,
        matchedCars
      );
    }
  };

  return (
    <>
      {/* SEARCH BAR */}

      <div
        className="
          w-full
          px-2
          py-2
        "
      >
        <button
          type="button"
          onClick={() =>
            setShowPopup(true)
          }
          className="
            flex
            h-12
            w-full
            items-center
            gap-3
            rounded-full
            border
            border-white/50
            bg-white/45
            px-4
            text-left
            shadow-sm
            backdrop-blur-xl
            transition
            hover:bg-white/60
            active:scale-[0.99]
          "
        >
          {/* SEARCH ICON */}

          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-black/70"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
            />

            <path
              d="m20 20-4-4"
            />
          </svg>

          {/* TEXT */}

          <span
            className="
              min-w-0
              flex-1
              truncate
              text-sm
              text-black/50
            "
          >
            Search{" "}
            <span className="text-black/65">
              {animatedHint}
            </span>
          </span>
        </button>
      </div>

      {/* POPUP */}

      <AnimatePresence>
        {showPopup && (
          <SearchPopup
            allCars={allCars}
            initialValue={value}
            onClose={() =>
              setShowPopup(false)
            }
            onSearch={(
              query,
              matchedCars
            ) => {
              setShowPopup(false);

              handleSubmit(
                query,
                matchedCars
              );
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}