import {
  FaMapMarkerAlt,
  FaTachometerAlt,
  FaUser,
  FaShareAlt,
} from "react-icons/fa";

/* ================= SAFE HELPERS ================= */

const asString = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    if (value.name) return value.name.toString();
  }

  return value.toString();
};

const formatPrice = (rawPrice) => {
  const num =
    parseInt(asString(rawPrice).replace(/[^0-9]/g, "")) || 0;

  return num.toLocaleString("en-IN");
};

/* ================= COMPONENT ================= */

export default function BikeCard({
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
  const normalizedStatus = asString(status).toLowerCase();

  /* ================= SHARE ================= */

  const shareBike = async (e) => {
    e.stopPropagation();

    const shareText = `
🏍️ ${asString(brandName)} ${asString(name)}

💰 Price: ₹${formatPrice(price)}
📅 Year: ${asString(year)}
📍 Location: ${asString(location)}
🛣️ KM: ${asString(km)} km
👤 Owner: ${asString(owner)}

👉 https://yourapp.com/bike/${bikeId}
`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Bike Details",
          text: shareText,
        });
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      console.log("Web Share not supported:", shareText);
    }
  };

  /* ================= STATUS ================= */

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

  /* ================= UI ================= */

  return (
    <div
      onClick={onTap}
      className="
        bg-white rounded-2xl
        shadow-sm hover:shadow-md
        transition cursor-pointer
        overflow-hidden
        my-1.5
      "
      style={{
        boxShadow: "0 3px 8px rgba(0,0,0,0.06)", // Flutter shadow
      }}
    >
      {/* ===== IMAGE ===== */}
      <div className="relative">

        {/* Aspect ratio identical to Flutter */}
        <div className="w-full aspect-[13/11] bg-gray-200">
          <img
            src={asString(imageUrl)}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* Year chip */}
        <div className="absolute top-2 left-2">
          <Chip text={year} />
        </div>

        {/* Status chip */}
        {normalizedStatus !== "available" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Chip
              text={statusText()}
              className={statusColor()}
            />
          </div>
        )}

        {/* Share button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={shareBike}
            className="
              w-7 h-7 rounded-full
              bg-black/60
              flex items-center justify-center
              text-white
              hover:bg-black/70 transition
            "
          >
            <FaShareAlt size={11} />
          </button>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="px-3 pt-1.5 pb-2">

        {/* Price + Location */}
        <div className="flex items-center">
          <div className="flex-1 text-xs font-bold truncate">
            ₹{formatPrice(price)}
          </div>

          <IconText
            icon={<FaMapMarkerAlt size={10} />}
            text={location}
            textSize="text-[8px]"
          />
        </div>

        {/* Name + KM */}
        <div className="flex items-center mt-0.5">
          <div className="flex-1 text-xs font-semibold truncate">
            {name}
          </div>

          <IconText
            icon={<FaTachometerAlt size={10} />}
            text={`${km} km`}
            textSize="text-[9px]"
          />
        </div>

        {/* Owner */}
        <div className="mt-0.5">
          <IconText
            icon={<FaUser size={11} />}
            text={owner}
            textSize="text-[10px]"
          />
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL HELPERS ================= */

function Chip({ text, className = "bg-black/60" }) {
  return (
    <span
      className={`
        ${className}
        px-2 py-1 rounded-full
        text-white text-[10px]
        font-bold leading-none
      `}
    >
      {text}
    </span>
  );
}

function IconText({ icon, text, textSize }) {
  return (
    <div className="flex items-center gap-1 text-gray-500 truncate">
      <span className="shrink-0">{icon}</span>
      <span className={`${textSize} truncate`}>
        {text}
      </span>
    </div>
  );
}