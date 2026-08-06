// src/pages/user/home/Pages/property/property_details/PropertyDetails.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PropertyTopbar from "./PropertyTopbar";
import PropertyGallery from "./PropertyGallery";
import PropertyBottomDetails from "./PropertyBottomDetails";
import PropertyActionButton from "./PropertyActionButton";
import PropertyCard from "@/components/PropertyCard";
import { getProperty, filterProperties } from "@/services/property"; // ✅ fixed

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

const mainTypeName = (property) => {
  const type = property?.mainType;
  if (type && typeof type === "object") return asString(type.name);
  if (typeof type === "string") return type;
  return "";
};

export default function PropertyDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { propertyId } = useParams();

  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(!location.state?.property);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const autoTimerRef = useRef(null);

  // ─── Fetch property if not passed via state ────────────
  useEffect(() => {
    if (property) return;
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const fetched = await getProperty(propertyId); // ✅ now works
        setProperty(fetched || null);
      } catch (err) {
        console.log("Fetch property error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId, property]);

  // ─── Build gallery and auto‑slide ──────────────────────
  useEffect(() => {
    if (!property) return;
    const banner = asString(property.bannerImage) || "https://via.placeholder.com/400x250?text=No+Image";
    const gallery = Array.isArray(property.galleryImages) ? property.galleryImages : [];
    const images = [banner, ...gallery.filter((img) => img !== banner)];
    setGalleryImages(images);
    startAutoSlide(images.length);
    return () => stopAutoSlide();
  }, [property]);

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

  // ─── Load similar properties ────────────────────────────
  const loadSimilar = useCallback(async () => {
    if (!property) return;
    setSimilarLoading(true);
    try {
      const type = mainTypeName(property);
      const currentId = extractId(property._id);
      const result = await filterProperties({ mainType: type }); // ✅ now works
      setSimilarProperties(result.filter((p) => extractId(p._id) !== currentId));
    } catch (e) {
      console.log("Similar error", e);
    } finally {
      setSimilarLoading(false);
    }
  }, [property]);

  useEffect(() => {
    loadSimilar();
  }, [loadSimilar]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading property...</div>;
  if (!property) return <div className="flex items-center justify-center h-screen">Property not found</div>;

  const type = mainTypeName(property);

  return (
    <div className="bg-white min-h-screen">
      <PropertyTopbar property={property} />
      <div className="pb-10">
        <PropertyGallery
          galleryImages={galleryImages}
          isLoading={false}
          currentIndex={currentIndex}
          onPageChange={setCurrentIndex}
        />
        <div className="mt-5" />
        <div className="mx-4 p-5 bg-[#FFF3CD] rounded-2xl">
          <PropertyBottomDetails property={property} />
          <div className="h-5" />
          <PropertyActionButton />
        </div>
        <div className="h-7" />
        <div className="px-4">
          <h2 className="text-lg font-extrabold">More {type} Properties</h2>
        </div>
        <div className="mt-3">
          {similarLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : similarProperties.length === 0 ? (
            <div className="text-center text-black/60 py-8">No Similar Properties Found</div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide px-4">
              <div className="flex gap-3" style={{ width: "max-content" }}>
                {similarProperties.map((p) => {
                  const id = extractId(p._id);
                  return (
                    <div
                      key={id}
                      className="w-44 cursor-pointer"
                      onClick={() => navigate(`/property/${id}`, { state: { property: p } })}
                    >
                      <PropertyCard
                        propertyId={id}
                        mainType={p.mainType}
                        category={p.category}
                        price={p.price}
                        imageUrl={p.bannerImage}
                        status={p.status}
                        district={p.district}
                        city={p.city}
                        bedrooms={p.bedrooms}
                        landArea={p.landArea}
                        direction={p.direction}
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