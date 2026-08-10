import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Welcome from "@/auth/Welcome";
import LoginLogic from "@/auth/LoginLogic";
import Register from "@/auth/Register";
import Terms from "@/auth/Terms";
import DisclaimerDialog from "@/auth/DisclaimerDialog";

import UserHome from "@/pages/user/UserHome";

import SearchResults from "@/pages/user/Search/SearchResults";

import NotificationScreen from "@/pages/user/Notification/NotificationScreen";
import FilterScreen from "@/pages/user/filter/FilterScreen";
import FilterResultScreen from "@/pages/user/filter/FilterResultScreen";

import SlideBanner from "@/pages/user/home/SlideBanner";

import CarDetails from "@/pages/user/home/Pages/car/car_details/CarDetails";
import BikeDetails from "@/pages/user/home/Pages/bike/bike_details/BikeDetails";
import PropertyDetails from "@/pages/user/home/property/property_sections/PropertyDetails";
import ElectronicsDetails from "@/pages/user/home/Pages/electronics/electronic_sections/ElectronicsDetails";

import HomeOwnCardScrollFilter from "@/pages/user/home/HomeOwnCardScrollFilter";
import NavScreen from "@/components/NavScreen";
import WishlistPage from "@/pages/Wishlist/WishlistPage";
import VariantAll from "@/pages/user/home/Pages/car/VariantAll";

import ViewAllOwnBoardScreen from "@/pages/user/home/Pages/car/ViewAllOwnBoardScreen";
import ViewAllTBoardScreen from "@/pages/user/home/Pages/car/ViewAllTBoardScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}

        <Route
          path="/"
          element={<Welcome />}
        />

        <Route
          path="/login"
          element={<LoginLogic />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

        <Route
          path="/disclaimer"
          element={
            <DisclaimerDialog />
          }
        />

        {/* USER */}

        <Route
          path="/home"
          element={<UserHome />}
        />

        <Route
          path="/search-results"
          element={
            <SearchResults />
          }
        />

        <Route
          path="/menu"
          element={<NavScreen />}
        />

        <Route
          path="/notifications"
          element={
            <NotificationScreen />
          }
        />

        <Route
          path="/filter"
          element={<FilterScreen />}
        />

        <Route
          path="/filter-result"
          element={
            <FilterResultScreen />
          }
        />

        <Route
          path="/slide"
          element={<SlideBanner />}
        />

        {/* CAR */}

        <Route
          path="/car/:carId"
          element={
            <CarDetails />
          }
        />

        {/* BIKE */}

        <Route
          path="/bike/:bikeId"
          element={
            <BikeDetails />
          }
        />

        {/* PROPERTY */}

        <Route
          path="/property/:propertyId"
          element={
            <PropertyDetails />
          }
        />

        {/* ELECTRONICS */}

        <Route
          path="/electronics/:electronicsId"
          element={
            <ElectronicsDetails />
          }
        />

        {/* VARIANT */}

        <Route
          path="/variant/:variant"
          element={
            <HomeOwnCardScrollFilter />
          }
        />

        <Route
          path="/variants"
          element={<VariantAll />}
        />

        {/* WISHLIST */}

        <Route
          path="/wishlist"
          element={
            <WishlistPage />
          }
        />

        {/* BOARDS */}

        <Route
          path="/own-cars"
          element={
            <ViewAllOwnBoardScreen />
          }
        />

        <Route
          path="/t-board-cars"
          element={
            <ViewAllTBoardScreen />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}