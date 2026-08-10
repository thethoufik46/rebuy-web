// src/pages/user/home/Pages/car/car_details/CarDetails.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import CarTopbar from "./CarTopbar";
import CarGallery from "./CarGallery";
import CarBottomDetails from "./CarBottomDetails";
import CarActionButton from "./CarActionButton";
import CarCard from "@/components/CarCard";
import { getCarById, getFilteredCars } from "@/services/carFilterApi";

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

const brandName = (car) => {
  const brandData = car?.brand;
  if (brandData && typeof brandData === "object") return asString(brandData.name);
  if (typeof brandData === "string") return brandData;
  return "";
};

export default function CarDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { carId } = useParams();
  const [searchParams] = useSearchParams();

  // ✅ Read tab from URL (default to 0 for Cars)
  const tab = searchParams.get("tab") || 0;

  const [car, setCar] = useState(location.state?.car || null);
  const [loading, setLoading] = useState(!location.state?.car);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [similarCars, setSimilarCars] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const autoTimerRef = useRef(null);

  // Load car if not passed via navigation
  useEffect(() => {
    if (car) return;
    const fetchCar = async () => {
      try {
        setLoading(true);
        const fetchedCar = await getCarById(carId);
        setCar(fetchedCar || null);
      } catch (err) {
        console.log("Fetch car error 👉", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [carId, car]);

  // Build gallery and start auto‑slide
  useEffect(() => {
    if (!car) return;
    const banner = asString(car.bannerImage) || "https://via.placeholder.com/400x250?text=No+Image";
    const gallery = Array.isArray(car.galleryImages) ? car.galleryImages : [];
    const images = [banner, ...gallery.filter((img) => img !== banner)];
    setGalleryImages(images);
    startAutoSlide(images.length);
    return () => stopAutoSlide();
  }, [car]);

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

  // Similar cars
  const loadSimilarCars = useCallback(async () => {
    if (!car) return;
    setSimilarLoading(true);
    try {
      const brand = brandName(car);
      const currentId = extractId(car._id);
      const result = await getFilteredCars({ brand });
      setSimilarCars(result.filter((c) => extractId(c._id) !== currentId));
    } catch (e) {
      console.log("Similar error 👉", e);
    } finally {
      setSimilarLoading(false);
    }
  }, [car]);

  useEffect(() => {
    loadSimilarCars();
  }, [loadSimilarCars]);

  // ─── BACK HANDLER ──────────────────────────────────────
  const handleBack = () => {
    navigate(`/home?tab=${tab}`); // ✅ return to UserHome with correct tab
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading car...</div>;
  }
  if (!car) {
    return <div className="flex items-center justify-center h-screen">Car not found</div>;
  }

  const brand = brandName(car);

  return (
    <div className="bg-white min-h-screen relative">
      {/* ✅ BACK BUTTON */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <CarTopbar car={car} />
      <div className="pb-10">
        <CarGallery
          galleryImages={galleryImages}
          isLoading={false}
          currentIndex={currentIndex}
          onPageChange={setCurrentIndex}
        />
        <div className="mt-5" />
        <div className="mx-4 p-5 bg-[#FFF3CD] rounded-2xl">
          <CarBottomDetails car={car} />
          <div className="h-5" />
          <CarActionButton />
        </div>
        <div className="h-7" />
        <div className="px-4">
          <h2 className="text-lg font-extrabold">More {brand} Cars</h2>
        </div>
        <div className="mt-3">
          {similarLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : similarCars.length === 0 ? (
            <div className="text-center text-black/60 py-8">No Similar Cars Found</div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide px-4">
              <div className="flex gap-3" style={{ width: "max-content" }}>
                {similarCars.map((c) => {
                  const id = extractId(c._id);
                  return (
                    <div
                      key={id}
                      className="w-44 cursor-pointer"
                      onClick={() => navigate(`/car/${id}?tab=${tab}`, { state: { car: c } })}
                    >
                      <CarCard
                        carId={id}
                        brandName={c.brand?.name}
                        brandLogoUrl={c.brand?.logo}
                        variant={c.variantName}
                        model={c.model}
                        imageUrl={c.bannerImage}
                        price={`₹${c.price}`}
                        fuel={c.fuel}
                        year={c.year}
                        status={c.status}
                        km={c.km}
                        owner={c.owner}
                        transmission={c.transmission}
                        district={c.district}
                        city={c.city}
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