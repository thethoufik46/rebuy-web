// ================= carVariantApi.js =================
// ✅ FINAL CLEAN API (React / Axios / Production Safe)

import axios from "axios";

/* =========================
   BASE API CONFIG
========================= */
const API = axios.create({
  baseURL: "https://rebuy-api.onrender.com/api",
  timeout: 20000,
});

/* =========================
   AUTH HEADER
========================= */
const authHeaders = () => {
  const token = localStorage.getItem("auth_token");

  if (!token) return {};

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* =========================
   NORMALIZE VARIANT
========================= */
const normalizeVariant = (v) => ({
  _id: v._id?.toString(),
  brandName: v.brandName || "",
  brandLogo: v.brandLogo || "",
  variantName: v.variantName || v.title || "",
  variantImage: v.variantImage || "",
  brandId: v.brandId || "",
});

/* =========================
   GET ALL VARIANTS
========================= */
export const getAllVariants = async () => {
  try {
    const res = await API.get("/variants");

    const list = res.data?.variants || [];

    return list.map(normalizeVariant);
  } catch (err) {
    console.error("GET ALL VARIANTS ERROR:", err);
    return [];
  }
};

/* =========================
   GET VISIBLE VARIANTS
========================= */
export const getVisibleVariants = async () => {
  try {
    const res = await API.get("/variants/visible");

    const list = res.data?.variants || [];

    return list.map(normalizeVariant);
  } catch (err) {
    console.error("VISIBLE VARIANTS ERROR:", err);
    return [];
  }
};

/* =========================
   LOAD VEHICLES VARIANTS 🚚
========================= */
export const getLoadVehiclesVariants = async () => {
  try {
    const res = await API.get("/variants/load-vehicles");

    const list = res.data?.variants || [];

    return list.map(normalizeVariant);
  } catch (err) {
    console.error("LOAD VEHICLES ERROR:", err);
    return [];
  }
};

/* =========================
   OTHER STATE VARIANTS 🌏
========================= */
export const getOtherStateVariants = async () => {
  try {
    const res = await API.get("/variants/other-state");

    const list = res.data?.variants || [];

    return list.map(normalizeVariant);
  } catch (err) {
    console.error("OTHER STATE ERROR:", err);
    return [];
  }
};

/* =========================
   SELECTED VARIANTS 🚗🔥
========================= */
export const getSelectedVariants = async () => {
  try {
    const res = await API.get("/variants/selected");

    const list = res.data?.variants || [];

    return list.map(normalizeVariant);
  } catch (err) {
    console.error("SELECTED VARIANTS ERROR:", err);
    return [];
  }
};

/* =========================
   VARIANTS BY BRAND
========================= */
export const getVariantsByBrand = async (brandId) => {
  try {
    const res = await API.get(`/variants/brand/${brandId}`);

    const list = res.data?.variants || [];

    return list.map(normalizeVariant);
  } catch (err) {
    console.error("VARIANTS BY BRAND ERROR:", err);
    return [];
  }
};

/* =========================
   ADD VARIANT
========================= */
export const addVariant = async ({ brandId, title, imageFile }) => {
  try {
    const formData = new FormData();

    formData.append("brandId", brandId);
    formData.append("title", title);
    formData.append("image", imageFile);

    const res = await API.post(
      "/variants/add",
      formData,
      authHeaders()
    );

    return res.data?.success === true;
  } catch (err) {
    console.error("ADD VARIANT ERROR:", err);
    return false;
  }
};

/* =========================
   UPDATE VARIANT
========================= */
export const updateVariant = async ({
  variantId,
  title,
  brandId,
  imageFile,
}) => {
  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("brandId", brandId);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await API.put(
      `/variants/${variantId}`,
      formData,
      authHeaders()
    );

    return res.status === 200;
  } catch (err) {
    console.error("UPDATE VARIANT ERROR:", err);
    return false;
  }
};

/* =========================
   DELETE VARIANT
========================= */
export const deleteVariant = async (variantId) => {
  try {
    const res = await API.delete(
      `/variants/${variantId}`,
      authHeaders()
    );

    return res.status === 200;
  } catch (err) {
    console.error("DELETE VARIANT ERROR:", err);
    return false;
  }
};

export default API;