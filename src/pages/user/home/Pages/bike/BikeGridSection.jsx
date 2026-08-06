import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BikeCard from "@/components/BikeCard";

/* ================= HELPERS ================= */

const extractId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    if (value.$oid) return value.$oid.toString();
    if (value._id) return value._id.toString();
  }

  return value.toString();
};

const brandName = (bike) => {
  const brand = bike?.brand;

  if (typeof brand === "object" && brand?.name) {
    return brand.name.toString();
  }

  return "";
};

const brandLogo = (bike) => {
  const brand = bike?.brand;

  if (typeof brand === "object" && brand?.logo) {
    return brand.logo.toString();
  }

  return "";
};

const isVisible = (bike) => {
  const status = (bike?.status || "").toString().toLowerCase();

  if (status === "draft") return false;
  if (status === "drift") return false;

  return true;
};

/* ─── Get model name directly from bike object ────────── */
const getModelName = (bike) => {
  const model = bike?.model;

  if (!model) return "";

  // If it's already a string, return it
  if (typeof model === "string") return model;

  // If it's an object, try common fields
  if (typeof model === "object") {
    if (model.modelName) return model.modelName.toString();
    if (model.name) return model.name.toString();
  }

  // Fallback: try to extract ID (we don't want that, but better than empty)
  return extractId(model);
};

/* ================= COMPONENT ================= */

export default function BikeGridSection({ bikes = [], onViewAll, showViewAllButton }) {
  const navigate = useNavigate();

  const bikesToShow = bikes.filter(isVisible).slice(0, 6);

  if (!bikesToShow.length) return null;

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
      {/* ✅ UPDATED GRID – mobile 2, tablet 4, desktop 6 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
        style={{
          columnGap: "12px",
          rowGap: "14px",
        }}
      >
        {bikesToShow.map((bike) => {
          const bikeId = extractId(bike._id);

          return (
            <motion.div
              key={bikeId}
              variants={itemVariants}
              onClick={() =>
                navigate(`/bike/${bikeId}`, { state: { bike } })
              }
              className="cursor-pointer aspect-[0.72] xl:aspect-[0.78]"
            >
              <BikeCard
                bikeId={bikeId}
                brandName={brandName(bike)}
                brandLogoUrl={brandLogo(bike)}
                model={getModelName(bike)}
                variant={bike.variant || ""}
                imageUrl={bike.bannerImage || ""}
                price={bike.price?.toString() || "0"}
                year={bike.year?.toString() || "-"}
                status={bike.status || "available"}
                km={bike.km?.toString() || "0"}
                owner={bike.owner?.toString() || "1"}
                district={bike.district || ""}
                city={bike.city || ""}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* ✅ VIEW ALL BUTTON */}
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
              View All Bikes
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