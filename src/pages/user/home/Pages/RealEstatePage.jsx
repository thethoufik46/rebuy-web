// src/pages/user/home/Pages/RealEstatePage.jsx

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import PropertyGridSection from "../property/PropertyGridSection";

const BASE_URL =
  "https://rebuy-api.onrender.com/api";

let propertiesCache = null;
let propertiesPromise = null;

async function getPropertiesFast() {
  if (
    Array.isArray(
      propertiesCache
    )
  ) {
    return propertiesCache;
  }

  if (propertiesPromise) {
    return propertiesPromise;
  }

  propertiesPromise = fetch(
    `${BASE_URL}/properties`,
    {
      method: "GET",
      headers: {
        Accept:
          "application/json",
      },
      cache: "default",
    }
  )
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(
          `Properties API ${response.status}`
        );
      }

      const data =
        await response.json();

      const result =
        Array.isArray(
          data?.properties
        )
          ? data.properties
          : [];

      propertiesCache = result;

      return result;
    })
    .catch((error) => {
      console.error(
        "Properties fetch error:",
        error
      );

      return [];
    })
    .finally(() => {
      propertiesPromise = null;
    });

  return propertiesPromise;
}

/* =========================================================
   HEADER
========================================================= */

function SectionHeader({
  title,
  subtitle,
  onViewAll,
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        px-4
      "
    >
      <div
        className="
          min-w-0
          flex-1
        "
      >
        <h2
          className="
            text-base
            font-semibold
            tracking-wide
          "
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="
              mt-0.5
              text-xs
              font-medium
              text-black/60
              font-tamil
            "
          >
            {subtitle}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="
          ml-3
          flex
          shrink-0
          items-center
          gap-1
          text-sm
          font-medium
          text-black/70
          active:text-black
        "
      >
        <span>
          View All
        </span>

        <ArrowIcon />
      </button>
    </div>
  );
}

/* =========================================================
   STATIC ARROW
========================================================= */

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function RealEstatePage() {
  const navigate =
    useNavigate();

  const [
    properties,
    setProperties,
  ] = useState(
    Array.isArray(
      propertiesCache
    )
      ? propertiesCache
      : []
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(
    !Array.isArray(
      propertiesCache
    )
  );

  useEffect(() => {
    let mounted = true;

    getPropertiesFast().then(
      (result) => {
        if (!mounted) return;

        setProperties(
          result
        );

        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  const handleViewAll =
    useCallback(() => {
      navigate(
        "/property-list",
        {
          state: {
            properties,
          },
        }
      );
    }, [
      navigate,
      properties,
    ]);

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Property Sections"
        subtitle="வீடு & நிலங்கள்"
        onViewAll={
          handleViewAll
        }
      />

      <PropertyGridSection
        properties={
          properties
        }
        showViewAllButton={
          true
        }
        onViewAll={
          handleViewAll
        }
        loading={
          isLoading
        }
      />

      <div className="h-5" />
    </div>
  );
}