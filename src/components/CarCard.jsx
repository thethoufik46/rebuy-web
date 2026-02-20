import { FaGasPump, FaTachometerAlt, FaUser, FaCogs, FaMapMarkerAlt, FaShareAlt } from "react-icons/fa";

export default function CarCard({
  carId,
  brandName,
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
  // === SAFE STRING CONVERTER (matches Flutter's _asString) ===
  const asString = (value) => {
    if (!value) return "";
    if (typeof value === "object") {
      if (value.name) return value.name.toString();
      if (Array.isArray(value)) return value[0]?.toString() || "";
    }
    return value.toString();
  };

  // === PRICE FORMATTER (Indian numbering) ===
  const formattedPrice = () => {
    const raw = asString(price);
    const num = parseInt(raw.replace(/[^0-9]/g, "")) || 0;
    return num.toLocaleString("en-IN");
  };

  const normalizedStatus = asString(status).toLowerCase();

  // === SHARE (Web Share API fallback) ===
  const shareCar = async (e) => {
    e.stopPropagation();
    const shareText = `
🚗 ${asString(brandName)} ${asString(variant)} ${asString(model)}

💰 Price: ₹${formattedPrice()}
⛽ Fuel: ${asString(fuel)}
⚙️ Transmission: ${asString(transmission)}
📍 Location: ${asString(district)}, ${asString(city)}
🛣️ KM: ${asString(km)} km
👤 Owner: ${asString(owner)}

👉 https://yourapp.com/car/${carId}
`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Car Details", text: shareText });
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      console.log("Web Share not supported, text:", shareText);
    }
  };

  // === STATUS COLOR & TEXT ===
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
      style={{ boxShadow: "0 3px 8px rgba(0,0,0,0.06)" }} // exact Flutter shadow
    >
      {/* ===== IMAGE SECTION (AspectRatio as in Flutter) ===== */}
      <div className="relative w-full">
        {/* Aspect ratio 13/11 (mobile), full width – matches Flutter */}
        <div className="w-full aspect-[13/11] bg-gray-200">
          <img
            src={asString(imageUrl)}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* Year chip – top left */}
        <div className="absolute top-2 left-2">
          <Chip text={asString(year)} className="bg-black/60" />
        </div>

        {/* Status chip – centered (only if not available) */}
        {normalizedStatus !== "available" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Chip text={statusText()} className={statusColor()} />
          </div>
        )}

        {/* Share button – top right */}
        <div className="absolute top-2 right-2">
          <button
            onClick={shareCar}
            className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/70 transition"
            aria-label="Share"
          >
            <FaShareAlt size={12} />
          </button>
        </div>
      </div>

      {/* ===== CONTENT SECTION – padding exactly as Flutter (12,2,12,10) ===== */}
      <div className="px-3 pt-0.5 pb-2.5 flex-1 flex flex-col">
        {/* Price + Transmission row */}
        <div className="flex items-center">
          <div className="flex-1 text-xs font-bold truncate">
            ₹{formattedPrice()}
          </div>
          <IconText
            icon={<FaCogs size={10} />}
            text={asString(transmission)}
            textSize="text-[9px]"
          />
        </div>

        {/* Variant + Model – single line, 12px semibold */}
        <div className="text-xs font-semibold truncate mt-0.5">
          {asString(variant)}, {asString(model)}
        </div>

        {/* Fuel / KM / Owner row – 8px text, 9px icons */}
        <div className="flex gap-3 mt-1.5 text-gray-500">
          <IconText
            icon={<FaGasPump size={9} />}
            text={asString(fuel)}
            textSize="text-[8px]"
          />
          <IconText
            icon={<FaTachometerAlt size={9} />}
            text={`${asString(km)} km`}
            textSize="text-[8px]"
          />
          <IconText
            icon={<FaUser size={9} />}
            text={`${asString(owner)} Own`}
            textSize="text-[8px]"
          />
        </div>

        {/* Location – single line, same styling */}
        <div className="mt-1.5 truncate">
          <IconText
            icon={<FaMapMarkerAlt size={9} />}
            text={`${asString(district)}, ${asString(city)}`}
            textSize="text-[8px]"
          />
        </div>
      </div>
    </div>
  );
}

// ===== HELPER COMPONENTS (exact Flutter styling) =====

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