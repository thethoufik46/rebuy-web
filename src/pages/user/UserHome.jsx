// src/pages/user/UserHome.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./home/Navbar";

/* =========================================================
   HOME SECTIONS
========================================================= */

import HomeBanner from "@/pages/user/home/HomeBanner";
import Location from "@/pages/user/home/Location";
import Footer from "@/pages/user/home/Footer";

/* =========================================================
   CATEGORY PAGES
========================================================= */

import CarsPage from "@/pages/user/home/Pages/CarsPage";
import BikesPage from "@/pages/user/home/Pages/BikesPage";
import RealEstatePage from "@/pages/user/home/Pages/RealEstatePage";
import ElectronicsPage from "@/pages/user/home/Pages/ElectronicsPage";

/* =========================================================
   CATEGORY ICONS
========================================================= */

import carIcon from "@/assets/home/car.webp";
import bikeIcon from "@/assets/home/bike.webp";
import propertyIcon from "@/assets/home/home.webp";
import electronicsIcon from "@/assets/home/electronic.webp";

/* =========================================================
   API
========================================================= */

const BASE_URL =
  "https://rebuy-api.onrender.com/api";

/* =========================================================
   CATEGORY PAGES
   ---------------------------------------------------------
   Location is NOT a tab.
   Footer is NOT a tab.
========================================================= */

const pages = [
  {
    id: 0,
    label: "Cars",
    icon: carIcon,
    component: CarsPage,
  },
  {
    id: 1,
    label: "Bikes",
    icon: bikeIcon,
    component: BikesPage,
  },
  {
    id: 2,
    label: "Property",
    icon: propertyIcon,
    component: RealEstatePage,
  },
  {
    id: 3,
    label: "Electronics",
    icon: electronicsIcon,
    component: ElectronicsPage,
  },
];

/* =========================================================
   USER HOME
========================================================= */

export default function UserHome() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] =
    useSearchParams();

  /* =======================================================
     READ TAB FROM URL
     -------------------------------------------------------
     ?tab=0 → Cars
     ?tab=1 → Bikes
     ?tab=2 → Property
     ?tab=3 → Electronics
  ======================================================= */

  const rawTab = Number(
    searchParams.get("tab") || 0
  );

  const selectedIndex =
    Number.isInteger(rawTab) &&
    rawTab >= 0 &&
    rawTab < pages.length
      ? rawTab
      : 0;

  /* =======================================================
     STATES
  ======================================================= */

  const [cars, setCars] = useState([]);

  const [search, setSearch] = useState("");

  const [suggestions, setSuggestions] =
    useState([]);

  /* =======================================================
     FETCH CARS
  ======================================================= */

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    try {
      const res = await fetch(
        `${BASE_URL}/cars`
      );

      if (!res.ok) {
        throw new Error(
          `Failed to fetch cars: ${res.status}`
        );
      }

      const data = await res.json();

      setCars(data.cars || []);
    } catch (err) {
      console.log(
        "Fetch cars error:",
        err
      );

      setCars([]);
    }
  }

  /* =======================================================
     SEARCH CHANGE
  ======================================================= */

  function handleSearchChange(value) {
    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const brands = cars
      .map(
        (car) =>
          car?.brand?.name || ""
      )
      .filter(Boolean);

    const unique = [
      ...new Set(brands),
    ];

    const result = unique.filter(
      (brand) =>
        brand
          .toLowerCase()
          .includes(
            value.toLowerCase()
          )
    );

    setSuggestions(
      result.slice(0, 8)
    );
  }

  /* =======================================================
     SEARCH SUGGESTION CLICK
  ======================================================= */

  function handleSuggestionClick(brand) {
    setSearch(brand);
    setSuggestions([]);
  }

  /* =======================================================
     TAB CHANGE
  ======================================================= */

  function handleTabChange(index) {
    setSearchParams({
      tab: index,
    });
  }

  /* =======================================================
     ACTIVE PAGE
  ======================================================= */

  const ActivePage = useMemo(
    () =>
      pages[selectedIndex]?.component ||
      CarsPage,
    [selectedIndex]
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        text-black
        overflow-x-hidden
      "
      style={{
        background:
          "linear-gradient(to bottom, rgb(214,206,243), #F3EFFF)",
      }}
    >

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          HOME VIDEO BANNER
      ================================================= */}

      <HomeBanner />

      {/* =================================================
          SEARCH + CATEGORY CONTENT
      ================================================= */}

      <div className="p-4 md:p-6">

        {/* =================================================
            SEARCH
        ================================================= */}

        <div
          className="
            flex
            items-center
            gap-2
            w-full
            mb-4
          "
        >

          {/* ---------------------------------------------
              SEARCH INPUT
          --------------------------------------------- */}

          <div className="relative flex-1">

            <input
              value={search}
              onChange={(e) =>
                handleSearchChange(
                  e.target.value
                )
              }
              placeholder="Search brand..."
              autoComplete="off"
              className="
                w-full
                px-4
                py-3
                rounded-full
                bg-white
                shadow-sm
                outline-none
                border
                border-transparent
                focus:border-black/10
                focus:ring-2
                focus:ring-black/5
                transition-all
              "
            />

            {/* -------------------------------------------
                SEARCH SUGGESTIONS
            ------------------------------------------- */}

            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -5,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                  className="
                    absolute
                    left-0
                    right-0
                    mt-2
                    bg-white
                    rounded-xl
                    shadow-xl
                    z-[100]
                    overflow-hidden
                  "
                >

                  {suggestions.map(
                    (brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() =>
                          handleSuggestionClick(
                            brand
                          )
                        }
                        className="
                          block
                          w-full
                          px-4
                          py-3
                          text-left
                          cursor-pointer
                          hover:bg-gray-100
                          transition
                        "
                      >
                        {brand}
                      </button>
                    )
                  )}

                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* ---------------------------------------------
              FILTER
          --------------------------------------------- */}

          <button
            type="button"
            onClick={() =>
              navigate("/filter")
            }
            className="
              w-12
              h-12
              shrink-0
              rounded-xl
              bg-white
              shadow-sm
              flex
              items-center
              justify-center
              hover:bg-gray-50
              active:scale-95
              transition-all
            "
            aria-label="Filter"
          >
            ⚙
          </button>

        </div>

        {/* =================================================
            TOP TABS
        ================================================= */}

        <div
          className="
            mx-3
            my-2
            px-1.5
            py-2
            bg-white/10
            backdrop-blur-xl
            rounded-3xl
            border
            border-white/20
            shadow-sm
          "
        >

          <div
            className="
              flex
              justify-around
              items-center
              h-[100px]
              sm:h-[106px]
            "
          >

            {pages.map(
              (page) => (
                <TabButton
                  key={page.id}
                  icon={page.icon}
                  label={page.label}
                  isActive={
                    selectedIndex ===
                    page.id
                  }
                  onClick={() =>
                    handleTabChange(
                      page.id
                    )
                  }
                />
              )
            )}

          </div>

        </div>

        {/* =================================================
            ACTIVE CATEGORY PAGE
        ================================================= */}

        <div className="mt-2">

          <AnimatePresence
            mode="wait"
          >

            <motion.div
              key={selectedIndex}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -12,
              }}
              transition={{
                duration: 0.25,
                ease: "easeInOut",
              }}
            >

              <ActivePage
                search={search}
              />

            </motion.div>

          </AnimatePresence>

        </div>

      </div>

      {/* =================================================
          LOCATION
          -------------------------------------------------
          No tab.
          No button.
          Just homepage section.
      ================================================= */}

      <Location />

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

    </div>
  );
}

