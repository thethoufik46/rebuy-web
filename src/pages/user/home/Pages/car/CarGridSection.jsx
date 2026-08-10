import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

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

export default function CarGridSection({
  cars = [],
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
     ANIMATION
  ======================================================= */

  const container = {
    hidden: {
      opacity: 0,
    },

    show: {
      opacity: 1,
      transition: {
        staggerChildren:
          0.06,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 15,
    },

    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
      },
    },
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="w-full">

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
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
              <motion.div
                key={
                  carId ||
                  `car-${index}`
                }
                variants={item}
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
              </motion.div>
            );
          }
        )}
      </motion.div>

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
  );
}