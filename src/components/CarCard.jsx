import React, { memo, useState } from "react";

import {
  FaGasPump,
  FaTachometerAlt,
  FaUser,
  FaCogs,
  FaMapMarkerAlt,
  FaShareAlt,
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
    return "";
  }

  if (typeof value === "object") {
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

const getImageUrl = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object") {
    return (
      value.url ||
      value.secure_url ||
      value.src ||
      value.path ||
      value.imageUrl ||
      value.bannerImage ||
      ""
    );
  }

  return "";
};

/* =========================================================
   PRICE
========================================================= */

const formatPrice = (value) => {
  const raw = asString(value);

  const number =
    parseInt(
      raw.replace(
        /[^0-9]/g,
        ""
      ),
      10
    ) || 0;

  return number.toLocaleString(
    "en-IN"
  );
};

/* =========================================================
   CARD
========================================================= */

function CarCard({
  loading = false,

  carId,

  brandName,
  brandLogoUrl,

  variant,
  model,

  imageUrl,

  price,
  fuel,
  year,

  status,
  km,

  owner,
  transmission,

  district,
  city,

  onTap,
}) {
  /* =======================================================
     IMAGE
  ======================================================= */

  const image =
    getImageUrl(imageUrl);

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

  const shareCar = async (
    event
  ) => {
    event.stopPropagation();

    const id =
      asString(carId);

    if (!id) return;

    const shareUrl =
      `${window.location.origin}/car/${id}`;

    const shareText =
      `🚗 ${asString(
        brandName
      )} ${asString(
        variant
      )} ${asString(model)}

💰 Price: ₹${formatPrice(
        price
      )}
⛽ Fuel: ${asString(fuel)}
⚙️ Transmission: ${asString(
        transmission
      )}
📍 Location: ${asString(
        district
      )}, ${asString(city)}
🛣️ KM: ${asString(km)} km
👤 Owner: ${asString(owner)}

👉 ${shareUrl}`;

    if (
      navigator.share
    ) {
      try {
        await navigator.share({
          title:
            `${asString(
              brandName
            )} ${asString(
              model
            )}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(
        `${shareText}\n${shareUrl}`
      );

      alert(
        "Car link copied!"
      );
    } catch {
      // Clipboard unavailable
    }
  };

  /* =======================================================
     STATUS
  ======================================================= */

  const normalizedStatus =
    asString(
      status
    ).toLowerCase();

  const getStatusColor = () => {
    if (
      normalizedStatus ===
      "sold"
    ) {
      return "bg-red-500";
    }

    if (
      normalizedStatus ===
      "booking"
    ) {
      return "bg-blue-500";
    }

    return "bg-gray-500";
  };

  const getStatusText = () => {
    if (
      normalizedStatus ===
      "sold"
    ) {
      return "SOLD";
    }

    if (
      normalizedStatus ===
      "booking"
    ) {
      return "BOOKING";
    }

    return normalizedStatus
      ? normalizedStatus.toUpperCase()
      : "";
  };

  /* =======================================================
     LIGHTWEIGHT LOADING
     -------------------------------------------------------
     NO animation
     NO shimmer
     NO Framer Motion
  ======================================================= */

  if (loading) {
    return (
      <div
        className="
          relative
          w-full
          overflow-hidden
          rounded-[22px]
          border
          border-white/70
          bg-white
          shadow-[0_4px_14px_rgba(15,23,42,0.05)]
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
            space-y-2
            px-3
            pb-3
            pt-3
          "
        >
          <div className="h-4 w-24 rounded bg-slate-100" />

          <div className="h-3 w-32 rounded bg-slate-100" />

          <div className="h-2.5 w-20 rounded bg-slate-100" />

          <div className="h-2.5 w-28 rounded bg-slate-100" />
        </div>
      </div>
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

          if (onTap) {
            onTap();
          }
        }
      }}
      className="
        group
        relative
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

        {image &&
        !imageError ? (
          <img
            src={image}
            alt={`${asString(
              brandName
            )} ${asString(
              model
            )}`}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            draggable="false"
            className="
              block
              h-full
              w-full
              object-cover
            "
            onLoad={() => {
              setImageLoaded(
                true
              );
            }}
            onError={() => {
              setImageError(
                true
              );
              setImageLoaded(
                false
              );
            }}
          />
        ) : (
          /* =================================================
             INLINE FALLBACK
             -------------------------------------------------
             No PremiumImageFallback component needed.
          ================================================= */
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
                h-12
                w-12
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
        )}

        {/* =================================================
            SIMPLE IMAGE PLACEHOLDER
            -------------------------------------------------
            Only static background while image loads.
            No animation.
        ================================================= */}

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

        {/* TOP GRADIENT */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            z-10
            h-16
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
            <span
              className="
                inline-flex
                items-center
                rounded-full
                bg-black/60
                px-2
                py-1
                text-[10px]
                font-bold
                leading-none
                text-white
              "
            >
              {asString(year)}
            </span>
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
                bg-black/[0.04]
              "
            >
              <span
                className={`
                  ${getStatusColor()}
                  rounded-full
                  px-2.5
                  py-1.5
                  text-[10px]
                  font-bold
                  text-white
                  shadow-lg
                `}
              >
                {getStatusText()}
              </span>
            </div>
          )}

        {/* SHARE */}

        <button
          type="button"
          onClick={
            shareCar
          }
          aria-label="Share car"
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
            h-20
            bg-gradient-to-t
            from-black/35
            via-black/5
            to-transparent
          "
        />
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          flex
          min-h-0
          flex-1
          flex-col
          px-3
          pb-3
          pt-2
        "
      >
        {/* PRICE */}

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

          {transmission && (
            <IconText
              icon={
                <FaCogs
                  size={9}
                />
              }
              text={asString(
                transmission
              )}
            />
          )}
        </div>

        {/* VARIANT + MODEL */}

        <div
          className="
            mt-1
            truncate
            text-xs
            font-semibold
            text-black
          "
        >
          {variant
            ? `${asString(
                variant
              )}, `
            : ""}
          {asString(model)}
        </div>

        {/* FUEL / KM / OWNER */}

        <div
          className="
            mt-2
            flex
            min-w-0
            gap-2.5
            overflow-hidden
            text-gray-500
          "
        >
          {fuel && (
            <IconText
              icon={
                <FaGasPump
                  size={8}
                />
              }
              text={asString(
                fuel
              )}
            />
          )}

          {km !== "" &&
            km !== null &&
            km !== undefined && (
              <IconText
                icon={
                  <FaTachometerAlt
                    size={8}
                  />
                }
                text={`${asString(
                  km
                )} km`}
              />
            )}

          {owner && (
            <IconText
              icon={
                <FaUser
                  size={8}
                />
              }
              text={`${asString(
                owner
              )} Own`}
            />
          )}
        </div>

        {/* LOCATION */}

        {(district ||
          city) && (
          <div
            className="
              mt-2
              min-w-0
              truncate
            "
          >
            <IconText
              icon={
                <FaMapMarkerAlt
                  size={8}
                />
              }
              text={`${asString(
                district
              )}${
                district &&
                city
                  ? ", "
                  : ""
              }${asString(
                city
              )}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ICON TEXT
========================================================= */

const IconText = memo(
  function IconText({
    icon,
    text,
  }) {
    return (
      <div
        className="
          flex
          min-w-0
          shrink
          items-center
          gap-1
          text-gray-500
        "
      >
        <span
          className="
            shrink-0
          "
        >
          {icon}
        </span>

        <span
          className="
            min-w-0
            truncate
            text-[8px]
          "
        >
          {text}
        </span>
      </div>
    );
  }
);

/* =========================================================
   FINAL EXPORT
========================================================= */

export default memo(
  CarCard
);