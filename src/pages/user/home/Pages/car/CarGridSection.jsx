// src/pages/user/home/Pages/car/CarGridSection.jsx

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
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
   HELPERS
========================================================= */

const extractId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    if (value.$oid) return String(value.$oid);
    if (value._id) return String(value._id);
    if (value.id) return String(value.id);
  }

  return String(value);
};

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

  for (const item of images) {
    if (!item) continue;

    if (typeof item === "string" && item.trim()) {
      return item.trim();
    }

    if (typeof item === "object") {
      const url =
        item.url ||
        item.secure_url ||
        item.src ||
        item.path ||
        item.imageUrl;

      if (url) return String(url);
    }
  }

  return "";
};

const getBrand = (car) => {
  if (typeof car?.brand === "object") {
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
   ---------------------------------------------------------
   Variants are auxiliary data. Cache them for 15 minutes
   so CarGrid never waits on the variant API.
========================================================= */

let variantCache = {};
let variantCacheTime = 0;
let variantPromise = null;

const CACHE_TIME = 15 * 60 * 1000;

const getVariantMap = async () => {
  if (
    Object.keys(variantCache).length &&
    Date.now() - variantCacheTime < CACHE_TIME
  ) {
    return variantCache;
  }

  if (variantPromise) {
    return variantPromise;
  }

  variantPromise = getAllVariants()
    .then((variants) => {
      if (!Array.isArray(variants)) {
        return variantCache;
      }

      const map = {};

      for (const item of variants) {
        const id = extractId(item?._id);

        if (id) {
          map[id] =
            item?.variantName ||
            item?.name ||
            "";
        }
      }

      variantCache = map;
      variantCacheTime = Date.now();

      return map;
    })
    .catch((error) => {
      console.error(
        "Variant error:",
        error
      );

      return variantCache;
    })
    .finally(() => {
      variantPromise = null;
    });

  return variantPromise;
};

/* =========================================================
   COMPONENT
========================================================= */

function CarGridSection({
  cars = [],
  loading = false,
  onViewAll,
  showViewAllButton = false,

  // Search Result context
  fromSearch = false,
  searchQuery = "",
  searchCars = [],
}) {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const currentTab =
    searchParams.get("tab") || "0";

  const [variantMap, setVariantMap] =
    useState(variantCache);

  /* =======================================================
     LOAD VARIANTS WITHOUT BLOCKING CAR GRID
  ======================================================= */

  useEffect(() => {
    let active = true;

    /*
     * Fire and forget.
     * Cars render immediately.
     */
    getVariantMap().then((map) => {
      if (active) {
        setVariantMap(map);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  /* =======================================================
     VARIANT NAME
  ======================================================= */

  const getVariantName = useCallback(
    (value) => {
      if (!value) return "";

      if (typeof value === "object") {
        return (
          value.variantName ||
          value.name ||
          value.title ||
          ""
        );
      }

      return (
        variantMap[extractId(value)] ||
        ""
      );
    },
    [variantMap]
  );

  /* =======================================================
     VISIBLE CARS
     -------------------------------------------------------
     Only 6 cards on home grid.
  ======================================================= */

  const visibleCars = useMemo(() => {
    if (!Array.isArray(cars)) {
      return [];
    }

    return cars
      .filter((car) => {
        const status = String(
          car?.status || ""
        ).toLowerCase();

        return (
          status !== "draft" &&
          status !== "deleted" &&
          status !== "drift"
        );
      })
      .slice(0, 6);
  }, [cars]);

  /* =======================================================
     LOADING
     -------------------------------------------------------
     No shimmer.
     No animation.
     Static lightweight placeholders only.
  ======================================================= */

  if (loading) {
    return <CarGridLoading />;
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (!visibleCars.length) {
    return null;
  }

  /* =======================================================
     DETAILS
  ======================================================= */

  const openDetails = (car) => {
    const id = extractId(
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
      `/car/${encodeURIComponent(id)}?tab=${currentTab}`,
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
            const carId = extractId(
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
                  priority={index < 2}

                  brandName={
                    getBrand(car)
                  }

                  variant={
                    getVariantName(
                      car?.variant
                    )
                  }

                  model={
                    car?.model?.name ||
                    car?.model?.modelName ||
                    car?.model ||
                    ""
                  }

                  imageUrl={
                    getImage(car)
                  }

                  price={
                    car?.price ?? "0"
                  }

                  fuel={
                    car?.fuel ||
                    car?.fuelType ||
                    ""
                  }

                  year={
                    car?.year || "-"
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
                    car?.owner || "1"
                  }

                  transmission={
                    car?.transmission ||
                    "Manual"
                  }

                  district={
                    car?.district || ""
                  }

                  city={
                    car?.city || ""
                  }

                  onTap={() =>
                    openDetails(car)
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
            onClick={onViewAll}
            className="
              flex
              h-[42px]
              w-full
              items-center
              justify-between
              rounded-[18px]
              bg-white/45
              px-5
              transition-colors
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
  );
}

/* =========================================================
   STATIC LOADING
   ---------------------------------------------------------
   No shimmer.
   No Framer Motion.
   No infinite animation.
   Minimal DOM.
========================================================= */

const CarGridLoading = memo(
  function CarGridLoading() {
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
              key={index}
              className="
                min-w-0
                w-full
                overflow-hidden
                rounded-[22px]
                border
                border-white/60
                bg-white/60
              "
            >
              <div
                className="
                  aspect-[13/11]
                  w-full
                  bg-slate-100
                "
              />

              <div className="space-y-2 px-3 py-3">
                <div className="h-3.5 w-20 rounded-full bg-slate-100" />
                <div className="h-3 w-3/4 rounded-full bg-slate-100" />
                <div className="h-2.5 w-1/2 rounded-full bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default memo(
  CarGridSection
);
