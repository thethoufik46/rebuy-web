// src/components/PropertyCard.jsx

import React, {
  memo,
  useState,
} from "react";

import {
  FaFilter,
  FaMapMarkerAlt,
  FaShareAlt,
} from "react-icons/fa";

/* =========================================================
   SAFE HELPERS
========================================================= */

const asString = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "";
  }

  if (
    typeof value === "object"
  ) {
    if (value.name) {
      return String(value.name);
    }

    if (value.$oid) {
      return String(value.$oid);
    }

    if (value._id) {
      return String(value._id);
    }

    if (Array.isArray(value)) {
      return value[0]
        ? String(value[0])
        : "";
    }

    return "";
  }

  return String(value);
};

/* =========================================================
   IMAGE URL
========================================================= */

const getImageUrl = (
  value
) => {
  if (!value) return "";

  if (
    typeof value ===
    "string"
  ) {
    return value.trim();
  }

  if (
    typeof value ===
    "object"
  ) {
    return (
      value.url ||
      value.secure_url ||
      value.src ||
      value.path ||
      value.imageUrl ||
      ""
    );
  }

  return "";
};

/* =========================================================
   PRICE
========================================================= */

const formatPrice = (
  value
) => {
  const raw =
    asString(value);

  const num =
    parseInt(
      raw.replace(
        /[^0-9]/g,
        ""
      ),
      10
    ) || 0;

  if (!num) {
    return "Price on Request";
  }

  return `₹${num.toLocaleString(
    "en-IN"
  )}`;
};

/* =========================================================
   PROPERTY CARD
   ---------------------------------------------------------
   LIGHTWEIGHT:
   - No framer-motion
   - No shimmer
   - No animated skeleton
   - No image fade
   - No image scale animation
   - React.memo
   - Lazy image
   - Async image decoding
========================================================= */

