// src/components/CarCard.jsx

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

const formatPrice = (value) => {
  const raw = asString(value);

  const number =
    parseInt(
      raw.replace(/[^0-9]/g, ""),
      10
    ) || 0;

  return number.toLocaleString("en-IN");
};

/* =========================================================
   COMPONENT
========================================================= */

export default function CarCard({
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
  const normalizedStatus =
    asString(status).toLowerCase();

  const image =
    getImageUrl(imageUrl);

  /* =======================================================
     STATUS
  ======================================================= */

  const getStatusColor = () => {
    if (
      normalizedStatus === "sold"
    ) {
      return "bg-red-500";
    }

    if (
      normalizedStatus === "booking"
    ) {
      return "bg-blue-500";
    }

    return "bg-gray-500";
  };

  const getStatusText = () => {
    if (
      normalizedStatus === "sold"
    ) {
      return "SOLD";
    }

    if (
      normalizedStatus === "booking"
    ) {
      return "BOOKING";
    }

    return normalizedStatus
      ? normalizedStatus.toUpperCase()
      : "";
  };

  /* =======================================================
     SHARE
  ======================================================= */

  const shareCar = async (event) => {
    event.stopPropagation();

    const id =
      asString(carId);

    const shareUrl =
      `${window.location.origin}/car/${id}`;

    const shareText = `
🚗 ${asString(brandName)} ${asString(variant)} ${asString(model)}

💰 Price: ₹${formatPrice(price)}
⛽ Fuel: ${asString(fuel)}
⚙️ Transmission: ${asString(transmission)}
📍 Location: ${asString(district)}, ${asString(city)}
🛣️ KM: ${asString(km)} km
👤 Owner: ${asString(owner)}

👉 ${shareUrl}
`;

    if (
      navigator.share
    ) {
      try {
        await navigator.share({
          title:
            `${asString(brandName)} ${asString(model)}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log(
          "Share cancelled",
          error
        );
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
    } catch (error) {
      console.log(
        "Share not supported",
        error
      );
    }
  };

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
          event.key === "Enter" ||
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
        rounded-2xl
        bg-white
        transition-all
        duration-200
        hover:-translate-y-[1px]
        hover:shadow-md
        active:scale-[0.985]
      "
      style={{
        boxShadow:
          "0 3px 8px rgba(0,0,0,0.06)",
      }}
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
          bg-[#f1f2f4]
        "
      >

        {image ? (
          <img
            src={image}
            alt={`${asString(
              brandName
            )} ${asString(
              model
            )}`}
            className="
              block
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.03]
            "
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror =
                null;

              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <ImagePlaceholder />
        )}

        {/* =================================================
            YEAR
        ================================================= */}

        {year && (
          <div
            className="
              absolute
              left-2
              top-2
              z-10
            "
          >
            <Chip
              text={asString(year)}
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
                bg-black/[0.04]
              "
            >
              <Chip
                text={getStatusText()}
                className={getStatusColor()}
              />
            </div>
          )}

        {/* =================================================
            SHARE
        ================================================= */}

        <button
          type="button"
          onClick={shareCar}
          className="
            absolute
            right-2
            top-2
            z-30
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-black/60
            text-white
            transition
            hover:bg-black/75
            active:scale-90
          "
          aria-label="Share car"
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
          min-h-0
          flex-1
          flex-col
          px-3
          pb-2.5
          pt-1
        "
      >

        {/* PRICE + TRANSMISSION */}

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
              text-xs
              font-bold
              text-black
            "
          >
            ₹{formatPrice(price)}
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
              textSize="text-[8px]"
            />
          )}
        </div>

        {/* VARIANT + MODEL */}

        <div
          className="
            mt-0.5
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
            mt-1.5
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
              textSize="text-[8px]"
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
                textSize="text-[8px]"
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
              textSize="text-[8px]"
            />
          )}
        </div>

        {/* LOCATION */}

        {(district ||
          city) && (
          <div
            className="
              mt-1.5
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
                district && city
                  ? ", "
                  : ""
              }${asString(city)}`}
              textSize="text-[8px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   CHIP
========================================================= */

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
      {text}
    </span>
  );
}

/* =========================================================
   ICON TEXT
========================================================= */

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
        {text}
      </span>
    </div>
  );
}

/* =========================================================
   IMAGE PLACEHOLDER
========================================================= */

function ImagePlaceholder() {
  return (
    <div
      className="
        flex
        h-full
        w-full
        items-center
        justify-center
        bg-[#f1f2f4]
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#d5d8dc"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 17h14" />

        <path d="M6 17V9l2-3h8l2 3v8" />

        <circle
          cx="8"
          cy="17"
          r="1.5"
        />

        <circle
          cx="16"
          cy="17"
          r="1.5"
        />
      </svg>
    </div>
  );
}