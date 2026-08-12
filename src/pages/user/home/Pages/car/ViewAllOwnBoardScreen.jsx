// src/pages/user/home/Pages/car/ViewAllOwnBoardScreen.jsx

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

export default function ViewAllOwnBoardScreen() {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [allCars, setAllCars] = useState([]);
  const [allVariants, setAllVariants] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [variantsMap, setVariantsMap] = useState({});

  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedVariant, setSelectedVariant] =
    useState(null);

  const [isLoadingVariants, setIsLoadingVariants] =
    useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const brandScrollRef = useRef(null);
  const variantScrollRef = useRef(null);

  /* =======================================================
     FETCH OWN BOARD CARS
  ======================================================= */

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await API.get("/cars", {
          params: {
            board: "own",
          },
        });

        const cars =
          response.data?.cars || [];

        setAllCars(cars);
      } catch (err) {
        console.error(
          "Error fetching own board cars:",
          err
        );

        setAllCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  /* =======================================================
     FETCH ALL VARIANTS
  ======================================================= */

  useEffect(() => {
    const loadVariants = async () => {
      try {
        const list = await getAllVariants();

        const map = {};

        list.forEach((v) => {
          const id = extractId(v._id);

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

        setAllVariants([]);
        setFilteredVariants([]);
      }
    };

    loadVariants();
  }, []);

  /* =======================================================
     FILTER VARIANTS BY BRAND
  ======================================================= */

  useEffect(() => {
    if (selectedBrand === "All") {
      setFilteredVariants(allVariants);
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

      setFilteredVariants(filtered);
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
  ]);

  /* =======================================================
     BRAND MAP
  ======================================================= */

  const brandMap = useMemo(() => {
    const map = {};

    allCars.forEach((car) => {
      const brand = car.brand;

      if (brand && brand.name) {
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
      if (selectedBrand === "All") {
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

          if (variantField.title) {
            return variantField.title;
          }

          if (variantField.name) {
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

          if (variantField.id) {
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
     VARIANT NAMES FROM CARS
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
          (c) =>
            c.brand?.name ===
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
     GET VARIANT IMAGE BY NAME
  ======================================================= */

  const getVariantImageForName =
    useCallback(
      (name) => {
        for (
          const v of filteredVariants
        ) {
          const vName =
            v.variantName ||
            v.title;

          if (vName === name) {
            return (
              v.variantImage ||
              v.imageUrl
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

        return null;
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

  const filteredCars = useMemo(() => {
    let cars = allCars;

    if (
      selectedBrand !== "All"
    ) {
      cars = cars.filter(
        (c) =>
          c.brand?.name ===
          selectedBrand
      );
    }

    if (selectedVariant) {
      cars = cars.filter(
        (car) => {
          const carVariantName =
            getVariantNameFromCar(
              car
            );

          return (
            carVariantName ===
            selectedVariant
          );
        }
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

  const handleBrandSelect = (
    brand
  ) => {
    setSelectedBrand(brand);
    setSelectedVariant(null);

    if (
      brandScrollRef.current
    ) {
      brandScrollRef.current.scrollLeft = 0;
    }
  };

  /* =======================================================
     VARIANT SELECT
  ======================================================= */

  const handleVariantSelect =
    (variant) => {
      setSelectedVariant(
        (prev) =>
          prev === variant
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#D6CEF3] to-[#F3EFFF]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
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
        overflow-x-hidden
        bg-gradient-to-b
        from-[#D6CEF3]
        to-[#F3EFFF]
      "
    >
      {/* =====================================================
          APP BAR
      ===================================================== */}

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
              items-center
              justify-center
              rounded-full
              bg-white/70
              text-[15px]
              shadow-sm
              transition-all
              hover:bg-white
              active:scale-90
            "
            aria-label="Open filters"
          >
            ⚙
          </button>
        }
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-[1280px]
          px-3
          pb-8
          pt-3
          sm:px-5
          lg:px-8
        "
      >
        {/* ===================================================
            BRAND FILTER
        =================================================== */}

        <div className="mb-2">
          <div
            ref={brandScrollRef}
            className="
              flex
              w-full
              gap-2
              overflow-x-auto
              pb-2
              scrollbar-hide
              overscroll-x-contain
            "
          >
            {brands.map((brand) => {
              const isActive =
                brand ===
                selectedBrand;

              const logoUrl =
                brand === "All"
                  ? "/assets/logo/logo.webp"
                  : brandMap[brand]
                      ?.logoUrl || "";

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
                    shrink-0
                    items-center
                    gap-1.5
                    rounded-full
                    px-2.5
                    py-1.5
                    whitespace-nowrap
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-black text-white shadow-sm"
                        : "bg-white/75 text-gray-800 hover:bg-white"
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
                      object-cover
                      bg-white
                    "
                    onError={(e) => {
                      e.currentTarget.src =
                        "/assets/logo/logo.webp";
                    }}
                  />

                  <span className="text-[12px] font-semibold sm:text-sm">
                    {brand}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            VARIANT FILTER
        =================================================== */}

        {selectedBrand !==
          "All" && (
          <div className="mb-3">
            {isLoadingVariants ? (
              <div
                className="
                  flex
                  h-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white/70
                  px-4
                "
              >
                <div
                  className="
                    mr-2
                    h-5
                    w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-black
                    border-t-transparent
                  "
                />

                <span className="text-sm font-semibold">
                  Loading variants...
                </span>
              </div>
            ) : variantNamesFromCars.length >
              0 ? (
              <div
                ref={variantScrollRef}
                className="
                  flex
                  w-full
                  gap-2
                  overflow-x-auto
                  pb-2
                  scrollbar-hide
                  overscroll-x-contain
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
                          shrink-0
                          items-center
                          gap-1.5
                          rounded-full
                          px-2.5
                          py-1.5
                          whitespace-nowrap
                          transition-all
                          duration-200
                          ${
                            isActive
                              ? "bg-black text-white shadow-sm"
                              : "bg-white/75 text-gray-800 hover:bg-white"
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
                            object-cover
                            bg-white
                          "
                          onError={(
                            e
                          ) => {
                            e.currentTarget.src =
                              "/assets/logo/logo.webp";
                          }}
                        />

                        <span className="text-[12px] font-semibold sm:text-sm">
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
                  items-center
                  justify-center
                  rounded-full
                  bg-white/70
                  px-4
                "
              >
                <span className="text-sm font-semibold text-gray-600">
                  No variants available
                </span>
              </div>
            )}
          </div>
        )}

        {/* ===================================================
            CAR GRID
            -----------------------------------------------
            Mobile  : 2
            Tablet  : 3
            Desktop : 4
        =================================================== */}

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
              No cars found
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
                  transition
                  hover:bg-blue-50
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
              grid-cols-2
              gap-2.5
              sm:gap-3
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
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      delay:
                        index * 0.035,
                    }}
                    className="
                      min-w-0
                      w-full
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
                          ?.name || ""
                      }

                      brandLogoUrl={
                        car.brand
                          ?.logo || ""
                      }

                      variant={getVariantNameFromCar(
                        car
                      )}

                      model={
                        car.model || ""
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
                        car.fuel || ""
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
                        car.city || ""
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