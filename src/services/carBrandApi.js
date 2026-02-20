import axios from "axios";

/* =========================
   BASE API CONFIG
========================= */
const API = axios.create({
  baseURL: "https://rebuy-api.onrender.com/api", // ✅ PRODUCTION BACKEND
  timeout: 20000,
});

/* =========================
   AUTH HEADER
========================= */
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* =========================
   GET BRANDS ✅ SAFE
========================= */
export const getBrands = async () => {
  try {
    const res = await API.get("/brands");

    console.log("✅ BRANDS API RESPONSE:", res.data);

    const raw = res.data;

    // ✅ Bulletproof normalizer (handles any backend format)
    const brands =
      raw.brands ||
      raw.data ||
      raw ||
      [];

    return Array.isArray(brands) ? brands : [];
  } catch (error) {
    console.error("❌ getBrands error:", error.message);
    return [];
  }
};

/* =========================
   ADD BRAND
========================= */
export const addBrand = async ({ name, logoFile }) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("logo", logoFile);

    const res = await API.post("/brands/add", formData, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    console.log("✅ ADD BRAND RESPONSE:", res.data);

    return res.data.success === true;
  } catch (error) {
    console.error("❌ addBrand error:", error.message);
    return false;
  }
};

/* =========================
   UPDATE BRAND
========================= */
export const updateBrand = async ({ brandId, name, logoFile }) => {
  try {
    const formData = new FormData();
    formData.append("name", name);

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    const res = await API.put(`/brands/${brandId}`, formData, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    console.log("✅ UPDATE BRAND RESPONSE:", res.data);

    return res.status === 200;
  } catch (error) {
    console.error("❌ updateBrand error:", error.message);
    return false;
  }
};

/* =========================
   DELETE BRAND
========================= */
export const deleteBrand = async (brandId) => {
  try {
    const res = await API.delete(`/brands/${brandId}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    console.log("✅ DELETE BRAND RESPONSE:", res.data);

    return res.status === 200;
  } catch (error) {
    console.error("❌ deleteBrand error:", error.message);
    return false;
  }
};
