import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Slider } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

import CarCard from "@/components/CarCard";
import { getAllVariants } from "@/services/carVariantApi.js";

/* ================= HELPERS (identical to Flutter) ================= */

const hideCar = (car) => {
  const status = car.status?.toString().toLowerCase() || "";
  return status.includes("draft") || status.includes("sold") || status.includes("drift");
};

const extractId = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    if (value.$oid) return value.$oid.toString();
    if (value._id) return value._id.toString();
  }
  return value.toString();
};

const withComma = (num) => Math.floor(num).toLocaleString("en-IN");

const priceSliderLabel = (value) => {
  if (value >= 5000000) return "50L+";
  if (value >= 100000) {
    const lakh = value / 100000;
    return lakh.toFixed(1).replace(".0", "") + "L";
  }
  return withComma(value);
};

const kmSliderLabel = (value) => {
  if (value >= 200000) return "2L+";
  if (value >= 100000) {
    const lakh = value / 100000;
    return lakh.toFixed(2).replace(/0+$/, "") + "L";
  }
  return Math.round(value / 1000) + "K";
};

/* ================= VARIANT CACHE (same as Flutter) ================= */

let allVariantsMap = {};
let cacheTime = null;
const CACHE_DURATION = 15 * 60 * 1000;

/* ================= MAIN COMPONENT ================= */

export default function FilterResultScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const filteredCars = location.state?.filteredCars || [];

  const [displayCars, setDisplayCars] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [kmRange, setKmRange] = useState([0, 200000]);

  const originalCarsRef = useRef(filteredCars);

  // Initial filter (hide draft/sold/drift)
  useEffect(() => {
    originalCarsRef.current = filteredCars;
    setDisplayCars(filteredCars.filter((c) => !hideCar(c)));
  }, [filteredCars]);

  // Variant cache loader
  useEffect(() => {
    const loadVariants = async () => {
      if (
        cacheTime &&
        Date.now() - cacheTime < CACHE_DURATION &&
        Object.keys(allVariantsMap).length
      ) return;

      try {
        const fetched = await getAllVariants();
        const map = {};
        fetched.forEach((v) => {
          const id = extractId(v._id);
          if (id) map[id] = v.variantName || v.title || "Unknown";
        });
        allVariantsMap = map;
        cacheTime = Date.now();
        setDisplayCars((prev) => [...prev]); // trigger re-render
      } catch (e) {
        console.log("Variant cache error 👉", e);
      }
    };
    loadVariants();
  }, []);

  const getVariantDisplayName = useCallback((car) => {
    const id = extractId(car.variant);
    if (id && allVariantsMap[id]) return allVariantsMap[id];
    return (
      car.variant?.variantName ||
      car.variant?.title ||
      car.variantName ||
      car.model ||
      "Unknown"
    );
  }, []);

  // Apply price & km filter
  useEffect(() => {
    const filtered = originalCarsRef.current.filter((car) => {
      if (hideCar(car)) return false;
      const price = parseFloat(car.price) || 0;
      const km = parseFloat(car.km) || 0;
      return (
        price >= priceRange[0] &&
        price <= priceRange[1] &&
        km >= kmRange[0] &&
        km <= kmRange[1]
      );
    });
    setDisplayCars(filtered);
  }, [priceRange, kmRange]);

  /* ================= UI – pixel perfect match with Flutter ================= */

  return (
    <div className="h-screen flex flex-col">
      {/* 🌸 Background gradient (exact Flutter colors) */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#D6CEF3] to-[#F3EFFF] -z-10" />

      {/* ===== CUSTOM APP BAR (exactly like Flutter) ===== */}
      <div className="bg-[#E9E9FF] px-3 py-2 flex items-center justify-between shadow-none">
        {/* Back button – white circle with arrow */}
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm"
        >
          <ArrowBack className="text-black/70" style={{ fontSize: 18 }} />
        </button>

        {/* Centered title */}
        <span className="text-black/80 font-semibold text-base">
          Results ({displayCars.length})
        </span>

        {/* Placeholder for symmetry */}
        <div className="w-9" />
      </div>

      {/* ===== FILTER ROW (white card, two sliders side‑by‑side) ===== */}
      <div className="mx-3 my-2 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm">
        <div className="flex gap-4">
          {/* Price slider */}
          <div className="flex-1">
            <div className="text-xs font-semibold text-black/80 mb-1">
              Price ({withComma(priceRange[0])} – {withComma(priceRange[1])})
            </div>
            <Slider
              value={priceRange}
              onChange={(e, v) => setPriceRange(v)}
              valueLabelDisplay="auto"
              valueLabelFormat={priceSliderLabel}
              min={0}
              max={5000000}
              step={100000}
              disableSwap
              sx={{
                color: "#7C6B9E",
                height: 4,
                "& .MuiSlider-thumb": {
                  width: 16,
                  height: 16,
                  backgroundColor: "#fff",
                  border: "2px solid currentColor",
                },
                "& .MuiSlider-track": {
                  border: "none",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "#bfbfbf",
                },
              }}
            />
          </div>

          {/* Km slider */}
          <div className="flex-1">
            <div className="text-xs font-semibold text-black/80 mb-1">
              Kilometers ({withComma(kmRange[0])} – {withComma(kmRange[1])})
            </div>
            <Slider
              value={kmRange}
              onChange={(e, v) => setKmRange(v)}
              valueLabelDisplay="auto"
              valueLabelFormat={kmSliderLabel}
              min={0}
              max={200000}
              step={5000}
              disableSwap
              sx={{
                color: "#7C6B9E",
                height: 4,
                "& .MuiSlider-thumb": {
                  width: 16,
                  height: 16,
                  backgroundColor: "#fff",
                  border: "2px solid currentColor",
                },
                "& .MuiSlider-track": {
                  border: "none",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "#bfbfbf",
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* ===== GRID OF CARDS (responsive columns, exact spacing) ===== */}
      <div className="flex-1 overflow-y-auto px-3 pb-5">
        {displayCars.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-black/70 font-medium">No cars found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayCars.map((car) => {
              const carId = extractId(car._id);
              return (
                <div
                  key={carId}
                  onClick={() => navigate(`/car/${carId}`, { state: { car } })}
                  className="cursor-pointer"
                >
                  <CarCard
                    carId={carId}
                    brandName={car.brand?.name}
                    brandLogoUrl={car.brand?.logo}
                    variant={getVariantDisplayName(car)}
                    model={car.model}
                    imageUrl={car.bannerImage}
                    price={`₹${car.price}`}
                    fuel={car.fuel}
                    year={car.year}
                    status={car.status}
                    km={car.km}
                    owner={car.owner}
                    transmission={car.transmission}
                    district={car.district}
                    city={car.city}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}