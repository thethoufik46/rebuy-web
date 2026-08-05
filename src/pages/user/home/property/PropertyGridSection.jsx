// src/pages/user/home/property/PropertyGridSection.jsx
import { useNavigate } from "react-router-dom";

// ─── Skeleton Card (Shimmer) ──────────────────────────────
const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
};

// ─── Property Card ──────────────────────────────────────────
const PropertyCard = ({ property, onClick }) => {
  const {
    _id,
    bannerImage,
    price,
    mainType,
    category,
    district,
    city,
    bedrooms,
    landArea,
    direction,
    status,
  } = property;

  const location = city ? `${city}, ${district}` : district || "Location";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative h-32 bg-slate-200">
        {bannerImage ? (
          <img
            src={bannerImage}
            alt={mainType || "Property"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 text-sm">
            No Image
          </div>
        )}
        {status && status !== "available" && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {status}
          </div>
        )}
      </div>
      <div className="p-3 space-y-1">
        <div className="flex justify-between items-start">
          <p className="text-sm font-semibold truncate">
            ₹{price?.toLocaleString() || "N/A"}
          </p>
          <span className="text-xs text-slate-500">{mainType || ""}</span>
        </div>
        <p className="text-xs text-slate-600 truncate">
          {category || "Property"} • {location}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {bedrooms && <span>🛏 {bedrooms}</span>}
          {landArea && <span>📐 {landArea}</span>}
          {direction && <span>🧭 {direction}</span>}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────
export default function PropertyGridSection({
  properties = [],
  showViewAllButton = false,
  onViewAll,
  loading = false,
}) {
  const navigate = useNavigate();

  // Show first 6 properties (matching Flutter's 2 columns × 3 rows)
  const visibleProperties = properties.slice(0, 6);

  // ─── Loading state ──────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        {showViewAllButton && (
          <button
            onClick={onViewAll}
            className="w-full py-2 text-sm text-purple-600 font-medium border border-purple-200 rounded-xl hover:bg-purple-50"
          >
            View All Properties (வீடு & நிலம்)
          </button>
        )}
      </div>
    );
  }

  // ─── Empty state ────────────────────────────────────────
  if (visibleProperties.length === 0) {
    return null;
  }

  // ─── Render cards ──────────────────────────────────────
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {visibleProperties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            onClick={() => navigate(`/property/${property._id}`)}
          />
        ))}
      </div>

      {showViewAllButton && (
        <button
          onClick={onViewAll}
          className="w-full py-2 text-sm text-purple-600 font-medium border border-purple-200 rounded-xl hover:bg-purple-50"
        >
          View All Properties (வீடு & நிலம்)
        </button>
      )}
    </div>
  );
}