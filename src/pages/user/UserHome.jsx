/* =========================================================
   src/pages/user/UserHome.jsx
   RE2BUY — FAST MARKETPLACE HOME
   ========================================================= */

import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Navbar from "./home/Navbar";
import SearchBar from "./Search/SearchBar";
import HomeBanner from "@/pages/user/home/HomeBanner";
import Testimonials from "@/pages/user/Testimonials/Testimonials";
import Footer from "@/pages/user/home/Footer";

import carIcon from "@/assets/home/car.webp";
import bikeIcon from "@/assets/home/bike.webp";
import propertyIcon from "@/assets/home/home.webp";
import electronicsIcon from "@/assets/home/electronic.webp";

/* =========================================================
   API
   ========================================================= */

const BASE_URL =
  "https://rebuy-api.onrender.com/api";

const HOME_LIMIT = 6;

/* =========================================================
   LAZY CATEGORY BUNDLES
   ========================================================= */

const CarsPage = lazy(
  () =>
    import(
      "@/pages/user/home/Pages/CarsPage"
    )
);

const BikesPage = lazy(
  () =>
    import(
      "@/pages/user/home/Pages/BikesPage"
    )
);

const RealEstatePage = lazy(
  () =>
    import(
      "@/pages/user/home/Pages/RealEstatePage"
    )
);

const ElectronicsPage = lazy(
  () =>
    import(
      "@/pages/user/home/Pages/ElectronicsPage"
    )
);

/* =========================================================
   CATEGORY DATA
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
   MEMORY CACHE
   ---------------------------------------------------------
   ONE cars request per SPA session.
========================================================= */

let carsMemoryCache = null;
let carsRequest = null;

/* =========================================================
   FETCH HOME CARS
========================================================= */

async function fetchHomeCars(signal) {
  if (Array.isArray(carsMemoryCache)) {
    return carsMemoryCache;
  }

  if (carsRequest) {
    return carsRequest;
  }

  carsRequest = fetch(
    `${BASE_URL}/cars?limit=${HOME_LIMIT}&page=1`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "default",
      signal,
    }
  )
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(
          `Cars API ${response.status}`
        );
      }

      const data =
        await response.json();

      const result = Array.isArray(
        data?.cars
      )
        ? data.cars.slice(
            0,
            HOME_LIMIT
          )
        : [];

      carsMemoryCache = result;

      return result;
    })
    .catch((error) => {
      carsRequest = null;

      if (
        error?.name !==
        "AbortError"
      ) {
        console.error(
          "Cars API error:",
          error
        );
      }

      throw error;
    })
    .finally(() => {
      carsRequest = null;
    });

  return carsRequest;
}

/* =========================================================
   USER HOME
========================================================= */

