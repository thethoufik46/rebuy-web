// src/components/ElectronicsCard.jsx
import { FaMapMarkerAlt, FaShareAlt } from "react-icons/fa";

export default function ElectronicsCard({
  electronicsId,
  brand,
  title,
  imageUrl,
  price,
  category,
  status,
  sellerInfo,   // kept if needed, but not shown
  district,
  city,
  onTap,
}) {
  // ─── Helpers ──────────────────────────────────────────────
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
    return num.toLocaleString("en-IN");
  };

  const normalizedStatus = asString(status).toLowerCase();

  // ─── Share ────────────────────────────────────────────────
  const shareItem = async (e) => {
    e.stopPropagation();
    const shareText = `
📱 ${asString(title)}

💰 ₹${formattedPrice()}
📍 ${asString(district)}, ${asString(city)}
👉 https://yourapp.com/electronics/${electronicsId}
`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Electronics Details", text: shareText });
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

  return (
    <div
      onClick={onTap}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer mx-0 my-1.5 flex flex-col overflow-hidden"
      style={{ boxShadow: "0 3px 8px rgba(0,0,0,0.06)" }}
    >
      {/* ===== IMAGE SECTION ===== */}
      <div className="relative w-full">
        <div className="w-full aspect-[12/10] bg-gray-200">
          <img
            src={asString(imageUrl)}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* Top‑left chip – category */}
        <div className="absolute top-2 left-2">
          <Chip text={asString(category)} className="bg-black/60" />
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
            onClick={shareItem}
            className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/70 transition"
            aria-label="Share"
          >
            <FaShareAlt size={12} />
          </button>
        </div>
      </div>

      {/* ===== CONTENT (matches Flutter padding) ===== */}
      <div className="px-3 pt-1.5 pb-2.5 flex-1 flex flex-col">
        {/* Price + Brand row */}
        <div className="flex items-center">
          <div className="flex-1 text-xs font-bold truncate">
            ₹{formattedPrice()}
          </div>
          <span className="text-[9px] text-gray-500 truncate max-w-[50%]">
            {asString(brand)}
          </span>
        </div>

        {/* Title – 12px bold */}
        <div className="text-xs font-semibold truncate mt-0.5">
          {asString(title)}
        </div>

        {/* Location – with icon */}
        <div className="mt-1.5 truncate">
          <div className="flex items-center gap-1 text-gray-500 truncate">
            <FaMapMarkerAlt size={9} className="shrink-0" />
            <span className="text-[9px] truncate">
              {asString(district)}, {asString(city)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper Component ──────────────────────────────────────
function Chip({ text, className = "bg-black/60" }) {
  return (
    <span
      className={`${className} px-2 py-1 rounded-full text-white text-[10px] font-bold leading-none`}
    >
      {text}
    </span>
  );
}