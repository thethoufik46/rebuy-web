// src/pages/user/home/Pages/ElectronicsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Service ──────────────────────────────────────────────
import { getElectronics } from "@/services/electronics";

// ─── Components ──────────────────────────────────────────
import SlideBanner from "../SlideBanner";                // replace with ElectronicsSlide if you have one
import ElectronicsGridSection from "./electronics/ElectronicsGridSection";

// ─── SectionHeader (inline – matches Flutter) ────────────
function SectionHeader({ title, subtitle, onViewAll }) {
  return (
    <div className="flex justify-between items-start px-4">
      <div className="flex-1">
        <h2 className="text-base font-semibold tracking-wide">{title}</h2>
        {subtitle && (
          <p className="text-xs font-medium text-black/60 mt-0.5 font-tamil">
            {subtitle}
          </p>
        )}
      </div>
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

// ─── Main Component ──────────────────────────────────────

export default function ElectronicsPage() {
  const navigate = useNavigate();
  const [electronics, setElectronics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchElectronics();
  }, []);

  async function fetchElectronics() {
    try {
      // ✅ Using the service – no hardcoded URL
      const items = await getElectronics();
      setElectronics(items);
    } catch (err) {
      console.error("Electronics fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleViewAll() {
    navigate("/electronics-list", { state: { electronics } });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] mt-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SlideBanner />

      <SectionHeader
        title="Electronics"
        subtitle="மொபைல் / லேப்டாப் / PC"
        onViewAll={handleViewAll}
      />

      <ElectronicsGridSection
        electronics={electronics}
        onViewAll={handleViewAll}
        showViewAllButton={true}
        loading={false} // already handled by the spinner above
      />

      <div className="h-5" />
    </div>
  );
}