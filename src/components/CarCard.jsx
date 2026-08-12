// src/components/CarCard.jsx

import React, {
  useState,
} from "react";

import {
  FaGasPump,
  FaTachometerAlt,
  FaUser,
  FaCogs,
  FaMapMarkerAlt,
  FaShareAlt,
} from "react-icons/fa";

import { motion } from "framer-motion";


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
  const raw =
    asString(value);

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
   COMPONENT
========================================================= */

export default function CarCard({
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


  /* =======================================================
     IMAGE STATE
  ======================================================= */

  const [
    imageLoaded,
    setImageLoaded,
  ] = useState(false);

  const [
    imageError,
    setImageError,
  ] = useState(false);


  /* =======================================================
     LOADING
     -------------------------------------------------------
     YouTube / Amazon style skeleton
  ======================================================= */

  if (loading) {
    return (
      <CarCardSkeleton />
    );
  }


  /* =======================================================
     STATUS
  ======================================================= */

  const normalizedStatus =
    asString(status).toLowerCase();


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
     SHARE
  ======================================================= */

  const shareCar = async (
    event
  ) => {

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
            `${asString(
              brandName
            )} ${asString(
              model
            )}`,

          text:
            shareText,

          url:
            shareUrl,
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
    <motion.div
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

      whileHover={{
        y: -2,
      }}

      whileTap={{
        scale: 0.985,
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
        transition-all
        duration-300

        hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)]
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

        {/* =================================================
            IMAGE SKELETON
        ================================================= */}

        {!imageLoaded &&
          !imageError &&
          image && (
            <PremiumImageSkeleton />
          )}


        {/* =================================================
            IMAGE
        ================================================= */}

        {image &&
        !imageError ? (

          <img
            src={image}
            alt={`${asString(
              brandName
            )} ${asString(
              model
            )}`}

            className={`
              block
              h-full
              w-full
              object-cover
              transition-all
              duration-700

              ${
                imageLoaded
                  ? "scale-100 opacity-100"
                  : "scale-[1.04] opacity-0"
              }

              group-hover:scale-[1.04]
            `}

            loading="lazy"

            onLoad={() =>
              setImageLoaded(
                true
              )
            }

            onError={(event) => {

              event.currentTarget.onerror =
                null;

              setImageError(
                true
              );
            }}
          />

        ) : (
          <PremiumImageFallback />
        )}


        {/* =================================================
            IMAGE TOP GLASS
        ================================================= */}

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


        {/* =================================================
            YEAR
        ================================================= */}

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
              text={asString(year)}
              className="
                bg-black/60
                backdrop-blur-md
              "
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
                text={
                  getStatusText()
                }
                className={`
                  ${getStatusColor()}
                  shadow-lg
                `}
              />

            </div>
          )}


        {/* =================================================
            SHARE
        ================================================= */}

        <button
          type="button"
          onClick={
            shareCar
          }

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
            transition
            hover:bg-black/70
            active:scale-90
          "

          aria-label="Share car"
        >

          <FaShareAlt
            size={11}
          />

        </button>


        {/* =================================================
            BOTTOM GRADIENT
        ================================================= */}

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

        {/* =================================================
            PRICE + TRANSMISSION
        ================================================= */}

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
              textSize="text-[8px]"
            />
          )}

        </div>


        {/* =================================================
            VARIANT + MODEL
        ================================================= */}

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


        {/* =================================================
            FUEL / KM / OWNER
        ================================================= */}

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


        {/* =================================================
            LOCATION
        ================================================= */}

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

              textSize="text-[8px]"
            />

          </div>
        )}

      </div>

    </motion.div>
  );
}


/* =========================================================
   PREMIUM CARD SKELETON
   ---------------------------------------------------------
   YouTube / Amazon inspired
   ========================================================= */

