import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { getElectronics } from "@/services/electronics";

import ElectronicsGridSection from "./electronics/ElectronicsGridSection";

/* =========================================================
   MEMORY CACHE
   ---------------------------------------------------------
   Prevents duplicate API requests during SPA navigation.
   Refreshing the browser fetches again.
========================================================= */

let electronicsCache = null;
let electronicsPromise = null;

async function getElectronicsFast() {
  if (
    Array.isArray(
      electronicsCache
    )
  ) {
    return electronicsCache;
  }

  if (electronicsPromise) {
    return electronicsPromise;
  }

  electronicsPromise =
    getElectronics()
      .then((items) => {
        const result =
          Array.isArray(items)
            ? items
            : [];

        electronicsCache =
          result;

        return result;
      })
      .catch((error) => {
        console.error(
          "Electronics fetch error:",
          error
        );

        return [];
      })
      .finally(() => {
        electronicsPromise =
          null;
      });

  return electronicsPromise;
}

/* =========================================================
   HEADER
   ---------------------------------------------------------
   Static arrow.
   No CSS animation.
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
        onClick={
          onViewAll
        }
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

export default function ElectronicsPage() {
  const navigate =
    useNavigate();

  const [
    electronics,
    setElectronics,
  ] = useState(
    Array.isArray(
      electronicsCache
    )
      ? electronicsCache
      : []
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(
    !Array.isArray(
      electronicsCache
    )
  );

  /* =======================================================
     FETCH
     -------------------------------------------------------
     No spinner UI.
     Grid receives loading state itself.
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    getElectronicsFast().then(
      (items) => {
        if (!mounted) return;

        setElectronics(
          items
        );

        setIsLoading(false);
      }
    );

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
        "/electronics-list",
        {
          state: {
            electronics,
          },
        }
      );
    }, [
      navigate,
      electronics,
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
      <SectionHeader
        title="Electronics"
        subtitle="மொபைல் / லேப்டாப் / PC"
        onViewAll={
          handleViewAll
        }
      />

      <ElectronicsGridSection
        electronics={
          electronics
        }
        onViewAll={
          handleViewAll
        }
        showViewAllButton={
          true
        }
        loading={
          isLoading
        }
      />

      <div className="h-5" />
    </div>
  );
}