// src/pages/user/home/Pages/CarsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeBoardTwoButton from "@/components/HomeBoardTwoButton";
import HomeOwncardscroll from "./car/HomeOwncardscroll";
import CarGridSection from "./car/CarGridSection";

const BASE_URL = "https://rebuy-api.onrender.com/api";

export default function CarsPage() {
  const navigate = useNavigate();

  // ─── State ────────────────────────────────────────────────
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  // Search state – kept for search functionality
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // ─── Fetch all cars (no board filter) ────────────────────
  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    try {
      const res = await fetch(`${BASE_URL}/cars`);
      const data = await res.json();
      const allCars = data.cars || [];
      setCars(allCars);
      setFilteredCars(allCars); // show all by default
    } catch (err) {
      console.error("Cars fetch error:", err);
    }
  }

  // ─── Search ──────────────────────────────────────────────
  function handleSearchChange(value) {
    setSearch(value);
    if (!value) {
      setSuggestions([]);
      setFilteredCars(cars);
      return;
    }
    const brands = cars.map((c) => c.brand?.name || "").filter(Boolean);
    const matches = brands.filter((b) =>
      b.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions([...new Set(matches)].slice(0, 8));
  }

  function handleSuggestionClick(brand) {
    const brandCars = cars.filter((c) => c.brand?.name === brand);
    setFilteredCars(brandCars);
    setSuggestions([]);
    setSearch(brand);
  }

  // ─── View All Handler ────────────────────────────────────
  function handleViewAll() {
    navigate("/filter-result", {
      state: { filteredCars },
    });
  }

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Board Buttons – both navigate to dedicated screens */}
      <HomeBoardTwoButton
        onOwnBoardTap={() => navigate("/own-cars")}
        onTBoardTap={() => navigate("/t-board-cars")}
      />

      {/* Variant Auto Scroll */}
      <div>
        <SectionHeader
          title="Car Sections"
          onViewAll={() => navigate("/variants")}
        />
        <HomeOwncardscroll />
      </div>

      {/* Car Grid – shows all cars (or filtered by search) */}
      <CarGridSection
        cars={filteredCars}
        showViewAllButton={true}
        onViewAll={handleViewAll}
      />
    </div>
  );
}

// ─── Helper Component ──────────────────────────────────────
const SectionHeader = ({ title, onViewAll }) => (
  <div className="flex justify-between items-center mb-2">
    <h2 className="text-lg font-semibold">{title}</h2>
    <button onClick={onViewAll} className="text-sm text-slate-500 hover:text-black transition">
      View All
    </button>
  </div>
);