function CarCardSkeleton() {

  return (
    <div
      className="
        relative
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

      {/* =================================================
          IMAGE SKELETON
      ================================================= */}

      <div
        className="
          relative
          aspect-[13/11]
          w-full
          overflow-hidden
          bg-slate-100
        "
      >

        <motion.div
          animate={{
            x: [
              "-120%",
              "180%",
            ],
          }}

          transition={{
            duration: 1.45,
            repeat: Infinity,
            ease: "easeInOut",
          }}

          className="
            absolute
            inset-y-0
            -left-1/2
            z-10
            w-1/2
            rotate-12
            bg-gradient-to-r
            from-transparent
            via-white/70
            to-transparent
            blur-lg
          "
        />


        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-slate-100
            via-slate-200/70
            to-slate-100
          "
        />


        {/* Fake image light */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-16
            w-20
            -translate-x-1/2
            -translate-y-1/2
            rounded-2xl
            bg-white/35
            blur-xl
          "
        />


        {/* Year skeleton */}

        <SkeletonLine
          className="
            absolute
            left-2.5
            top-2.5
            z-20
            h-5
            w-12
            rounded-full
          "
        />


        {/* Share skeleton */}

        <SkeletonCircle
          className="
            absolute
            right-2.5
            top-2.5
            z-20
            h-8
            w-8
          "
        />

      </div>


      {/* =================================================
          CONTENT SKELETON
      ================================================= */}

      <div
        className="
          space-y-2.5
          px-3
          pb-3
          pt-3
        "
      >

        {/* Price */}

        <SkeletonLine
          className="
            h-4
            w-24
          "
        />


        {/* Model */}

        <SkeletonLine
          className="
            h-3
            w-32
          "
        />


        {/* Details */}

        <div
          className="
            flex
            gap-2
          "
        >

          <SkeletonLine
            className="
              h-2.5
              w-12
            "
          />

          <SkeletonLine
            className="
              h-2.5
              w-14
            "
          />

          <SkeletonLine
            className="
              h-2.5
              w-12
            "
          />

        </div>


        {/* Location */}

        <SkeletonLine
          className="
            h-2.5
            w-28
          "
        />

      </div>

    </div>
  );
}


/* =========================================================
   SKELETON LINE
========================================================= */

function SkeletonLine({
  className = "",
}) {

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-full
        bg-slate-200
        ${className}
      `}
    >

      <motion.div
        animate={{
          x: [
            "-120%",
            "180%",
          ],
        }}

        transition={{
          duration: 1.25,
          repeat: Infinity,
          ease: "easeInOut",
        }}

        className="
          absolute
          inset-y-0
          -left-1/2
          w-1/2
          rotate-12
          bg-gradient-to-r
          from-transparent
          via-white/80
          to-transparent
          blur-[2px]
        "
      />

    </div>
  );
}


/* =========================================================
   SKELETON CIRCLE
========================================================= */

function SkeletonCircle({
  className = "",
}) {

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-full
        bg-slate-200
        ${className}
      `}
    >

      <motion.div
        animate={{
          x: [
            "-120%",
            "180%",
          ],
        }}

        transition={{
          duration: 1.25,
          repeat: Infinity,
          ease: "easeInOut",
        }}

        className="
          absolute
          inset-y-0
          -left-1/2
          w-1/2
          rotate-12
          bg-gradient-to-r
          from-transparent
          via-white/80
          to-transparent
        "
      />

    </div>
  );
}


/* =========================================================
   PREMIUM IMAGE SKELETON
========================================================= */

function PremiumImageSkeleton() {

  return (
    <div
      className="
        absolute
        inset-0
        z-10
        overflow-hidden
        bg-gradient-to-br
        from-slate-100
        via-slate-200/70
        to-slate-100
      "
    >

      <motion.div
        animate={{
          x: [
            "-120%",
            "180%",
          ],
        }}

        transition={{
          duration: 1.35,
          repeat: Infinity,
          ease: "easeInOut",
        }}

        className="
          absolute
          inset-y-0
          -left-1/2
          w-1/2
          rotate-12
          bg-gradient-to-r
          from-transparent
          via-white/75
          to-transparent
          blur-lg
        "
      />

    </div>
  );
}


/* =========================================================
   PREMIUM IMAGE FALLBACK
========================================================= */

function PremiumImageFallback() {

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
          bg-white/60
          text-xl
          font-black
          text-black/15
          shadow-sm
          backdrop-blur-xl
        "
      >
        R
      </div>

    </div>
  );
}


/* =========================================================
   CHIP
========================================================= */

function Chip({
  text,
  className =
    "bg-black/60",
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
  textSize =
    "text-[8px]",
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