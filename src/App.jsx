// ======================= src/App.jsx =======================

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

/* =========================================================
   AUTH
========================================================= */

import Welcome from "@/auth/Welcome";
import LoginLogic from "@/auth/LoginLogic";
import Register from "@/auth/Register";
import Forgot from "@/auth/Forgot";
import AuthTerms from "@/auth/Terms";
import DisclaimerDialog from "@/auth/DisclaimerDialog";
import ProtectedRoute from "@/auth/ProtectedRoute";

/* =========================================================
   LEGAL / POLICY
========================================================= */

import PrivacyPolicy from "@/components/privacy_policy/PrivacyPolicy";
import RefundPolicy from "@/components/privacy_policy/RefundPolicy";
import TermsConditions from "@/components/privacy_policy/TermsConditions";

/* =========================================================
   NEEDS
========================================================= */

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
   FAQ
========================================================= */

import Faq from "@/pages/Faq/Faq";

/* =========================================================
   HELP
========================================================= */

import Help from "@/pages/Faq/help";

/* =========================================================
   CASHBACK
========================================================= */

import Cashback from "@/pages/Faq/Cashback";

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route
          path="/"
          element={<Welcome />}
        />

        <Route
          path="/login"
          element={<LoginLogic />}
        />

        <Route
          path="/forgot"
          element={<Forgot />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/terms"
          element={<AuthTerms />}
        />

        <Route
          path="/disclaimer"
          element={<DisclaimerDialog />}
        />

        {/* =====================================================
            LEGAL
        ===================================================== */}

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/refund-policy"
          element={<RefundPolicy />}
        />

        <Route
          path="/terms-conditions"
          element={<TermsConditions />}
        />

        {/* =====================================================
            NEEDS
        ===================================================== */}

        <Route
          path="/needs"
          element={<Needs />}
        />

        <Route
          path="/needs-list"
          element={<NeedsList />}
        />

        {/* =====================================================
            FAQ
        ===================================================== */}

        <Route
          path="/faq"
          element={<Faq />}
        />

        {/* =====================================================
            HELP
        ===================================================== */}

        <Route
          path="/help"
          element={<Help />}
        />

        {/* =====================================================
            CASHBACK
        ===================================================== */}

        <Route
          path="/cashback"
          element={<Cashback />}
        />

        {/* =====================================================
            PROTECTED ROUTES
        ===================================================== */}

        <Route element={<ProtectedRoute />}>

          {/* HOME */}

          <Route
            path="/home"
            element={<UserHome />}
          />

          {/* SEARCH */}

          <Route
            path="/search-results"
            element={<SearchResults />}
          />

          {/* MENU */}

          <Route
            path="/menu"
            element={<NavScreen />}
          />

          {/* NOTIFICATIONS */}

          <Route
            path="/notifications"
            element={<NotificationScreen />}
          />

          {/* FILTER */}

          <Route
            path="/filter"
            element={<FilterScreen />}
          />

          <Route
            path="/filter-result"
            element={<FilterResultScreen />}
          />

          {/* SLIDE */}

          <Route
            path="/slide"
            element={<SlideBanner />}
          />

          {/* PROFILE */}

          <Route
            path="/profile"
            element={<UserProfile />}
          />

          <Route
            path="/change-password"
            element={<ChangePassword />}
          />

          {/* FINANCE */}

          <Route
            path="/finance"
            element={<Finance />}
          />

          {/* TESTIMONIALS */}

          <Route
            path="/testimonials"
            element={<Testimonials />}
          />

          {/* CAR */}

          <Route
            path="/car/:carId"
            element={<CarDetails />}
          />

          {/* BIKE */}

          <Route
            path="/bike/:bikeId"
            element={<BikeDetails />}
          />

          {/* PROPERTY */}

          <Route
            path="/property/:propertyId"
            element={<PropertyDetails />}
          />

          {/* ELECTRONICS */}

          <Route
            path="/electronics/:electronicsId"
            element={<ElectronicsDetails />}
          />

          {/* VARIANT */}

          <Route
            path="/variant/:variant"
            element={<HomeOwnCardScrollFilter />}
          />

          <Route
            path="/variants"
            element={<VariantAll />}
          />

          {/* WISHLIST */}

          <Route
            path="/wishlist"
            element={<WishlistPage />}
          />

          {/* OWN BOARD */}

          <Route
            path="/own-cars"
            element={<ViewAllOwnBoardScreen />}
          />

          {/* T BOARD */}

          <Route
            path="/t-board-cars"
            element={<ViewAllTBoardScreen />}
          />

        </Route>

        {/* =====================================================
            FALLBACK
        ===================================================== */}

        <Route
          path="*"
          element={<Welcome />}
        />

      </Routes>
    </BrowserRouter>
  );
}