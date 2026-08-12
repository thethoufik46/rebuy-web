import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import CarCard from "@/components/CarCard";

import {
  getAllVariants,
} from "@/services/carVariantApi";

/* =========================================================
   ID
========================================================= */

const extractId = (value) => {
  if (!value) return "";

  if (
    typeof value === "object"
  ) {
    if (value.$oid) {
      return String(
        value.$oid
      );
    }

    if (value._id) {
      return String(
        value._id
      );
    }

    if (value.id) {
      return String(
        value.id
      );
    }
  }

  return String(value);
};

/* =========================================================
   IMAGE
========================================================= */

const getImage = (car) => {
  const images = [
    car?.bannerImage,
    car?.imageUrl,
    car?.image,
    car?.thumbnail,
    car?.photo,
    car?.images?.[0],
    car?.photos?.[0],
    car?.gallery?.[0],
    car?.media?.[0],
  ];

  for (
    const item of images
  ) {
    if (!item) continue;

    if (
      typeof item === "string"
    ) {
      if (item.trim()) {
        return item.trim();
      }
    }

    if (
      typeof item ===
      "object"
    ) {
      const url =
        item.url ||
        item.secure_url ||
        item.src ||
        item.path ||
        item.imageUrl;

      if (url) {
        return String(
          url
        );
      }
    }
  }

  return "";
};

/* =========================================================
   BRAND
========================================================= */

const getBrand = (car) => {
  if (
    typeof car?.brand ===
    "object"
  ) {
    return (
      car.brand.name ||
      car.brand.brandName ||
      ""
    );
  }

  return car?.brand || "";
};

/* =========================================================
   VARIANT CACHE
========================================================= */

let variantCache = {};
let variantCacheTime = 0;

const CACHE_TIME =
  15 * 60 * 1000;

/* =========================================================
   COMPONENT
========================================================= */


function SkeletonAnimationStyles() {
  return (
    <style>{`
      @keyframes carSkeletonShimmer {
        0% {
          transform: translateX(-180%) skewX(-12deg);
        }

        100% {
          transform: translateX(380%) skewX(-12deg);
        }
      }

      .animate-car-skeleton-shimmer {
        animation:
          carSkeletonShimmer
          1.25s
          linear
          infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .animate-car-skeleton-shimmer {
          animation: none;
        }
      }
    `}</style>
  );
}


