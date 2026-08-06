// src/pages/user/home/Pages/bike/bike_details/BikeDetails.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BikeTopbar from "./BikeTopbar";
import BikeGallery from "./BikeGallery";
import BikeBottomDetails from "./BikeBottomDetails";
import BikeActionButton from "./BikeActionButton";
import BikeCard from "@/components/BikeCard";
import { getBikeById, getFilteredBikes } from "@/services/bikeFilterApi";

/* ================= SAFE HELPERS ================= */
const asString = (v) => {
  if (v == null) return "";
  if (typeof v === "object") {
    if (v.name) return v.name.toString();
    if (v.title) return v.title.toString();
    if (Array.isArray(v) && v.length) return asString(v[0]);
  }
  return v.toString();
};

const extractId = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    if (value.$oid) return value.$oid.toString();
    if (value._id) return value._id.toString();
  }
  return value.toString();
};

const brandName = (bike) => {
  const brandData = bike?.brand;
  if (brandData && typeof brandData === "object") return asString(brandData.name);
  if (typeof brandData === "string") return brandData;
  return "";
};

export default function BikeDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bikeId } = useParams();

  const [bike, setBike] = useState(location.state?.bike || null);
  const [loading, setLoading] = useState(!location.state?.bike);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [similarBikes, setSimilarBikes] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const autoTimerRef = useRef(null);

  // Load bike if not passed via navigation
  useEffect(() => {
    if (bike) return;
    const fetchBike = async () => {
      try {
        setLoading(true);
        const fetchedBike = await getBikeById(bikeId);
        setBike(fetchedBike || null);
      } catch (err) {
        console.log("Fetch bike error 👉", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [bikeId, bike]);

  // Build gallery and auto‑slide
  useEffect(() => {
    if (!bike) return;
    const banner = asString(bike.bannerImage) || "https://via.placeholder.com/400x250?text=No+Image";
    const gallery = Array.isArray(bike.galleryImages) ? bike.galleryImages : [];
    const images = [banner, ...gallery.filter((img) => img !== banner)];
    setGalleryImages(images);
    startAutoSlide(images.length);
    return () => stopAutoSlide();
  }, [bike]);

  const startAutoSlide = (length) => {
    stopAutoSlide();
    if (length <= 1) return;
    autoTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % length);
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  };

  // Similar bikes
  const loadSimilarBikes = useCallback(async () => {
    if (!bike) return;
    setSimilarLoading(true);
    try {
      const brand = brandName(bike);
      const currentId = extractId(bike._id);
      const result = await getFilteredBikes({ brand });
      setSimilarBikes(result.filter((b) => extractId(b._id) !== currentId));
    } catch (e) {
      console.log("Similar error 👉", e);
    } finally {
      setSimilarLoading(false);
    }
  }, [bike]);

  useEffect(() => {
    loadSimilarBikes();
  }, [loadSimilarBikes]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading bike...</div>;
  }
  if (!bike) {
    return <div className="flex items-center justify-center h-screen">Bike not found</div>;
  }

  const brand = brandName(bike);

  return (
    <div className="bg-white min-h-screen">
      <BikeTopbar bike={bike} />
      <div className="pb-10">
        <BikeGallery
          galleryImages={galleryImages}
          isLoading={false}
          currentIndex={currentIndex}
          onPageChange={setCurrentIndex}
        />
        <div className="mt-5" />
        <div className="mx-4 p-5 bg-[#FFF3CD] rounded-2xl">
          <BikeBottomDetails bike={bike} />
          <div className="h-5" />
          <BikeActionButton />
        </div>
        <div className="h-7" />
        <div className="px-4">
          <h2 className="text-lg font-extrabold">More {brand} Bikes</h2>
        </div>
        <div className="mt-3">
          {similarLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : similarBikes.length === 0 ? (
            <div className="text-center text-black/60 py-8">No Similar Bikes Found</div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide px-4">
              <div className="flex gap-3" style={{ width: "max-content" }}>
                {similarBikes.map((b) => {
                  const id = extractId(b._id);
                  return (
                    <div
                      key={id}
                      className="w-44 cursor-pointer"
                      onClick={() => navigate(`/bike/${id}`, { state: { bike: b } })}
                    >
                      <BikeCard
                        bikeId={id}
                        brandName={b.brand?.name || ""}
                        brandLogoUrl={b.brand?.logo || ""}
                        model={b.model || ""}
                        variant={b.variant || ""}
                        imageUrl={b.bannerImage || ""}
                        price={b.price?.toString() || "0"}
                        year={b.year?.toString() || "-"}
                        status={b.status || "available"}
                        km={b.km?.toString() || "0"}
                        owner={b.owner?.toString() || "1"}
                        district={b.district || ""}
                        city={b.city || ""}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}