// src/services/property.js
const BASE_URL = import.meta.env.VITE_API_URL || "https://rebuy-api.onrender.com/api";
const PROPERTIES_URL = `${BASE_URL}/properties`;
const LOCATIONS_URL = `${BASE_URL}/locations/tamilnadu`;

// ─── Helpers ──────────────────────────────────────────────

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("Login required");
  return {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/json",
  };
}

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error (${res.status}): ${text}`);
  }
  return res.json();
}

// ─── PUBLIC API ──────────────────────────────────────────

/**
 * Get all properties (public) with pagination
 */
export async function getProperties({ page = 1, limit = 20 } = {}) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const url = `${PROPERTIES_URL}?${params}`;
    const data = await fetchJSON(url);
    return data.properties || [];
  } catch (err) {
    console.error("getProperties error:", err);
    return [];
  }
}

/**
 * Filter properties (public) with pagination
 */
export async function filterProperties({
  mainType,
  category,
  district,
  city,
  minPrice,
  maxPrice,
  bedrooms,
  page = 1,
  limit = 20,
} = {}) {
  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (mainType) params.set("mainType", mainType);
    if (category) params.set("category", category);
    if (district) params.set("district", district);
    if (city) params.set("city", city);
    if (minPrice !== undefined) params.set("minPrice", String(minPrice));
    if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));
    if (bedrooms !== undefined) params.set("bedrooms", String(bedrooms));

    const url = `${PROPERTIES_URL}?${params}`;
    const data = await fetchJSON(url);
    return data.properties || [];
  } catch (err) {
    console.error("filterProperties error:", err);
    return [];
  }
}

/**
 * Get Tamil Nadu locations (public)
 */
export async function getLocations() {
  try {
    const data = await fetchJSON(LOCATIONS_URL);
    return data.locations || {};
  } catch (err) {
    console.error("getLocations error:", err);
    return {};
  }
}

/**
 * Get single property details (public)
 */
export async function getProperty(id) {
  try {
    const data = await fetchJSON(`${PROPERTIES_URL}/${id}`);
    return data.property || null;
  } catch (err) {
    console.error("getProperty error:", err);
    return null;
  }
}

// ─── ADMIN API (requires auth) ──────────────────────────

export async function getAllPropertiesAdmin() {
  try {
    const headers = getAuthHeaders();
    const data = await fetchJSON(PROPERTIES_URL, { headers });
    return data.properties || [];
  } catch (err) {
    console.error("getAllPropertiesAdmin error:", err);
    return [];
  }
}

export async function addProperty({ data, banner, gallery = [], audio = null, video = [] }) {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    if (banner) formData.append("banner", banner);
    gallery.forEach((file) => formData.append("gallery", file));
    if (audio) formData.append("audio", audio);
    video.forEach((file) => formData.append("video", file));

    const headers = getAuthHeaders();
    const res = await fetch(`${PROPERTIES_URL}/add`, {
      method: "POST",
      headers,
      body: formData,
    });
    return res.status === 201;
  } catch (err) {
    console.error("addProperty error:", err);
    return false;
  }
}

export async function updateProperty({
  propertyId,
  data,
  banner = null,
  gallery = [],
  existingGallery = [],
  audio = null,
  video = [],
  existingVideos = [],
}) {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    if (existingGallery.length) {
      formData.append("existingGallery", JSON.stringify(existingGallery));
    }
    if (existingVideos.length) {
      formData.append("existingVideos", JSON.stringify(existingVideos));
    }
    if (banner) formData.append("banner", banner);
    gallery.forEach((file) => formData.append("gallery", file));
    if (audio) formData.append("audio", audio);
    video.forEach((file) => formData.append("video", file));

    const headers = getAuthHeaders();
    const res = await fetch(`${PROPERTIES_URL}/${propertyId}`, {
      method: "PUT",
      headers,
      body: formData,
    });
    return res.status === 200;
  } catch (err) {
    console.error("updateProperty error:", err);
    return false;
  }
}

export async function deleteProperty(propertyId) {
  try {
    const headers = getAuthHeaders();
    const res = await fetch(`${PROPERTIES_URL}/${propertyId}`, {
      method: "DELETE",
      headers,
    });
    return res.status === 200;
  } catch (err) {
    console.error("deleteProperty error:", err);
    return false;
  }
}

// ─── USER API (requires auth) ──────────────────────────

export async function userAddProperty({ data, gallery = [], audio = null, video = [] }) {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && String(value).trim() !== "") {
        formData.append(key, String(value));
      }
    });
    gallery.forEach((file) => formData.append("gallery", file));
    if (audio) formData.append("audio", audio);
    video.forEach((file) => formData.append("video", file));

    const headers = getAuthHeaders();
    const res = await fetch(`${PROPERTIES_URL}/user-add`, {
      method: "POST",
      headers,
      body: formData,
    });
    return res.status === 201;
  } catch (err) {
    console.error("userAddProperty error:", err);
    return false;
  }
}

export async function getMyPropertiesGrouped() {
  try {
    const headers = getAuthHeaders();
    const data = await fetchJSON(`${PROPERTIES_URL}/my`, { headers });
    const properties = data.properties || [];
    const draft = properties.filter((p) => p.status === "draft");
    const live = properties.filter((p) => p.status !== "draft");
    return { draft, live };
  } catch (err) {
    console.error("getMyPropertiesGrouped error:", err);
    return { draft: [], live: [] };
  }
}

export async function requestDeleteProperty(propertyId) {
  try {
    const headers = getAuthHeaders();
    const res = await fetch(`${PROPERTIES_URL}/${propertyId}/request-delete`, {
      method: "PUT",
      headers,
    });
    if (res.ok) {
      const data = await res.json();
      return data.success === true;
    }
    return false;
  } catch (err) {
    console.error("requestDeleteProperty error:", err);
    return false;
  }
}