import { BrowserRouter, Routes, Route } from "react-router-dom";

/* AUTH */
import Welcome from "@/auth/Welcome";
import LoginLogic from "@/auth/LoginLogic";
import Register from "@/auth/Register";
import Terms from "@/auth/Terms";
import DisclaimerDialog from "@/auth/DisclaimerDialog";

/* USER */
import UserHome from "@/pages/user/UserHome";
import NotificationScreen from "@/pages/user/Notification/NotificationScreen";
import FilterScreen from "@/pages/user/filter/FilterScreen";
import FilterResultScreen from "@/pages/user/filter/FilterResultScreen";
import SlideBanner from "@/pages/user/home/SlideBanner";

/* DETAILS */
import CarDetails from "@/pages/user/home/Pages/car/car_details/CarDetails";

/* VARIANT FILTER */
import HomeOwnCardScrollFilter from "@/pages/user/home/HomeOwnCardScrollFilter";

/* COMPONENTS */
import NavScreen from "@/components/NavScreen";

/* ✅ WISHLIST */
import WishlistPage from "@/pages/Wishlist/WishlistPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginLogic />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<DisclaimerDialog />} />

        {/* USER */}
        <Route path="/home" element={<UserHome />} />
        <Route path="/menu" element={<NavScreen />} />
        <Route path="/notifications" element={<NotificationScreen />} />
        <Route path="/filter" element={<FilterScreen />} />
        <Route path="/filter-result" element={<FilterResultScreen />} />
        <Route path="/slide" element={<SlideBanner />} />

        {/* CAR DETAILS */}
        <Route path="/car/:carId" element={<CarDetails />} />

        {/* VARIANT FILTER */}
        <Route path="/variant/:variant" element={<HomeOwnCardScrollFilter />} />

        {/* ✅ WISHLIST */}
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </BrowserRouter>
  );
}