export default function CarGridSection({
  cars = [],
  loading = false,
  onViewAll,
  showViewAllButton = false,

  // Search Result context
  fromSearch = false,
  searchQuery = "",
  searchCars = [],
}) {
  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const currentTab =
    searchParams.get(
      "tab"
    ) || "0";

  const [
    variantMap,
    setVariantMap,
  ] = useState({});

  /*
   * Parent should pass loading=true while the
   * car API request is still running.
   *
   * If loading is not supplied, the component
   * falls back to false for backward compatibility.
   */
  const [
    carLoading,
    setCarLoading,
  ] = useState(false);

  /* =======================================================
     CAR API LOADING
  ======================================================= */

  useEffect(() => {
    setCarLoading(Boolean(loading));
  }, [loading]);


  /* =======================================================
     LOAD VARIANTS
  ======================================================= */

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (
        Date.now() -
          variantCacheTime <
          CACHE_TIME &&
        Object.keys(
          variantCache
        ).length
      ) {
        setVariantMap(
          variantCache
        );

        return;
      }

      try {
        const variants =
          await getAllVariants();

        if (
          !Array.isArray(
            variants
          )
        ) {
          return;
        }

        const map = {};

        variants.forEach(
          (item) => {
            const id =
              extractId(
                item?._id
              );

            if (id) {
              map[id] =
                item?.variantName ||
                item?.name ||
                "";
            }
          }
        );

        variantCache =
          map;

        variantCacheTime =
          Date.now();

        if (active) {
          setVariantMap(
            map
          );
        }
      } catch (error) {
        console.error(
          "Variant error:",
          error
        );
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  /* =======================================================
     VARIANT
  ======================================================= */

  const getVariantName =
    useCallback(
      (value) => {
        if (!value) {
          return "";
        }

        if (
          typeof value ===
          "object"
        ) {
          return (
            value.variantName ||
            value.name ||
            value.title ||
            ""
          );
        }

        const id =
          extractId(value);

        return (
          variantMap[id] ||
          ""
        );
      },
      [variantMap]
    );

  /* =======================================================
     VISIBLE
  ======================================================= */

  const visibleCars =
    Array.isArray(cars)
      ? cars
          .filter((car) => {
            const status =
              String(
                car?.status ||
                  ""
              ).toLowerCase();

            return (
              status !==
                "draft" &&
              status !==
                "deleted" &&
              status !==
                "drift"
            );
          })
          .slice(0, 6)
      : [];

  /*
   * Never show a blank section while the car API
   * is still loading. Show premium skeleton cards
   * with the same responsive grid shape instead.
   */
  if (carLoading) {
    return (
      <CarGridSkeleton />
    );
  }

  /*
   * API finished but returned no visible cars.
   * Keep the previous behavior: render nothing.
   */
  if (!visibleCars.length) {
    return null;
  }

  /* =======================================================
     OPEN DETAILS
  ======================================================= */

  const openDetails =
    (car) => {
      const id =
        extractId(
          car?._id ||
            car?.id ||
            car?.carId
        );

      if (!id) {
        console.error(
          "Car ID missing",
          car
        );

        return;
      }

      navigate(
        `/car/${encodeURIComponent(
          id
        )}?tab=${currentTab}`,
        {
          state: {
            car,
          },
        }
      );
    };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      <SkeletonAnimationStyles />
      <div className="w-full">

      <div
        className="
          grid
          grid-cols-2
          gap-x-3
          gap-y-3.5
          md:grid-cols-4
          lg:grid-cols-6
        "
      >
        {visibleCars.map(
          (car, index) => {
            const carId =
              extractId(
                car?._id ||
                  car?.id ||
                  car?.carId
              );

            return (
              <div
                key={
                  carId ||
                  `car-${index}`
                }
                className="min-w-0 w-full"
              >
                <CarCard
                  carId={carId}

                  brandName={
                    getBrand(car)
                  }

                  variant={
                    getVariantName(
                      car?.variant
                    )
                  }

                  model={
                    car?.model
                      ?.name ||
                    car?.model
                      ?.modelName ||
                    car?.model ||
                    ""
                  }

                  imageUrl={
                    getImage(car)
                  }

                  price={
                    car?.price ??
                    "0"
                  }

                  fuel={
                    car?.fuel ||
                    car?.fuelType ||
                    ""
                  }

                  year={
                    car?.year ||
                    "-"
                  }

                  status={
                    car?.status ||
                    "available"
                  }

                  km={
                    car?.km ??
                    car?.kilometers ??
                    "0"
                  }

                  owner={
                    car?.owner ||
                    "1"
                  }

                  transmission={
                    car?.transmission ||
                    "Manual"
                  }

                  district={
                    car?.district ||
                    ""
                  }

                  city={
                    car?.city ||
                    ""
                  }

                  onTap={() =>
                    openDetails(
                      car
                    )
                  }
                />
              </div>
            );
          }
        )}
      </div>

      {showViewAllButton && (
        <div className="py-3.5">
          <button
            type="button"
            onClick={
              onViewAll
            }
            className="
              flex
              h-[42px]
              w-full
              items-center
              justify-between
              rounded-[18px]
              bg-white/45
              px-5
              hover:bg-white/65
            "
          >
            <span className="text-xs font-semibold">
              View All Cars
            </span>

            <span
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-white/60
              "
            >
              →
            </span>
          </button>
        </div>
      )}
      </div>
    </>
  );
}


/* =========================================================
   PREMIUM CAR GRID SKELETON
   ---------------------------------------------------------
   YouTube / Amazon inspired shimmer loading.
   Same 2 / 4 / 6 column responsive structure as real cards.
========================================================= */

