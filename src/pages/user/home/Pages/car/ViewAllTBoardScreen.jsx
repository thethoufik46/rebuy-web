// src/pages/user/home/Pages/car/ViewAllTBoardScreen.jsx

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import CarCard from "@/components/CarCard";
import API from "@/services/api";
import { getAllVariants } from "@/services/carVariantApi";
import AppBar from "@/components/AppBar";

/* =========================================================
   HELPERS
========================================================= */

const extractId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    if (value.$oid) {
      return value.$oid.toString();
    }

    if (value._id) {
      return value._id.toString();
    }

    if (Array.isArray(value) && value.length) {
      return extractId(value[0]);
    }

    if (value.id) {
      return value.id.toString();
    }
  }

  return value.toString();
};

/* =========================================================
   PAGE
========================================================= */

export default function ViewAllTBoardScreen() {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [allCars, setAllCars] = useState([]);
  const [allVariants, setAllVariants] = useState([]);
  const [filteredVariants, setFilteredVariants] =
    useState([]);
  const [variantsMap, setVariantsMap] = useState({});

  const [selectedBrand, setSelectedBrand] =
    useState("All");

  const [selectedVariant, setSelectedVariant] =
    useState(null);

  const [isLoadingVariants, setIsLoadingVariants] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const brandScrollRef = useRef(null);
  const variantScrollRef = useRef(null);

  /* =======================================================
     FETCH T BOARD CARS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchCars = async () => {
      try {
        const response = await API.get("/cars", {
          params: {
            board: "t board",
          },
        });

        if (!mounted) return;

        const cars =
          response.data?.cars || [];

        setAllCars(cars);
      } catch (err) {
        console.error(
          "Error fetching T Board cars:",
          err
        );

        if (mounted) {
          setAllCars([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCars();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     FETCH VARIANTS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadVariants = async () => {
      try {
        const list =
          await getAllVariants();

        if (!mounted) return;

        const map = {};

        list.forEach((v) => {
          const id =
            extractId(v._id);

          if (id) {
            map[id] = {
              name:
                v.variantName ||
                v.title ||
                "",

              image:
                v.variantImage ||
                "",

              brandId:
                extractId(v.brand),
            };
          }
        });

        setVariantsMap(map);
        setAllVariants(list);
        setFilteredVariants(list);
      } catch (err) {
        console.error(
          "Error loading variants:",
          err
        );

        if (mounted) {
          setAllVariants([]);
          setFilteredVariants([]);
        }
      }
    };

    loadVariants();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     BRAND MAP
  ======================================================= */

  const brandMap = useMemo(() => {
    const map = {};

    allCars.forEach((car) => {
      const brand = car.brand;

      if (brand?.name) {
        map[brand.name] = {
          ...brand,
        };
      }
    });

    return map;
  }, [allCars]);

  /* =======================================================
     BRANDS
  ======================================================= */

  const brands = useMemo(
    () => [
      "All",
      ...Object.keys(brandMap),
    ],
    [brandMap]
  );

  /* =======================================================
     SELECTED BRAND ID
  ======================================================= */

  const getSelectedBrandId =
    useCallback(() => {
      if (
        selectedBrand === "All"
      ) {
        return null;
      }

      const brand =
        brandMap[selectedBrand];

      return brand
        ? extractId(brand._id)
        : null;
    }, [
      selectedBrand,
      brandMap,
    ]);

  /* =======================================================
     FILTER VARIANTS
  ======================================================= */

  useEffect(() => {
    if (
      selectedBrand === "All"
    ) {
      setFilteredVariants(
        allVariants
      );

      setSelectedVariant(null);

      return;
    }

    const brandId =
      getSelectedBrandId();

    if (!brandId) {
      setFilteredVariants([]);
      setSelectedVariant(null);
      return;
    }

    setIsLoadingVariants(true);

    try {
      const filtered =
        allVariants.filter(
          (v) =>
            extractId(v.brand) ===
            brandId
        );

      setFilteredVariants(
        filtered
      );

      setSelectedVariant(null);
    } catch (err) {
      console.error(
        "Filter variants error:",
        err
      );

      setFilteredVariants([]);
    } finally {
      setIsLoadingVariants(false);
    }
  }, [
    selectedBrand,
    allVariants,
    getSelectedBrandId,
  ]);

  /* =======================================================
     VARIANT NAME
  ======================================================= */

  const getVariantNameFromCar =
    useCallback(
      (car) => {
        if (car.variantName) {
          return car.variantName;
        }

        const variantField =
          car.variant;

        if (variantField) {
          if (
            variantField.variantName
          ) {
            return variantField.variantName;
          }

          if (
            variantField.title
          ) {
            return variantField.title;
          }

          if (
            variantField.name
          ) {
            return variantField.name;
          }

          if (
            typeof variantField ===
            "string"
          ) {
            const id =
              extractId(
                variantField
              );

            if (
              id &&
              variantsMap[id]
            ) {
              return variantsMap[
                id
              ].name;
            }
          }

          if (
            typeof variantField ===
              "object" &&
            variantField._id
          ) {
            const id =
              extractId(
                variantField._id
              );

            if (
              id &&
              variantsMap[id]
            ) {
              return variantsMap[
                id
              ].name;
            }
          }

          if (
            variantField.id
          ) {
            const id =
              extractId(
                variantField.id
              );

            if (
              id &&
              variantsMap[id]
            ) {
              return variantsMap[
                id
              ].name;
            }
          }
        }

        return (
          car.model ||
          "Unknown"
        );
      },
      [variantsMap]
    );

  /* =======================================================
     VARIANT IMAGE
  ======================================================= */

  const getVariantImageFromCar =
    useCallback(
      (car) => {
        const variantField =
          car.variant;

        if (variantField) {
          if (
            variantField.variantImage
          ) {
            return variantField.variantImage;
          }

          if (
            variantField.imageUrl
          ) {
            return variantField.imageUrl;
          }

          if (
            typeof variantField ===
            "string"
          ) {
            const id =
              extractId(
                variantField
              );

            if (
              id &&
              variantsMap[id]
            ) {
              return variantsMap[
                id
              ].image;
            }
          }

          if (
            typeof variantField ===
              "object" &&
            variantField._id
          ) {
            const id =
              extractId(
                variantField._id
              );

            if (
              id &&
              variantsMap[id]
            ) {
              return variantsMap[
                id
              ].image;
            }
          }
        }

        return "";
      },
      [variantsMap]
    );

  /* =======================================================
     VARIANT NAMES
  ======================================================= */

  const variantNamesFromCars =
    useMemo(() => {
      if (
        selectedBrand === "All"
      ) {
        return [];
      }

      const brandCars =
        allCars.filter(
          (car) =>
            car.brand?.name ===
            selectedBrand
        );

      const names = new Set();

      brandCars.forEach((car) => {
        const name =
          getVariantNameFromCar(
            car
          );

        if (
          name &&
          name !== "Unknown"
        ) {
          names.add(name);
        }
      });

      return Array.from(
        names
      ).sort();
    }, [
      selectedBrand,
      allCars,
      getVariantNameFromCar,
    ]);

  /* =======================================================
     GET VARIANT IMAGE
  ======================================================= */

  const getVariantImageForName =
    useCallback(
      (name) => {
        for (
          const variant of
          filteredVariants
        ) {
          const variantName =
            variant.variantName ||
            variant.title;

          if (
            variantName === name
          ) {
            return (
              variant.variantImage ||
              variant.imageUrl ||
              ""
            );
          }
        }

        for (
          const car of allCars
        ) {
          if (
            car.brand?.name ===
            selectedBrand
          ) {
            const carVariant =
              getVariantNameFromCar(
                car
              );

            if (
              carVariant === name
            ) {
              return getVariantImageFromCar(
                car
              );
            }
          }
        }

        return "";
      },
      [
        filteredVariants,
        allCars,
        selectedBrand,
        getVariantNameFromCar,
        getVariantImageFromCar,
      ]
    );

  /* =======================================================
     FILTERED CARS
  ======================================================= */

  const filteredCars =
    useMemo(() => {
      let cars = allCars;

      if (
        selectedBrand !== "All"
      ) {
        cars =
          cars.filter(
            (car) =>
              car.brand?.name ===
              selectedBrand
          );
      }

      if (selectedVariant) {
        cars =
          cars.filter(
            (car) =>
              getVariantNameFromCar(
                car
              ) ===
              selectedVariant
          );
      }

      return cars;
    }, [
      allCars,
      selectedBrand,
      selectedVariant,
      getVariantNameFromCar,
    ]);

  /* =======================================================
     BRAND SELECT
  ======================================================= */

  const handleBrandSelect =
    (brand) => {
      setSelectedBrand(brand);
      setSelectedVariant(null);

      if (
        brandScrollRef.current
      ) {
        brandScrollRef.current.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }

      if (
        variantScrollRef.current
      ) {
        variantScrollRef.current.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }
    };

  /* =======================================================
     VARIANT SELECT
  ======================================================= */

  const handleVariantSelect =
    (variant) => {
      setSelectedVariant(
        (previous) =>
          previous === variant
            ? null
            : variant
      );
    };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const handleClearFilters =
    () => {
      setSelectedBrand("All");
      setSelectedVariant(null);

      if (
        brandScrollRef.current
      ) {
        brandScrollRef.current.scrollLeft = 0;
      }

      if (
        variantScrollRef.current
      ) {
        variantScrollRef.current.scrollLeft = 0;
      }
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-gradient-to-b
          from-[#D6CEF3]
          to-[#F3EFFF]
        "
      >
        <div
          className="
            h-10
            w-10
            animate-spin
            rounded-full
            border-2
            border-gray-300
            border-t-blue-500
          "
        />
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        w-full
        min-w-0
        overflow-x-hidden
        bg-gradient-to-b
        from-[#D6CEF3]
        to-[#F3EFFF]
      "
    >
      {/* ===================================================
          HIDE HORIZONTAL SCROLLBAR
      =================================================== */}

      <style>{`
        .re2buy-horizontal-scroll {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .re2buy-horizontal-scroll::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        .re2buy-horizontal-scroll::-webkit-scrollbar-track {
          display: none !important;
        }

        .re2buy-horizontal-scroll::-webkit-scrollbar-thumb {
          display: none !important;
        }
      `}</style>

      {/* ===================================================
          APP BAR
      =================================================== */}

      <AppBar
        title={`${filteredCars.length} cars`}
        actions={
          <button
            type="button"
            onClick={() =>
              navigate("/filter")
            }
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/75
              text-[15px]
              shadow-sm
              transition
              hover:bg-white
              active:scale-90
            "
            aria-label="Open filters"
          >
            ⚙
          </button>
        }
      />

      {/* ===================================================
          MAIN
      =================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-[1280px]
          min-w-0
          overflow-hidden
          px-2.5
          pt-3
          pb-8
          sm:px-4
          lg:px-8
        "
      >
        {/* =================================================
            BRAND FILTER
        ================================================= */}

        <section
          className="
            mb-2
            w-full
            min-w-0
            overflow-hidden
          "
        >
          <div
            ref={brandScrollRef}
            className="
              re2buy-horizontal-scroll
              flex
              w-full
              min-w-0
              gap-2
              overflow-x-auto
              overflow-y-hidden
              pb-1
              overscroll-x-contain
              touch-pan-x
            "
          >
            {brands.map(
              (brand) => {
                const isActive =
                  brand ===
                  selectedBrand;

                const logoUrl =
                  brand === "All"
                    ? "/assets/logo/logo.webp"
                    : brandMap[
                        brand
                      ]?.logoUrl ||
                      "";

                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() =>
                      handleBrandSelect(
                        brand
                      )
                    }
                    className={`
                      flex
                      h-9
                      shrink-0
                      items-center
                      gap-1.5
                      rounded-full
                      px-2.5
                      whitespace-nowrap
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "bg-black text-white shadow-sm"
                          : "bg-white/75 text-gray-800"
                      }
                    `}
                  >
                    <img
                      src={
                        logoUrl ||
                        "/assets/logo/logo.webp"
                      }
                      alt={brand}
                      className="
                        h-7
                        w-7
                        shrink-0
                        rounded-full
                        bg-white
                        object-cover
                      "
                      onError={(
                        event
                      ) => {
                        event.currentTarget.src =
                          "/assets/logo/logo.webp";
                      }}
                    />

                    <span
                      className="
                        max-w-[105px]
                        truncate
                        text-[11px]
                        font-semibold
                        sm:max-w-none
                        sm:text-sm
                      "
                    >
                      {brand}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </section>

        {/* =================================================
            VARIANT FILTER
        ================================================= */}

        {selectedBrand !==
          "All" && (
          <section
            className="
              mb-3
              w-full
              min-w-0
              overflow-hidden
            "
          >
            {isLoadingVariants ? (
              <div
                className="
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  bg-white/70
                "
              >
                <div
                  className="
                    mr-2
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-black
                    border-t-transparent
                  "
                />

                <span className="text-xs font-semibold">
                  Loading variants...
                </span>
              </div>
            ) : variantNamesFromCars.length >
              0 ? (
              <div
                ref={
                  variantScrollRef
                }
                className="
                  re2buy-horizontal-scroll
                  flex
                  w-full
                  min-w-0
                  gap-2
                  overflow-x-auto
                  overflow-y-hidden
                  pb-1
                  overscroll-x-contain
                  touch-pan-x
                "
              >
                {variantNamesFromCars.map(
                  (variant) => {
                    const isActive =
                      variant ===
                      selectedVariant;

                    const image =
                      getVariantImageForName(
                        variant
                      );

                    return (
                      <button
                        key={variant}
                        type="button"
                        onClick={() =>
                          handleVariantSelect(
                            variant
                          )
                        }
                        className={`
                          flex
                          h-9
                          shrink-0
                          items-center
                          gap-1.5
                          rounded-full
                          px-2.5
                          whitespace-nowrap
                          transition-all
                          duration-200
                          ${
                            isActive
                              ? "bg-black text-white shadow-sm"
                              : "bg-white/75 text-gray-800"
                          }
                        `}
                      >
                        <img
                          src={
                            image ||
                            "/assets/logo/logo.webp"
                          }
                          alt={variant}
                          className="
                            h-7
                            w-7
                            shrink-0
                            rounded-full
                            bg-white
                            object-cover
                          "
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              "/assets/logo/logo.webp";
                          }}
                        />

                        <span
                          className="
                            max-w-[120px]
                            truncate
                            text-[11px]
                            font-semibold
                            sm:max-w-none
                            sm:text-sm
                          "
                        >
                          {variant}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            ) : (
              <div
                className="
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  bg-white/70
                "
              >
                <span className="text-xs font-semibold text-gray-600">
                  No variants available
                </span>
              </div>
            )}
          </section>
        )}

        {/* =================================================
            CAR GRID
        ================================================= */}

        {filteredCars.length ===
        0 ? (
          <div
            className="
              flex
              min-h-[420px]
              flex-col
              items-center
              justify-center
              text-center
            "
          >
            <div className="mb-4 text-6xl text-gray-300">
              🚗
            </div>

            <p className="font-medium text-gray-500">
              No T Board cars found
            </p>

            {(
              selectedBrand !==
                "All" ||
              selectedVariant
            ) && (
              <button
                type="button"
                onClick={
                  handleClearFilters
                }
                className="
                  mt-3
                  rounded-full
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-blue-500
                  shadow-sm
                "
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div
            className="
              grid
              w-full
              min-w-0
              grid-cols-2
              items-start
              gap-x-2
              gap-y-3
              sm:gap-x-3
              sm:gap-y-4
              md:grid-cols-3
              lg:grid-cols-4
              lg:gap-4
            "
          >
            {filteredCars.map(
              (car, index) => {
                const id =
                  extractId(
                    car._id
                  );

                return (
                  <motion.div
                    key={id}
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.28,
                      delay:
                        index * 0.035,
                    }}
                    className="
                      block
                      w-full
                      min-w-0
                      max-w-full
                      self-start
                      cursor-pointer
                    "
                    onClick={() =>
                      navigate(
                        `/car/${id}`,
                        {
                          state: {
                            car,
                          },
                        }
                      )
                    }
                  >
                    <CarCard
                      carId={id}
                      brandName={
                        car.brand
                          ?.name ||
                        ""
                      }
                      brandLogoUrl={
                        car.brand
                          ?.logo ||
                        ""
                      }
                      variant={getVariantNameFromCar(
                        car
                      )}
                      model={
                        car.model ||
                        ""
                      }
                      imageUrl={
                        car.bannerImage ||
                        ""
                      }
                      price={`₹${
                        car.price ||
                        0
                      }`}
                      fuel={
                        car.fuel ||
                        ""
                      }
                      year={
                        car.year?.toString() ||
                        "-"
                      }
                      status={
                        car.status ||
                        "available"
                      }
                      km={
                        car.km?.toString() ||
                        "0"
                      }
                      owner={
                        car.owner?.toString() ||
                        "1"
                      }
                      transmission={
                        car.transmission ||
                        "Manual"
                      }
                      district={
                        car.district ||
                        ""
                      }
                      city={
                        car.city ||
                        ""
                      }
                    />
                  </motion.div>
                );
              }
            )}
          </div>
        )}
      </main>
    </div>
  );
}