/* =========================================================
   TAB BUTTON
========================================================= */

function TabButton({
  icon,
  label,
  isActive,
  onClick,
}) {
  return (
    <motion.button
      type="button"
      whileTap={{
        scale: 0.95,
      }}
      onClick={onClick}
      className={`
        flex-1
        flex
        flex-col
        items-center
        justify-center
        py-2
        rounded-2xl
        transition-all
        duration-200

        ${
          isActive
            ? "bg-white/30 backdrop-blur-sm border border-white/20 shadow-lg"
            : "bg-transparent"
        }
      `}
    >

      {/* =================================================
          ICON
      ================================================= */}

      <motion.div
        animate={{
          scale:
            isActive
              ? 1.05
              : 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className={`
          w-[75px]
          h-[75px]
          sm:w-[80px]
          sm:h-[80px]
          rounded-full
          flex
          items-center
          justify-center
          overflow-hidden

          ${
            isActive
              ? "bg-white/20"
              : ""
          }
        `}
      >

        <img
          src={icon}
          alt={label}
          draggable="false"
          className="
            w-full
            h-full
            object-contain
            select-none
          "
        />

      </motion.div>

      {/* =================================================
          LABEL
      ================================================= */}

      <span
        className={`
          text-xs
          sm:text-sm
          mt-1

          ${
            isActive
              ? "font-bold text-black"
              : "font-medium text-black/80"
          }
        `}
      >
        {label}
      </span>

      {/* =================================================
          ACTIVE UNDERLINE
      ================================================= */}

      <motion.div
        className="
          h-1
          rounded-full
          bg-gradient-to-r
          from-black/80
          to-black/50
        "
        initial={{
          width: 0,
        }}
        animate={{
          width:
            isActive
              ? 26
              : 0,
        }}
        transition={{
          duration: 0.2,
        }}
      />

    </motion.button>
  );
}