function CarGridSkeleton() {
  return (
    <div className="w-full">

      <div
        className="
          grid
          grid-cols-2
          gap-x-3
          gap-y-3.5
          md:grid-cols-4
          lg:grid-cols-6
        "
      >
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={`car-skeleton-${index}`}
            className="min-w-0 w-full"
          >
            <CarSkeletonCard />
          </div>
        ))}
      </div>

    </div>
  );
}


/* =========================================================
   PREMIUM CAR SKELETON CARD
========================================================= */

function CarSkeletonCard() {
  return (
    <div
      className="
        relative
        w-full
        min-w-0
        overflow-hidden
        rounded-[22px]
        border
        border-white/70
        bg-white
        shadow-[0_5px_18px_rgba(15,23,42,0.06)]
      "
    >

      {/* =================================================
          IMAGE AREA
      ================================================= */}

      <div
        className="
          relative
          aspect-[13/11]
          w-full
          overflow-hidden
          bg-gradient-to-br
          from-slate-100
          via-slate-200/70
          to-slate-100
        "
      >

        {/* Main cinematic shimmer */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-20
            w-[48%]
            -skew-x-12
            bg-gradient-to-r
            from-transparent
            via-white/80
            to-transparent
            blur-lg
          "
        />

        {/* Soft moving light */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-20
            w-24
            -translate-x-1/2
            -translate-y-1/2
            rounded-[28px]
            bg-white
            blur-2xl
          "
        />

        {/* Image-like center placeholder */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-12
            w-16
            -translate-x-1/2
            -translate-y-1/2
            rounded-2xl
            bg-white/45
            shadow-inner
            backdrop-blur-sm
          "
        />

        {/* Year */}
        <SkeletonBlock
          className="
            absolute
            left-2.5
            top-2.5
            z-30
            h-5
            w-12
            rounded-full
          "
        />

        {/* Share */}
        <SkeletonBlock
          className="
            absolute
            right-2.5
            top-2.5
            z-30
            h-8
            w-8
            rounded-full
          "
        />

        {/* Bottom image fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-10
            h-16
            bg-gradient-to-t
            from-black/[0.04]
            to-transparent
          "
        />

      </div>


      {/* =================================================
          CONTENT AREA
      ================================================= */}

      <div
        className="
          space-y-2.5
          px-3
          pb-3
          pt-3
        "
      >

        {/* Price */}
        <SkeletonBlock
          className="
            h-4
            w-24
            rounded-full
          "
        />

        {/* Model */}
        <SkeletonBlock
          className="
            h-3
            w-[74%]
            rounded-full
          "
        />

        {/* Details */}
        <div className="flex gap-2">
          <SkeletonBlock
            className="
              h-2.5
              w-12
              rounded-full
            "
          />

          <SkeletonBlock
            className="
              h-2.5
              w-14
              rounded-full
            "
          />

          <SkeletonBlock
            className="
              h-2.5
              w-12
              rounded-full
            "
          />
        </div>

        {/* Location */}
        <SkeletonBlock
          className="
            h-2.5
            w-[68%]
            rounded-full
          "
        />

      </div>

    </div>
  );
}


/* =========================================================
   SKELETON BLOCK
========================================================= */


/* =========================================================
   SKELETON SHIMMER
   ONLY LOADING ANIMATION — no card entrance/floating animation
========================================================= */

const SkeletonShimmer = () => (
  <span
    aria-hidden="true"
    className="
      pointer-events-none
      absolute
      inset-y-0
      left-0
      z-20
      w-1/2
      -skew-x-12
      bg-gradient-to-r
      from-transparent
      via-white/80
      to-transparent
      blur-md
      animate-car-skeleton-shimmer
    "
  />
);

function SkeletonBlock({
  className = "",
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        bg-slate-200
        ${className}
      `}
    >
      <SkeletonShimmer />
    </div>
  );
}


/* =========================================================
   SHIMMER
========================================================= */