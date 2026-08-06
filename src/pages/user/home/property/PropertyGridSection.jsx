// src/pages/user/home/property/PropertyGridSection.jsx
import { useNavigate } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard"; // ✅ imported external component

// ─── Skeleton Card (Shimmer) ──────────────────────────────
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

// ─── Main Component ─────────────────────────────────────────
export default function PropertyGridSection({
  properties = [],
  showViewAllButton = false,
  onViewAll,
  loading = false,
}) {
  const navigate = useNavigate();

  const visibleProperties = properties.slice(0, 6);

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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-3.5">
        {visibleProperties.map((property) => {
          const id = property._id;
          return (
            <div
              key={id}
              className="cursor-pointer aspect-[0.72] xl:aspect-[0.78]"
              onClick={() => navigate(`/property/${id}`)}
            >
              {/* ✅ Use external PropertyCard with exact props */}
              <PropertyCard
                propertyId={id}
                mainType={property.mainType}
                category={property.category}
                price={property.price}
                imageUrl={property.bannerImage}
                status={property.status}
                district={property.district}
                city={property.city}
                bedrooms={property.bedrooms}
                landArea={property.landArea}
                direction={property.direction}
                onTap={() => navigate(`/property/${id}`)}
              />
            </div>
          );
        })}
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