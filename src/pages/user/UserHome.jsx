
// src/pages/user/UserHome.jsx

import { useEffect, useMemo, useState } from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

/* =========================================================
   HOME COMPONENTS
========================================================= */

import Navbar from "./home/Navbar";

import SearchBar from "./Search/SearchBar";

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
========================================================= */


/* =========================================================
   USER HOME
========================================================= */

export default function UserHome() {
  const navigate = useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  /* =======================================================
     URL TAB  
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

  const [search, setSearch] =
    useState("");

  /* =======================================================
     FETCH CARS
  ======================================================= */

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    try {
      const response =
        await fetch(
          `${BASE_URL}/cars`
        );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch cars: ${response.status}`
        );
      }

      const data =
        await response.json();

      setCars(
        Array.isArray(
          data?.cars
        )
          ? data.cars
          : []
      );
    } catch (error) {
      console.error(
        "Fetch cars error:",
        error
      );

      setCars([]);
    }
  }

  /* =======================================================
     SEARCH CHANGE
  ======================================================= */

  function handleSearchChange(
    value
  ) {
    setSearch(value);
  }

  /* =======================================================
     SEARCH RESULT
  ======================================================= */

  function handleSearchSubmit(
    query,
    matchedCars
  ) {
    setSearch(query);

    navigate(
      "/search-results",
      {
        state: {
          query,
          filteredCars:
            Array.isArray(
              matchedCars
            )
              ? matchedCars
              : [],
        },
      }
    );
  }

  /* =======================================================
     TAB CHANGE
  ======================================================= */

  function handleTabChange(
    index
  ) {
    setSearchParams({
      tab: index,
    });
  }

  /* =======================================================
     ACTIVE PAGE
  ======================================================= */

  const ActivePage =
    useMemo(
      () =>
        pages[
          selectedIndex
        ]?.component ||
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
        overflow-x-hidden
        text-black
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

          DESKTOP ONLY
          Mobile = completely hidden
      ================================================= */}

      <div className="hidden md:block">
        <HomeBanner />
      </div>

      {/* =================================================
          SEARCH + CATEGORY
      ================================================= */}

      <div className="p-4 md:p-6">

        {/* =================================================
            SEARCH ROW
        ================================================= */}

        <div
          className="
            mb-4
            flex
            w-full
            items-center
            gap-2
          "
        >

          {/* SEARCH */}

          <div className="min-w-0 flex-1">

            <SearchBar
              value={search}
              onChange={
                handleSearchChange
              }
              allCars={cars}
              onSearch={
                handleSearchSubmit
              }
            />

          </div>

          {/* FILTER */}

          <button
            type="button"
            onClick={() =>
              navigate("/filter")
            }
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/50
              bg-white/55
              shadow-sm
              backdrop-blur-xl
              transition-all
              hover:bg-white/70
              active:scale-95
            "
            aria-label="Filter"
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >

              <line
                x1="4"
                y1="6"
                x2="20"
                y2="6"
              />

              <line
                x1="7"
                y1="12"
                x2="17"
                y2="12"
              />

              <line
                x1="10"
                y1="18"
                x2="14"
                y2="18"
              />

            </svg>

          </button>

        </div>

        {/* =================================================
            CATEGORY TABS
        ================================================= */}

        <div
          className="
            mx-3
            my-2
            rounded-3xl
            border
            border-white/20
            bg-white/10
            px-1.5
            py-2
            shadow-sm
            backdrop-blur-xl
          "
        >

          <div
            className="
              flex
              h-[100px]
              items-center
              justify-around
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
            ACTIVE CATEGORY
        ================================================= */}

        <div className="mt-2">

          <AnimatePresence
            mode="wait"
          >

            <motion.div
              key={
                selectedIndex
              }
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
        flex
        flex-1
        flex-col
        items-center
        justify-center
        rounded-2xl
        py-2
        transition-all
        duration-200

        ${
          isActive
            ? "border border-white/20 bg-white/30 shadow-lg backdrop-blur-sm"
            : "bg-transparent"
        }
      `}
    >

      {/* =================================================
          ICON
      ================================================= */}

      <motion.div
        animate={{
          scale: isActive
            ? 1.05
            : 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className={`
          flex
          h-[75px]
          w-[75px]
          items-center
          justify-center
          overflow-hidden
          rounded-full

          sm:h-[80px]
          sm:w-[80px]

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
            h-full
            w-full
            select-none
            object-contain
          "
        />

      </motion.div>

      {/* =================================================
          LABEL
      ================================================= */}

      <span
        className={`
          mt-1
          text-xs
          sm:text-sm

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
          UNDERLINE
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
          width: isActive
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
