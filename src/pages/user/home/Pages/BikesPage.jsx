import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BikeGridSection from "./bike/BikeGridSection";

const BASE_URL =
  "https://rebuy-api.onrender.com/api";

/* =========================================================
   MEMORY CACHE
   ---------------------------------------------------------
   Navigation back to this page = instant.
   Browser refresh = API request again.
========================================================= */

let bikesCache = null;
let bikesPromise = null;

async function getBikesFast() {
  if (Array.isArray(bikesCache)) {
    return bikesCache;
  }

  if (bikesPromise) {
    return bikesPromise;
  }

  bikesPromise = fetch(
    `${BASE_URL}/bikes`,
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
          `Bikes API ${response.status}`
        );
      }

      const data =
        await response.json();

      const result = Array.isArray(
        data?.bikes
      )
        ? data.bikes
        : [];

      bikesCache = result;

      return result;
    })
    .catch((error) => {
      console.error(
        "Bikes fetch error:",
        error
      );

      return [];
    })
    .finally(() => {
      bikesPromise = null;
    });

  return bikesPromise;
}

/* =========================================================
   PAGE
========================================================= */

export default function BikesPage() {
  const navigate =
    useNavigate();

  const [
    bikes,
    setBikes,
  ] = useState(
    Array.isArray(bikesCache)
      ? bikesCache
      : []
  );

  const [
    filteredBikes,
    setFilteredBikes,
  ] = useState(
    Array.isArray(bikesCache)
      ? bikesCache
      : []
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    suggestions,
    setSuggestions,
  ] = useState([]);

  /* =======================================================
     FETCH
     -------------------------------------------------------
     No spinner.
     No delay.
     No animation.
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    getBikesFast().then(
      (result) => {
        if (!mounted) return;

        setBikes(result);
        setFilteredBikes(result);
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const handleSearchChange =
    useCallback(
      (value) => {
        const nextValue =
          value || "";

        setSearch(
          nextValue
        );

        if (!nextValue) {
          setSuggestions([]);
          setFilteredBikes(
            bikes
          );
          return;
        }

        const query =
          nextValue.toLowerCase();

        const uniqueBrands =
          new Set();

        for (
          const bike of bikes
        ) {
          const brand =
            bike?.brand?.name;

          if (
            brand &&
            String(
              brand
            )
              .toLowerCase()
              .includes(query)
          ) {
            uniqueBrands.add(
              String(brand)
            );
          }

          if (
            uniqueBrands.size >=
            8
          ) {
            break;
          }
        }

        setSuggestions(
          Array.from(
            uniqueBrands
          )
        );
      },
      [bikes]
    );

  /* =======================================================
     BRAND SELECT
  ======================================================= */

  const handleSuggestionClick =
    useCallback(
      (brand) => {
        const result =
          bikes.filter(
            (bike) =>
              bike?.brand
                ?.name === brand
          );

        setFilteredBikes(
          result
        );

        setSuggestions([]);
        setSearch(brand);
      },
      [bikes]
    );

  /* =======================================================
     VIEW ALL
  ======================================================= */

  const handleViewAll =
    useCallback(() => {
      navigate(
        "/bike-list",
        {
          state: {
            bikes:
              filteredBikes,
          },
        }
      );
    }, [
      navigate,
      filteredBikes,
    ]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        space-y-4
      "
    >
      <BikeGridSection
        bikes={
          filteredBikes
        }
        showViewAllButton={
          true
        }
        onViewAll={
          handleViewAll
        }
      />
    </div>
  );
}