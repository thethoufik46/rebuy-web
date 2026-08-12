// src/pages/user/home/Pages/car/car_details/CarBottomDetails.jsx

import React, { useEffect, useRef, useState } from "react";
import {
  FaCalendarAlt,
  FaGasPump,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";

/* =========================================================
   HELPERS
========================================================= */

const asString = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  if (typeof value === "object") {
    if (value.name) {
      return String(value.name);
    }

    if (value.title) {
      return String(value.title);
    }

    if (value.variantName) {
      return String(value.variantName);
    }

    if (
      Array.isArray(value) &&
      value.length > 0
    ) {
      return asString(value[0]);
    }

    return "-";
  }

  return String(value);
};

/* =========================================================
   QUICK SPEC ITEM
========================================================= */

const SpecItem = ({
  icon,
  label,
  value,
}) => (
  <div
    className="
      flex
      min-w-0
      items-center
      gap-3
      rounded-xl
      px-2
      py-2.5
      transition-all
      duration-300
      hover:bg-black/[0.025]
      sm:px-3
    "
  >
    <div
      className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-black
        text-white
        shadow-[0_5px_14px_rgba(0,0,0,0.12)]
        sm:h-11
        sm:w-11
      "
    >
      {React.cloneElement(icon, {
        className:
          "h-4 w-4 sm:h-5 sm:w-5",
      })}
    </div>

    <div className="min-w-0">
      <p className="truncate text-[11px] font-medium text-black/50 sm:text-xs">
        {label}
      </p>

      <p className="mt-0.5 truncate text-sm font-bold text-black sm:text-[15px]">
        {value}
      </p>
    </div>
  </div>
);

/* =========================================================
   HORIZONTAL LONG VALUE

   Short text = normal.
   Long text = automatically moves horizontally.
   No text is permanently hidden.
========================================================= */

