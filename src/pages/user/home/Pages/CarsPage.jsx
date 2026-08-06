// src/pages/user/home/Pages/CarsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SlideBanner from "../SlideBanner";
import HomeBoardTwoButton from "../HomeBoardTwoButton";
import HomeOwncardscroll from "../HomeOwncardscroll";
import CarGridSection from "./car/CarGridSection";

const BASE_URL = "https://rebuy-api.onrender.com/api";

export default function CarsPage() {
  const navigate = useNavigate();

  // ─── State ────────────────────────────────────────────────
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  const [selectedTab, setSelectedTab] = useState("own"); // "own" | "t board"

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // ─── Fetch Cars ──────────────────────────────────────────
  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCars() {
    try {
      const res = await fetch(`${BASE_URL}/cars`);
      const data = await res.json();
      const allCars = data.cars || [];
      setCars(allCars);
      applyBoardFilter(allCars, selectedTab);
    } catch (err) {
      console.error("Cars fetch error:", err);
    }
  }

  // ─── Board Filter ────────────────────────────────────────
  function applyBoardFilter(allCars, tab) {
    const filtered = allCars.filter((c) => {
      const board = c.board?.toLowerCase() || "";
      if (tab === "own") return board === "own";
      return board === "t board";
    });
    setFilteredCars(filtered);
  }

  // ─── Tab Change ──────────────────────────────────────────
  function handleTabChange(tab) {
    setSelectedTab(tab);
    applyBoardFilter(cars, tab);
  }

  // ─── Search ──────────────────────────────────────────────
  function handleSearchChange(value) {
    setSearch(value);

    if (!value) {
      setSuggestions([]);
      applyBoardFilter(cars, selectedTab);
      return;
    }

    const brands = cars
      .map((c) => c.brand?.name || "")
      .filter(Boolean);

    const matches = brands.filter((b) =>
      b.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions([...new Set(matches)].slice(0, 8));
  }

  function handleSuggestionClick(brand) {
    const brandCars = cars.filter((c) => {
      const board = c.board?.toLowerCase() || "";
      const matchesBoard =
        selectedTab === "own" ? board === "own" : board === "t board";
      return c.brand?.name === brand && matchesBoard;
    });

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
    

      {/* Board Tabs */}
      <HomeBoardTwoButton
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
      />

      {/* Variant Auto Scroll */}
      <div>
        <SectionHeader
          title="Car Sections"
          onViewAll={() => navigate("/variants")}
        />
        <HomeOwncardscroll />
      </div>

      {/* Car Grid */}
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
    <button onClick={onViewAll} className="text-sm text-slate-500">
      View All
    </button>
  </div>
);