export default function UserHome() {
  const navigate = useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const tabValue =
    searchParams.get("tab");

  const parsedTab =
    tabValue === null
      ? 0
      : Number(tabValue);

  const selectedIndex =
    Number.isInteger(parsedTab) &&
    parsedTab >= 0 &&
    parsedTab < pages.length
      ? parsedTab
      : 0;

  /* =======================================================
     CARS
  ======================================================= */

  const [cars, setCars] = useState(
    () =>
      Array.isArray(
        carsMemoryCache
      )
        ? carsMemoryCache
        : []
  );

  const [
    carsLoading,
    setCarsLoading,
  ] = useState(
    !Array.isArray(
      carsMemoryCache
    )
  );

  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] =
    useState("");

  /* =======================================================
     LOAD ONCE
  ======================================================= */

  useEffect(() => {
    if (
      Array.isArray(
        carsMemoryCache
      )
    ) {
      setCars(
        carsMemoryCache
      );
      setCarsLoading(false);
      return;
    }

    const controller =
      new AbortController();

    let mounted = true;

    fetchHomeCars(
      controller.signal
    )
      .then((result) => {
        if (!mounted) return;

        setCars(result);
      })
      .catch((error) => {
        if (
          error?.name ===
          "AbortError"
        ) {
          return;
        }

        if (mounted) {
          setCars([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setCarsLoading(false);
        }
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearchChange =
    useCallback((value) => {
      setSearch(
        String(value ?? "")
      );
    }, []);

  /* =======================================================
     SEARCH SUBMIT
  ======================================================= */

  const handleSearchSubmit =
    useCallback(
      (query, matchedCars) => {
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
      },
      [navigate]
    );

  /* =======================================================
     TAB
  ======================================================= */

  const handleTabChange =
    useCallback(
      (index) => {
        if (
          index < 0 ||
          index >= pages.length
        ) {
          return;
        }

        setSearchParams(
          {
            tab: String(index),
          },
          {
            replace: true,
          }
        );
      },
      [setSearchParams]
    );

  const ActivePage =
    pages[selectedIndex]
      ?.component || CarsPage;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        overflow-x-hidden
        bg-[#F3EFFF]
        text-black
      "
    >
      <Navbar />

      {/* =================================================
          DESKTOP BANNER
      ================================================= */}

      <div className="hidden md:block">
        <HomeBanner />
      </div>

      <div
        className="
          p-3
          sm:p-4
          md:p-6
        "
      >
        {/* =================================================
            SEARCH
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

          <button
            type="button"
            aria-label="Filter"
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
              border-white/60
              bg-white/60
              shadow-sm
              backdrop-blur-lg
              transition
              duration-150
              hover:bg-white/80
              active:scale-95
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
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
            CATEGORY BAR
        ================================================= */}

        <div
          className="
            mx-0
            my-3
            rounded-[30px]
            border
            border-white/40
            bg-white/15
            p-2
            shadow-[0_14px_40px_rgba(80,60,120,0.07)]
            backdrop-blur-xl
            sm:mx-2
          "
        >
          <div
            className="
              flex
              h-[88px]
              items-center
              justify-around
              gap-2
              sm:h-[96px]
            "
          >
            {pages.map(
              (page) => (
                <CategoryButton
                  key={page.id}
                  icon={page.icon}
                  active={
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

        <div className="mt-2 min-h-[180px]">
          <Suspense
            fallback={
              <PageLoader />
            }
          >
            <ActivePage
              cars={cars}
              carsLoading={
                carsLoading
              }
              search={search}
            />
          </Suspense>
        </div>
      </div>

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

      <Footer />
    </main>
  );
}

/* =========================================================
   CATEGORY BUTTON
========================================================= */

const CategoryButton = React.memo(
  function CategoryButton({
    icon,
    active,
    onClick,
  }) {
    return (
      <button
        type="button"
        aria-label="Category"
        aria-pressed={active}
        onClick={onClick}
        className={`
          relative
          flex
          h-[72px]
          w-[72px]
          shrink-0
          items-center
          justify-center
          rounded-[24px]
          border
          transition
          duration-150
          active:scale-95
          max-[380px]:h-[62px]
          max-[380px]:w-[62px]

          ${
            active
              ? `
                border-white/80
                bg-white/55
                shadow-[0_10px_28px_rgba(80,60,120,0.14)]
              `
              : `
                border-white/30
                bg-white/15
                hover:bg-white/30
              `
          }
        `}
      >
        <span
          className="
            pointer-events-none
            absolute
            inset-[1px]
            rounded-[23px]
            bg-gradient-to-br
            from-white/45
            via-white/10
            to-transparent
          "
        />

        <img
          src={icon}
          alt=""
          draggable="false"
          width="54"
          height="54"
          loading="eager"
          decoding="async"
          className={`
            relative
            z-10
            h-[54px]
            w-[54px]
            object-contain
            transition
            duration-150
            ${
              active
                ? "scale-[1.05]"
                : ""
            }
          `}
        />

        {active && (
          <span
            className="
              absolute
              -bottom-[4px]
              left-1/2
              z-20
              h-[6px]
              w-[6px]
              -translate-x-1/2
              rounded-full
              bg-black/80
            "
          />
        )}
      </button>
    );
  }
);

/* =========================================================
   PAGE LOADER
========================================================= */

function PageLoader() {
  return (
    <div
      className="
        flex
        min-h-[180px]
        items-center
        justify-center
      "
    >
      <span
        className="
          h-7
          w-7
          animate-spin
          rounded-full
          border-2
          border-black/10
          border-t-black/70
        "
      />
    </div>
  );
}