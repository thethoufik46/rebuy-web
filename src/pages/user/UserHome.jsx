import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./home/Navbar";
import SlideBanner from "@/pages/user/home/SlideBanner.jsx";
import HomeBoardTwoButton from "@/pages/user/home/HomeBoardTwoButton.jsx";
import HomeButtons from "@/pages/user/home/FourButton.jsx";
import VideocardBuyandSell from "@/pages/user/home/VideocardBuyandSell.jsx";
import HomeOwncardscroll from "@/pages/user/home/HomeOwncardscroll.jsx";
import CarGridSection from "@/pages/user/home/CarGridSection.jsx";
import BikeGridSection from "@/pages/user/home/BikeGridSection.jsx";

const BASE_URL = "https://rebuy-api.onrender.com/api";

export default function UserHome() {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [properties, setProperties] = useState([]);

  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedTab, setSelectedTab] = useState("own");

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchCars();
    fetchBikes();
    fetchProperties();
  }, []);

  async function fetchCars() {
    try {
      const res = await fetch(`${BASE_URL}/cars`);
      const data = await res.json();
      const allCars = data.cars || [];
      setCars(allCars);
      applyBoardFilter(allCars, selectedTab);
    } catch (err) {
      console.log("Cars error 👉", err);
    }
  }

  async function fetchBikes() {
    try {
      const res = await fetch(`${BASE_URL}/bikes`);
      const data = await res.json();
      setBikes(data.bikes || []);
    } catch (err) {
      console.log("Bikes error 👉", err);
    }
  }

  async function fetchProperties() {
    try {
      const res = await fetch(`${BASE_URL}/properties`);
      const data = await res.json();
      setProperties(data.properties || []);
    } catch (err) {
      console.log("Properties error 👉", err);
    }
  }

  function applyBoardFilter(allCars, tab) {
    const filtered = allCars.filter((c) => {
      const board = c.board?.toLowerCase() || "";
      if (tab === "own") return board === "own";
      return board === "t board";
    });
    setFilteredCars(filtered);
  }

  function handleSearchChange(value) {
    setSearch(value);

    if (!value) {
      setSuggestions([]);
      applyBoardFilter(cars, selectedTab);
      return;
    }

    const brands = cars.map((c) => c.brand?.name || "").filter(Boolean);

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

  const taxiCars = cars.filter((c) =>
    c.brand?.name?.toLowerCase().includes("taxi")
  );

  const loadCars = cars.filter((c) =>
    c.brand?.name?.toLowerCase().includes("load")
  );

  return (
    <div
      className="min-h-screen text-black"
      style={{
        background: `linear-gradient(
          to bottom,
          rgb(214, 206, 243),
          #F3EFFF
        )`,
      }}
    >
      <Navbar />

      <div className="p-4 md:p-6">

        {/* SEARCH */}
        <div className="flex items-center gap-2 w-full mb-4">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search brand..."
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

          <button
            onClick={() => navigate("/filter")}
            className="
              w-12 h-12
              rounded-xl
              bg-white
              shadow-sm
            "
          >
            ⚙
          </button>
        </div>

        {/* SLIDER */}
        <div className="mb-4">
          <SlideBanner />
        </div>

        {/* BOARD CARDS */}
        <div className="mb-4">
          <HomeBoardTwoButton />
        </div>

        {/* VIDEO */}
        <div className="mb-4">
          <VideocardBuyandSell />
        </div>

        {/* FOUR BUTTONS */}
        <div className="mb-4">
          <HomeButtons />
        </div>

        {/* ✅ VARIANT AUTO SCROLL */}
      <div className="mb-4">
  <SectionHeader
    title="Car Sections"
    onViewAll={() => navigate("/variants")}
  />

  <HomeOwncardscroll />
</div>

        {/* ✅ CAR GRID */}
        <div className="mb-5">
          <CarGridSection
            cars={filteredCars}
            showViewAllButton={true}
            onViewAll={() =>
              navigate("/filter-result", {
                state: { filteredCars },
              })
            }
          />
        </div>

        {/* ✅ BIKE GRID */}
        <div className="mb-5">
          <BikeGridSection
            bikes={bikes}
            onViewAll={() =>
              navigate("/bike-list", { state: { bikes } })
            }
          />
        </div>

     

    

     
      </div>
    </div>
  );
}

/* UI */

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-slate-500">View All</span>
      </div>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Card({ title }) {
  return (
    <div className="bg-white rounded-2xl p-2 shadow-sm">
      <div className="h-24 bg-slate-200 rounded-xl mb-2" />
      <p className="text-xs font-medium">{title}</p>
    </div>
  );
}




function SectionHeader({ title, onViewAll }) {
  return (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-lg font-semibold">{title}</h2>

      <button
        onClick={onViewAll}
        className="text-sm text-slate-500"
      >
        View All
      </button>
    </div>
  );
}