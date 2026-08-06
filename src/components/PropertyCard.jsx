import { FaBed, FaRulerCombined, FaFilter, FaMapMarkerAlt, FaShareAlt } from "react-icons/fa";

export default function PropertyCard({
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
  // ─── Helpers (same as Flutter) ──────────────────────────
  const asString = (value) => {
    if (!value) return "";
    if (typeof value === "object") {
      if (value.name) return value.name.toString();
      if (Array.isArray(value)) return value[0]?.toString() || "";
    }
    return value.toString();
  };

  const formattedPrice = () => {
    const raw = asString(price);
    const num = parseInt(raw.replace(/[^0-9]/g, "")) || 0;
    return num === 0 ? "Price on Request" : `₹${num.toLocaleString("en-IN")}`;
  };

  const normalizedStatus = asString(status).toLowerCase();

  // ─── Share (exact Flutter behaviour) ─────────────────────
  const shareProperty = async (e) => {
    e.stopPropagation();
    const shareText = `
🏠 ${asString(category)}

💰 ${formattedPrice()}
📍 ${asString(district)}, ${asString(city)}
👉 https://yourapp.com/property/${propertyId}
`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Property Details", text: shareText });
      } catch (_) {}
    } else {
      console.log("Share not supported, text:", shareText);
    }
  };

  // ─── Status chip helpers ─────────────────────────────────
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

  // ─── Right‑side text (bedrooms or land area) ─────────────
  const rightText = () => {
    const b = asString(bedrooms);
    if (b) return `${b} BHK`; // Flutter shows just bedrooms number, but we can add BHK
    const l = asString(landArea);
    if (l) return `${l} sq ft`;
    return "";
  };

  return (
    <div
      onClick={onTap}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer mx-0 my-1.5 flex flex-col overflow-hidden"
      style={{ boxShadow: "0 3px 8px rgba(0,0,0,0.06)" }}
    >
      {/* ===== IMAGE SECTION ===== */}
      <div className="relative w-full">
        {/* Aspect ratio: mobile 12/10, desktop (lg+) 4/3 – matches Flutter */}
        <div className="w-full aspect-[12/10] lg:aspect-[4/3] bg-gray-200">
          <img
            src={asString(imageUrl)}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* Top‑left chip – mainType */}
        <div className="absolute top-2 left-2">
          <Chip text={asString(mainType)} className="bg-black/60" />
        </div>

        {/* Centered status chip – only if not available */}
        {normalizedStatus !== "available" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Chip text={statusText()} className={statusColor()} />
          </div>
        )}

        {/* Top‑right share button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={shareProperty}
            className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/70 transition"
            aria-label="Share"
          >
            <FaShareAlt size={12} />
          </button>
        </div>
      </div>

      {/* ===== CONTENT (exact Flutter padding) ===== */}
      <div className="px-3 pt-0.5 pb-2.5 flex-1 flex flex-col">
        {/* Price row with right text (bedrooms or land area) */}
        <div className="flex items-center">
          <div className="flex-1 text-xs font-bold truncate">
            {formattedPrice()}
          </div>
          {rightText() && (
            <span className="text-[9px] text-gray-500 font-medium">
              {rightText()}
            </span>
          )}
        </div>

        {/* Category – 12px bold */}
        <div className="text-xs font-semibold truncate mt-0.5">
          {asString(category)}
        </div>

        {/* Direction (if present) – with filter icon */}
        {asString(direction) && (
          <div className="mt-1.5">
            <IconText
              icon={<FaFilter size={9} />}
              text={asString(direction)}
              textSize="text-[8px]"
            />
          </div>
        )}

        {/* Location – exact same row as Flutter */}
        <div className="mt-1.5 truncate">
          <div className="flex items-center gap-1 text-gray-500 truncate">
            <FaMapMarkerAlt size={9} className="shrink-0" />
            <span className="text-[8px] truncate">
              <span className="text-gray-700">{asString(district)}</span>
              <span className="text-gray-400">, </span>
              <span className="text-gray-500">{asString(city)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper Components (unchanged) ─────────────────────────

function Chip({ text, className = "bg-black/60" }) {
  return (
    <span
      className={`${className} px-2 py-1 rounded-full text-white text-[10px] font-bold leading-none`}
    >
      {text}
    </span>
  );
}

function IconText({ icon, text, textSize = "text-[8px]" }) {
  return (
    <div className="flex items-center gap-1 text-gray-500 truncate">
      <span className="shrink-0">{icon}</span>
      <span className={`${textSize} truncate`}>{text}</span>
    </div>
  );
}