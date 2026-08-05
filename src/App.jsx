import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import CarDetails from "@/pages/user/car_sections/car_details/CarDetails";

/* VARIANT FILTER */
import HomeOwnCardScrollFilter from "@/pages/user/home/HomeOwnCardScrollFilter";

/* COMPONENTS */
import NavScreen from "@/components/NavScreen";

export default function App() {
  const token = localStorage.getItem("auth_token");

  return (
    <BrowserRouter>
      <Routes>

        {/* Auto Login */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/home" replace /> : <Welcome />
          }
        />

        <Route
          path="/login"
          element={
            token ? <Navigate to="/home" replace /> : <LoginLogic />
          }
        />

        <Route path="/register" element={<Register />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/disclaimer" element={<DisclaimerDialog />} />

        {/* Protected Pages */}
        <Route
          path="/home"
          element={
            token ? <UserHome /> : <Navigate to="/login" replace />
          }
        />

        <Route path="/menu" element={<NavScreen />} />
        <Route path="/notifications" element={<NotificationScreen />} />
        <Route path="/filter" element={<FilterScreen />} />
        <Route path="/filter-result" element={<FilterResultScreen />} />
        <Route path="/slide" element={<SlideBanner />} />
        <Route path="/car/:carId" element={<CarDetails />} />

        <Route
          path="/variant/:variant"
          element={<HomeOwnCardScrollFilter />}
        />

      </Routes>
    </BrowserRouter>
  );
}