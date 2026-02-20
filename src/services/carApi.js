import API from "@/services/api"; // ✅ your axios instance

/* =====================================================
   ✅ AUTH HEADER (Flutter SharedPreferences → localStorage)
===================================================== */
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");

  if (!token) throw new Error("Login required");

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* =====================================================
   ✅ SAFE HELPERS (Mongo Safe 🔥)
===================================================== */
export const extractId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    if (value.$oid) return value.$oid.toString();
    if (value._id) return value._id.toString();
  }

  return value.toString();
};

/* =====================================================
   ✅ GET LOCATIONS
===================================================== */
export const getLocations = async () => {
  try {
    const res = await API.get("/locations");

    return res.data?.locations || {};
  } catch (err) {
    console.log("Locations error 👉", err);
    return {};
  }
};

/* =====================================================
   ✅ GET BRANDS
===================================================== */
export const getBrands = async () => {
  try {
    const res = await API.get("/brands");

    const raw = res.data;

    const brands =
      raw.brands ||
      raw.data ||
      raw ||
      [];

    return Array.isArray(brands) ? brands : [];
  } catch (err) {
    console.log("Brands error 👉", err);
    return [];
  }
};

/* =====================================================
   ✅ GET VARIANTS BY BRAND
===================================================== */
export const getVariantsByBrand = async (brandId) => {
  try {
    const res = await API.get(`/variants/brand/${brandId}`);

    return res.data?.variants || [];
  } catch (err) {
    console.log("Variants error 👉", err);
    return [];
  }
};

/* =====================================================
   ✅ GET PUBLIC CARS (FILTERED)
===================================================== */
export const getCars = async (filters = {}) => {
  try {
    const res = await API.get("/cars", {
      params: filters, // ✅ Axios auto query builder
    });

    return res.data?.cars || [];
  } catch (err) {
    console.log("Cars error 👉", err);
    return [];
  }
};

/* =====================================================
   ✅ ADMIN → GET ALL CARS 🔥
===================================================== */
export const getAllCarsAdmin = async () => {
  try {
    const res = await API.get("/cars", {
      headers: getAuthHeaders(),
    });

    return res.data?.cars || [];
  } catch (err) {
    console.log("Admin cars error 👉", err);
    return [];
  }
};

/* =====================================================
   ✅ GET MY CARS 🔥
===================================================== */
export const getMyCars = async () => {
  try {
    const res = await API.get("/cars/my", {
      headers: getAuthHeaders(),
    });

    return res.data?.cars || [];
  } catch (err) {
    console.log("My cars error 👉", err);
    return [];
  }
};

/* =====================================================
   ✅ ADMIN ADD CAR 🔥🔥🔥
===================================================== */
export const addCar = async ({ data, banner, gallery, audio }) => {
  try {
    const formData = new FormData();

    /* ✅ Fields */
    Object.entries(data).forEach(([key, value]) => {
      if (value != null) formData.append(key, value);
    });

    /* ✅ Banner */
    if (banner) formData.append("banner", banner);

    /* ✅ Gallery */
    if (gallery?.length) {
      gallery.forEach((img) => {
        formData.append("gallery", img);
      });
    }

    /* ✅ Audio */
    if (audio) formData.append("audio", audio);

    const res = await API.post("/cars/add", formData, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    return res.status === 201;
  } catch (err) {
    console.log("Add car error 👉", err);
    return false;
  }
};

/* =====================================================
   ✅ UPDATE CAR 🔥
===================================================== */
export const updateCar = async ({ carId, data, banner, gallery, audio }) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value != null) formData.append(key, value);
    });

    if (banner) formData.append("banner", banner);

    if (gallery?.length) {
      gallery.forEach((img) => {
        formData.append("gallery", img);
      });
    }

    if (audio) formData.append("audio", audio);

    const res = await API.put(`/cars/${carId}`, formData, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    return res.status === 200;
  } catch (err) {
    console.log("Update car error 👉", err);
    return false;
  }
};

/* =====================================================
   ✅ DELETE CAR
===================================================== */
export const deleteCar = async (carId) => {
  try {
    const res = await API.delete(`/cars/${carId}`, {
      headers: getAuthHeaders(),
    });

    return res.status === 200;
  } catch (err) {
    console.log("Delete car error 👉", err);
    return false;
  }
};

/* =====================================================
   ✅ USER ADD CAR 🔥
===================================================== */
export const userAddCar = async ({ data, gallery, audio }) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value != null && value.toString().trim() !== "") {
        formData.append(key, value);
      }
    });

    if (gallery?.length) {
      gallery.forEach((img) => {
        formData.append("gallery", img);
      });
    }

    if (audio) formData.append("audio", audio);

    const res = await API.post("/cars/user-add", formData, {
      headers: getAuthHeaders(),
    });

    return res.status === 201;
  } catch (err) {
    console.log("User add car error 👉", err);
    return false;
  }
};

/* =====================================================
   ✅ GET MY CARS GROUPED 😎🔥
===================================================== */
export const getMyCarsGrouped = async () => {
  try {
    const cars = await getMyCars();

    const draft = cars.filter((c) => c.status === "draft");
    const live = cars.filter((c) => c.status !== "draft");

    return { draft, live };
  } catch (err) {
    console.log("Grouped cars error 👉", err);
    return { draft: [], live: [] };
  }
};

/* =====================================================
   ✅ USER → REQUEST DELETE CAR 🔥
===================================================== */
export const requestDeleteCar = async (carId) => {
  try {
    const res = await API.put(
      `/cars/${carId}/request-delete`,
      {},
      { headers: getAuthHeaders() }
    );

    return res.data?.success === true;
  } catch (err) {
    console.log("Request delete error 👉", err);
    return false;
  }
};