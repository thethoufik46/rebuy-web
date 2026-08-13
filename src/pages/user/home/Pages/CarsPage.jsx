// src/pages/user/home/Pages/CarsPage.jsx

import React, {
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import HomeBoardTwoButton from "@/components/HomeBoardTwoButton";
import HomeOwncardscroll from "./car/HomeOwncardscroll";
import CarGridSection from "./car/CarGridSection";

/* =========================================================
   API
========================================================= */

const BASE_URL =
  "https://rebuy-api.onrender.com/api";

/* =========================================================
   MEMORY CACHE
   ---------------------------------------------------------
   - First browser load -> API
   - Cars -> another page -> Cars -> instant cache
   - Component remount -> no API
   - Browser refresh -> fresh API
========================================================= */

let carsCache = null;
let carsPromise = null;

/* =========================================================
   ONE REQUEST ONLY
========================================================= */

function getCars() {
  if (Array.isArray(carsCache)) {
    return Promise.resolve(carsCache);
  }

  if (carsPromise) {
    return carsPromise;
  }

  carsPromise = fetch(
    `${BASE_URL}/cars`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "default",
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

      const result =
        Array.isArray(data?.cars)
          ? data.cars
          : [];

      carsCache = result;

      return result;
    })
    .catch((error) => {
      console.error(
        "Cars fetch error:",
        error
      );

      throw error;
    })
    .finally(() => {
      carsPromise = null;
    });

  return carsPromise;
}

/* =========================================================
   PAGE
========================================================= */

function CarsPage() {
  const navigate =
    useNavigate();

  const [
    cars,
    setCars,
  ] = useState(() =>
    Array.isArray(carsCache)
      ? carsCache
      : []
  );

  const [
    filteredCars,
    setFilteredCars,
  ] = useState(() =>
    Array.isArray(carsCache)
      ? carsCache
      : []
  );

  const [
    loading,
    setLoading,
  ] = useState(
    !Array.isArray(carsCache)
  );

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    if (Array.isArray(carsCache)) {
      setCars(carsCache);
      setFilteredCars(carsCache);
      setLoading(false);
      return;
    }

    let mounted = true;

    getCars()
      .then((allCars) => {
        if (!mounted) return;

        setCars(allCars);
        setFilteredCars(allCars);
      })
      .catch(() => {
        if (!mounted) return;
      })
      .finally(() => {
        if (!mounted) return;

        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     VIEW ALL
  ======================================================= */

  const handleViewAll =
    useCallback(() => {
      navigate(
        "/filter-result",
        {
          state: {
            filteredCars,
          },
        }
      );
    }, [
      navigate,
      filteredCars,
    ]);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        w-full
        min-w-0
        space-y-4
      "
    >
      <HomeBoardTwoButton
        onOwnBoardTap={() =>
          navigate("/own-cars")
        }
        onTBoardTap={() =>
          navigate("/t-board-cars")
        }
      />

      <div>
        <SectionHeader
          title="Car Sections"
          onViewAll={() =>
            navigate("/variants")
          }
        />

        <HomeOwncardscroll />
      </div>

      <CarGridSection
        cars={filteredCars}
        loading={loading}
        showViewAllButton={true}
        onViewAll={handleViewAll}
      />
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

const SectionHeader = memo(
  function SectionHeader({
    title,
    onViewAll,
  }) {
    return (
      <div
        className="
          mb-2
          flex
          items-center
          justify-between
        "
      >
        <h2
          className="
            text-lg
            font-semibold
          "
        >
          {title}
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="
            text-sm
            text-slate-500
            transition-colors
            hover:text-black
          "
        >
          View All
        </button>
      </div>
    );
  }
);

export default memo(
  CarsPage
);
