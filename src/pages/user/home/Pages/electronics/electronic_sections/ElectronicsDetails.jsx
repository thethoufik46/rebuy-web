// src/pages/user/home/Pages/electronics/electronics_details/ElectronicsDetails.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ElectronicsTopbar from "./ElectronicsTopbar";
import ElectronicsGallery from "./ElectronicsGallery";
import ElectronicsBottomDetails from "./ElectronicsBottomDetails";
import ElectronicsActionButton from "./ElectronicsActionButton";
import ElectronicsCard from "@/components/ElectronicsCard";
import { getElectronicsById, getElectronics } from "@/services/electronics";

// ─── Helpers ──────────────────────────────────────────────
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

const brandName = (electronics) => {
  const brandData = electronics?.brand;
  if (brandData && typeof brandData === "object") return asString(brandData.name);
  if (typeof brandData === "string") return brandData;
  return "";
};

export default function ElectronicsDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { electronicsId } = useParams();

  const [electronics, setElectronics] = useState(location.state?.electronics || null);
  const [loading, setLoading] = useState(!location.state?.electronics);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [similarItems, setSimilarItems] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const autoTimerRef = useRef(null);

  // ─── Fetch electronics (with fallback) ──────────────────
  useEffect(() => {
    if (electronics) return;

    const fetchItem = async () => {
      try {
        setLoading(true);

        // Try direct fetch first
        let fetched = await getElectronicsById(electronicsId);

        // If direct fails, fallback: fetch all and filter
        if (!fetched) {
          console.warn("⚠️ Direct fetch failed, falling back to full list filter...");
          const all = await getElectronics();
          fetched = all.find((item) => extractId(item._id) === electronicsId) || null;
        }

        setElectronics(fetched || null);
      } catch (err) {
        console.log("Fetch electronics error", err);
        setElectronics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [electronicsId, electronics]);

  // ─── Build gallery and auto‑slide ──────────────────────
  useEffect(() => {
    if (!electronics) return;
    const banner = asString(electronics.bannerImage) || "https://via.placeholder.com/400x250?text=No+Image";
    const gallery = Array.isArray(electronics.galleryImages) ? electronics.galleryImages : [];
    const images = [banner, ...gallery.filter((img) => img !== banner)];
    setGalleryImages(images);
    startAutoSlide(images.length);
    return () => stopAutoSlide();
  }, [electronics]);

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

  // ─── Load similar items ──────────────────────────────────
  const loadSimilar = useCallback(async () => {
    if (!electronics) return;
    setSimilarLoading(true);
    try {
      const brand = brandName(electronics);
      const currentId = extractId(electronics._id);
      const result = await getElectronics({ brand });
      setSimilarItems(result.filter((e) => extractId(e._id) !== currentId));
    } catch (e) {
      console.log("Similar error", e);
    } finally {
      setSimilarLoading(false);
    }
  }, [electronics]);

  useEffect(() => {
    loadSimilar();
  }, [loadSimilar]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading electronics...</div>;
  if (!electronics) return <div className="flex items-center justify-center h-screen">Item not found</div>;

  const brand = brandName(electronics);

  return (
    <div className="bg-white min-h-screen">
      <ElectronicsTopbar electronics={electronics} />
      <div className="pb-10">
        <ElectronicsGallery
          galleryImages={galleryImages}
          isLoading={false}
          currentIndex={currentIndex}
          onPageChange={setCurrentIndex}
        />
        <div className="mt-5" />
        <div className="mx-4 p-5 bg-[#FFF3CD] rounded-2xl">
          <ElectronicsBottomDetails electronics={electronics} />
          <div className="h-5" />
          <ElectronicsActionButton />
        </div>
        <div className="h-7" />
        <div className="px-4">
          <h2 className="text-lg font-extrabold">More {brand} Electronics</h2>
        </div>
        <div className="mt-3">
          {similarLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : similarItems.length === 0 ? (
            <div className="text-center text-black/60 py-8">No Similar Items Found</div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide px-4">
              <div className="flex gap-3" style={{ width: "max-content" }}>
                {similarItems.map((item) => {
                  const id = extractId(item._id);
                  return (
                    <div
                      key={id}
                      className="w-44 cursor-pointer"
                      onClick={() => navigate(`/electronics/${id}`, { state: { electronics: item } })}
                    >
                      <ElectronicsCard
                        electronicsId={id}
                        brand={item.brand}
                        title={item.title}
                        imageUrl={item.bannerImage}
                        price={item.price}
                        category={item.category}
                        status={item.status}
                        sellerInfo={item.sellerinfo}
                        district={item.district}
                        city={item.city}
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