function PropertyCard({
  loading = false,

  propertyId,
  mainType,
  category,

  price,
  imageUrl,

  status,

  district,
  city,

  bedrooms,
  landArea,
  direction,

  onTap,
}) {
  /* =======================================================
     IMAGE
  ======================================================= */

  const image =
    getImageUrl(
      imageUrl
    );

  const [
    imageLoaded,
    setImageLoaded,
  ] = useState(false);

  const [
    imageError,
    setImageError,
  ] = useState(false);

  /* =======================================================
     STATUS
  ======================================================= */

  const normalizedStatus =
    asString(
      status
    ).toLowerCase();

  const statusColor =
    normalizedStatus ===
    "sold"
      ? "bg-red-500"
      : normalizedStatus ===
        "booking"
      ? "bg-blue-500"
      : "bg-gray-500";

  const statusText =
    normalizedStatus ===
    "sold"
      ? "SOLD"
      : normalizedStatus ===
        "booking"
      ? "BOOKING"
      : normalizedStatus
      ? normalizedStatus.toUpperCase()
      : "";

  /* =======================================================
     RIGHT TEXT
  ======================================================= */

  const bedroomText =
    asString(
      bedrooms
    );

  const landText =
    asString(
      landArea
    );

  const rightText =
    bedroomText
      ? `${bedroomText} BHK`
      : landText
      ? `${landText} sq ft`
      : "";

  /* =======================================================
     SHARE
  ======================================================= */

  const shareProperty =
    async (event) => {
      event.stopPropagation();

      const id =
        asString(
          propertyId
        );

      if (!id) {
        return;
      }

      const shareUrl =
        `${window.location.origin}/property/${encodeURIComponent(
          id
        )}`;

      const shareText =
        `🏠 ${asString(
          category
        )}

💰 ${formatPrice(
          price
        )}
📍 ${asString(
          district
        )}, ${asString(
          city
        )}

👉 ${shareUrl}`;

      /* Native share */

      if (
        typeof navigator !==
          "undefined" &&
        typeof navigator.share ===
          "function"
      ) {
        try {
          await navigator.share({
            title:
              "Property Details",
            text: shareText,
            url: shareUrl,
          });
        } catch {
          // User cancelled
        }

        return;
      }

      /* Clipboard fallback */

      try {
        if (
          navigator.clipboard
            ?.writeText
        ) {
          await navigator.clipboard.writeText(
            shareText
          );
        }
      } catch {
        // Ignore clipboard error
      }
    };

  /* =======================================================
     STATIC LOADING
     -------------------------------------------------------
     NO ANIMATION
  ======================================================= */

  if (loading) {
    return (
      <PropertyCardSkeleton />
    );
  }

  /* =======================================================
     CARD
  ======================================================= */

  return (
    <div
      onClick={onTap}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          event.key ===
            "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          onTap?.();
        }
      }}
      className="
        group
        relative
        mx-0
        my-1.5
        flex
        w-full
        cursor-pointer
        flex-col
        overflow-hidden
        rounded-[22px]
        border
        border-white/70
        bg-white
        shadow-[0_5px_18px_rgba(15,23,42,0.07)]
        active:scale-[0.99]
      "
    >
      {/* =================================================
          IMAGE
      ================================================= */}

      <div
        className="
          relative
          w-full
          overflow-hidden
          bg-slate-100
        "
      >
        <div
          className="
            relative
            aspect-[12/10]
            w-full
            overflow-hidden
            bg-slate-100
            lg:aspect-[4/3]
          "
        >
          {/* IMAGE */}

          {!imageError &&
          image ? (
            <img
              src={image}
              alt={
                asString(
                  category
                ) ||
                "Property"
              }
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              draggable="false"
              onLoad={() =>
                setImageLoaded(
                  true
                )
              }
              onError={() => {
                setImageError(
                  true
                );

                setImageLoaded(
                  false
                );
              }}
              className="
                block
                h-full
                w-full
                object-cover
              "
            />
          ) : (
            <PropertyImageFallback />
          )}

          {/* STATIC IMAGE BACKGROUND
              No shimmer / no fade */}

          {!imageLoaded &&
            !imageError &&
            image && (
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  -z-0
                  bg-slate-100
                "
              />
            )}

          {/* BOTTOM GRADIENT */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              z-10
              h-16
              bg-gradient-to-t
              from-black/30
              to-transparent
            "
          />
        </div>

        {/* =================================================
            MAIN TYPE
        ================================================= */}

        {mainType && (
          <div
            className="
              absolute
              left-2.5
              top-2.5
              z-20
            "
          >
            <Chip
              text={mainType}
            />
          </div>
        )}

        {/* =================================================
            STATUS
        ================================================= */}

        {normalizedStatus &&
          normalizedStatus !==
            "available" && (
            <div
              className="
                absolute
                inset-0
                z-20
                flex
                items-center
                justify-center
                bg-black/[0.03]
              "
            >
              <Chip
                text={
                  statusText
                }
                className={`${statusColor} shadow-lg`}
              />
            </div>
          )}

        {/* =================================================
            SHARE
        ================================================= */}

        <button
          type="button"
          onClick={
            shareProperty
          }
          aria-label="Share property"
          className="
            absolute
            right-2.5
            top-2.5
            z-30
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-white/30
            bg-black/55
            text-white
            shadow-lg
            backdrop-blur-md
            active:scale-90
          "
        >
          <FaShareAlt
            size={11}
          />
        </button>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          px-3
          pb-3
          pt-2
        "
      >
        {/* PRICE + BHK / AREA */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
          "
        >
          <div
            className="
              min-w-0
              flex-1
              truncate
              text-sm
              font-extrabold
              tracking-tight
              text-black
            "
          >
            {formatPrice(
              price
            )}
          </div>

          {rightText && (
            <span
              className="
                shrink-0
                text-[9px]
                font-medium
                text-gray-500
              "
            >
              {rightText}
            </span>
          )}
        </div>

        {/* CATEGORY */}

        <div
          className="
            mt-0.5
            truncate
            text-xs
            font-semibold
            text-black
          "
        >
          {asString(
            category
          )}
        </div>

        {/* DIRECTION */}

        {asString(
          direction
        ) && (
          <div
            className="
              mt-1.5
            "
          >
            <IconText
              icon={
                <FaFilter
                  size={8}
                />
              }
              text={direction}
              textSize="text-[8px]"
            />
          </div>
        )}

        {/* LOCATION */}

        {(district ||
          city) && (
          <div
            className="
              mt-1.5
              flex
              min-w-0
              items-center
              gap-1
              truncate
              text-gray-500
            "
          >
            <FaMapMarkerAlt
              size={8}
              className="shrink-0"
            />

            <span
              className="
                truncate
                text-[8px]
              "
            >
              <span className="text-gray-700">
                {asString(
                  district
                )}
              </span>

              {district &&
                city && (
                  <span className="text-gray-400">
                    ,{" "}
                  </span>
                )}

              <span className="text-gray-500">
                {asString(
                  city
                )}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STATIC PROPERTY SKELETON
   ---------------------------------------------------------
   NO:
   - Framer Motion
   - shimmer
   - blur
   - keyframes
   - opacity animation
========================================================= */

const PropertyCardSkeleton =
  memo(
    function PropertyCardSkeleton() {
      return (
        <div
          className="
            relative
            mx-0
            my-1.5
            flex
            w-full
            flex-col
            overflow-hidden
            rounded-[22px]
            border
            border-white/70
            bg-white
            shadow-[0_5px_18px_rgba(15,23,42,0.06)]
          "
        >
          {/* IMAGE */}

          <div
            className="
              aspect-[12/10]
              w-full
              bg-slate-100
              lg:aspect-[4/3]
            "
          />

          {/* CONTENT */}

          <div
            className="
              space-y-2.5
              px-3
              pb-3
              pt-3
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >
              <div
                className="
                  h-4
                  w-28
                  rounded-full
                  bg-slate-100
                "
              />

              <div
                className="
                  h-2.5
                  w-14
                  rounded-full
                  bg-slate-100
                "
              />
            </div>

            <div
              className="
                h-3
                w-[72%]
                rounded-full
                bg-slate-100
              "
            />

            <div
              className="
                h-2.5
                w-[55%]
                rounded-full
                bg-slate-100
              "
            />

            <div
              className="
                h-2.5
                w-[68%]
                rounded-full
                bg-slate-100
              "
            />
          </div>
        </div>
      );
    }
  );

/* =========================================================
   IMAGE FALLBACK
   ---------------------------------------------------------
   No PremiumImageFallback dependency.
========================================================= */

const PropertyImageFallback =
  memo(
    function PropertyImageFallback() {
      return (
        <div
          className="
            flex
            h-full
            w-full
            items-center
            justify-center
            bg-gradient-to-br
            from-slate-100
            via-slate-200
            to-slate-100
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-white/70
              text-xl
              font-black
              text-black/15
              shadow-sm
            "
          >
            R
          </div>
        </div>
      );
    }
  );

/* =========================================================
   CHIP
========================================================= */

const Chip = memo(
  function Chip({
    text,
    className = "bg-black/60",
  }) {
    return (
      <span
        className={`
          ${className}
          inline-flex
          items-center
          rounded-full
          px-2
          py-1
          text-[10px]
          font-bold
          leading-none
          text-white
        `}
      >
        {asString(text)}
      </span>
    );
  }
);

/* =========================================================
   ICON TEXT
========================================================= */

const IconText = memo(
  function IconText({
    icon,
    text,
    textSize = "text-[8px]",
  }) {
    return (
      <div
        className="
          flex
          min-w-0
          items-center
          gap-1
          truncate
          text-gray-500
        "
      >
        <span className="shrink-0">
          {icon}
        </span>

        <span
          className={`
            ${textSize}
            min-w-0
            truncate
          `}
        >
          {asString(text)}
        </span>
      </div>
    );
  }
);

/* =========================================================
   FINAL EXPORT
========================================================= */

export default memo(
  PropertyCard
);