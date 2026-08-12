// src/components/ElectronicsCard.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaShareAlt } from "react-icons/fa";

export default function ElectronicsCard({
  loading = false,
  electronicsId,
  brand,
  title,
  imageUrl,
  price,
  category,
  status,
  sellerInfo,
  district,
  city,
  onTap,
}) {
  if (loading) {
    return <ElectronicsCardSkeleton />;
  }

  const asString = (value) => {
    if (value === null || value === undefined || value === "") return "";

    if (typeof value === "object") {
      if (value.name) return value.name.toString();
      if (value.$oid) return value.$oid.toString();
      if (Array.isArray(value)) return value[0]?.toString() || "";
    }

    return value.toString();
  };

  const formattedPrice = () => {
    const raw = asString(price);
    const num = parseInt(raw.replace(/[^0-9]/g, ""), 10) || 0;
    return num.toLocaleString("en-IN");
  };

  const normalizedStatus = asString(status).toLowerCase();

  const shareItem = async (e) => {
    e.stopPropagation();

    const shareUrl =
      `${window.location.origin}/electronics/${encodeURIComponent(asString(electronicsId))}`;

    const shareText = `
📱 ${asString(title)}

💰 ₹${formattedPrice()}
📍 ${asString(district)}, ${asString(city)}

👉 ${shareUrl}
`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Electronics Details",
          text: shareText,
          url: shareUrl,
        });
      } catch (_) {}
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
      } catch (_) {
        console.log("Share not supported, text:", shareText);
      }
    }
  };

  const statusColor = () => {
    if (normalizedStatus === "sold") return "bg-red-500";
    if (normalizedStatus === "booking") return "bg-blue-500";
    return "bg-gray-500";
  };

  const statusText = () => {
    if (normalizedStatus === "sold") return "SOLD";
    if (normalizedStatus === "booking") return "BOOKING";
    return normalizedStatus.toUpperCase();
  };

  return (
    <motion.div
      onClick={onTap}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      className="
        group relative mx-0 my-1.5 flex cursor-pointer
        flex-col overflow-hidden rounded-[22px] border
        border-white/70 bg-white shadow-[0_5px_18px_rgba(15,23,42,0.07)]
        transition-all duration-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.12)]
      "
    >
      <ElectronicsImage
        imageUrl={asString(imageUrl)}
        category={category}
        status={normalizedStatus}
        statusText={statusText()}
        statusColor={statusColor()}
        onShare={shareItem}
      />

      <div className="flex flex-1 flex-col px-3 pt-2 pb-3">
        <div className="flex min-w-0 items-center">
          <div className="flex-1 truncate text-sm font-extrabold tracking-tight">
            ₹{formattedPrice()}
          </div>

          <span className="max-w-[50%] truncate text-[9px] text-gray-500">
            {asString(brand)}
          </span>
        </div>

        <div className="mt-0.5 truncate text-xs font-semibold">
          {asString(title)}
        </div>

        <div className="mt-1.5 flex min-w-0 items-center gap-1 truncate text-gray-500">
          <FaMapMarkerAlt size={9} className="shrink-0" />
          <span className="truncate text-[9px]">
            {asString(district)}, {asString(city)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ElectronicsImage({
  imageUrl,
  category,
  status,
  statusText,
  statusColor,
  onShare,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full">
      <div className="relative aspect-[12/10] w-full overflow-hidden bg-slate-100">
        {!loaded && !error && imageUrl && <ImageSkeleton />}

        {!error && imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className={`
              h-full w-full object-cover transition-all duration-700
              ${loaded ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}
              group-hover:scale-[1.04]
            `}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        ) : (
          <ImageFallback />
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="absolute left-2.5 top-2.5 z-20">
        <Chip text={category} />
      </div>

      {status && status !== "available" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <Chip text={statusText} className={`${statusColor} shadow-lg`} />
        </div>
      )}

      <button
        type="button"
        onClick={onShare}
        aria-label="Share"
        className="
          absolute right-2.5 top-2.5 z-30 flex h-8 w-8
          items-center justify-center rounded-full border border-white/30
          bg-black/55 text-white shadow-lg backdrop-blur-md
          transition hover:bg-black/70 active:scale-90
        "
      >
        <FaShareAlt size={11} />
      </button>
    </div>
  );
}

function ElectronicsCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97, filter: "blur(3px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="
        relative mx-0 my-1.5 flex w-full flex-col overflow-hidden
        rounded-[22px] border border-white/70 bg-white
        shadow-[0_5px_18px_rgba(15,23,42,0.06)]
      "
    >
      <div className="relative aspect-[12/10] overflow-hidden bg-gradient-to-br from-slate-100 via-slate-200/70 to-slate-100">
        <PageShimmer />

        <motion.div
          animate={{ opacity: [0.2, 0.42, 0.2], scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-16 w-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/45 blur-xl"
        />

        <SkeletonLine className="absolute left-2.5 top-2.5 z-20 h-5 w-16 rounded-full" />
        <SkeletonLine className="absolute right-2.5 top-2.5 z-20 h-8 w-8 rounded-full" />
      </div>

      <div className="space-y-2.5 px-3 pb-3 pt-3">
        <div className="flex items-center justify-between gap-3">
          <SkeletonLine className="h-4 w-24 rounded-full" />
          <SkeletonLine className="h-2.5 w-14 rounded-full" />
        </div>

        <SkeletonLine className="h-3 w-[76%] rounded-full" />
        <SkeletonLine className="h-2.5 w-[66%] rounded-full" />
      </div>
    </motion.div>
  );
}

function PageShimmer() {
  return (
    <motion.div
      initial={{ x: "-140%", opacity: 0 }}
      animate={{ x: "180%", opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
      className="
        pointer-events-none absolute inset-y-0 left-0 z-20
        w-1/2 -skew-x-12 bg-gradient-to-r
        from-transparent via-white/80 to-transparent blur-lg
      "
    />
  );
}

function ImageSkeleton() {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden bg-gradient-to-br from-slate-100 via-slate-200/70 to-slate-100">
      <PageShimmer />
    </div>
  );
}

function ImageFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/60 text-xl font-black text-black/15 shadow-sm backdrop-blur-xl">
        R
      </div>
    </div>
  );
}

function SkeletonLine({ className = "" }) {
  return (
    <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
      <PageShimmer />
    </div>
  );
}

function Chip({ text, className = "bg-black/60" }) {
  return (
    <span
      className={`${className} inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold leading-none text-white`}
    >
      {typeof text === "object" ? text?.name || "" : text}
    </span>
  );
}