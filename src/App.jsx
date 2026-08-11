// src/App.jsx

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
import Terms from "@/auth/Terms";
import DisclaimerDialog from "@/auth/DisclaimerDialog";

import ProtectedRoute from "@/auth/ProtectedRoute";

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
   APP
========================================================= */

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC ROUTES
            -------------------------------------------------
            Login இல்லாமலும் open ஆகலாம்.
        ================================================= */}

        <Route
          path="/"
          element={
            <Welcome />
          }
        />

        <Route
          path="/login"
          element={
            <LoginLogic />
          }
        />

        <Route
          path="/forgot"
          element={
            <Forgot />
          }
        />

        <Route
          path="/register"
          element={
            <Register />
          }
        />

        <Route
          path="/terms"
          element={
            <Terms />
          }
        />

        <Route
          path="/disclaimer"
          element={
            <DisclaimerDialog />
          }
        />


        {/* =================================================
            PROTECTED ROUTES
            -------------------------------------------------
            இந்த block-க்குள் இருக்கும் எல்லா routes-க்கும்
            login compulsory.
        ================================================= */}

        <Route
          element={
            <ProtectedRoute />
          }
        >

          {/* ===============================================
              HOME
          =============================================== */}

          <Route
            path="/home"
            element={
              <UserHome />
            }
          />


          {/* ===============================================
              SEARCH
          =============================================== */}

          <Route
            path="/search-results"
            element={
              <SearchResults />
            }
          />


          {/* ===============================================
              MENU
          =============================================== */}

          <Route
            path="/menu"
            element={
              <NavScreen />
            }
          />


          {/* ===============================================
              NOTIFICATIONS
          =============================================== */}

          <Route
            path="/notifications"
            element={
              <NotificationScreen />
            }
          />


          {/* ===============================================
              FILTER
          =============================================== */}

          <Route
            path="/filter"
            element={
              <FilterScreen />
            }
          />

          <Route
            path="/filter-result"
            element={
              <FilterResultScreen />
            }
          />


          {/* ===============================================
              SLIDE
          =============================================== */}

          <Route
            path="/slide"
            element={
              <SlideBanner />
            }
          />


          {/* ===============================================
              PROFILE
          =============================================== */}

          <Route
            path="/profile"
            element={
              <UserProfile />
            }
          />

          <Route
            path="/change-password"
            element={
              <ChangePassword />
            }
          />


          {/* ===============================================
              CAR DETAILS
          =============================================== */}

          <Route
            path="/car/:carId"
            element={
              <CarDetails />
            }
          />


          {/* ===============================================
              BIKE DETAILS
          =============================================== */}

          <Route
            path="/bike/:bikeId"
            element={
              <BikeDetails />
            }
          />


          {/* ===============================================
              PROPERTY DETAILS
          =============================================== */}

          <Route
            path="/property/:propertyId"
            element={
              <PropertyDetails />
            }
          />


          {/* ===============================================
              ELECTRONICS DETAILS
          =============================================== */}

          <Route
            path="/electronics/:electronicsId"
            element={
              <ElectronicsDetails />
            }
          />


          {/* ===============================================
              VARIANT
          =============================================== */}

          <Route
            path="/variant/:variant"
            element={
              <HomeOwnCardScrollFilter />
            }
          />

          <Route
            path="/variants"
            element={
              <VariantAll />
            }
          />


          {/* ===============================================
              WISHLIST
          =============================================== */}

          <Route
            path="/wishlist"
            element={
              <WishlistPage />
            }
          />


          {/* ===============================================
              OWN CARS
          =============================================== */}

          <Route
            path="/own-cars"
            element={
              <ViewAllOwnBoardScreen />
            }
          />


          {/* ===============================================
              T BOARD CARS
          =============================================== */}

          <Route
            path="/t-board-cars"
            element={
              <ViewAllTBoardScreen />
            }
          />

        </Route>


        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Welcome />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}