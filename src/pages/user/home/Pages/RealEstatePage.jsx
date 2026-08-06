// src/pages/user/home/Pages/RealEstatePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Components ──────────────────────────────────────────────
import SlideBanner from "../SlideBanner";
import PropertyGridSection from "../property/PropertyGridSection";

// ─── SectionHeader (local – same file) ──────────────────────
function SectionHeader({ title, subtitle, onViewAll }) {
  return (
    <div className="flex justify-between items-start px-4">
      {/* Left: Title + optional subtitle */}
      <div className="flex-1">
        <h2 className="text-base font-semibold tracking-wide">{title}</h2>
        {subtitle && (
          <p className="text-xs font-medium text-black/60 mt-0.5 font-tamil">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right: View All with animated arrow */}
      <button
        onClick={onViewAll}
        className="flex items-center gap-1 text-sm font-medium text-black/70 hover:text-black transition-colors"
      >
        <span>View All</span>
        <ArrowIcon />
      </button>
    </div>
  );
}

// ─── Animated Arrow (CSS keyframes) ────────────────────────
function ArrowIcon() {
  return (
    <span className="inline-block animate-arrow-slide">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </span>
  );
}

// ─── RealEstatePage ──────────────────────────────────────────
const BASE_URL = "https://rebuy-api.onrender.com/api";

export default function RealEstatePage() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const res = await fetch(`${BASE_URL}/properties`);
      const data = await res.json();
      setProperties(data.properties || []);
    } catch (err) {
      console.error("Properties fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleViewAll() {
    navigate("/property-list", { state: { properties } });
  }

  // ─── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] mt-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="space-y-4">
   

      <SectionHeader
        title="Property Sections"
        subtitle="வீடு & நிலங்கள்"
        onViewAll={handleViewAll}
      />

      <PropertyGridSection
        properties={properties}
        showViewAllButton={true}
        onViewAll={handleViewAll}
        loading={false}
      />

      <div className="h-5" />
    </div>
  );
}