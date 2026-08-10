// src/screens/FilterScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import {
  FaCar,
  FaCog,
  FaGasPump,
  FaUserFriends,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTruck,
  FaCheck,
  FaArrowLeft,
  FaSearch,
  FaMapMarkerAlt,
  FaChevronDown,
  FaSlidersH,
  FaTimes,
} from "react-icons/fa";

import { getBrands } from "@/services/carBrandApi.js";
import { getVariantsByBrand } from "@/services/carVariantApi.js";
import { getFilteredCars } from "@/services/carFilterApi.js";

const ALL_BRANDS = "__ALL__";

export default function FilterScreen() {
  const navigate = useNavigate();

  /* =========================================================
     STATE
  ========================================================= */

  const [selectedBrandId, setSelectedBrandId] =
    useState(ALL_BRANDS);

  const [selectedVariantId, setSelectedVariantId] =
    useState(null);

  const [selectedFuel, setSelectedFuel] =
    useState(null);

  const [selectedTransmission, setSelectedTransmission] =
    useState(null);

  const [selectedOwner, setSelectedOwner] =
    useState(null);

  const [selectedBoard, setSelectedBoard] =
    useState(null);

  const [priceRange, setPriceRange] = useState({
    start: 0,
    end: 30,
  });

  const [yearRange, setYearRange] = useState({
    start: 1995,
    end: 2025,
  });

  const [brands, setBrands] = useState([]);
  const [variants, setVariants] = useState([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isVariantLoading, setIsVariantLoading] =
    useState(false);

  const [advancedOpen, setAdvancedOpen] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  const [locationText, setLocationText] =
    useState("");


  /* =========================================================
     FILTER OPTIONS
  ========================================================= */

  const filterOptions = {
    fuel: [
      {
        value: "petrol",
        label: "Petrol",
      },
      {
        value: "diesel",
        label: "Diesel",
      },
      {
        value: "cng",
        label: "CNG",
      },
      {
        value: "lpg",
        label: "LPG",
      },
      {
        value: "electric",
        label: "Electric",
      },
      {
        value: "hybrid",
        label: "Hybrid",
      },
    ],

    transmission: [
      {
        value: "manual",
        label: "Manual",
      },
      {
        value: "automatic",
        label: "Automatic",
      },
    ],

    owner: Array.from(
      { length: 5 },
      (_, i) => ({
        value: `${i + 1}`,
        label: `${i + 1}${
          ["st", "nd", "rd", "th", "th"][i]
        } Owner`,
      })
    ),
  };


  /* =========================================================
     FETCH BRANDS
  ========================================================= */

  useEffect(() => {
    fetchBrands();
  }, []);


  const fetchBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data || []);
    } catch (error) {
      console.error(
        "Failed to load brands:",
        error
      );

      alert("Failed to load brands");
    }
  };


  /* =========================================================
     FETCH VARIANTS
  ========================================================= */

  const fetchVariants = async (brandId) => {
    setIsVariantLoading(true);

    setVariants([]);
    setSelectedVariantId(null);

    try {
      const data =
        await getVariantsByBrand(brandId);

      setVariants(data || []);
    } catch (error) {
      console.error(
        "Error fetching variants:",
        error
      );
    } finally {
      setIsVariantLoading(false);
    }
  };


  /* =========================================================
     VARIANT NAME
  ========================================================= */

  const getVariantName = (variant) => {
    return (
      variant.title ||
      variant.name ||
      variant.variantName ||
      variant.model ||
      "Unknown Variant"
    );
  };


  /* =========================================================
     APPLY FILTERS
  ========================================================= */

  const applyFilters = async () => {
    setIsLoading(true);

    try {
      const cars = await getFilteredCars({
        brand:
          selectedBrandId !== ALL_BRANDS
            ? selectedBrandId
            : null,

        variant:
          selectedVariantId,

        fuel:
          selectedFuel,

        transmission:
          selectedTransmission,

        owner:
          selectedOwner,

        board:
          selectedBoard,

        minPrice:
          priceRange.start > 0
            ? priceRange.start * 100000
            : null,

        maxPrice:
          priceRange.end < 30
            ? priceRange.end * 100000
            : null,

        minYear:
          yearRange.start > 1995
            ? yearRange.start
            : null,

        maxYear:
          yearRange.end < 2025
            ? yearRange.end
            : null,
      });

      if (!cars || cars.length === 0) {
        alert("No cars found");
      } else {
        navigate(
          "/filter-result",
          {
            state: {
              filteredCars: cars,
            },
          }
        );
      }
    } catch (error) {
      alert(
        `Error: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };


  /* =========================================================
     RESET
  ========================================================= */

  const resetFilters = () => {
    setSelectedBrandId(
      ALL_BRANDS
    );

    setSelectedVariantId(null);

    setVariants([]);

    setSelectedFuel(null);

    setSelectedTransmission(null);

    setSelectedOwner(null);

    setSelectedBoard(null);

    setPriceRange({
      start: 0,
      end: 30,
    });

    setYearRange({
      start: 1995,
      end: 2025,
    });

    setSearchText("");

    setLocationText("");

    setAdvancedOpen(false);
  };


  /* =========================================================
     SELECT CHANGE
  ========================================================= */

  const handleBrandChange = (value) => {
    setSelectedBrandId(value);

    if (
      value &&
      value !== ALL_BRANDS
    ) {
      fetchVariants(value);
    } else {
      setVariants([]);
      setSelectedVariantId(null);
    }
  };


  /* =========================================================
     SELECTED LABELS
  ========================================================= */

  const selectedBrandName =
    brands.find(
      (brand) =>
        brand._id === selectedBrandId
    )?.name || "All brands";


  const selectedVariantName =
    variants.find(
      (variant) =>
        variant._id === selectedVariantId
    );

  const variantLabel =
    selectedVariantName
      ? getVariantName(
          selectedVariantName
        )
      : "All models";


  /* =========================================================
     DESKTOP SELECT
  ========================================================= */

  const DesktopSelect = ({
    icon,
    label,
    value,
    onChange,
    children,
  }) => {
    return (
      <div className="desktop-select">

        <div className="desktop-select-icon">
          {icon}
        </div>

        <div className="desktop-select-content">

          <span className="desktop-select-label">
            {label}
          </span>

          <select
            value={value || ""}
            onChange={(e) =>
              onChange(
                e.target.value || null
              )
            }
          >
            {children}
          </select>

        </div>

        <FaChevronDown
          className="desktop-select-arrow"
        />

      </div>
    );
  };


  /* =========================================================
     PRICE RANGE
  ========================================================= */

  const PriceRange = () => {
    return (
      <div className="price-range">

        <div className="range-heading">

          <div>
            <span className="range-eyebrow">
              PRICE
            </span>

            <h3>
              Your budget
            </h3>
          </div>

          <div className="range-icon">
            <FaMoneyBillWave />
          </div>

        </div>


        <Slider
          range
          min={0}
          max={30}
          step={1}
          value={[
            priceRange.start,
            priceRange.end,
          ]}
          onChange={(range) =>
            setPriceRange({
              start: range[0],
              end: range[1],
            })
          }
          allowCross={false}
          trackStyle={{
            background:
              "#a789df",
            height: 5,
          }}
          handleStyle={[
            {
              background:
                "#ffffff",
              border:
                "3px solid #a789df",
              width: 20,
              height: 20,
              marginTop: -8,
              boxShadow:
                "0 4px 12px rgba(120,90,170,.20)",
            },
            {
              background:
                "#ffffff",
              border:
                "3px solid #a789df",
              width: 20,
              height: 20,
              marginTop: -8,
              boxShadow:
                "0 4px 12px rgba(120,90,170,.20)",
            },
          ]}
          railStyle={{
            background:
              "#e6def4",
            height: 5,
          }}
        />


        <div className="range-values">

          <span>
            ₹{priceRange.start} L
          </span>

          <span>
            {priceRange.end === 30
              ? "₹30 L+"
              : `₹${priceRange.end} L`}
          </span>

        </div>

      </div>
    );
  };


  /* =========================================================
     YEAR RANGE
  ========================================================= */

  const YearRange = () => {
    return (
      <div className="advanced-range-card">

        <div className="advanced-range-heading">

          <div>
            <span>
              YEAR
            </span>

            <strong>
              Model year
            </strong>
          </div>

          <FaCalendarAlt />
        </div>

        <Slider
          range
          min={1995}
          max={2025}
          step={1}
          value={[
            yearRange.start,
            yearRange.end,
          ]}
          onChange={(range) =>
            setYearRange({
              start: range[0],
              end: range[1],
            })
          }
          allowCross={false}
          trackStyle={{
            background:
              "#a789df",
            height: 4,
          }}
          handleStyle={[
            {
              background:
                "#ffffff",
              border:
                "2px solid #a789df",
              width: 18,
              height: 18,
              marginTop: -7,
            },
            {
              background:
                "#ffffff",
              border:
                "2px solid #a789df",
              width: 18,
              height: 18,
              marginTop: -7,
            },
          ]}
          railStyle={{
            background:
              "#ddd5eb",
            height: 4,
          }}
        />

        <div className="range-values">
          <span>
            {yearRange.start}
          </span>

          <span>
            {yearRange.end}
          </span>
        </div>

      </div>
    );
  };


  /* =========================================================
     BOARD FILTER
  ========================================================= */

  const BoardFilter = () => {
    return (
      <div className="board-section">

        <div className="advanced-title">
          <span>
            REGISTRATION
          </span>

          <strong>
            Choose board type
          </strong>
        </div>


        <div className="board-grid">

          {/* OWN */}

          <button
            type="button"
            className={`board-card ${
              selectedBoard === "own"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setSelectedBoard(
                selectedBoard === "own"
                  ? null
                  : "own"
              )
            }
          >

            <div className="board-card-icon">
              <FaCar />
            </div>

            <div className="board-card-text">
              <strong>
                OWN BOARD
              </strong>

              <span>
                White boards
              </span>
            </div>

            <div className="board-check">
              {selectedBoard === "own" ? (
                <FaCheck />
              ) : null}
            </div>

          </button>


          {/* T BOARD */}

          <button
            type="button"
            className={`board-card ${
              selectedBoard === "t board"
                ? "selected-yellow"
                : ""
            }`}
            onClick={() =>
              setSelectedBoard(
                selectedBoard === "t board"
                  ? null
                  : "t board"
              )
            }
          >

            <div className="board-card-icon">
              <FaTruck />
            </div>

            <div className="board-card-text">
              <strong>
                T BOARD
              </strong>

              <span>
                Taxi / Travels
              </span>
            </div>

            <div className="board-check">
              {selectedBoard === "t board" ? (
                <FaCheck />
              ) : null}
            </div>

          </button>

        </div>

      </div>
    );
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="filter-page">


      {/* =====================================================
          DESKTOP HEADER / HERO
      ===================================================== */}

      <section className="desktop-filter-hero">

        <div className="hero-overlay" />

        <div className="desktop-filter-header">

          <button
            className="desktop-back"
            onClick={() =>
              navigate(-1)
            }
          >
            <FaArrowLeft />
          </button>


          <div className="desktop-filter-logo">

            <img
              src="/assets/logo/logo_1.webp"
              alt="Re2buy"
            />

          </div>


          <div className="desktop-header-title">
            RE2BUY
          </div>


          <button
            className="desktop-close"
            onClick={() =>
              navigate(-1)
            }
          >
            <FaTimes />
          </button>

        </div>


        <div className="hero-content">

          <span>
            RE2BUY / CARS
          </span>

          <h1>
            Find your
            <br />
            <em>next car.</em>
          </h1>

          <p>
            Search verified cars from
            trusted sellers.
          </p>

        </div>

      </section>


      {/* =====================================================
          DESKTOP SEARCH PANEL
      ===================================================== */}

      <main className="desktop-filter-content">

        <motion.section
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="desktop-search-panel"
        >

          {/* TOP SEARCH */}

          <div className="search-panel-top">

            <div className="search-title">
              <span>
                Search cars
              </span>

              <small>
                Find exactly what
                you're looking for
              </small>
            </div>


            {/* BRAND */}

            <DesktopSelect
              label="Brand"
              icon={
                <FaCar />
              }
              value={
                selectedBrandId
              }
              onChange={
                handleBrandChange
              }
            >

              <option value="">
                All brands
              </option>

              <option
                value={
                  ALL_BRANDS
                }
              >
                All brands
              </option>

              {brands.map(
                (brand) => (
                  <option
                    key={
                      brand._id
                    }
                    value={
                      brand._id
                    }
                  >
                    {
                      brand.name ||
                      "Unknown"
                    }
                  </option>
                )
              )}

            </DesktopSelect>


            {/* MODEL */}

            <DesktopSelect
              label="Model"
              icon={
                <FaCog />
              }
              value={
                selectedVariantId
              }
              onChange={
                setSelectedVariantId
              }
            >

              <option value="">
                {isVariantLoading
                  ? "Loading models..."
                  : "All models"}
              </option>

              {variants.map(
                (variant) => (
                  <option
                    key={
                      variant._id
                    }
                    value={
                      variant._id
                    }
                  >
                    {getVariantName(
                      variant
                    )}
                  </option>
                )
              )}

            </DesktopSelect>


            {/* LOCATION */}

            <div className="desktop-search-input">

              <div className="desktop-search-input-icon">
                <FaMapMarkerAlt />
              </div>

              <div>
                <span>
                  Location
                </span>

                <input
                  value={
                    locationText
                  }
                  onChange={(e) =>
                    setLocationText(
                      e.target.value
                    )
                  }
                  placeholder="Anywhere"
                />
              </div>

            </div>


            {/* SEARCH */}

            <div className="desktop-search-text">

              <FaSearch />

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


          <div className="panel-divider" />


          {/* PRICE */}

          <div className="price-section">

            <PriceRange />

          </div>


          {/* ADVANCED */}

          <motion.button
            type="button"
            whileTap={{
              scale: 0.97,
            }}
            onClick={() =>
              setAdvancedOpen(
                !advancedOpen
              )
            }
            className="advanced-toggle"
          >

            <FaSlidersH />

            <span>
              {advancedOpen
                ? "Hide advanced search"
                : "Advanced search"}
            </span>

            <motion.span
              animate={{
                rotate:
                  advancedOpen
                    ? 180
                    : 0,
              }}
            >
              <FaChevronDown />
            </motion.span>

          </motion.button>


          {/* ADVANCED PANEL */}

          <motion.div
            initial={false}
            animate={{
              height:
                advancedOpen
                  ? "auto"
                  : 0,

              opacity:
                advancedOpen
                  ? 1
                  : 0,

              marginTop:
                advancedOpen
                  ? 24
                  : 0,
            }}
            className="advanced-wrapper"
          >

            <div className="advanced-grid">


              {/* FUEL */}

              <AdvancedSelect
                title="Fuel type"
                value={
                  selectedFuel
                }
                onChange={
                  setSelectedFuel
                }
                icon={
                  <FaGasPump />
                }
                options={
                  filterOptions.fuel
                }
              />


              {/* TRANSMISSION */}

              <AdvancedSelect
                title="Transmission"
                value={
                  selectedTransmission
                }
                onChange={
                  setSelectedTransmission
                }
                icon={
                  <FaCar />
                }
                options={
                  filterOptions.transmission
                }
              />


              {/* OWNER */}

              <AdvancedSelect
                title="Owner"
                value={
                  selectedOwner
                }
                onChange={
                  setSelectedOwner
                }
                icon={
                  <FaUserFriends />
                }
                options={
                  filterOptions.owner
                }
              />


              {/* YEAR */}

              <YearRange />

            </div>


            <BoardFilter />

          </motion.div>


          {/* ACTIONS */}

          <div className="filter-actions">

            <button
              className="clear-filter-button"
              onClick={
                resetFilters
              }
            >
              Clear all
            </button>


            <motion.button
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
              disabled={
                isLoading
              }
              className="show-cars-button"
              onClick={
                applyFilters
              }
            >

              {isLoading ? (
                <>
                  <span className="button-loader" />
                  Searching...
                </>
              ) : (
                <>
                  Show cars
                  <span>
                    →
                  </span>
                </>
              )}

            </motion.button>

          </div>

        </motion.section>


        {/* =====================================================
            RESULT SUMMARY
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.4,
          }}
          className="desktop-result-preview"
        >

          <div>

            <span>
              RE2BUY CARS
            </span>

            <h2>
              Find a car that
              <br />
              <strong>
                fits your life.
              </strong>
            </h2>

          </div>


          <div className="preview-stat">
            <strong>
              {selectedBrandId ===
              ALL_BRANDS
                ? "ALL"
                : selectedBrandName}
            </strong>

            <span>
              Selected brand
            </span>
          </div>


          <div className="preview-stat">
            <strong>
              {variantLabel}
            </strong>

            <span>
              Selected model
            </span>
          </div>

        </motion.div>

      </main>


      {/* =====================================================
          MOBILE — OLD DESIGN
      ===================================================== */}

      <div className="mobile-filter-screen">

        {/* APP BAR */}

        <div className="mobile-filter-appbar">

          <div
            className="mobile-filter-back"
            onClick={() =>
              navigate(-1)
            }
          >
            <FaArrowLeft
              size={18}
            />
          </div>

          <div className="mobile-filter-title">
            Filter Cars
          </div>

        </div>


        {/* BODY */}

        <div className="mobile-filter-body">

          {/* BOARD */}

          <div className="mobile-board-row">

            <button
              type="button"
              className={`mobile-board-button ${
                selectedBoard === "own"
                  ? "mobile-board-selected"
                  : ""
              }`}
              onClick={() =>
                setSelectedBoard(
                  selectedBoard ===
                    "own"
                    ? null
                    : "own"
                )
              }
            >

              <div className="mobile-board-icon">
                <FaCar />
              </div>

              <div className="mobile-board-text">
                <strong>
                  OWN BOARD
                </strong>

                <span>
                  White boards
                </span>
              </div>

              <div className="mobile-board-check">
                {selectedBoard ===
                "own" ? (
                  <FaCheck size={11} />
                ) : null}
              </div>

            </button>


            <button
              type="button"
              className={`mobile-board-button ${
                selectedBoard === "t board"
                  ? "mobile-board-t-selected"
                  : ""
              }`}
              onClick={() =>
                setSelectedBoard(
                  selectedBoard ===
                    "t board"
                    ? null
                    : "t board"
                )
              }
            >

              <div className="mobile-board-icon">
                <FaTruck />
              </div>

              <div className="mobile-board-text">
                <strong>
                  T BOARD
                </strong>

                <span>
                  Taxi Travels
                </span>
              </div>

              <div className="mobile-board-check">
                {selectedBoard ===
                "t board" ? (
                  <FaCheck size={11} />
                ) : null}
              </div>

            </button>

          </div>


          {/* BRAND */}

          <MobileFilterRow
            title="Brand"
            icon={
              <FaCar />
            }
          >

            <select
              value={
                selectedBrandId
              }
              onChange={(e) =>
                handleBrandChange(
                  e.target.value
                )
              }
            >

              <option
                value={
                  ALL_BRANDS
                }
              >
                All Brands
              </option>

              {brands.map(
                (brand) => (
                  <option
                    key={
                      brand._id
                    }
                    value={
                      brand._id
                    }
                  >
                    {
                      brand.name ||
                      "Unknown"
                    }
                  </option>
                )
              )}

            </select>

          </MobileFilterRow>


          {/* VARIANT */}

          {selectedBrandId !==
            ALL_BRANDS && (
            <MobileFilterRow
              title="Variant"
              icon={
                <FaCog />
              }
            >

              {isVariantLoading ? (
                <div className="mobile-spinner" />
              ) : (
                <select
                  value={
                    selectedVariantId ||
                    ""
                  }
                  onChange={(e) =>
                    setSelectedVariantId(
                      e.target.value ||
                        null
                    )
                  }
                >

                  <option value="">
                    All Variants
                  </option>

                  {variants.map(
                    (variant) => (
                      <option
                        key={
                          variant._id
                        }
                        value={
                          variant._id
                        }
                      >
                        {getVariantName(
                          variant
                        )}
                      </option>
                    )
                  )}

                </select>
              )}

            </MobileFilterRow>
          )}


          {/* FUEL */}

          <MobileFilterRow
            title="Fuel Type"
            icon={
              <FaGasPump />
            }
          >

            <select
              value={
                selectedFuel ||
                ""
              }
              onChange={(e) =>
                setSelectedFuel(
                  e.target.value ||
                    null
                )
              }
            >

              <option value="">
                All
              </option>

              {filterOptions.fuel.map(
                (item) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {item.label}
                  </option>
                )
              )}

            </select>

          </MobileFilterRow>


          {/* TRANSMISSION */}

          <MobileFilterRow
            title="Transmission"
            icon={
              <FaCar />
            }
          >

            <select
              value={
                selectedTransmission ||
                ""
              }
              onChange={(e) =>
                setSelectedTransmission(
                  e.target.value ||
                    null
                )
              }
            >

              <option value="">
                All
              </option>

              {filterOptions.transmission.map(
                (item) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {item.label}
                  </option>
                )
              )}

            </select>

          </MobileFilterRow>


          {/* OWNER */}

          <MobileFilterRow
            title="Owner"
            icon={
              <FaUserFriends />
            }
          >

            <select
              value={
                selectedOwner ||
                ""
              }
              onChange={(e) =>
                setSelectedOwner(
                  e.target.value ||
                    null
                )
              }
            >

              <option value="">
                All
              </option>

              {filterOptions.owner.map(
                (item) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {item.label}
                  </option>
                )
              )}

            </select>

          </MobileFilterRow>


          {/* PRICE */}

          <div className="mobile-range-card">

            <div className="mobile-range-title">
              <FaMoneyBillWave />

              <span>
                Price Range (in Lakhs)
              </span>
            </div>

            <Slider
              range
              min={0}
              max={30}
              step={1}
              value={[
                priceRange.start,
                priceRange.end,
              ]}
              onChange={(range) =>
                setPriceRange({
                  start:
                    range[0],
                  end:
                    range[1],
                })
              }
              allowCross={false}
              trackStyle={[
                {
                  background:
                    "#000",
                  height: 4,
                },
              ]}
              handleStyle={[
                {
                  borderColor:
                    "#000",
                  background:
                    "#fff",
                  borderWidth: 2,
                  width: 16,
                  height: 16,
                  marginTop: -6,
                },
                {
                  borderColor:
                    "#000",
                  background:
                    "#fff",
                  borderWidth: 2,
                  width: 16,
                  height: 16,
                  marginTop: -6,
                },
              ]}
              railStyle={{
                background:
                  "#ccc",
                height: 4,
              }}
            />

            <div className="mobile-range-labels">

              <span>
                ₹{priceRange.start}L
              </span>

              <span>
                {priceRange.end === 30
                  ? "₹30L+"
                  : `₹${priceRange.end}L`}
              </span>

            </div>

          </div>


          {/* YEAR */}

          <div className="mobile-range-card">

            <div className="mobile-range-title">
              <FaCalendarAlt />

              <span>
                Year Range
              </span>
            </div>

            <Slider
              range
              min={1995}
              max={2025}
              step={1}
              value={[
                yearRange.start,
                yearRange.end,
              ]}
              onChange={(range) =>
                setYearRange({
                  start:
                    range[0],
                  end:
                    range[1],
                })
              }
              allowCross={false}
              trackStyle={[
                {
                  background:
                    "#000",
                  height: 4,
                },
              ]}
              handleStyle={[
                {
                  borderColor:
                    "#000",
                  background:
                    "#fff",
                  borderWidth: 2,
                  width: 16,
                  height: 16,
                  marginTop: -6,
                },
                {
                  borderColor:
                    "#000",
                  background:
                    "#fff",
                  borderWidth: 2,
                  width: 16,
                  height: 16,
                  marginTop: -6,
                },
              ]}
              railStyle={{
                background:
                  "#ccc",
                height: 4,
              }}
            />

            <div className="mobile-range-labels">

              <span>
                {yearRange.start}
              </span>

              <span>
                {yearRange.end}
              </span>

            </div>

          </div>


          {/* ACTION */}

          <div className="mobile-action-row">

            <button
              className="mobile-clear-button"
              onClick={
                resetFilters
              }
            >
              Clear All
            </button>

            <button
              className="mobile-apply-button"
              disabled={
                isLoading
              }
              onClick={
                applyFilters
              }
            >
              {isLoading
                ? "Loading..."
                : "Show Cars"}
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          ALL STYLES
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }


        .filter-page {
          min-height: 100vh;

          background:
            #f8f7fb;

          color:
            #15131a;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }


        /* =====================================================
           DESKTOP HERO
        ===================================================== */

        .desktop-filter-hero {
          display: block;

          height:
            310px;

          position: relative;

          overflow: hidden;

          background:
            linear-gradient(
              110deg,
              #24212d,
              #70627d 45%,
              #d9d1df
            );
        }


        .desktop-filter-hero::before {
          content: "";

          position: absolute;

          inset: 0;

          background:
            radial-gradient(
              circle at 65% 25%,
              rgba(255,255,255,.18),
              transparent 25%
            ),
            linear-gradient(
              90deg,
              rgba(10,8,15,.70),
              rgba(30,25,40,.25),
              rgba(255,255,255,.08)
            );
        }


        .desktop-filter-hero::after {
          content: "";

          position: absolute;

          width: 760px;
          height: 230px;

          right: -80px;
          bottom: -80px;

          border-radius:
            50%;

          background:
            rgba(255,255,255,.08);

          transform:
            rotate(-8deg);

          filter:
            blur(2px);
        }


        .hero-overlay {
          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              180deg,
              rgba(10,8,15,.35),
              rgba(10,8,15,.08)
            );
        }


        /* =====================================================
           HEADER
        ===================================================== */

        .desktop-filter-header {
          position: absolute;

          z-index: 5;

          left: 0;
          right: 0;
          top: 0;

          height: 86px;

          padding:
            18px 34px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          color:
            white;
        }


        .desktop-back {
          width: 44px;
          height: 44px;

          border:
            1px solid
            rgba(255,255,255,.35);

          border-radius:
            50%;

          background:
            rgba(255,255,255,.10);

          backdrop-filter:
            blur(15px);

          color:
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


        .desktop-filter-logo {
          position:
            absolute;

          left:
            30px;

          top:
            78px;

          z-index:
            3;
        }


        .desktop-filter-logo img {
          height:
            42px;

          width:
            auto;

          filter:
            brightness(0)
            invert(1);

          object-fit:
            contain;
        }


        .desktop-header-title {
          position:
            absolute;

          left:
            50%;

          transform:
            translateX(-50%);

          font-size:
            12px;

          font-weight:
            700;

          letter-spacing:
            .24em;

          opacity:
            .9;
        }


        .desktop-close {
          width:
            44px;

          height:
            44px;

          border:
            1px solid
            rgba(255,255,255,.35);

          border-radius:
            50%;

          background:
            rgba(255,255,255,.10);

          backdrop-filter:
            blur(15px);

          color:
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


        /* =====================================================
           HERO CONTENT
        ===================================================== */

        .hero-content {
          position:
            absolute;

          z-index:
            4;

          left:
            clamp(
              40px,
              9vw,
              150px
            );

          bottom:
            70px;

          color:
            white;
        }


        .hero-content span {
          font-size:
            10px;

          letter-spacing:
            .28em;

          font-weight:
            700;

          opacity:
            .72;
        }


        .hero-content h1 {
          margin:
            12px 0 0;

          font-size:
            clamp(
              48px,
              6vw,
              84px
            );

          line-height:
            .88;

          letter-spacing:
            -.06em;

          font-weight:
            800;
        }


        .hero-content h1 em {
          color:
            #d8c5ff;

          font-style:
            normal;
        }


        .hero-content p {
          margin:
            14px 0 0;

          font-size:
            13px;

          opacity:
            .75;
        }


        /* =====================================================
           MAIN DESKTOP
        ===================================================== */

        .desktop-filter-content {
          position:
            relative;

          width:
            min(
              1530px,
              calc(100% - 80px)
            );

          margin:
            0 auto;

          padding-bottom:
            70px;
        }


        /* =====================================================
           SEARCH PANEL
        ===================================================== */

        .desktop-search-panel {
          position:
            relative;

          margin-top:
            -95px;

          z-index:
            10;

          background:
            rgba(252,250,246,.97);

          border:
            1px solid
            rgba(255,255,255,.95);

          border-radius:
            22px;

          box-shadow:
            0 25px 70px
            rgba(35,28,50,.13);

          padding:
            28px 32px 22px;
        }


        .search-panel-top {
          display:
            grid;

          grid-template-columns:
            210px
            1fr
            1fr
            1fr
            1.25fr;

          gap:
            20px;

          align-items:
            center;
        }


        .search-title {
          display:
            flex;

          flex-direction:
            column;

          gap:
            5px;
        }


        .search-title span {
          font-size:
            21px;

          font-weight:
            700;

          letter-spacing:
            -.025em;
        }


        .search-title small {
          color:
            #a09aa6;

          font-size:
            11px;
        }


        /* =====================================================
           SELECT
        ===================================================== */

        .desktop-select {
          height:
            64px;

          border-radius:
            17px;

          background:
            #f9f7f2;

          border:
            1px solid
            rgba(220,216,209,.75);

          display:
            flex;

          align-items:
            center;

          padding:
            0 16px;

          position:
            relative;

          transition:
            .25s ease;
        }


        .desktop-select:hover {
          background:
            #ffffff;

          border-color:
            #d9cceb;

          box-shadow:
            0 8px 25px
            rgba(130,100,170,.07);
        }


        .desktop-select-icon {
          width:
            30px;

          height:
            30px;

          border-radius:
            50%;

          background:
            #f0eafb;

          color:
            #8872aa;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          margin-right:
            11px;

          font-size:
            12px;
        }


        .desktop-select-content {
          min-width:
            0;

          flex:
            1;

          display:
            flex;

          flex-direction:
            column;
        }


        .desktop-select-label {
          color:
            #a29ca7;

          font-size:
            10px;

          font-weight:
            700;

          margin-bottom:
            2px;
        }


        .desktop-select select {
          appearance:
            none;

          border:
            none;

          outline:
            none;

          background:
            transparent;

          width:
            100%;

          color:
            #29252e;

          font-size:
            13px;

          font-weight:
            600;

          cursor:
            pointer;

          padding:
            0 20px 0 0;
        }


        .desktop-select-arrow {
          position:
            absolute;

          right:
            14px;

          color:
            #8f8995;

          font-size:
            9px;

          pointer-events:
            none;
        }


        /* =====================================================
           SEARCH INPUT
        ===================================================== */

        .desktop-search-input {
          height:
            64px;

          border-radius:
            17px;

          background:
            #f9f7f2;

          border:
            1px solid
            rgba(220,216,209,.75);

          display:
            flex;

          align-items:
            center;

          padding:
            0 16px;

          gap:
            11px;
        }


        .desktop-search-input-icon {
          width:
            30px;

          height:
            30px;

          border-radius:
            50%;

          background:
            #f0eafb;

          color:
            #8872aa;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          font-size:
            11px;
        }


        .desktop-search-input > div:last-child {
          display:
            flex;

          flex-direction:
            column;

          min-width:
            0;
        }


        .desktop-search-input span {
          color:
            #a29ca7;

          font-size:
            10px;

          font-weight:
            700;
        }


        .desktop-search-input input {
          width:
            100%;

          min-width:
            0;

          border:
            none;

          outline:
            none;

          background:
            transparent;

          font-size:
            13px;

          font-weight:
            600;

          color:
            #28242c;
        }


        .desktop-search-input input::placeholder {
          color:
            #6e6874;
        }


        .desktop-search-text {
          height:
            64px;

          border-radius:
            17px;

          background:
            white;

          border:
            1px solid
            rgba(230,225,219,.8);

          display:
            flex;

          align-items:
            center;

          gap:
            11px;

          padding:
            0 18px;

          color:
            #8d8494;
        }


        .desktop-search-text input {
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
            #26222a;
        }


        /* =====================================================
           DIVIDER
        ===================================================== */

        .panel-divider {
          height:
            1px;

          background:
            #e6e1da;

          margin:
            25px 0 20px;
        }


        /* =====================================================
           PRICE
        ===================================================== */

        .price-section {
          padding:
            0 8px;
        }


        .range-heading {
          display:
            flex;

          justify-content:
            space-between;

          align-items:
            flex-start;

          margin-bottom:
            22px;
        }


        .range-eyebrow {
          display:
            block;

          color:
            #aaa3ad;

          font-size:
            10px;

          font-weight:
            700;

          letter-spacing:
            .15em;

          margin-bottom:
            5px;
        }


        .range-heading h3 {
          margin:
            0;

          font-size:
            15px;

          font-weight:
            700;
        }


        .range-icon {
          width:
            34px;

          height:
            34px;

          border-radius:
            50%;

          background:
            #eee7f9;

          color:
            #8a70af;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          font-size:
            12px;
        }


        .price-range .rc-slider {
          margin:
            0 3px;
        }


        .range-values {
          display:
            flex;

          justify-content:
            space-between;

          margin-top:
            14px;

          color:
            #27232a;

          font-size:
            12px;

          font-weight:
            500;
        }


        /* =====================================================
           ADVANCED BUTTON
        ===================================================== */

        .advanced-toggle {
          position:
            relative;

          display:
            flex;

          align-items:
            center;

          gap:
            9px;

          margin:
            23px auto -43px;

          z-index:
            3;

          height:
            45px;

          padding:
            0 20px;

          border:
            none;

          border-radius:
            999px;

          background:
            #e5d5ff;

          color:
            #594475;

          font-size:
            11px;

          font-weight:
            700;

          cursor:
            pointer;

          box-shadow:
            0 7px 20px
            rgba(130,100,170,.12);
        }


        .advanced-toggle > span:last-child {
          display:
            flex;
        }


        /* =====================================================
           ADVANCED WRAPPER
        ===================================================== */

        .advanced-wrapper {
          overflow:
            hidden;
        }


        .advanced-grid {
          display:
            grid;

          grid-template-columns:
            repeat(4,1fr);

          gap:
            14px;

          padding-top:
            10px;
        }


        .advanced-range-card,
        .board-section {
          background:
            #f8f5ff;

          border:
            1px solid
            #e8e0f2;

          border-radius:
            16px;

          padding:
            18px;
        }


        .advanced-range-heading {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          margin-bottom:
            25px;

          color:
            #8872a6;
        }


        .advanced-range-heading div {
          display:
            flex;

          flex-direction:
            column;

          gap:
            4px;
        }


        .advanced-range-heading span {
          font-size:
            9px;

          font-weight:
            700;

          letter-spacing:
            .14em;

          color:
            #aaa2b0;
        }


        .advanced-range-heading strong {
          color:
            #28232d;

          font-size:
            13px;
        }


        .advanced-range-card .range-values {
          font-size:
            11px;
        }


        /* =====================================================
           BOARD
        ===================================================== */

        .board-section {
          margin-top:
            14px;
        }


        .advanced-title {
          display:
            flex;

          flex-direction:
            column;

          gap:
            4px;

          margin-bottom:
            14px;
        }


        .advanced-title span {
          font-size:
            9px;

          font-weight:
            700;

          letter-spacing:
            .15em;

          color:
            #a29aa9;
        }


        .advanced-title strong {
          font-size:
            14px;

          color:
            #27232c;
        }


        .board-grid {
          display:
            grid;

          grid-template-columns:
            1fr 1fr;

          gap:
            12px;
        }


        .board-card {
          height:
            65px;

          display:
            flex;

          align-items:
            center;

          gap:
            11px;

          padding:
            0 14px;

          border-radius:
            15px;

          border:
            1px solid
            #e6e0ed;

          background:
            #ffffff;

          cursor:
            pointer;

          text-align:
            left;

          transition:
            .25s ease;
        }


        .board-card:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 8px 22px
            rgba(100,80,130,.08);
        }


        .board-card.selected {
          background:
            #eee5ff;

          border-color:
            #c6aef0;
        }


        .board-card.selected-yellow {
          background:
            #fff0c8;

          border-color:
            #efd98e;
        }


        .board-card-icon {
          width:
            34px;

          height:
            34px;

          border-radius:
            50%;

          background:
            #f4f0f8;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          color:
            #6d6475;

          font-size:
            13px;
        }


        .board-card-text {
          flex:
            1;

          display:
            flex;

          flex-direction:
            column;

          gap:
            3px;
        }


        .board-card-text strong {
          font-size:
            11px;
        }


        .board-card-text span {
          color:
            #938b99;

          font-size:
            10px;
        }


        .board-check {
          width:
            20px;

          height:
            20px;

          border-radius:
            50%;

          border:
            1px solid
            #cfc7d7;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          font-size:
            9px;

          color:
            white;
        }


        .board-card.selected
        .board-check {
          background:
            #9273c3;

          border-color:
            #9273c3;
        }


        .board-card.selected-yellow
        .board-check {
          background:
            #d3aa40;

          border-color:
            #d3aa40;
        }


        /* =====================================================
           ACTIONS
        ===================================================== */

        .filter-actions {
          display:
            flex;

          align-items:
            center;

          justify-content:
            flex-end;

          gap:
            12px;

          margin-top:
            25px;
        }


        .clear-filter-button {
          height:
            48px;

          padding:
            0 24px;

          border:
            1px solid
            #d9d3dc;

          border-radius:
            13px;

          background:
            white;

          color:
            #5f5865;

          font-size:
            12px;

          font-weight:
            600;

          cursor:
            pointer;
        }


        .show-cars-button {
          min-width:
            170px;

          height:
            48px;

          padding:
            0 22px;

          border:
            none;

          border-radius:
            13px;

          background:
            #292331;

          color:
            white;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          gap:
            16px;

          font-size:
            12px;

          font-weight:
            700;

          cursor:
            pointer;

          box-shadow:
            0 9px 24px
            rgba(40,30,55,.16);
        }


        .show-cars-button span {
          font-size:
            18px;
        }


        .show-cars-button:disabled {
          opacity:
            .65;

          cursor:
            not-allowed;
        }


        .button-loader {
          width:
            15px;

          height:
            15px;

          border:
            2px solid
            rgba(255,255,255,.35);

          border-top-color:
            white;

          border-radius:
            50%;

          animation:
            filter-spin .7s linear infinite;
        }


        @keyframes filter-spin {
          to {
            transform:
              rotate(360deg);
          }
        }


        /* =====================================================
           PREVIEW
        ===================================================== */

        .desktop-result-preview {
          display:
            grid;

          grid-template-columns:
            2fr 1fr 1fr;

          gap:
            30px;

          align-items:
            end;

          padding:
            55px 10px 0;
        }


        .desktop-result-preview > div:first-child
        span {
          font-size:
            9px;

          color:
            #a19aa7;

          letter-spacing:
            .2em;

          font-weight:
            700;
        }


        .desktop-result-preview h2 {
          margin:
            9px 0 0;

          font-size:
            clamp(
              30px,
              3vw,
              48px
            );

          line-height:
            .95;

          letter-spacing:
            -.05em;
        }


        .desktop-result-preview h2 strong {
          color:
            #a185d1;
        }


        .preview-stat {
          border-left:
            1px solid
            #ddd6e2;

          padding-left:
            22px;

          display:
            flex;

          flex-direction:
            column;

          gap:
            5px;
        }


        .preview-stat strong {
          font-size:
            15px;

          white-space:
            nowrap;

          overflow:
            hidden;

          text-overflow:
            ellipsis;
        }


        .preview-stat span {
          color:
            #9d96a2;

          font-size:
            10px;
        }


        /* =====================================================
           MOBILE HIDDEN
        ===================================================== */

        .mobile-filter-screen {
          display:
            none;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1250px) {

          .search-panel-top {
            grid-template-columns:
              180px
              1fr
              1fr
              1fr;
          }


          .desktop-search-text {
            grid-column:
              2 / 5;
          }


          .desktop-filter-content {
            width:
              calc(100% - 40px);
          }


          .advanced-grid {
            grid-template-columns:
              1fr 1fr;
          }

        }


        /* =====================================================
           MOBILE — OLD STYLE
        ===================================================== */

        @media (max-width: 768px) {

          .desktop-filter-hero,
          .desktop-filter-content {
            display:
              none;
          }


          .mobile-filter-screen {
            display:
              block;

            min-height:
              100vh;

            background:
              #f5f5ff;

            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }


          .mobile-filter-appbar {
            position:
              sticky;

            top:
              0;

            z-index:
              20;

            background:
              #e9e9ff;

            padding:
              12px 16px;

            display:
              flex;

            align-items:
              center;
          }


          .mobile-filter-back {
            width:
              38px;

            height:
              38px;

            background:
              white;

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
          }


          .mobile-filter-title {
            flex:
              1;

            text-align:
              center;

            margin-right:
              38px;

            font-size:
              18px;

            font-weight:
              600;
          }


          .mobile-filter-body {
            padding:
              14px;
          }


          .mobile-board-row {
            display:
              flex;

            gap:
              10px;

            margin-bottom:
              12px;
          }


          .mobile-board-button {
            flex:
              1;

            height:
              56px;

            padding:
              0 12px;

            border-radius:
              16px;

            border:
              1px solid
              rgba(255,255,255,.3);

            background:
              rgba(255,255,255,.4);

            display:
              flex;

            align-items:
              center;

            cursor:
              pointer;
          }


          .mobile-board-selected {
            background:
              rgba(255,255,255,.7);

            border-color:
              rgba(0,0,0,.3);
          }


          .mobile-board-t-selected {
            background:
              rgba(255,243,205,.8);

            border-color:
              rgba(0,0,0,.3);
          }


          .mobile-board-icon {
            width:
              32px;

            height:
              32px;

            background:
              rgba(255,255,255,.85);

            border-radius:
              50%;

            display:
              flex;

            align-items:
              center;

            justify-content:
              center;

            margin-right:
              10px;
          }


          .mobile-board-text {
            flex:
              1;

            display:
              flex;

            flex-direction:
              column;

            text-align:
              left;
          }


          .mobile-board-text strong {
            font-size:
              12px;
          }


          .mobile-board-text span {
            font-size:
              10px;

            color:
              rgba(0,0,0,.7);
          }


          .mobile-board-check {
            width:
              18px;

            height:
              18px;

            border-radius:
              50%;

            border:
              1.5px solid
              rgba(0,0,0,.5);

            display:
              flex;

            align-items:
              center;

            justify-content:
              center;
          }


          .mobile-filter-row {
            display:
              flex;

            align-items:
              center;

            background:
              white;

            border-radius:
              12px;

            border:
              1px solid
              #e0e0ff;

            padding:
              10px 14px;

            margin-bottom:
              12px;
          }


          .mobile-filter-icon {
            width:
              32px;

            height:
              32px;

            background:
              #f5f5ff;

            border-radius:
              8px;

            display:
              flex;

            align-items:
              center;

            justify-content:
              center;

            margin-right:
              10px;
          }


          .mobile-filter-label {
            flex:
              1;

            font-size:
              13px;

            font-weight:
              500;
          }


          .mobile-filter-row select {
            min-width:
              145px;

            max-width:
              55%;

            padding:
              8px 10px;

            font-size:
              13px;

            border:
              1px solid
              #e0e0ff;

            border-radius:
              10px;

            background:
              #f5f5ff;

            outline:
              none;
          }


          .mobile-spinner {
            width:
              20px;

            height:
              20px;

            border:
              2px solid
              #ccc;

            border-top-color:
              #000;

            border-radius:
              50%;

            animation:
              filter-spin .7s linear infinite;
          }


          .mobile-range-card {
            background:
              white;

            border-radius:
              12px;

            border:
              1px solid
              #e0e0ff;

            padding:
              14px;

            margin-bottom:
              12px;
          }


          .mobile-range-title {
            display:
              flex;

            align-items:
              center;

            gap:
              10px;

            font-size:
              13px;

            font-weight:
              500;

            margin-bottom:
              15px;
          }


          .mobile-range-labels {
            display:
              flex;

            justify-content:
              space-between;

            margin-top:
              8px;

            font-size:
              11px;
          }


          .mobile-action-row {
            display:
              flex;

            gap:
              10px;

            margin-top:
              24px;
          }


          .mobile-clear-button,
          .mobile-apply-button {
            flex:
              1;

            height:
              48px;

            border-radius:
              12px;

            font-size:
              15px;

            font-weight:
              600;

            cursor:
              pointer;
          }


          .mobile-clear-button {
            background:
              white;

            border:
              1.5px solid
              #000;

            color:
              #000;
          }


          .mobile-apply-button {
            background:
              #000;

            border:
              none;

            color:
              white;
          }

        }


        /* =====================================================
           SMALL MOBILE
        ===================================================== */

        @media (max-width: 480px) {

          .mobile-filter-body {
            padding:
              12px;
          }


          .mobile-filter-row select {
            min-width:
              125px;
          }


          .mobile-board-button {
            padding:
              0 9px;
          }


          .mobile-board-icon {
            margin-right:
              7px;
          }

        }

      `}</style>

    </div>
  );
}


/* =============================================================
   ADVANCED SELECT
============================================================= */

function AdvancedSelect({
  title,
  value,
  onChange,
  icon,
  options,
}) {
  return (
    <div className="advanced-range-card">

      <div className="advanced-range-heading">

        <div>

          <span>
            FILTER
          </span>

          <strong>
            {title}
          </strong>

        </div>

        {icon}

      </div>


      <select
        value={value || ""}
        onChange={(e) =>
          onChange(
            e.target.value ||
              null
          )
        }
        style={{
          width: "100%",
          height: "42px",
          border: "1px solid #e0d8e9",
          borderRadius: "11px",
          background: "#fff",
          padding: "0 12px",
          outline: "none",
          fontSize: "12px",
          color: "#29242e",
          cursor: "pointer",
        }}
      >

        <option value="">
          All {title}
        </option>

        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {option.label}
            </option>
          )
        )}

      </select>

    </div>
  );
}


/* =============================================================
   MOBILE FILTER ROW
============================================================= */

function MobileFilterRow({
  title,
  icon,
  children,
}) {
  return (
    <div className="mobile-filter-row">

      <div className="mobile-filter-icon">
        {icon}
      </div>

      <div className="mobile-filter-label">
        {title}
      </div>

      {children}

    </div>
  );
}