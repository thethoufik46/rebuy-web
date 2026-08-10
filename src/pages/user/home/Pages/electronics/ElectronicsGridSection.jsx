// src/pages/user/home/Pages/electronics/ElectronicsGridSection.jsx
import { useNavigate } from "react-router-dom";
import ElectronicsCard from "@/components/ElectronicsCard";

// ─── Helper: filter out drafts ─────────────────────────────
const isVisible = (item) => {
  const status = (item?.status || "").toString().toLowerCase();
  if (status === "draft") return false;
  if (status === "drift") return false;
  return true;
};

// ─── Skeleton Card ──────────────────────────────────────────
const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
      <div className="flex-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
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

  const displayedItems = loading ? [] : electronics.filter(isVisible).slice(0, 6);

  // ─── Loading state ──────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[0.72] xl:aspect-[0.78]">
              <SkeletonCard />
            </div>
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-3.5">
        {displayedItems.map((item) => {
          const id = item.electronicsId || item._id;
          return (
            <div
              key={id}
              className="cursor-pointer aspect-[0.72] xl:aspect-[0.78]"
              onClick={() => navigate(`/electronics/${id}`)}
            >
              <ElectronicsCard
                electronicsId={id}
                brand={item.brand}
                title={item.title}
                imageUrl={item.bannerImage || (item.galleryImages && item.galleryImages[0])}
                price={item.price}
                category={item.category}
                status={item.status}
                sellerInfo={item.sellerinfo} // not used but passed
                district={item.district}
                city={item.city}
                onTap={() => navigate(`/electronics/${id}`)}
              />
            </div>
          );
        })}
      </div>

    {showViewAllButton && (
        <div style={{ padding: "14px 0" }}>
          <button
            onClick={onViewAll}
            style={{
              height: "42px",
              background: "rgba(255,255,255,0.45)",
              borderRadius: "18px",
              padding: "0 25px",
              width: "100%",
            }}
            className="flex items-center justify-between"
          >
            <span className="text-xs font-semibold text-black">  View All Electronics</span>
            <div
              style={{
                width: 28,
                height: 28,
                background: "rgba(255,255,255,0.6)",
                borderRadius: "50%",
              }}
              className="flex items-center justify-center"
            >
              <span className="text-sm">→</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}