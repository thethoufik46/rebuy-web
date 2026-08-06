// src/services/electronics.js
import API from "@/services/api"; // optional, but we use fetch

const BASE_URL = import.meta.env.VITE_API_URL || "https://rebuy-api.onrender.com/api";
const ELECTRONICS_URL = `${BASE_URL}/electronics`;
const LOCATIONS_URL = `${BASE_URL}/locations`;

// ─── Helpers ──────────────────────────────────────────────

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token"); // ✅ fixed: no external helper
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

// ─── Public API ──────────────────────────────────────────

/**
 * Get electronics with optional filters
 */
export async function getElectronics({
  category,
  brand,
  district,
  city,
  minPrice,
  maxPrice,
} = {}) {
  try {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (district) params.set("district", district);
    if (city) params.set("city", city);
    if (minPrice !== undefined) params.set("minPrice", String(minPrice));
    if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));

    const url = `${ELECTRONICS_URL}?${params}`;
    const data = await fetchJSON(url);
    return data.electronics || data.items || [];
  } catch (err) {
    console.error("getElectronics error:", err);
    return [];
  }
}

// src/services/electronics.js

/**
 * Get single electronics item by ID (for details page)
 */
export async function getElectronicsById(id) {
  try {
    const url = `${ELECTRONICS_URL}/${id}`;
    console.log("🔍 Fetching electronics:", url); // DEBUG

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`❌ API error (${res.status}):`, await res.text());
      return null;
    }

    const data = await res.json();
    console.log("📦 Electronics response:", data); // DEBUG

    // Try multiple response shapes
    return data.electronics || data.item || data.data || data || null;
  } catch (err) {
    console.error("❌ getElectronicsById error:", err);
    return null;
  }
}

/**
 * Get locations (districts & cities) – public
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

// ─── Admin API (requires auth) ──────────────────────────

export async function getAllElectronicsAdmin() {
  try {
    const headers = getAuthHeaders();
    const data = await fetchJSON(ELECTRONICS_URL, { headers });
    return data.electronics || data.items || [];
  } catch (err) {
    console.error("getAllElectronicsAdmin error:", err);
    return [];
  }
}

export async function addElectronics({
  data,
  banner,
  gallery = [],
  audio = null,
  videos = [],
  videoLink = null,
}) {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    if (videoLink && videoLink.trim()) formData.append("videoLink", videoLink.trim());
    if (banner) formData.append("banner", banner);
    gallery.forEach((file) => formData.append("gallery", file));
    if (audio) formData.append("audio", audio);
    videos.forEach((file) => formData.append("video", file));

    const headers = getAuthHeaders();
    const res = await fetch(`${ELECTRONICS_URL}/add`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (res.ok) {
      const result = await res.json();
      return result.success === true;
    }
    return false;
  } catch (err) {
    console.error("addElectronics error:", err);
    return false;
  }
}

export async function updateElectronics({
  id,
  data,
  banner = null,
  gallery = [],
  audio = null,
  videos = [],
  videoLink = null,
  existingGallery = [],
  existingVideos = [],
}) {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    if (videoLink && videoLink.trim()) formData.append("videoLink", videoLink.trim());
    if (existingGallery.length) {
      formData.append("existingGallery", JSON.stringify(existingGallery));
    }
    if (existingVideos.length) {
      formData.append("existingVideos", JSON.stringify(existingVideos));
    }
    if (banner) formData.append("banner", banner);
    gallery.forEach((file) => formData.append("gallery", file));
    if (audio) formData.append("audio", audio);
    videos.forEach((file) => formData.append("video", file));

    const headers = getAuthHeaders();
    const res = await fetch(`${ELECTRONICS_URL}/${id}`, {
      method: "PUT",
      headers,
      body: formData,
    });
    if (res.ok) {
      const result = await res.json();
      return result.success === true;
    }
    return false;
  } catch (err) {
    console.error("updateElectronics error:", err);
    return false;
  }
}

export async function deleteElectronics(id) {
  try {
    const headers = getAuthHeaders();
    const res = await fetch(`${ELECTRONICS_URL}/${id}`, {
      method: "DELETE",
      headers,
    });
    if (res.ok) {
      const result = await res.json();
      return result.success === true;
    }
    return false;
  } catch (err) {
    console.error("deleteElectronics error:", err);
    return false;
  }
}

// ─── User API (requires auth) ───────────────────────────

export async function userAddElectronics({
  data,
  gallery = [],
  audio = null,
  videos = [],
  videoLink = null,
}) {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && String(value).trim() !== "") {
        formData.append(key, String(value));
      }
    });
    if (videoLink && videoLink.trim()) formData.append("videoLink", videoLink.trim());
    gallery.forEach((file) => formData.append("gallery", file));
    if (audio) formData.append("audio", audio);
    videos.forEach((file) => formData.append("video", file));

    const headers = getAuthHeaders();
    const res = await fetch(`${ELECTRONICS_URL}/user-add`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (res.ok) {
      const result = await res.json();
      return result.success === true;
    }
    return false;
  } catch (err) {
    console.error("userAddElectronics error:", err);
    return false;
  }
}

export async function getMyElectronicsGrouped() {
  try {
    const headers = getAuthHeaders();
    const data = await fetchJSON(`${ELECTRONICS_URL}/my`, { headers });
    const list = data.electronics || data.items || [];
    const draft = list.filter((item) => item.status === "draft");
    const live = list.filter((item) => item.status !== "draft");
    return { draft, live };
  } catch (err) {
    console.error("getMyElectronicsGrouped error:", err);
    return { draft: [], live: [] };
  }
}

export async function requestDeleteElectronics(id) {
  try {
    const headers = getAuthHeaders();
    const res = await fetch(`${ELECTRONICS_URL}/${id}/request-delete`, {
      method: "PUT",
      headers,
    });
    if (res.ok) {
      const result = await res.json();
      return result.success === true;
    }
    return false;
  } catch (err) {
    console.error("requestDeleteElectronics error:", err);
    return false;
  }
}