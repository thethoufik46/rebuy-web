import React from "react";
import { useNavigate } from "react-router-dom";
import BikeCard from "@/components/BikeCard"; // ✅ adjust if needed

/* ================= SAFE HELPERS (Flutter identical) ================= */

const extractId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    if (value.$oid) return value.$oid.toString();
    if (value._id) return value._id.toString();
  }

  if (Array.isArray(value) && value.length) {
    return extractId(value[0]);
  }

  return value.toString();
};

const asString = (v) => {
  if (!v) return "";

  if (typeof v === "object") {
    if (v.name) return v.name.toString();
  }

  return v.toString();
};

const brandName = (bike) => {
  const brand = bike?.brand;

  if (brand && typeof brand === "object") {
    return asString(brand.name);
  }

  if (Array.isArray(brand) && brand.length) {
    return asString(brand[0]);
  }

  return "";
};

const brandLogo = (bike) => {
  const brand = bike?.brand;

  if (brand && typeof brand === "object" && brand.logo) {
    return brand.logo.toString();
  }

  return "";
};

/* ================= COMPONENT ================= */

export default function BikeGridSection({
  bikes = [],
  onViewAll,
}) {
  const navigate = useNavigate();

  const bikesToShow = bikes.slice(0, 6);

  if (!bikesToShow.length) return null;

  return (
    <div className="flex flex-col">

      {/* ✅ GRID – EXACT Flutter spacing */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
        {/* gap-x-3 = 12px
            gap-y-3.5 ≈ 14px */}
        
        {bikesToShow.map((bike) => {
          const id = extractId(bike._id);
          const brand = brandName(bike);
          const model = asString(bike.model);

          return (
            <div
              key={id}
              onClick={() =>
                navigate(`/bike/${id}`, { state: { bike } })
              }
              className="cursor-pointer"
            >
              <BikeCard
                bikeId={id}
                name={`${brand} ${model}`}
                brandName={brand}
                brandLogoUrl={brandLogo(bike)}
                imageUrl={asString(bike.bannerImage)}
                location={asString(bike.location)}
                price={`₹${asString(bike.price)}`}
                year={asString(bike.year)}
                km={asString(bike.km)}
                owner={asString(bike.owner)}
                status={asString(bike.status)}
              />
            </div>
          );
        })}
      </div>

      {/* ✅ VIEW ALL BUTTON (Flutter identical) */}
      {bikes.length > 1 && (
        <div className="py-3.5">
          <button
            onClick={onViewAll}
            className="
              w-full h-10.5
              bg-white/45
              rounded-2xl
              px-6
              flex items-center justify-between
              transition hover:bg-white/60
            "
          >
            <span className="font-semibold text-xs text-black">
              View All Bikes
            </span>

            <div className="w-7 h-7 bg-white/60 rounded-full flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}