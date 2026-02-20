import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CarCard from "@/components/CarCard";
import { getAllVariants } from "@/services/carVariantApi";

/* ================= HELPERS (Flutter identical) ================= */

const extractId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    if (value.$oid) return value.$oid.toString();
    if (value._id) return value._id.toString();
  }

  return value.toString();
};

const brandName = (car) => {
  const brand = car?.brand;

  if (typeof brand === "object" && brand?.name) {
    return brand.name.toString();
  }

  return "";
};

const brandLogo = (car) => {
  const brand = car?.brand;

  if (typeof brand === "object" && brand?.logo) {
    return brand.logo.toString();
  }

  return "";
};

const isVisible = (car) => {
  const status = (car?.status || "").toString().toLowerCase();

  if (status === "draft") return false;
  if (status === "drift") return false;

  return true;
};

/* ================= CACHE ================= */

let cachedVariantMap = {};
let cacheTime = null;
const CACHE_DURATION = 15 * 60 * 1000;

/* ================= COMPONENT ================= */

export default function CarGridSection({ cars = [], onViewAll, showViewAllButton }) {
  const navigate = useNavigate();
  const [variantMap, setVariantMap] = useState({});

  /* ================= LOAD VARIANTS (Flutter cache logic) ================= */

  useEffect(() => {
    const loadVariants = async () => {
      if (
        cacheTime &&
        Date.now() - cacheTime < CACHE_DURATION &&
        Object.keys(cachedVariantMap).length
      ) {
        setVariantMap(cachedVariantMap);
        return;
      }

      try {
        const variants = await getAllVariants();

        const map = {};
        variants.forEach((v) => {
          const id = extractId(v._id);
          if (id) map[id] = v.variantName || "";
        });

        cachedVariantMap = map;
        cacheTime = Date.now();

        setVariantMap(map);
      } catch (e) {
        console.log("Variant load error 👉", e);
      }
    };

    loadVariants();
  }, []);

  const variantName = useCallback(
    (variantValue) => {
      const id = extractId(variantValue);
      if (!id) return "";
      return variantMap[id] || "";
    },
    [variantMap]
  );

  /* ================= FILTER + TAKE(6) ================= */

  const carsToShow = cars.filter(isVisible).slice(0, 6);

  if (!carsToShow.length) return null;

  /* ================= ANIMATION (Flutter staggeredGrid feel) ================= */

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <div>
      {/* ✅ GRID — EXACT Flutter spacing */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2"
        style={{
          columnGap: "12px",   // crossAxisSpacing
          rowGap: "14px",      // mainAxisSpacing
        }}
      >
        {carsToShow.map((car) => {
          const carId = extractId(car._id);

          return (
            <motion.div
              key={carId}
              variants={itemVariants}
              onClick={() =>
                navigate(`/car/${carId}`, { state: { car } })
              }
              style={{
                aspectRatio: "0.72",  // childAspectRatio 🔥🔥🔥
              }}
              className="cursor-pointer"
            >
              <CarCard
                carId={carId}
                brandName={brandName(car)}
                brandLogoUrl={brandLogo(car)}
                variant={variantName(car.variant)}
                model={car.model || ""}
                imageUrl={car.bannerImage || ""}
                price={car.price?.toString() || "0"}
                fuel={car.fuel || ""}
                year={car.year?.toString() || "-"}
                status={car.status || "available"}
                km={car.km?.toString() || "0"}
                owner={car.owner?.toString() || "1"}
                transmission={car.transmission || "Manual"}
                district={car.district || ""}
                city={car.city || ""}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* ✅ VIEW ALL BUTTON — EXACT Flutter */}
      {showViewAllButton && (
        <div style={{ padding: "14px 0" }}>
          <button
            onClick={onViewAll}
            style={{
              height: "42px",
              background: "rgba(255,255,255,0.45)",
              borderRadius: "18px",
              padding: "0 25px",
              width: "100%",
            }}
            className="flex items-center justify-between"
          >
            <span className="text-xs font-semibold text-black">
              View All Cars
            </span>

            <div
              style={{
                width: 28,
                height: 28,
                background: "rgba(255,255,255,0.6)",
                borderRadius: "50%",
              }}
              className="flex items-center justify-center"
            >
              <span className="text-sm">→</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}