// src/pages/user/home/Pages/BikesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BikeGridSection from "./bike/BikeGridSection";

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
    

      {/* Bike Grid */}
      <BikeGridSection
        bikes={filteredBikes}
        showViewAllButton={true}
        onViewAll={handleViewAll}
      />
    </div>
  );
}