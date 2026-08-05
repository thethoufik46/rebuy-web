// src/pages/user/home/Pages/BikesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BikeGridSection from "../BikeGridSection";

const BASE_URL = "https://rebuy-api.onrender.com/api";

export default function BikesPage() {
  const navigate = useNavigate();

  // ─── State ────────────────────────────────────────────────
  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // ─── Fetch Bikes ──────────────────────────────────────────
  useEffect(() => {
    fetchBikes();
  }, []);

  async function fetchBikes() {
    try {
      const res = await fetch(`${BASE_URL}/bikes`);
      const data = await res.json();
      const allBikes = data.bikes || [];
      setBikes(allBikes);
      setFilteredBikes(allBikes); // initially show all
    } catch (err) {
      console.error("Bikes fetch error:", err);
    }
  }

  // ─── Search ──────────────────────────────────────────────
  function handleSearchChange(value) {
    setSearch(value);

    if (!value) {
      setSuggestions([]);
      setFilteredBikes(bikes); // reset to all bikes
      return;
    }

    // Get unique brand names from bikes
    const brands = bikes
      .map((b) => b.brand?.name || "")
      .filter(Boolean);

    const matches = brands.filter((b) =>
      b.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions([...new Set(matches)].slice(0, 8));
  }

  function handleSuggestionClick(brand) {
    const brandBikes = bikes.filter(
      (b) => b.brand?.name === brand
    );
    setFilteredBikes(brandBikes);
    setSuggestions([]);
    setSearch(brand);
  }

  // ─── View All Handler ────────────────────────────────────
  function handleViewAll() {
    navigate("/bike-list", {
      state: { bikes: filteredBikes },
    });
  }

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Search + Filter Button (optional, can keep gear for future filter page) */}
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search bike brand..."
            className="
              w-full px-4 py-3
              rounded-full
              bg-white
              shadow-sm
              outline-none
            "
          />

          {suggestions.length > 0 && (
            <div className="absolute w-full bg-white rounded-xl mt-2 shadow-lg z-50">
              {suggestions.map((s) => (
                <div
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optional filter button – you can link to a bike filter page if needed */}
        <button
          onClick={() => navigate("/bike-filter")}
          className="w-12 h-12 rounded-xl bg-white shadow-sm"
        >
          ⚙
        </button>
      </div>

      {/* Bike Grid */}
      <BikeGridSection
        bikes={filteredBikes}
        showViewAllButton={true}
        onViewAll={handleViewAll}
      />
    </div>
  );
}