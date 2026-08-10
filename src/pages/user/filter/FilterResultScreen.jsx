// src/screens/FilterResultScreen.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Slider } from "@mui/material";

import {
  ArrowBack,
  ExpandMore,
  Tune,
  Search,
  DirectionsCar,
  LocalGasStation,
  People,
  Settings,
  CreditCard,
  Check,
  Close,
} from "@mui/icons-material";

import CarCard from "@/components/CarCard";
import { getAllVariants } from "@/services/carVariantApi.js";

/* =========================================================
   HELPERS
========================================================= */

const hideCar = (car) => {
  const status =
    car.status?.toString().toLowerCase() || "";

  return (
    status.includes("draft") ||
    status.includes("sold") ||
    status.includes("drift")
  );
};


const extractId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    if (value.$oid) {
      return value.$oid.toString();
    }

    if (value._id) {
      return value._id.toString();
    }
  }

  return value.toString();
};


const withComma = (num) => {
  return Math.floor(num).toLocaleString("en-IN");
};


const priceSliderLabel = (value) => {
  if (value >= 5000000) {
    return "50L+";
  }

  if (value >= 100000) {
    const lakh = value / 100000;

    return (
      lakh
        .toFixed(1)
        .replace(".0", "") + "L"
    );
  }

  return withComma(value);
};


const kmSliderLabel = (value) => {
  if (value >= 200000) {
    return "2L+";
  }

  if (value >= 100000) {
    const lakh = value / 100000;

    return (
      lakh
        .toFixed(2)
        .replace(/0+$/, "") + "L"
    );
  }

  return Math.round(value / 1000) + "K";
};


/* =========================================================
   VARIANT CACHE
========================================================= */

let allVariantsMap = {};
let cacheTime = null;