function HorizontalValue({ value }) {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);

  const [isOverflowing, setIsOverflowing] =
    useState(false);

  const [distance, setDistance] =
    useState(0);

  useEffect(() => {
    let resizeObserver = null;

    const measure = () => {
      if (
        !wrapperRef.current ||
        !textRef.current
      ) {
        return;
      }

      const availableWidth =
        wrapperRef.current.clientWidth;

      const textWidth =
        textRef.current.scrollWidth;

      const overflow =
        textWidth - availableWidth;

      setDistance(
        overflow > 0 ? overflow : 0
      );

      setIsOverflowing(overflow > 2);
    };

    measure();

    if (
      typeof ResizeObserver !==
      "undefined"
    ) {
      resizeObserver =
        new ResizeObserver(measure);

      if (wrapperRef.current) {
        resizeObserver.observe(
          wrapperRef.current
        );
      }
    }

    window.addEventListener(
      "resize",
      measure
    );

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      window.removeEventListener(
        "resize",
        measure
      );
    };
  }, [value]);

  return (
    <span
      ref={wrapperRef}
      className="
        min-w-0
        max-w-[68%]
        overflow-hidden
        text-right
        sm:max-w-[72%]
      "
      title={value}
    >
      <span
        ref={textRef}
        className={`
          inline-block
          whitespace-nowrap
          text-xs
          font-semibold
          text-black
          sm:text-sm
          ${
            isOverflowing
              ? "car-long-value"
              : ""
          }
        `}
        style={
          isOverflowing
            ? {
                "--car-overflow":
                  `${distance}px`,
              }
            : undefined
        }
      >
        {value}
      </span>
    </span>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

const DetailRow = ({
  label,
  value,
  index,
}) => (
  <div
    className={`
      flex
      min-h-[42px]
      items-center
      justify-between
      gap-4
      rounded-lg
      px-3
      py-2
      transition-colors
      duration-200
      hover:bg-black/[0.025]
      ${
        index % 2 === 1
          ? "bg-black/[0.018]"
          : "bg-transparent"
      }
    `}
  >
    <span className="shrink-0 text-xs text-black/60 sm:text-sm">
      {label}
    </span>

    <HorizontalValue value={value} />
  </div>
);

/* =========================================================
   PRICE
========================================================= */

const PriceBlock = ({
  label,
  value,
}) => (
  <div className="min-w-0">
    <p className="text-[11px] font-medium text-black/50 sm:text-xs">
      {label}
    </p>

    <p className="mt-0.5 truncate text-xl font-extrabold tracking-tight text-black sm:text-2xl">
      {value}
    </p>
  </div>
);

/* =========================================================
   COMPONENT
========================================================= */

export default function CarBottomDetails({
  car = {},
}) {
  const value = (key) =>
    asString(car?.[key]);

  const brand = value("brand");
  const variant = value("variant");
  const model = value("model");
  const year = value("year");
  const km = value("km");
  const fuel = value("fuel");
  const transmission =
    value("transmission");
  const color = value("color");
  const board = value("board");
  const insurance =
    value("insurance");
  const district =
    value("district");
  const city = value("city");
  const sellerInfo =
    value("sellerinfo");
  const status = value("status");
  const description =
    value("description");
  const price = value("price");
  const owner = value("owner");

  const location =
    district === "-" &&
    city === "-"
      ? "-"
      : district === "-"
        ? city
        : city === "-"
          ? district
          : `${district}, ${city}`;

  const details = [
    ["Brand", brand],
    ["Variant", variant],
    ["Model", model],
    ["Year", year],
    ["Kilometers", km],
    ["Fuel", fuel],
    ["Transmission", transmission],
    ["Color", color],
    ["Board", board],
    ["Insurance", insurance],
    ["Location", location],
    ["Seller Info", sellerInfo],
    ["Status", status],
  ];

  return (
    <section
      className="
        car-bottom-details-fullscreen
        relative
        z-0
        w-full
        max-w-none
        bg-white
        px-3
        text-black
        sm:px-6
        lg:w-screen
        lg:left-1/2
        lg:-translate-x-1/2
        lg:px-10
        xl:px-14
        2xl:px-16
      "
    >
      {/* =====================================================
          LONG TEXT ANIMATION
      ===================================================== */}

      <style>{`
        .car-bottom-details-fullscreen {
          width: 100%;
          max-width: 100%;
          background: #ffffff;
        }

        @media (min-width: 1024px) {
          .car-bottom-details-fullscreen {
            width: 100vw;
            max-width: 100vw;
            min-width: 100vw;
            position: relative;
            left: 50%;
            transform: translateX(-50%);
            background: #ffffff;
            isolation: isolate;
          }

          .car-bottom-details-fullscreen::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: -1;
            background: #ffffff;
            pointer-events: none;
          }

          .car-bottom-details-fullscreen .car-bottom-details-grid {
            width: 100%;
            background: #ffffff;
          }
          .car-bottom-details-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          }
        }

        .car-long-value {
          animation:
            carLongValueScroll
            5.5s
            cubic-bezier(.22,1,.36,1)
            infinite
            alternate;
        }

        @keyframes carLongValueScroll {
          0%, 18% {
            transform: translateX(0);
          }

          82%, 100% {
            transform:
              translateX(
                calc(-1 * var(--car-overflow))
              );
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .car-long-value {
            animation: none;
          }
        }
      `}</style>

      {/* =====================================================
          PRICE
      ===================================================== */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-6
          border-b
          border-black/10
          pb-5
          sm:pb-6
        "
      >
        <PriceBlock
          label="Price"
          value={`₹${price}`}
        />

        <div className="text-right">
          <PriceBlock
            label="Down Payment"
            value="CIBIL Based"
          />
        </div>
      </div>

      {/* =====================================================
          LEFT ICONS + RIGHT DETAILS
      ===================================================== */}

      <div
        className="
          car-bottom-details-grid
          grid
          grid-cols-1
          gap-5
          py-5
          sm:py-6
          lg:grid-cols-2
          lg:gap-8
          lg:py-8
          2xl:gap-10
          bg-white
        "
      >
        {/* ===================================================
            LEFT — QUICK DETAILS
        =================================================== */}

        <div
          className="
            rounded-2xl
            border
            border-black/[0.07]
            bg-white
            p-3
            shadow-[0_8px_25px_rgba(0,0,0,0.055)]
            sm:p-4
            lg:h-full
          "
        >
          <div className="mb-2 px-2 sm:px-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
              Quick details
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-1
              sm:gap-2
              lg:grid-cols-1
              lg:gap-1
            "
          >
            <SpecItem
              icon={<FaCalendarAlt />}
              label="Year"
              value={year}
            />

            <SpecItem
              icon={<FaGasPump />}
              label="Fuel"
              value={fuel}
            />

            <SpecItem
              icon={<FaTachometerAlt />}
              label="Kilometers"
              value={km}
            />

            <SpecItem
              icon={<FaUser />}
              label="Owner"
              value={owner}
            />
          </div>
        </div>

        {/* ===================================================
            RIGHT — VEHICLE DETAILS
        =================================================== */}

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-black/[0.07]
            bg-white
            p-2
            shadow-[0_8px_25px_rgba(0,0,0,0.045)]
            sm:p-3
            lg:h-full
            lg:w-full
          "
        >
          <div className="mb-2 px-3 pt-2 sm:px-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
              Vehicle details
            </p>
          </div>

          <div className="space-y-0.5">
            {details.map(
              ([label, item], index) => (
                <DetailRow
                  key={label}
                  label={label}
                  value={item}
                  index={index}
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <div
        className="
          border-t
          border-black/10
          py-5
          sm:py-6
          lg:py-7
        "
      >
        <div
          className="
            rounded-2xl
            border
            border-black/[0.07]
            bg-white
            px-4
            py-4
            sm:px-5
            sm:py-5
          "
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
            Description
          </p>

          <p
            className="
              mt-2
              text-sm
              font-medium
              leading-7
              text-black/80
              sm:text-[15px]
            "
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}