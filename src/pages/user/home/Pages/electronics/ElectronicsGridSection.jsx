// src/pages/user/home/Pages/electronics/ElectronicsGridSection.jsx
import { useNavigate } from "react-router-dom";

// ─── Skeleton Card ──────────────────────────────────────────
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

// ─── Electronics Card ───────────────────────────────────────
const ElectronicsCard = ({ item, onClick }) => {
  const {
    electronicsId,
    brand,
    title,
    price,
    category,
    status,
    sellerinfo,
    district,
    city,
    bannerImage,
    galleryImages,
  } = item;

  const imageUrl = bannerImage || (galleryImages && galleryImages[0]) || "";
  const brandName = typeof brand === "object" ? brand.name : brand || "Unknown";
  const location = city ? `${city}, ${district}` : district || "";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative h-32 bg-slate-200">
        {imageUrl ? (
          <img src={imageUrl} alt={title || "Electronics"} className="w-full h-full object-cover" />
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
          <span className="text-xs text-slate-500">{category || ""}</span>
        </div>
        <p className="text-xs text-slate-700 truncate font-medium">{brandName}</p>
        <p className="text-xs text-slate-500 truncate">{title || "Electronics"}</p>
        {location && <p className="text-xs text-slate-400 truncate">{location}</p>}
        {sellerinfo && (
          <p className="text-xs text-slate-400 truncate">Seller: {sellerinfo}</p>
        )}
      </div>
    </div>
  );
};

// ─── Main Grid ──────────────────────────────────────────────
export default function ElectronicsGridSection({
  electronics = [],
  showViewAllButton = false,
  onViewAll,
  loading = false,
}) {
  const navigate = useNavigate();

  // Show first 6 items when not loading
  const displayedItems = loading ? [] : electronics.slice(0, 6);

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
            View All Electronics
          </button>
        )}
      </div>
    );
  }

  // ─── Empty state ────────────────────────────────────────
  if (displayedItems.length === 0) {
    return null;
  }

  // ─── Render cards ──────────────────────────────────────
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {displayedItems.map((item) => (
          <ElectronicsCard
            key={item.electronicsId || item._id}
            item={item}
            onClick={() => navigate(`/electronics/${item.electronicsId || item._id}`)}
          />
        ))}
      </div>

      {showViewAllButton && (
        <button
          onClick={onViewAll}
          className="w-full py-2 text-sm text-purple-600 font-medium border border-purple-200 rounded-xl hover:bg-purple-50"
        >
          View All Electronics
        </button>
      )}
    </div>
  );
}