const CACHE_DURATION =
  15 * 60 * 1000;


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function FilterResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Cars coming from FilterScreen.
   *
   * Example:
   *
   * navigate("/filter-result", {
   *   state: {
   *     filteredCars: cars
   *   }
   * })
   */

  const filteredCars =
    location.state?.filteredCars || [];


  /* =======================================================
     ORIGINAL CARS
  ======================================================= */

  const originalCarsRef =
    useRef(filteredCars);


  /* =======================================================
     RESULT CARS
  ======================================================= */

  const [displayCars, setDisplayCars] =
    useState([]);


  /* =======================================================
     FILTER STATES
  ======================================================= */

  const [priceRange, setPriceRange] =
    useState([0, 5000000]);

  const [kmRange, setKmRange] =
    useState([0, 200000]);


  const [selectedFuel, setSelectedFuel] =
    useState("");

  const [selectedTransmission, setSelectedTransmission] =
    useState("");

  const [selectedOwner, setSelectedOwner] =
    useState("");

  const [selectedBoard, setSelectedBoard] =
    useState("");


  const [searchText, setSearchText] =
    useState("");


  const [advancedOpen, setAdvancedOpen] =
    useState(false);


  const [sortBy, setSortBy] =
    useState("newest");


  /* =======================================================
     VARIANT CACHE RELOAD
  ======================================================= */

  const [, forceVariantRender] =
    useState(0);


  /* =======================================================
     INITIAL CARS
  ======================================================= */

  useEffect(() => {
    originalCarsRef.current =
      filteredCars;

    setDisplayCars(
      filteredCars.filter(
        (car) => !hideCar(car)
      )
    );
  }, [filteredCars]);


  /* =======================================================
     LOAD VARIANTS
  ======================================================= */

  useEffect(() => {
    const loadVariants =
      async () => {
        if (
          cacheTime &&
          Date.now() - cacheTime <
            CACHE_DURATION &&
          Object.keys(
            allVariantsMap
          ).length
        ) {
          return;
        }

        try {
          const fetched =
            await getAllVariants();

          const map = {};

          fetched.forEach(
            (variant) => {
              const id =
                extractId(
                  variant._id
                );

              if (id) {
                map[id] =
                  variant.variantName ||
                  variant.title ||
                  variant.name ||
                  "Unknown";
              }
            }
          );

          allVariantsMap = map;

          cacheTime =
            Date.now();

          forceVariantRender(
            (v) => v + 1
          );
        } catch (error) {
          console.log(
            "Variant cache error:",
            error
          );
        }
      };

    loadVariants();
  }, []);


  /* =======================================================
     VARIANT NAME
  ======================================================= */

  const getVariantDisplayName =
    useCallback((car) => {
      const id =
        extractId(
          car.variant
        );

      if (
        id &&
        allVariantsMap[id]
      ) {
        return allVariantsMap[id];
      }

      return (
        car.variant?.variantName ||
        car.variant?.title ||
        car.variantName ||
        car.model ||
        "Unknown"
      );
    }, []);


  /* =======================================================
     APPLY ALL LOCAL FILTERS
  ======================================================= */

  useEffect(() => {
    let result =
      originalCarsRef.current.filter(
        (car) => !hideCar(car)
      );


    /* -----------------------------------------------------
       PRICE
    ----------------------------------------------------- */

    result = result.filter(
      (car) => {
        const price =
          parseFloat(
            car.price
          ) || 0;

        return (
          price >= priceRange[0] &&
          price <= priceRange[1]
        );
      }
    );


    /* -----------------------------------------------------
       KM
    ----------------------------------------------------- */

    result = result.filter(
      (car) => {
        const km =
          parseFloat(
            car.km
          ) || 0;

        return (
          km >= kmRange[0] &&
          km <= kmRange[1]
        );
      }
    );


    /* -----------------------------------------------------
       FUEL
    ----------------------------------------------------- */

    if (selectedFuel) {
      result =
        result.filter(
          (car) =>
            car.fuel
              ?.toString()
              .toLowerCase() ===
            selectedFuel
              .toLowerCase()
        );
    }


    /* -----------------------------------------------------
       TRANSMISSION
    ----------------------------------------------------- */

    if (selectedTransmission) {
      result =
        result.filter(
          (car) =>
            car.transmission
              ?.toString()
              .toLowerCase() ===
            selectedTransmission
              .toLowerCase()
        );
    }


    /* -----------------------------------------------------
       OWNER
    ----------------------------------------------------- */

    if (selectedOwner) {
      result =
        result.filter(
          (car) => {
            const owner =
              car.owner
                ?.toString()
                .toLowerCase() || "";

            return owner.includes(
              selectedOwner
                .toLowerCase()
            );
          }
        );
    }


    /* -----------------------------------------------------
       BOARD
    ----------------------------------------------------- */

    if (selectedBoard) {
      result =
        result.filter(
          (car) => {
            const board =
              car.board
                ?.toString()
                .toLowerCase() || "";

            if (
              selectedBoard ===
              "own"
            ) {
              return (
                board.includes("own") ||
                board.includes("white")
              );
            }

            if (
              selectedBoard ===
              "t board"
            ) {
              return (
                board.includes("t") ||
                board.includes("taxi") ||
                board.includes("travel")
              );
            }

            return true;
          }
        );
    }


    /* -----------------------------------------------------
       SEARCH
    ----------------------------------------------------- */

    if (
      searchText.trim()
    ) {
      const search =
        searchText
          .trim()
          .toLowerCase();

      result =
        result.filter(
          (car) => {
            const variant =
              getVariantDisplayName(
                car
              );

            const searchable = [
              car.brand?.name,
              car.model,
              variant,
              car.fuel,
              car.transmission,
              car.district,
              car.city,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            return searchable.includes(
              search
            );
          }
        );
    }


    /* -----------------------------------------------------
       SORT
    ----------------------------------------------------- */

    result.sort(
      (a, b) => {
        if (
          sortBy ===
          "price-low"
        ) {
          return (
            (parseFloat(a.price) || 0) -
            (parseFloat(b.price) || 0)
          );
        }

        if (
          sortBy ===
          "price-high"
        ) {
          return (
            (parseFloat(b.price) || 0) -
            (parseFloat(a.price) || 0)
          );
        }

        if (
          sortBy ===
          "year-new"
        ) {
          return (
            (parseInt(b.year) || 0) -
            (parseInt(a.year) || 0)
          );
        }

        return (
          (parseInt(b.year) || 0) -
          (parseInt(a.year) || 0)
        );
      }
    );


    setDisplayCars(result);

  }, [
    priceRange,
    kmRange,
    selectedFuel,
    selectedTransmission,
    selectedOwner,
    selectedBoard,
    searchText,
    sortBy,
    getVariantDisplayName,
  ]);


  /* =======================================================
     RESET
  ======================================================= */

  const resetFilters =
    () => {
      setPriceRange([
        0,
        5000000,
      ]);

      setKmRange([
        0,
        200000,
      ]);

      setSelectedFuel("");

      setSelectedTransmission("");

      setSelectedOwner("");

      setSelectedBoard("");

      setSearchText("");

      setSortBy("newest");
    };


  /* =======================================================
     FILTER ACTIVE COUNT
  ======================================================= */

  const activeFilterCount =
    useMemo(() => {
      let count = 0;

      if (selectedFuel)
        count++;

      if (
        selectedTransmission
      )
        count++;

      if (selectedOwner)
        count++;

      if (selectedBoard)
        count++;

      if (
        priceRange[0] > 0 ||
        priceRange[1] <
          5000000
      )
        count++;

      if (
        kmRange[0] > 0 ||
        kmRange[1] <
          200000
      )
        count++;

      if (searchText)
        count++;

      return count;
    }, [
      selectedFuel,
      selectedTransmission,
      selectedOwner,
      selectedBoard,
      priceRange,
      kmRange,
      searchText,
    ]);


  /* =======================================================
     NO STATE
  ======================================================= */

  if (
    !location.state ||
    !Array.isArray(
      location.state.filteredCars
    )
  ) {
    return (
      <div className="min-h-screen bg-[#f7f5fa] flex items-center justify-center">

        <div className="text-center">

          <div className="text-5xl mb-5">
            🚘
          </div>

          <h2 className="text-2xl font-bold">
            No cars available
          </h2>

          <p className="text-black/50 mt-2">
            Please go back and select
            your car filters.
          </p>

          <button
            onClick={() =>
              navigate(-1)
            }
            className="mt-6 px-6 py-3 rounded-full bg-black text-white"
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }


  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="re2-filter-result-page">


      {/* =====================================================
          DESKTOP HEADER
      ===================================================== */}

      <header className="re2-desktop-header">

        <div className="re2-logo-area">

          <button
            onClick={() =>
              navigate(-1)
            }
            className="re2-header-back"
          >
            <ArrowBack
              style={{
                fontSize: 17,
              }}
            />
          </button>

          <img
            src="/assets/logo/logo_1.webp"
            alt="Re2buy"
            className="re2-logo"
          />

        </div>


        <nav className="re2-nav">

          <button>
            All cars
          </button>

          <button>
            Car brands
            <ExpandMore
              style={{
                fontSize: 15,
              }}
            />
          </button>

          <button>
            Car models
            <ExpandMore
              style={{
                fontSize: 15,
              }}
            />
          </button>

          <button>
            Car types
            <ExpandMore
              style={{
                fontSize: 15,
              }}
            />
          </button>

          <button>
            Leasing forms
            <ExpandMore
              style={{
                fontSize: 15,
              }}
            />
          </button>

          <button>
            Employees
          </button>

          <button>
            FAQ
            <ExpandMore
              style={{
                fontSize: 15,
              }}
            />
          </button>

        </nav>


        <button
          className="re2-menu-button"
          onClick={() =>
            navigate(-1)
          }
        >
          <span />
          <span />
        </button>

      </header>


      {/* =====================================================
          DESKTOP CONTENT
      ===================================================== */}

      <main className="re2-desktop-main">


        {/* ===================================================
            SEARCH / FILTER PANEL
        =================================================== */}

        <section className="re2-filter-panel">


          {/* -----------------------------------------------
              TOP FILTERS
          ------------------------------------------------ */}

          <div className="re2-filter-top">


            {/* BRAND */}

            <div className="re2-filter-heading">

              <span>
                Search cars
              </span>

              <small>
                Find your next car
              </small>

            </div>


            {/* BRAND / SEARCH */}

            <FilterSelect
              icon={
                <DirectionsCar />
              }
              label="Brand"
              value="All brands"
            />


            {/* MODEL */}

            <FilterSelect
              icon={
                <Settings />
              }
              label="Model"
              value="All models"
            />


            {/* SEARCH */}

            <div className="re2-search-box">

              <Search />

              <input
                value={
                  searchText
                }
                onChange={(e) =>
                  setSearchText(
                    e.target.value
                  )
                }
                placeholder="Search by car, brand, model..."
              />

            </div>

          </div>


          <div className="re2-line" />


          {/* =================================================
              PRICE
          ================================================= */}

          <div className="re2-price-row">


            <div className="re2-price-label">

              <strong>
                Price
              </strong>

              <span>
                {withComma(
                  priceRange[0]
                )}{" "}
                –{" "}
                {withComma(
                  priceRange[1]
                )}
              </span>

            </div>


            <div className="re2-price-slider">

              <Slider
                value={
                  priceRange
                }
                onChange={(
                  _event,
                  value
                ) =>
                  setPriceRange(
                    value
                  )
                }
                min={0}
                max={5000000}
                step={100000}
                disableSwap
                valueLabelDisplay="auto"
                valueLabelFormat={
                  priceSliderLabel
                }
                sx={{
                  color:
                    "#a88bd6",

                  height: 5,

                  "& .MuiSlider-thumb":
                    {
                      width: 20,
                      height: 20,
                      backgroundColor:
                        "#fff",
                      border:
                        "3px solid #a88bd6",
                      boxShadow:
                        "0 3px 12px rgba(120,90,160,.16)",
                    },

                  "& .MuiSlider-track":
                    {
                      border:
                        "none",
                    },

                  "& .MuiSlider-rail":
                    {
                      backgroundColor:
                        "#e7def1",
                      opacity: 1,
                    },
                }}
              />

              <div className="re2-slider-labels">

                <span>
                  {priceSliderLabel(
                    priceRange[0]
                  )}
                </span>

                <span>
                  {priceSliderLabel(
                    priceRange[1]
                  )}
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              ADVANCED SEARCH
          ================================================= */}

          <button
            className={`re2-advanced-button ${
              advancedOpen
                ? "open"
                : ""
            }`}
            onClick={() =>
              setAdvancedOpen(
                !advancedOpen
              )
            }
          >

            <Tune
              style={{
                fontSize: 15,
              }}
            />

            <span>
              {advancedOpen
                ? "Hide advanced search"
                : "Advanced search"}
            </span>

            <ExpandMore
              className={
                advancedOpen
                  ? "rotate-180"
                  : ""
              }
            />

          </button>


          {/* =================================================
              ADVANCED CONTENT
          ================================================= */}

          <div
            className={`re2-advanced-content ${
              advancedOpen
                ? "advanced-visible"
                : ""
            }`}
          >

            <div className="re2-advanced-grid">


              {/* FUEL */}

              <AdvancedSelect
                label="Fuel type"
                value={
                  selectedFuel
                }
                onChange={
                  setSelectedFuel
                }
                icon={
                  <LocalGasStation />
                }
                options={[
                  [
                    "",
                    "All fuel types",
                  ],
                  [
                    "petrol",
                    "Petrol",
                  ],
                  [
                    "diesel",
                    "Diesel",
                  ],
                  [
                    "cng",
                    "CNG",
                  ],
                  [
                    "lpg",
                    "LPG",
                  ],
                  [
                    "electric",
                    "Electric",
                  ],
                  [
                    "hybrid",
                    "Hybrid",
                  ],
                ]}
              />


              {/* TRANSMISSION */}

              <AdvancedSelect
                label="Transmission"
                value={
                  selectedTransmission
                }
                onChange={
                  setSelectedTransmission
                }
                icon={
                  <Settings />
                }
                options={[
                  [
                    "",
                    "All transmissions",
                  ],
                  [
                    "manual",
                    "Manual",
                  ],
                  [
                    "automatic",
                    "Automatic",
                  ],
                ]}
              />


              {/* OWNER */}

              <AdvancedSelect
                label="Owner"
                value={
                  selectedOwner
                }
                onChange={
                  setSelectedOwner
                }
                icon={
                  <People />
                }
                options={[
                  [
                    "",
                    "All owners",
                  ],
                  [
                    "1",
                    "1st Owner",
                  ],
                  [
                    "2",
                    "2nd Owner",
                  ],
                  [
                    "3",
                    "3rd Owner",
                  ],
                  [
                    "4",
                    "4th Owner",
                  ],
                  [
                    "5",
                    "5th Owner",
                  ],
                ]}
              />


              {/* KM */}

              <div className="re2-advanced-card">

                <div className="re2-advanced-card-head">

                  <div>
                    <span>
                      DETAILS
                    </span>

                    <strong>
                      Kilometers
                    </strong>
                  </div>

                  <span>
                    {kmSliderLabel(
                      kmRange[0]
                    )}{" "}
                    –{" "}
                    {kmSliderLabel(
                      kmRange[1]
                    )}
                  </span>

                </div>


                <Slider
                  value={
                    kmRange
                  }
                  onChange={(
                    _event,
                    value
                  ) =>
                    setKmRange(
                      value
                    )
                  }
                  min={0}
                  max={200000}
                  step={5000}
                  disableSwap
                  valueLabelDisplay="auto"
                  valueLabelFormat={
                    kmSliderLabel
                  }
                  sx={{
                    color:
                      "#a88bd6",

                    height: 5,

                    "& .MuiSlider-thumb":
                      {
                        width: 18,
                        height: 18,
                        backgroundColor:
                          "#fff",
                        border:
                          "3px solid #a88bd6",
                      },

                    "& .MuiSlider-track":
                      {
                        border:
                          "none",
                      },

                    "& .MuiSlider-rail":
                      {
                        backgroundColor:
                          "#e7def1",
                        opacity: 1,
                      },
                  }}
                />

              </div>

            </div>


            {/* BOARD */}

            <div className="re2-board-section">

              <div className="re2-board-title">

                <span>
                  REGISTRATION
                </span>

                <strong>
                  Board type
                </strong>

              </div>


              <div className="re2-board-list">


                {/* OWN */}

                <button
                  className={`re2-board-card ${
                    selectedBoard ===
                    "own"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedBoard(
                      selectedBoard ===
                        "own"
                        ? ""
                        : "own"
                    )
                  }
                >

                  <div className="re2-board-icon">
                    <DirectionsCar />
                  </div>

                  <div>

                    <strong>
                      OWN BOARD
                    </strong>

                    <span>
                      White board
                    </span>

                  </div>

                  <div className="re2-check">

                    {selectedBoard ===
                    "own" && (
                      <Check
                        style={{
                          fontSize: 13,
                        }}
                      />
                    )}

                  </div>

                </button>


                {/* T BOARD */}

                <button
                  className={`re2-board-card ${
                    selectedBoard ===
                    "t board"
                      ? "selected yellow"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedBoard(
                      selectedBoard ===
                        "t board"
                        ? ""
                        : "t board"
                    )
                  }
                >

                  <div className="re2-board-icon">
                    <DirectionsCar />
                  </div>

                  <div>

                    <strong>
                      T BOARD
                    </strong>

                    <span>
                      Taxi / Travels
                    </span>

                  </div>

                  <div className="re2-check">

                    {selectedBoard ===
                    "t board" && (
                      <Check
                        style={{
                          fontSize: 13,
                        }}
                      />
                    )}

                  </div>

                </button>

              </div>

            </div>

          </div>


          {/* =================================================
              FILTER ACTIONS
          ================================================= */}

          <div className="re2-filter-actions">

            <div className="re2-active-count">

              {activeFilterCount >
                0 && (
                <span>
                  {activeFilterCount} filters
                  active
                </span>
              )}

            </div>


            <button
              className="re2-clear-button"
              onClick={
                resetFilters
              }
            >
              <Close
                style={{
                  fontSize: 14,
                }}
              />

              Clear filter
            </button>

          </div>

        </section>


        {/* ===================================================
            COMPANY / BOARD ROW
        =================================================== */}

        <section className="re2-company-section">

          <div className="re2-company-heading">
            One car marketplace —
            <span>
              selected listings
            </span>
          </div>


          <div className="re2-company-grid">


            {/* SELECTED */}

            <CompanyCard
              selected
              title="Re2buy Cars"
              count={
                displayCars.length
              }
            />


            {/* OTHER */}

            <CompanyCard
              title="All Cars"
              count={
                originalCarsRef.current.length
              }
            />


            <CompanyCard
              title="Verified Cars"
              count={
                displayCars.filter(
                  (car) =>
                    car.verified ===
                      true ||
                    car.isVerified ===
                      true
                ).length
              }
            />


            <CompanyCard
              title="Premium Cars"
              count={
                displayCars.filter(
                  (car) =>
                    car.premium ===
                      true ||
                    car.isPremium ===
                      true
                ).length
              }
            />

          </div>

        </section>


        {/* ===================================================
            RESULTS HEADER
        =================================================== */}

        <section className="re2-results-heading">

          <div>

            <h1>
              See the results of
              your search
            </h1>

            <p>
              ({displayCars.length} results)
            </p>

          </div>


          <select
            value={
              sortBy
            }
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
            className="re2-sort-select"
          >

            <option value="newest">
              Newest
            </option>

            <option value="year-new">
              Newest year
            </option>

            <option value="price-low">
              Price low
            </option>

            <option value="price-high">
              Price high
            </option>

          </select>

        </section>


        {/* ===================================================
            CAR GRID — SAME PAGE
        =================================================== */}

        <section className="re2-car-results">

          {displayCars.length ===
          0 ? (
            <div className="re2-no-results">

              <div className="re2-no-results-icon">
                <DirectionsCar />
              </div>

              <h2>
                No cars found
              </h2>

              <p>
                Try changing your
                filters and search again.
              </p>

              <button
                onClick={
                  resetFilters
                }
              >
                Reset filters
              </button>

            </div>
          ) : (
            <div className="re2-car-grid">

              {displayCars.map(
                (car) => {
                  const carId =
                    extractId(
                      car._id
                    );

                  return (
                    <div
                      key={
                        carId
                      }
                      className="re2-car-item"
                      onClick={() =>
                        navigate(
                          `/car/${carId}`,
                          {
                            state: {
                              car,
                            },
                          }
                        )
                      }
                    >

                      <CarCard
                        carId={
                          carId
                        }
                        brandName={
                          car.brand
                            ?.name
                        }
                        brandLogoUrl={
                          car.brand
                            ?.logo
                        }
                        variant={
                          getVariantDisplayName(
                            car
                          )
                        }
                        model={
                          car.model
                        }
                        imageUrl={
                          car.bannerImage
                        }
                        price={`₹${withComma(
                          parseFloat(
                            car.price
                          ) || 0
                        )}`}
                        fuel={
                          car.fuel
                        }
                        year={
                          car.year
                        }
                        status={
                          car.status
                        }
                        km={
                          car.km
                        }
                        owner={
                          car.owner
                        }
                        transmission={
                          car.transmission
                        }
                        district={
                          car.district
                        }
                        city={
                          car.city
                        }
                      />

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

      </main>


      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="re2-mobile-page">


        {/* APP BAR */}

        <div className="re2-mobile-header">

          <button
            onClick={() =>
              navigate(-1)
            }
          >
            <ArrowBack
              style={{
                fontSize: 19,
              }}
            />
          </button>

          <strong>
            Results ({displayCars.length})
          </strong>

          <div />

        </div>


        {/* SEARCH */}

        <div className="re2-mobile-search">

          <Search />

          <input
            value={
              searchText
            }
            onChange={(e) =>
              setSearchText(
                e.target.value
              )
            }
            placeholder="Search cars..."
          />

        </div>


        {/* FILTER CARD */}

        <div className="re2-mobile-filter-card">


          {/* PRICE */}

          <div className="re2-mobile-slider">

            <div className="re2-mobile-slider-title">

              <span>
                Price
              </span>

              <strong>
                {priceSliderLabel(
                  priceRange[0]
                )}{" "}
                -{" "}
                {priceSliderLabel(
                  priceRange[1]
                )}
              </strong>

            </div>


            <Slider
              value={
                priceRange
              }
              onChange={(
                _event,
                value
              ) =>
                setPriceRange(
                  value
                )
              }
              min={0}
              max={5000000}
              step={100000}
              disableSwap
              sx={{
                color:
                  "#7c6b9e",

                "& .MuiSlider-thumb":
                  {
                    width: 16,
                    height: 16,
                  },
              }}
            />

          </div>


          {/* KM */}

          <div className="re2-mobile-slider">

            <div className="re2-mobile-slider-title">

              <span>
                Kilometers
              </span>

              <strong>
                {kmSliderLabel(
                  kmRange[0]
                )}{" "}
                -{" "}
                {kmSliderLabel(
                  kmRange[1]
                )}
              </strong>

            </div>


            <Slider
              value={
                kmRange
              }
              onChange={(
                _event,
                value
              ) =>
                setKmRange(
                  value
                )
              }
              min={0}
              max={200000}
              step={5000}
              disableSwap
              sx={{
                color:
                  "#7c6b9e",

                "& .MuiSlider-thumb":
                  {
                    width: 16,
                    height: 16,
                  },
              }}
            />

          </div>


          {/* ADVANCED */}

          <button
            className="re2-mobile-advanced"
            onClick={() =>
              setAdvancedOpen(
                !advancedOpen
              )
            }
          >

            <Tune />

            Advanced filters

            <ExpandMore
              className={
                advancedOpen
                  ? "rotate-180"
                  : ""
              }
            />

          </button>


          {advancedOpen && (
            <div className="re2-mobile-advanced-content">

              <MobileSelect
                title="Fuel"
                value={
                  selectedFuel
                }
                onChange={
                  setSelectedFuel
                }
                options={[
                  [
                    "",
                    "All",
                  ],
                  [
                    "petrol",
                    "Petrol",
                  ],
                  [
                    "diesel",
                    "Diesel",
                  ],
                  [
                    "cng",
                    "CNG",
                  ],
                  [
                    "electric",
                    "Electric",
                  ],
                  [
                    "hybrid",
                    "Hybrid",
                  ],
                ]}
              />


              <MobileSelect
                title="Transmission"
                value={
                  selectedTransmission
                }
                onChange={
                  setSelectedTransmission
                }
                options={[
                  [
                    "",
                    "All",
                  ],
                  [
                    "manual",
                    "Manual",
                  ],
                  [
                    "automatic",
                    "Automatic",
                  ],
                ]}
              />


              <MobileSelect
                title="Owner"
                value={
                  selectedOwner
                }
                onChange={
                  setSelectedOwner
                }
                options={[
                  [
                    "",
                    "All",
                  ],
                  [
                    "1",
                    "1st Owner",
                  ],
                  [
                    "2",
                    "2nd Owner",
                  ],
                  [
                    "3",
                    "3rd Owner",
                  ],
                  [
                    "4",
                    "4th Owner",
                  ],
                ]}
              />

            </div>
          )}

        </div>


        {/* MOBILE RESULTS */}

        <div className="re2-mobile-results">

          <div className="re2-mobile-results-head">

            <div>
              <h2>
                {displayCars.length}
                {" "}
                results
              </h2>

              <span>
                Cars matching your filters
              </span>
            </div>


            <select
              value={
                sortBy
              }
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
            >
              <option value="newest">
                Newest
              </option>

              <option value="price-low">
                Price low
              </option>

              <option value="price-high">
                Price high
              </option>
            </select>

          </div>


          {displayCars.length ===
          0 ? (
            <div className="re2-mobile-empty">
              No cars found
            </div>
          ) : (
            <div className="re2-mobile-grid">

              {displayCars.map(
                (car) => {
                  const carId =
                    extractId(
                      car._id
                    );

                  return (
                    <div
                      key={
                        carId
                      }
                      onClick={() =>
                        navigate(
                          `/car/${carId}`,
                          {
                            state: {
                              car,
                            },
                          }
                        )
                      }
                    >

                      <CarCard
                        carId={
                          carId
                        }
                        brandName={
                          car.brand
                            ?.name
                        }
                        brandLogoUrl={
                          car.brand
                            ?.logo
                        }
                        variant={
                          getVariantDisplayName(
                            car
                          )
                        }
                        model={
                          car.model
                        }
                        imageUrl={
                          car.bannerImage
                        }
                        price={`₹${withComma(
                          parseFloat(
                            car.price
                          ) || 0
                        )}`}
                        fuel={
                          car.fuel
                        }
                        year={
                          car.year
                        }
                        status={
                          car.status
                        }
                        km={
                          car.km
                        }
                        owner={
                          car.owner
                        }
                        transmission={
                          car.transmission
                        }
                        district={
                          car.district
                        }
                        city={
                          car.city
                        }
                      />

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

      </div>


      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }


        body {
          margin: 0;
        }


        .re2-filter-result-page {
          min-height: 100vh;
          background:
            #f8f7f4;

          color:
            #17151a;

          font-family:
            Inter,
            Arial,
            Helvetica,
            sans-serif;
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .re2-desktop-header {
          height: 92px;

          background:
            rgba(255,255,255,.96);

          border-bottom:
            1px solid
            #eeeae5;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          padding:
            0 32px;

          position:
            sticky;

          top: 0;

          z-index: 50;
        }


        .re2-logo-area {
          display:
            flex;

          align-items:
            center;

          gap:
            16px;

          min-width:
            210px;
        }


        .re2-header-back {
          width:
            38px;

          height:
            38px;

          border:
            1px solid
            #e8e3dc;

          background:
            #fff;

          border-radius:
            50%;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          cursor:
            pointer;

          transition:
            .2s ease;
        }


        .re2-header-back:hover {
          background:
            #f2ecfa;

          border-color:
            #d9caec;
        }


        .re2-logo {
          width:
            125px;

          max-height:
            54px;

          object-fit:
            contain;
        }


        .re2-nav {
          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          gap:
            clamp(
              22px,
              3vw,
              52px
            );

          flex:
            1;
        }


        .re2-nav button {
          border:
            none;

          background:
            transparent;

          color:
            #252229;

          font-size:
            12px;

          display:
            flex;

          align-items:
            center;

          gap:
            3px;

          cursor:
            pointer;

          white-space:
            nowrap;

          transition:
            .2s ease;
        }


        .re2-nav button:hover {
          color:
            #8b70b2;
        }


        .re2-menu-button {
          width:
            42px;

          height:
            42px;

          border:
            1px solid
            #eee8e1;

          border-radius:
            50%;

          background:
            white;

          display:
            flex;

          flex-direction:
            column;

          align-items:
            center;

          justify-content:
            center;

          gap:
            5px;

          cursor:
            pointer;
        }


        .re2-menu-button span {
          width:
            14px;

          height:
            1.5px;

          background:
            #17151a;
        }


        /* =====================================================
           MAIN
        ===================================================== */

        .re2-desktop-main {
          width:
            min(
              1375px,
              calc(100% - 50px)
            );

          margin:
            0 auto;

          padding:
            26px 0 80px;
        }


        /* =====================================================
           FILTER PANEL
        ===================================================== */

        .re2-filter-panel {
          background:
            #fbfaf6;

          border:
            1px solid
            #eee9e2;

          border-radius:
            0 0 18px 18px;

          padding:
            27px 30px 22px;

          box-shadow:
            0 18px 50px
            rgba(67,54,76,.06);
        }


        .re2-filter-top {
          display:
            grid;

          grid-template-columns:
            205px
            1fr
            1fr
            1.18fr;

          gap:
            20px;

          align-items:
            center;
        }


        .re2-filter-heading {
          display:
            flex;

          flex-direction:
            column;

          gap:
            5px;
        }


        .re2-filter-heading span {
          font-size:
            20px;

          font-weight:
            750;

          letter-spacing:
            -.03em;
        }


        .re2-filter-heading small {
          font-size:
            10px;

          color:
            #a19aa5;
        }


        .re2-filter-select {
          height:
            62px;

          border-radius:
            16px;

          background:
            #f7f5f0;

          border:
            1px solid
            #ebe5dd;

          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          padding:
            0 16px;

          position:
            relative;

          transition:
            .22s ease;
        }


        .re2-filter-select:hover {
          background:
            #fff;

          border-color:
            #d9cbea;

          box-shadow:
            0 8px 22px
            rgba(117,90,150,.06);
        }


        .re2-filter-select-icon {
          width:
            31px;

          height:
            31px;

          border-radius:
            50%;

          background:
            #eee8f8;

          color:
            #8971a9;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;
        }


        .re2-filter-select-text {
          display:
            flex;

          flex-direction:
            column;

          gap:
            3px;

          flex:
            1;
        }


        .re2-filter-select-text span {
          color:
            #aaa2ad;

          font-size:
            9px;

          font-weight:
            700;
        }


        .re2-filter-select-text strong {
          font-size:
            12px;

          font-weight:
            650;
        }


        .re2-filter-select > svg {
          color:
            #8c8590;

          font-size:
            17px;
        }


        .re2-search-box {
          height:
            62px;

          border:
            1px solid
            #ebe5dd;

          border-radius:
            16px;

          background:
            #fff;

          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          padding:
            0 17px;

          color:
            #948c98;
        }


        .re2-search-box svg {
          font-size:
            18px;
        }


        .re2-search-box input {
          width:
            100%;

          border:
            none;

          outline:
            none;

          background:
            transparent;

          font-size:
            12px;

          color:
            #28242c;
        }


        .re2-search-box input::placeholder {
          color:
            #a7a0aa;
        }


        .re2-line {
          height:
            1px;

          background:
            #e7e2db;

          margin:
            24px 0;
        }


        /* =====================================================
           PRICE
        ===================================================== */

        .re2-price-row {
          display:
            grid;

          grid-template-columns:
            205px 1fr;

          gap:
            20px;

          align-items:
            center;
        }


        .re2-price-label {
          display:
            flex;

          flex-direction:
            column;

          gap:
            6px;
        }


        .re2-price-label strong {
          font-size:
            15px;
        }


        .re2-price-label span {
          font-size:
            10px;

          color:
            #9b949e;
        }


        .re2-price-slider {
          padding:
            0 6px;
        }


        .re2-slider-labels {
          display:
            flex;

          justify-content:
            space-between;

          margin-top:
            6px;

          color:
            #242027;

          font-size:
            10px;
        }


        /* =====================================================
           ADVANCED BUTTON
        ===================================================== */

        .re2-advanced-button {
          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          gap:
            7px;

          height:
            42px;

          padding:
            0 19px;

          margin:
            22px auto -43px;

          position:
            relative;

          z-index:
            4;

          border:
            none;

          border-radius:
            999px;

          background:
            #e9d8ff;

          color:
            #60497e;

          font-size:
            11px;

          font-weight:
            700;

          cursor:
            pointer;

          box-shadow:
            0 7px 22px
            rgba(119,91,155,.10);

          transition:
            .25s ease;
        }


        .re2-advanced-button:hover {
          transform:
            translateY(-2px);

          background:
            #dfcaff;
        }


        .re2-advanced-button svg:last-child {
          transition:
            .25s ease;
        }


        .rotate-180 {
          transform:
            rotate(180deg);
        }


        /* =====================================================
           ADVANCED
        ===================================================== */

        .re2-advanced-content {
          max-height:
            0;

          opacity:
            0;

          overflow:
            hidden;

          transition:
            max-height .45s ease,
            opacity .3s ease,
            padding .35s ease;

          padding-top:
            0;
        }


        .re2-advanced-content.advanced-visible {
          max-height:
            700px;

          opacity:
            1;

          padding-top:
            40px;
        }


        .re2-advanced-grid {
          display:
            grid;

          grid-template-columns:
            repeat(4,1fr);

          gap:
            13px;
        }


        .re2-advanced-card {
          min-height:
            105px;

          background:
            #f8f5ff;

          border:
            1px solid
            #e8e0f1;

          border-radius:
            15px;

          padding:
            17px;
        }


        .re2-advanced-card-head {
          display:
            flex;

          justify-content:
            space-between;

          align-items:
            flex-start;

          margin-bottom:
            22px;
        }


        .re2-advanced-card-head > div {
          display:
            flex;

          flex-direction:
            column;

          gap:
            4px;
        }


        .re2-advanced-card-head span:first-child {
          color:
            #a49ba8;

          font-size:
            8px;

          letter-spacing:
            .13em;

          font-weight:
            700;
        }


        .re2-advanced-card-head strong {
          font-size:
            12px;
        }


        .re2-advanced-card-head > span:last-child {
          color:
            #8b72aa;

          font-size:
            10px;

          font-weight:
            700;
        }


        /* =====================================================
           ADVANCED SELECT
        ===================================================== */

        .re2-advanced-select {
          min-height:
            105px;

          background:
            #f8f5ff;

          border:
            1px solid
            #e8e0f1;

          border-radius:
            15px;

          padding:
            16px;

          display:
            flex;

          flex-direction:
            column;

          justify-content:
            space-between;
        }


        .re2-advanced-select-top {
          display:
            flex;

          justify-content:
            space-between;

          align-items:
            center;
        }


        .re2-advanced-select-title {
          display:
            flex;

          flex-direction:
            column;

          gap:
            4px;
        }


        .re2-advanced-select-title span {
          color:
            #a49ba8;

          font-size:
            8px;

          font-weight:
            700;

          letter-spacing:
            .13em;
        }


        .re2-advanced-select-title strong {
          font-size:
            12px;
        }


        .re2-advanced-select-icon {
          width:
            29px;

          height:
            29px;

          border-radius:
            50%;

          background:
            #eee7f8;

          color:
            #8b71ac;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;
        }


        .re2-advanced-select select {
          width:
            100%;

          height:
            36px;

          border:
            1px solid
            #e0d7e9;

          background:
            white;

          border-radius:
            9px;

          padding:
            0 10px;

          outline:
            none;

          font-size:
            11px;

          color:
            #39323d;

          cursor:
            pointer;
        }


        /* =====================================================
           BOARD
        ===================================================== */

        .re2-board-section {
          margin-top:
            13px;

          background:
            #f8f5ff;

          border:
            1px solid
            #e8e0f1;

          border-radius:
            15px;

          padding:
            16px;
        }


        .re2-board-title {
          display:
            flex;

          flex-direction:
            column;

          gap:
            4px;

          margin-bottom:
            12px;
        }


        .re2-board-title span {
          font-size:
            8px;

          color:
            #a49ba8;

          letter-spacing:
            .13em;

          font-weight:
            700;
        }


        .re2-board-title strong {
          font-size:
            12px;
        }


        .re2-board-list {
          display:
            grid;

          grid-template-columns:
            1fr 1fr;

          gap:
            10px;
        }


        .re2-board-card {
          min-height:
            58px;

          border:
            1px solid
            #e3dce8;

          background:
            white;

          border-radius:
            13px;

          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          padding:
            8px 11px;

          text-align:
            left;

          cursor:
            pointer;

          transition:
            .22s ease;
        }


        .re2-board-card:hover {
          transform:
            translateY(-1px);

          box-shadow:
            0 7px 18px
            rgba(90,70,120,.07);
        }


        .re2-board-card.selected {
          background:
            #eee4ff;

          border-color:
            #c7afe9;
        }


        .re2-board-card.selected.yellow {
          background:
            #fff1c8;

          border-color:
            #ebd584;
        }


        .re2-board-icon {
          width:
            33px;

          height:
            33px;

          border-radius:
            50%;

          background:
            #f4f1f5;

          color:
            #706776;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;
        }


        .re2-board-card > div:nth-child(2) {
          flex:
            1;

          display:
            flex;

          flex-direction:
            column;

          gap:
            3px;
        }


        .re2-board-card strong {
          font-size:
            10px;
        }


        .re2-board-card span {
          color:
            #9c949f;

          font-size:
            9px;
        }


        .re2-check {
          width:
            19px;

          height:
            19px;

          border:
            1px solid
            #d2cbd5;

          border-radius:
            50%;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;
        }


        .selected .re2-check {
          background:
            #9477bd;

          border-color:
            #9477bd;

          color:
            white;
        }


        .selected.yellow .re2-check {
          background:
            #cda73d;

          border-color:
            #cda73d;

          color:
            white;
        }


        /* =====================================================
           FILTER ACTION
        ===================================================== */

        .re2-filter-actions {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          margin-top:
            20px;
        }


        .re2-active-count span {
          padding:
            7px 12px;

          border-radius:
            999px;

          background:
            #eee5fb;

          color:
            #745a96;

          font-size:
            10px;

          font-weight:
            700;
        }


        .re2-clear-button {
          height:
            38px;

          padding:
            0 15px;

          border:
            1px solid
            #ded8df;

          background:
            white;

          border-radius:
            10px;

          display:
            flex;

          align-items:
            center;

          gap:
            6px;

          color:
            #6b646f;

          font-size:
            10px;

          cursor:
            pointer;
        }


        /* =====================================================
           COMPANY
        ===================================================== */

        .re2-company-section {
          padding:
            34px 0 0;
        }


        .re2-company-heading {
          font-size:
            19px;

          font-weight:
            700;

          margin-bottom:
            14px;
        }


        .re2-company-heading span {
          color:
            #9b82bd;
        }


        .re2-company-grid {
          display:
            grid;

          grid-template-columns:
            repeat(4,1fr);

          gap:
            14px;
        }


        .re2-company-card {
          min-height:
            70px;

          background:
            #fbfaf9;

          border:
            1px solid
            #eeeae6;

          border-radius:
            13px;

          display:
            flex;

          align-items:
            center;

          gap:
            11px;

          padding:
            10px 13px;

          transition:
            .2s ease;
        }


        .re2-company-card.selected {
          background:
            #ffeab0;

          border-color:
            #f3d982;
        }


        .re2-company-card:hover {
          transform:
            translateY(-2px);
        }


        .re2-company-logo {
          width:
            39px;

          height:
            39px;

          border-radius:
            10px;

          background:
            #f1e9fb;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          color:
            #7d63a2;
        }


        .re2-company-info {
          flex:
            1;

          display:
            flex;

          flex-direction:
            column;

          gap:
            3px;
        }


        .re2-company-info strong {
          font-size:
            11px;
        }


        .re2-company-info span {
          font-size:
            9px;

          color:
            #8d8690;
        }


        .re2-company-check {
          width:
            19px;

          height:
            19px;

          border-radius:
            50%;

          background:
            white;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          color:
            #777;
        }


        /* =====================================================
           RESULTS HEADER
        ===================================================== */

        .re2-results-heading {
          display:
            flex;

          justify-content:
            space-between;

          align-items:
            end;

          margin:
            27px 0 16px;
        }


        .re2-results-heading h1 {
          margin:
            0;

          font-size:
            28px;

          letter-spacing:
            -.04em;
        }


        .re2-results-heading p {
          margin:
            4px 0 0;

          font-size:
            11px;

          color:
            #88818c;
        }


        .re2-sort-select {
          width:
            180px;

          height:
            40px;

          border:
            1px solid
            #ece7e1;

          border-radius:
            999px;

          background:
            #fff;

          padding:
            0 15px;

          outline:
            none;

          font-size:
            11px;

          color:
            #343039;

          cursor:
            pointer;
        }


        /* =====================================================
           CAR GRID
        ===================================================== */

        .re2-car-grid {
          display:
            grid;

          grid-template-columns:
            repeat(4,1fr);

          gap:
            18px;

          align-items:
            start;
        }


        .re2-car-item {
          cursor:
            pointer;

          min-width:
            0;

          transition:
            transform .25s ease;
        }


        .re2-car-item:hover {
          transform:
            translateY(-4px);
        }


        /* =====================================================
           NO RESULTS
        ===================================================== */

        .re2-no-results {
          min-height:
            360px;

          border:
            1px dashed
            #dcd5e2;

          border-radius:
            20px;

          display:
            flex;

          flex-direction:
            column;

          align-items:
            center;

          justify-content:
            center;

          text-align:
            center;

          background:
            #fcfbff;
        }


        .re2-no-results-icon {
          width:
            60px;

          height:
            60px;

          border-radius:
            50%;

          background:
            #eee5fa;

          color:
            #8e73af;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          margin-bottom:
            15px;
        }


        .re2-no-results h2 {
          margin:
            0;

          font-size:
            20px;
        }


        .re2-no-results p {
          margin:
            7px 0 18px;

          color:
            #96909a;

          font-size:
            12px;
        }


        .re2-no-results button {
          border:
            none;

          background:
            #292331;

          color:
            white;

          padding:
            11px 18px;

          border-radius:
            10px;

          cursor:
            pointer;
        }


        /* =====================================================
           MOBILE HIDDEN
        ===================================================== */

        .re2-mobile-page {
          display:
            none;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1200px) {

          .re2-nav {
            gap:
              18px;
          }


          .re2-nav button {
            font-size:
              11px;
          }


          .re2-filter-top {
            grid-template-columns:
              170px 1fr 1fr;
          }


          .re2-search-box {
            grid-column:
              2 / 4;
          }


          .re2-car-grid {
            grid-template-columns:
              repeat(3,1fr);
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 768px) {

          .re2-desktop-header,
          .re2-desktop-main {
            display:
              none;
          }


          .re2-mobile-page {
            display:
              block;

            min-height:
              100vh;

            background:
              #f5f5ff;

            padding-bottom:
              30px;
          }


          .re2-mobile-header {
            height:
              58px;

            padding:
              0 14px;

            background:
              #e9e9ff;

            display:
              grid;

            grid-template-columns:
              40px 1fr 40px;

            align-items:
              center;

            position:
              sticky;

            top:
              0;

            z-index:
              30;
          }


          .re2-mobile-header button {
            width:
              36px;

            height:
              36px;

            border:
              none;

            border-radius:
              50%;

            background:
              white;

            display:
              flex;

            align-items:
              center;

            justify-content:
              center;

            cursor:
              pointer;
          }


          .re2-mobile-header strong {
            text-align:
              center;

            font-size:
              15px;
          }


          .re2-mobile-search {
            margin:
              12px;

            height:
              46px;

            border-radius:
              13px;

            background:
              white;

            display:
              flex;

            align-items:
              center;

            gap:
              8px;

            padding:
              0 13px;

            border:
              1px solid
              #e2e1f2;
          }


          .re2-mobile-search svg {
            color:
              #817595;
          }


          .re2-mobile-search input {
            flex:
              1;

            border:
              none;

            outline:
              none;

            background:
              transparent;

            font-size:
              12px;
          }


          .re2-mobile-filter-card {
            margin:
              0 12px;

            padding:
              13px;

            background:
              rgba(255,255,255,.88);

            border-radius:
              15px;

            border:
              1px solid
              #e2e1f2;
          }


          .re2-mobile-slider {
            margin-bottom:
              17px;
          }


          .re2-mobile-slider-title {
            display:
              flex;

            justify-content:
              space-between;

            margin-bottom:
              5px;

            font-size:
              11px;
          }


          .re2-mobile-slider-title strong {
            color:
              #75658a;

            font-size:
              10px;
          }


          .re2-mobile-advanced {
            width:
              100%;

            height:
              40px;

            border:
              1px solid
              #e2dbee;

            border-radius:
              10px;

            background:
              #f8f4ff;

            display:
              flex;

            align-items:
              center;

            gap:
              7px;

            padding:
              0 12px;

            color:
              #655273;

            font-size:
              11px;

            font-weight:
              600;
          }


          .re2-mobile-advanced svg:last-child {
            margin-left:
              auto;

            transition:
              .2s;
          }


          .re2-mobile-advanced-content {
            padding-top:
              10px;
          }


          .re2-mobile-select {
            display:
              flex;

            align-items:
              center;

            justify-content:
              space-between;

            gap:
              10px;

            margin-bottom:
              8px;
          }


          .re2-mobile-select span {
            font-size:
              11px;

            font-weight:
              600;
          }


          .re2-mobile-select select {
            width:
              55%;

            height:
              34px;

            border:
              1px solid
              #ded6e8;

            border-radius:
              9px;

            background:
              white;

            outline:
              none;

            font-size:
              10px;
          }


          .re2-mobile-results {
            padding:
              18px 12px 0;
          }


          .re2-mobile-results-head {
            display:
              flex;

            justify-content:
              space-between;

            align-items:
              end;

            margin-bottom:
              12px;
          }


          .re2-mobile-results-head h2 {
            margin:
              0;

            font-size:
              20px;
          }


          .re2-mobile-results-head span {
            display:
              block;

            margin-top:
              3px;

            color:
              #928b99;

            font-size:
              10px;
          }


          .re2-mobile-results-head select {
            height:
              34px;

            border:
              1px solid
              #ddd8e2;

            border-radius:
              999px;

            background:
              white;

            padding:
              0 10px;

            font-size:
              10px;

            outline:
              none;
          }


          .re2-mobile-grid {
            display:
              grid;

            grid-template-columns:
              repeat(2,1fr);

            gap:
              10px;
          }


          .re2-mobile-empty {
            padding:
              60px 20px;

            text-align:
              center;

            color:
              #777;
          }

        }


        @media (max-width: 430px) {

          .re2-mobile-grid {
            grid-template-columns:
              1fr;
          }

        }

      `}</style>

    </div>
  );
}


/* =============================================================
   FILTER SELECT
============================================================= */

function FilterSelect({
  icon,
  label,
  value,
}) {
  return (
    <div className="re2-filter-select">

      <div className="re2-filter-select-icon">
        {icon}
      </div>

      <div className="re2-filter-select-text">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

      <ExpandMore />

    </div>
  );
}


/* =============================================================
   ADVANCED SELECT
============================================================= */

function AdvancedSelect({
  label,
  value,
  onChange,
  icon,
  options,
}) {
  return (
    <div className="re2-advanced-select">

      <div className="re2-advanced-select-top">

        <div className="re2-advanced-select-title">

          <span>
            FILTER
          </span>

          <strong>
            {label}
          </strong>

        </div>


        <div className="re2-advanced-select-icon">
          {icon}
        </div>

      </div>


      <select
        value={
          value || ""
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      >

        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={
                optionValue ||
                "all"
              }
              value={
                optionValue
              }
            >
              {optionLabel}
            </option>
          )
        )}

      </select>

    </div>
  );
}


/* =============================================================
   COMPANY CARD
============================================================= */

function CompanyCard({
  title,
  count,
  selected = false,
}) {
  return (
    <div
      className={`re2-company-card ${
        selected
          ? "selected"
          : ""
      }`}
    >

      <div className="re2-company-logo">
        <DirectionsCar
          style={{
            fontSize: 22,
          }}
        />
      </div>


      <div className="re2-company-info">

        <strong>
          {title}
        </strong>

        <span>
          {count} cars
        </span>

      </div>


      <div className="re2-company-check">

        {selected && (
          <Check
            style={{
              fontSize: 12,
            }}
          />
        )}

      </div>

    </div>
  );
}


/* =============================================================
   MOBILE SELECT
============================================================= */

function MobileSelect({
  title,
  value,
  onChange,
  options,
}) {
  return (
    <div className="re2-mobile-select">

      <span>
        {title}
      </span>

      <select
        value={
          value || ""
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      >

        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={
                optionValue ||
                "all"
              }
              value={
                optionValue
              }
            >
              {optionLabel}
            </option>
          )
        )}

      </select>

    </div>
  );
}