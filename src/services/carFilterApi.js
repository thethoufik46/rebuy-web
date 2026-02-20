import axios from "axios";

/* =========================
   BASE API CONFIG
========================= */
const API = axios.create({
  baseURL: "https://rebuy-api.onrender.com/api", // ✅ PRODUCTION BACKEND
  timeout: 20000,
});

/* =========================
   NORMALIZE CAR (OPTIONAL SAFETY)
========================= */
const normalizeCar = (car) => ({
  ...car,
  _id: car._id?.toString(),
});

/* =====================================================
   GET FILTERED CARS (FULL FILTER)
===================================================== */
export const getFilteredCars = async (filters = {}) => {
  try {
    const params = {};

    if (filters.brand) params.brand = filters.brand;
    if (filters.variant) params.variant = filters.variant;
    if (filters.fuel) params.fuel = filters.fuel;
    if (filters.transmission) params.transmission = filters.transmission;
    if (filters.owner) params.owner = filters.owner;
    if (filters.board) params.board = filters.board;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minYear) params.minYear = filters.minYear;
    if (filters.maxYear) params.maxYear = filters.maxYear;

    const res = await API.get("/cars", { params });

    const list = res.data?.cars || [];

    return list.map(normalizeCar);
  } catch (err) {
    console.error("FILTERED CARS ERROR:", err);
    return [];
  }
};

/* =====================================================
   VARIANT + BOARD FILTER ONLY ⭐⭐⭐⭐⭐
===================================================== */
export const getCarsByVariantBoard = async ({
  variant,
  board,
}) => {
  try {
    const params = {};

    if (variant) params.variant = variant;
    if (board) params.board = board;

    const res = await API.get("/cars/filter", { params });

    const list = res.data?.cars || [];

    return list.map(normalizeCar);
  } catch (err) {
    console.error("VARIANT + BOARD FILTER ERROR:", err);
    return [];
  }
};



export const getCarById = async (carId) => {
  try {
    const res = await API.get(`/cars/${carId}`);
    return res.data?.car || null;
  } catch (err) {
    console.log("Get car by id error 👉", err);
    return null;
  }
};