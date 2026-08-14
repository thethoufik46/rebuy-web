import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { useEffect, useState } from "react";

/* =========================================================
   AUTH
========================================================= */

import Welcome from "@/auth/Welcome";
import LoginLogic from "@/auth/LoginLogic";
import Register from "@/auth/Register";
import Forgot from "@/auth/Forgot";

/*
  IMPORTANT:
  Rename auth Terms to AuthTerms.
  This prevents conflict with privacy_policy/Terms.
*/
import AuthTerms from "@/auth/Terms";

import DisclaimerDialog from "@/auth/DisclaimerDialog";
import ProtectedRoute from "@/auth/ProtectedRoute";

/* =========================================================
   LEGAL / POLICY PAGES
========================================================= */

import PrivacyPolicy from "@/components/privacy_policy/PrivacyPolicy";
import RefundPolicy from "@/components/privacy_policy/RefundPolicy";
import TermsConditions
  from "@/components/privacy_policy/TermsConditions";


  import Needs from "@/pages/user/needs/Needs";
import NeedsList from "@/pages/user/needs/NeedsList";


/* =========================================================
   USER
========================================================= */

import UserHome from "@/pages/user/UserHome";

import SearchResults from "@/pages/user/Search/SearchResults";

import NotificationScreen from "@/pages/user/Notification/NotificationScreen";

import FilterScreen from "@/pages/user/filter/FilterScreen";
import FilterResultScreen from "@/pages/user/filter/FilterResultScreen";

import SlideBanner from "@/pages/user/home/SlideBanner";

/* =========================================================
   PROFILE
========================================================= */

import UserProfile from "@/pages/user/Profile/UserProfile";
import ChangePassword from "@/pages/user/Profile/ChangePassword";

/* =========================================================
   FINANCE
========================================================= */

import Finance from "@/pages/user/finance/Finance";

/* =========================================================
   TESTIMONIALS
========================================================= */

import Testimonials from "@/pages/user/Testimonials/Testimonials";

/* =========================================================
   DETAILS
========================================================= */

import CarDetails from "@/pages/user/home/Pages/car/car_details/CarDetails";

import BikeDetails from "@/pages/user/home/Pages/bike/bike_details/BikeDetails";

import PropertyDetails from "@/pages/user/home/property/property_sections/PropertyDetails";

import ElectronicsDetails from "@/pages/user/home/Pages/electronics/electronic_sections/ElectronicsDetails";

/* =========================================================
   CAR / VARIANT
========================================================= */

import HomeOwnCardScrollFilter from "@/pages/user/home/HomeOwnCardScrollFilter";

import VariantAll from "@/pages/user/home/Pages/car/VariantAll";

import ViewAllOwnBoardScreen from "@/pages/user/home/Pages/car/ViewAllOwnBoardScreen";

import ViewAllTBoardScreen from "@/pages/user/home/Pages/car/ViewAllTBoardScreen";

/* =========================================================
   COMPONENTS
========================================================= */

import NavScreen from "@/components/NavScreen";

/* =========================================================
   WISHLIST
========================================================= */

import WishlistPage from "@/pages/Wishlist/WishlistPage";


/* =========================================================
   STARTUP SCREEN — MODERN LOADING ANIMATION
   ---------------------------------------------------------
   Premium intro with animated gradient, floating shapes,
   progress bar, and smooth exit.
========================================================= */

function StartupScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let finished = false;
    let frame1;
    let frame2;
    let interval;
    let timeout;

    // Animate progress from 0 to 100 over ~1.2s
    const startProgress = () => {
      let current = 0;
      interval = setInterval(() => {
        current += Math.random() * 6 + 2; // variable speed
        if (current >= 100) {
          current = 100;
          clearInterval(interval);
          // Wait a tiny beat then finish
          timeout = setTimeout(() => {
            if (!finished) {
              finished = true;
              onFinish();
            }
          }, 200);
        }
        setProgress(Math.min(current, 100));
      }, 40);
    };

    // Allow browser to paint first
    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        startProgress();
      });
    });

    return () => {
      if (frame1) cancelAnimationFrame(frame1);
      if (frame2) cancelAnimationFrame(frame2);
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: "blur(12px)",
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-[#0a0a0f]
      "
    >
      {/* ===================================================
          ANIMATED GRADIENT MESH BACKGROUND
      =================================================== */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, #6b21a5 0%, #1e1b2e 60%, #0a0a0f 100%)",
              "radial-gradient(circle at 80% 70%, #4f46e5 0%, #1e1b2e 60%, #0a0a0f 100%)",
              "radial-gradient(circle at 40% 80%, #7c3aed 0%, #1e1b2e 60%, #0a0a0f 100%)",
              "radial-gradient(circle at 70% 20%, #6b21a5 0%, #1e1b2e 60%, #0a0a0f 100%)",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0"
        />

        {/* Extra glowing orbs */}
        <motion.div
          animate={{
            x: [0, 120, -80, 0],
            y: [0, -60, 90, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-1/4
            top-1/3
            h-96
            w-96
            rounded-full
            bg-purple-500/20
            blur-[120px]
          "
        />
        <motion.div
          animate={{
            x: [0, -100, 70, 0],
            y: [0, 80, -50, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            right-1/4
            bottom-1/3
            h-80
            w-80
            rounded-full
            bg-indigo-500/20
            blur-[140px]
          "
        />
      </div>

      {/* ===================================================
          FLOATING SHAPES
      =================================================== */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[12%] top-[18%] h-12 w-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
      />
      <motion.div
        animate={{
          y: [0, 40, 0],
          rotate: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute right-[15%] top-[28%] h-16 w-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[25%] left-[20%] h-10 w-10 rotate-45 border border-white/10 bg-white/5 backdrop-blur-sm"
      />
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute bottom-[35%] right-[10%] h-14 w-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
      />

      {/* ===================================================
          CENTER CONTENT
      =================================================== */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        {/* Logo with glow */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              inset-[-20px]
              rounded-[40px]
              bg-purple-500/30
              blur-3xl
            "
          />
          <div
            className="
              relative
              flex
              h-[100px]
              w-[100px]
              items-center
              justify-center
              overflow-hidden
              rounded-[30px]
              border
              border-white/20
              bg-white/10
              shadow-[0_30px_80px_rgba(80,50,200,0.25)]
              backdrop-blur-xl
            "
          >
            <img
              src="/assets/logo/logo.webp"
              alt="Re2Buy"
              className="h-[72px] w-[72px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.parentElement?.querySelector(
                  "[data-logo-fallback]"
                );
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div
              data-logo-fallback
              className="hidden h-full w-full items-center justify-center text-4xl font-black tracking-[-0.08em] text-white"
            >
              R2
            </div>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          className="mt-6 text-center"
        >
          <h1 className="text-4xl font-black tracking-[-0.05em] text-white">
            Re2Buy
          </h1>
          <p className="mt-1 text-xs font-medium tracking-[0.2em] text-white/50">
            BUY • SELL • DISCOVER
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 200 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-8 h-1.5 overflow-hidden rounded-full bg-white/10"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-3 text-[10px] font-medium tracking-[0.15em] text-white/40"
        >
          {progress < 100 ? "LOADING" : "WELCOME"}
        </motion.p>
      </div>

      {/* Bottom brand */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <span className="text-[9px] font-semibold tracking-[0.25em] text-white/20">
          TAMIL NADU MARKETPLACE
        </span>
      </motion.div>
    </motion.div>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {
  /*
    Startup animation is shown only once
    per browser tab.
  */
  const [showStartup, setShowStartup] = useState(() => {
    try {
      return sessionStorage.getItem("re2buy_startup_seen") !== "1";
    } catch {
      return true;
    }
  });

  const finishStartup = () => {
    try {
      sessionStorage.setItem("re2buy_startup_seen", "1");
    } catch {
      // Ignore storage errors
    }
    setShowStartup(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginLogic />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms" element={<AuthTerms />} />
        <Route path="/disclaimer" element={<DisclaimerDialog />} />

        {/* Legal Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />

        <Route
  path="/needs"
  element={<Needs />}
/>

<Route
  path="/needs-list"
  element={<NeedsList />}
/>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<UserHome />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/menu" element={<NavScreen />} />
          <Route path="/notifications" element={<NotificationScreen />} />
          <Route path="/filter" element={<FilterScreen />} />
          <Route path="/filter-result" element={<FilterResultScreen />} />
          <Route path="/slide" element={<SlideBanner />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/car/:carId" element={<CarDetails />} />
          <Route path="/bike/:bikeId" element={<BikeDetails />} />
          <Route path="/property/:propertyId" element={<PropertyDetails />} />
          <Route
            path="/electronics/:electronicsId"
            element={<ElectronicsDetails />}
          />
          <Route path="/variant/:variant" element={<HomeOwnCardScrollFilter />} />
          <Route path="/variants" element={<VariantAll />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/own-cars" element={<ViewAllOwnBoardScreen />} />
          <Route path="/t-board-cars" element={<ViewAllTBoardScreen />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Welcome />} />
      </Routes>

      {/* Startup Overlay */}
      <AnimatePresence mode="wait">
        {showStartup && (
          <StartupScreen key="re2buy-startup" onFinish={finishStartup} />
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}