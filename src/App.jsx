import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ─── AUTH ──────────────────────────────────────────────── */
import Welcome from "@/auth/Welcome";
import LoginLogic from "@/auth/LoginLogic";
import Register from "@/auth/Register";
import Terms from "@/auth/Terms";
import DisclaimerDialog from "@/auth/DisclaimerDialog";

/* ─── USER PAGES ────────────────────────────────────────── */
import UserHome from "@/pages/user/UserHome";
import NotificationScreen from "@/pages/user/Notification/NotificationScreen";
import FilterScreen from "@/pages/user/filter/FilterScreen";
import FilterResultScreen from "@/pages/user/filter/FilterResultScreen";
import SlideBanner from "@/pages/user/home/SlideBanner";

/* ─── DETAILS PAGES ─────────────────────────────────────── */
import CarDetails from "@/pages/user/home/Pages/car/car_details/CarDetails";
import BikeDetails from "@/pages/user/home/Pages/bike/bike_details/BikeDetails";

// ✅ Use your actual folder names:
import PropertyDetails from "@/pages/user/home/property/property_sections/PropertyDetails";
import ElectronicsDetails from "@/pages/user/home/Pages/electronics/electronic_sections/ElectronicsDetails";

/* ─── OTHER ─────────────────────────────────────────────── */
import HomeOwnCardScrollFilter from "@/pages/user/home/HomeOwnCardScrollFilter";
import NavScreen from "@/components/NavScreen";
import WishlistPage from "@/pages/Wishlist/WishlistPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── AUTH ────────────────────────────────── */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginLogic />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<DisclaimerDialog />} />

        {/* ─── USER ────────────────────────────────── */}
        <Route path="/home" element={<UserHome />} />
        <Route path="/menu" element={<NavScreen />} />
        <Route path="/notifications" element={<NotificationScreen />} />
        <Route path="/filter" element={<FilterScreen />} />
        <Route path="/filter-result" element={<FilterResultScreen />} />
        <Route path="/slide" element={<SlideBanner />} />

        {/* ─── CAR ────────────────────────────────── */}
        <Route path="/car/:carId" element={<CarDetails />} />

        {/* ─── BIKE ───────────────────────────────── */}
        <Route path="/bike/:bikeId" element={<BikeDetails />} />

        {/* ─── PROPERTY ───────────────────────────── */}
        <Route path="/property/:propertyId" element={<PropertyDetails />} />

        {/* ─── ELECTRONICS ────────────────────────── */}
        <Route path="/electronics/:electronicsId" element={<ElectronicsDetails />} />

        {/* ─── VARIANT FILTER ────────────────────── */}
        <Route path="/variant/:variant" element={<HomeOwnCardScrollFilter />} />

        {/* ─── WISHLIST ───────────────────────────── */}
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </BrowserRouter>
  );
}