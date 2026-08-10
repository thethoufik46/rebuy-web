// src/pages/Wishlist/WishlistPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { getWishlist, toggleWishlist } from "@/services/wishlistApi";
import AppBar from "@/components/AppBar"; // ✅ import

import CarCard from "@/components/CarCard";
import BikeCard from "@/components/BikeCard";
import PropertyCard from "@/components/PropertyCard";
import ElectronicsCard from "@/components/ElectronicsCard";

// ─── Helpers ──────────────────────────────────────────────
const asString = (v) => (v?.toString() ?? "");
const extractId = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    if (value.$oid) return value.$oid.toString();
    if (value._id) return value._id.toString();
  }
  if (Array.isArray(value) && value.length) return extractId(value[0]);
  return value.toString();
};
const brandName = (item) => {
  const brand = item?.brand;
  if (brand && typeof brand === "object" && brand.name) return brand.name.toString();
  return "";
};
const brandLogo = (item) => {
  const brand = item?.brand;
  if (brand && typeof brand === "object" && brand.logo) return brand.logo.toString();
  return "";
};

// ─── Main Component ──────────────────────────────────────────
export default function WishlistPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getWishlist();
      setWishlist(data);
    } catch (_) {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromWishlist = async (id, type) => {
    const action = await toggleWishlist({ itemId: id, itemType: type });
    if (action !== "removed") return;
    setWishlist((prev) => prev.filter((item) => extractId(item._id) !== id));
  };

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const renderCard = (item) => {
    const type = item._wishlistType || "Car";
    const id = extractId(item._id);

    switch (type) {
      case "Car":
        return (
          <CarCard
            carId={id}
            brandName={brandName(item)}
            brandLogoUrl={brandLogo(item)}
            variant={asString(item.variant)}
            model={asString(item.model)}
            imageUrl={asString(item.bannerImage)}
            price={asString(item.price)}
            fuel={asString(item.fuel)}
            year={asString(item.year)}
            status={asString(item.status)}
            km={asString(item.km)}
            owner={asString(item.owner)}
            transmission={asString(item.transmission)}
            district={asString(item.district)}
            city={asString(item.city)}
            onTap={() => navigate("/car/" + id, { state: { car: item } })}
          />
        );
      case "Bike":
        return (
          <BikeCard
            bikeId={id}
            brandName={brandName(item)}
            brandLogoUrl={brandLogo(item)}
            model={asString(item.model)}
            variant={asString(item.variant)}
            imageUrl={asString(item.bannerImage)}
            price={asString(item.price)}
            year={asString(item.year)}
            status={asString(item.status)}
            km={asString(item.km)}
            owner={asString(item.owner)}
            district={asString(item.district)}
            city={asString(item.city)}
            onTap={() => navigate("/bike/" + id, { state: { bike: item } })}
          />
        );
      case "Property":
        return (
          <PropertyCard
            propertyId={id}
            imageUrl={asString(item.bannerImage)}
            price={asString(item.price)}
            mainType={asString(item.mainType)}
            category={asString(item.category)}
            district={asString(item.district)}
            city={asString(item.city)}
            bedrooms={asString(item.bedrooms)}
            landArea={asString(item.landArea)}
            direction={asString(item.direction)}
            status={asString(item.status)}
            onTap={() => navigate("/property/" + id, { state: { property: item } })}
          />
        );
      case "Electronics":
        return (
          <ElectronicsCard
            electronicsId={id}
            brand={brandName(item)}
            title={asString(item.title)}
            imageUrl={asString(item.bannerImage)}
            price={asString(item.price)}
            category={asString(item.category)}
            status={asString(item.status)}
            sellerInfo={asString(item.sellerinfo)}
            district={asString(item.district)}
            city={asString(item.city)}
            onTap={() => navigate("/electronics/" + id, { state: { electronics: item } })}
          />
        );
      default:
        return null;
    }
  };

  // ─── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E9E9FF]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-600">Loading favorites...</p>
        </div>
      </div>
    );
  }

  // ─── Empty ─────────────────────────────────────────────────
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#D6CEF3] to-[#F3EFFF]">
        <AppBar title="My Favorites ❤️" />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <FaHeart className="text-6xl text-gray-300 mb-6" />
          <p className="text-lg font-medium text-gray-600">Your favorites list is empty</p>
          <p className="text-sm text-gray-400 mt-2 text-center max-w-xs">
            Tap the heart icon on cars, bikes, properties, or electronics to add them here ❤️
          </p>
        </div>
      </div>
    );
  }

  // ─── Grid ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#D6CEF3] to-[#F3EFFF]">
      <AppBar title="My Favorites ❤️" />
      <div className="flex-1 overflow-y-auto px-3 pt-2 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-3.5">
          {wishlist.map((item) => {
            const id = extractId(item._id);
            const type = item._wishlistType || "Car";
            return (
              <div key={id} className="relative aspect-[0.72] xl:aspect-[0.78]">
                {renderCard(item)}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(id, type);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition"
                  aria-label="Remove from wishlist"
                >
                  <FaHeart className="text-red-500 text-sm" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}