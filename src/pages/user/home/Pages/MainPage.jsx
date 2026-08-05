// src/pages/user/home/Pages/MainPage.jsx

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import CarsPage from "./CarsPage";
import BikesPage from "./BikesPage";
import RealEstatePage from "./RealEstatePage";
import ElectronicsPage from "./ElectronicsPage";

import carIcon from "@/assets/home/car.webp";
import bikeIcon from "@/assets/home/bike.webp";
import propertyIcon from "@/assets/home/home.webp";
import electronicsIcon from "@/assets/home/electronic.webp";

const pages = [
  { id: 0, label: "Cars", icon: carIcon, component: CarsPage },
  { id: 1, label: "Bikes", icon: bikeIcon, component: BikesPage },
  { id: 2, label: "Property", icon: propertyIcon, component: RealEstatePage },
  { id: 3, label: "Electronics", icon: electronicsIcon, component: ElectronicsPage },
];

export default function MainPage({
  cars,
  filteredCars,
  selectedTab,
  onTabChange,
  onViewAllCars,
  bikes,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Build props for each page
  const pageProps = {
    0: { cars, filteredCars, selectedTab, onTabChange, onViewAllCars },
    1: { bikes },
    2: {},
    3: {},
  };

  const ActiveComponent = useMemo(
    () => pages[selectedIndex].component,
    [selectedIndex]
  );

  const activeProps = pageProps[selectedIndex] || {};

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="mx-3 my-2 px-1.5 py-2 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-sm">
        <div className="flex justify-around items-center h-[100px] sm:h-[106px]">
          {pages.map((page) => {
            const isActive = selectedIndex === page.id;
            return (
              <TabButton
                key={page.id}
                icon={page.icon}
                label={page.label}
                isActive={isActive}
                onClick={() => setSelectedIndex(page.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Page Content */}
      <div className="mt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ActiveComponent {...activeProps} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Tab Button ─────────────────────────────────────────────
function TabButton({ icon, label, isActive, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex-1 flex flex-col items-center justify-center py-2 rounded-2xl
        transition-all duration-200
        ${isActive
          ? "bg-white/30 backdrop-blur-sm border border-white/20 shadow-lg"
          : "bg-transparent"
        }
      `}
    >
      <motion.div
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
        className={`
          w-[75px] h-[75px] sm:w-[80px] sm:h-[80px] rounded-full
          flex items-center justify-center
          ${isActive ? "bg-white/20" : ""}
        `}
      >
        <img src={icon} alt={label} className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
      </motion.div>
      <span className={`text-xs sm:text-sm font-medium mt-1 ${isActive ? "text-black font-bold" : "text-black/80"}`}>
        {label}
      </span>
      <motion.div
        className="h-1 rounded-full bg-gradient-to-r from-black/80 to-black/50"
        initial={{ width: 0 }}
        animate={{ width: isActive ? 26 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}