// src/components/BikeCard.jsx

import React, {
  memo,
  useState,
} from "react";

import {
  FaMapMarkerAlt,
  FaTachometerAlt,
  FaUser,
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
      return String(
        value.name
      );
    }

    if (value.$oid) {
      return String(
        value.$oid
      );
    }

    if (value._id) {
      return String(
        value._id
      );
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
   PRICE
========================================================= */

const formatPrice = (
  rawPrice
) => {
  const num =
    parseInt(
      asString(
        rawPrice
      ).replace(
        /[^0-9]/g,
        ""
      ),
      10
    ) || 0;

  return num.toLocaleString(
    "en-IN"
  );
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
   BIKE CARD
   ---------------------------------------------------------
   PERFORMANCE:
   - No framer-motion
   - No animation
   - No shimmer
   - No blur animation
   - No skeleton animation
   - React.memo
   - Async image decode
   - Lazy images
========================================================= */

function BikeCard({
  loading = false,

  bikeId,
  brandName,
  brandLogoUrl,

  name,
  imageUrl,

  location,
  price,
  year,
  status,
  km,
  owner,

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
     SHARE
  ======================================================= */

  const shareBike = async (
    event
  ) => {
    event.stopPropagation();

    const id =
      asString(
        bikeId
      );

    if (!id) return;

    const shareUrl =
      `${window.location.origin}/bike/${encodeURIComponent(
        id
      )}`;

    const shareText =
      `🏍️ ${asString(
        brandName
      )} ${asString(name)}

💰 Price: ₹${formatPrice(
        price
      )}
📅 Year: ${asString(
        year
      )}
📍 Location: ${asString(
        location
      )}
🛣️ KM: ${asString(
        km
      )} km
👤 Owner: ${asString(
        owner
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
            `${asString(
              brandName
            )} ${asString(
              name
            )}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
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
      // Ignore clipboard failure
    }
  };

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
     STATIC LOADING
     -------------------------------------------------------
     NO animation.
     NO shimmer.
  ======================================================= */

  if (loading) {
    return (
      <BikeCardSkeleton />
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
          aspect-[13/11]
          w-full
          shrink-0
          overflow-hidden
          bg-slate-100
        "
      >
        {/* IMAGE */}

        {!imageError &&
        image ? (
          <img
            src={image}
            alt={`${asString(
              brandName
            )} ${asString(
              name
            )}`}
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
          <BikeImageFallback />
        )}

        {/* STATIC IMAGE PLACEHOLDER */}

        {!imageLoaded &&
          !imageError &&
          image && (
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-slate-100
              "
            />
          )}

        {/* TOP GRADIENT */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            z-10
            h-14
            bg-gradient-to-b
            from-black/10
            to-transparent
          "
        />

        {/* YEAR */}

        {year && (
          <div
            className="
              absolute
              left-2.5
              top-2.5
              z-20
            "
          >
            <Chip
              text={year}
            />
          </div>
        )}

        {/* STATUS */}

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

        {/* SHARE */}

        <button
          type="button"
          onClick={
            shareBike
          }
          aria-label="Share bike"
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
          CONTENT
      ================================================= */}

      <div
        className="
          min-w-0
          px-3
          pb-2.5
          pt-2
        "
      >
        {/* PRICE + LOCATION */}

        <div
          className="
            flex
            min-w-0
            items-center
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
            ₹
            {formatPrice(
              price
            )}
          </div>

          {location && (
            <IconText
              icon={
                <FaMapMarkerAlt
                  size={9}
                />
              }
              text={location}
              textSize="text-[8px]"
            />
          )}
        </div>

        {/* NAME + KM */}

        <div
          className="
            mt-0.5
            flex
            min-w-0
            items-center
          "
        >
          <div
            className="
              min-w-0
              flex-1
              truncate
              text-xs
              font-semibold
              text-black
            "
          >
            {asString(name)}
          </div>

          {km !== "" &&
            km !==
              null &&
            km !==
              undefined && (
              <IconText
                icon={
                  <FaTachometerAlt
                    size={9}
                  />
                }
                text={`${asString(
                  km
                )} km`}
                textSize="text-[8px]"
              />
            )}
        </div>

        {/* OWNER */}

        {owner && (
          <div
            className="
              mt-1
            "
          >
            <IconText
              icon={
                <FaUser
                  size={9}
                />
              }
              text={owner}
              textSize="text-[9px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STATIC SKELETON
   ---------------------------------------------------------
   NO motion
   NO shimmer
   NO keyframes
========================================================= */

const BikeCardSkeleton = memo(
  function BikeCardSkeleton() {
    return (
      <div
        className="
          my-1.5
          w-full
          overflow-hidden
          rounded-[22px]
          border
          border-white/70
          bg-white
          shadow-[0_5px_18px_rgba(15,23,42,0.06)]
        "
      >
        <div
          className="
            aspect-[13/11]
            w-full
            bg-slate-100
          "
        />

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
              h-4
              w-24
              rounded-full
              bg-slate-100
            "
          />

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
              flex
              gap-2
            "
          >
            <div
              className="
                h-2.5
                w-12
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
              h-2.5
              w-[58%]
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
   Replaces any PremiumImageFallback dependency.
========================================================= */

const BikeImageFallback = memo(
  function BikeImageFallback() {
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
          shrink
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
  BikeCard
);