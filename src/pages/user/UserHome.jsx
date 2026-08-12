// src/pages/user/UserHome.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
import Testimonials from "@/pages/user/Testimonials/Testimonials";
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

   IMPORTANT:
   pages MUST be declared before rawTab / selectedIndex.
========================================================= */

const pages = [
  {
    id: 0,
    icon: carIcon,
    component: CarsPage,
  },

  {
    id: 1,
    icon: bikeIcon,
    component: BikesPage,
  },

  {
    id: 2,
    icon: propertyIcon,
    component: RealEstatePage,
  },

  {
    id: 3,
    icon: electronicsIcon,
    component: ElectronicsPage,
  },
];

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

  const tabParam =
    searchParams.get("tab");

  const rawTab =
    tabParam === null ||
    tabParam.trim() === ""
      ? 0
      : Number(tabParam);

  const selectedIndex =
    Number.isInteger(rawTab) &&
    rawTab >= 0 &&
    rawTab < pages.length
      ? rawTab
      : 0;

  /* =======================================================
     STATES
  ======================================================= */

  const [
    cars,
    setCars,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

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
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= pages.length
    ) {
      return;
    }

    setSearchParams({
      tab: String(index),
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
          HOME BANNER

          Desktop:
          visible

          Mobile:
          completely hidden
      ================================================= */}

      <div
        className="
          hidden
          md:block
        "
      >
        <HomeBanner />
      </div>

      {/* =================================================
          SEARCH + CATEGORY
      ================================================= */}

      <div
        className="
          p-4
          md:p-6
        "
      >

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

          <div
            className="
              min-w-0
              flex-1
            "
          >
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
            aria-label="Filter"
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
            MODERN GLASS CATEGORY BAR

            ICON ONLY
            NO LABEL
        ================================================= */}

        <div
          className="
            mx-1
            my-3
            rounded-[32px]
            border
            border-white/30
            bg-white/10
            p-2
            shadow-[0_20px_60px_rgba(80,60,120,0.10)]
            backdrop-blur-2xl
            sm:mx-3
          "
        >
          <div
            className="
              flex
              h-[92px]
              items-center
              justify-around
              gap-2
              sm:h-[100px]
            "
          >
            {pages.map(
              (page) => (
                <TabButton
                  key={page.id}
                  icon={page.icon}
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

        <div
          className="
            mt-2
          "
        >
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

      {/*
        <Location />
      */}

      {/* =================================================
          TESTIMONIALS
          FOOTER-KKU MELAE
      ================================================= */}

      <section
        className="
          w-full
          overflow-hidden
          px-3
          pb-4
          pt-2
          sm:px-5
          lg:px-8
        "
      >
        <Testimonials />
      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />
    </div>
  );
}

/* =========================================================
   MODERN GLASS CATEGORY BUTTON

   ICON ONLY
   NO NAME
========================================================= */

function TabButton({
  icon,
  isActive,
  onClick,
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{
        scale: 0.92,
      }}
      animate={{
        scale: isActive
          ? 1.08
          : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 22,
      }}
      aria-label="Category"
      className={`
        relative
        flex
        h-[76px]
        w-[76px]
        shrink-0
        items-center
        justify-center
        rounded-[26px]
        border
        transition-all
        duration-300

        ${
          isActive
            ? `
              border-white/70
              bg-white/45
              shadow-[0_12px_35px_rgba(80,60,120,0.18)]
              backdrop-blur-2xl
            `
            : `
              border-white/30
              bg-white/15
              backdrop-blur-xl
              hover:bg-white/30
              hover:border-white/50
            `
        }

        max-[380px]:h-[64px]
        max-[380px]:w-[64px]
        max-[380px]:rounded-[22px]
      `}
    >

      {/* =================================================
          GLASS HIGHLIGHT
      ================================================= */}

      <span
        className="
          pointer-events-none
          absolute
          inset-[1px]
          rounded-[25px]
          bg-gradient-to-br
          from-white/50
          via-white/10
          to-transparent
          opacity-80
          max-[380px]:rounded-[21px]
        "
      />

      {/* =================================================
          ACTIVE GLOW
      ================================================= */}

      {isActive && (
        <motion.span
          layoutId="activeCategoryGlow"
          className="
            pointer-events-none
            absolute
            -inset-1
            rounded-[28px]
            bg-white/20
            blur-xl
            max-[380px]:rounded-[24px]
          "
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        />
      )}

      {/* =================================================
          ICON
      ================================================= */}

      <motion.img
        src={icon}
        alt=""
        draggable="false"
        animate={{
          scale: isActive
            ? 1.08
            : 1,

          y: isActive
            ? -1
            : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 20,
        }}
        className="
          relative
          z-10
          h-[58px]
          w-[58px]
          select-none
          object-contain
          max-[380px]:h-[50px]
          max-[380px]:w-[50px]
        "
      />

      {/* =================================================
          ACTIVE DOT
      ================================================= */}

      {isActive && (
        <motion.span
          layoutId="activeCategoryDot"
          className="
            absolute
            -bottom-[5px]
            left-1/2
            z-20
            h-[7px]
            w-[7px]
            -translate-x-1/2
            rounded-full
            bg-black/80
            shadow-[0_0_12px_rgba(0,0,0,0.25)]
          "
        />
      )}
    </motion.button>
  );
}