// src/services/need.js

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://rebuy-api.onrender.com/api";

const NEED_URL = `${BASE_URL}/buycar`;

/* =========================================================
   AUTH
========================================================= */

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("Login required");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/* =========================================================
   SAFE JSON
========================================================= */

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `API error (${response.status})`
    );
  }

  return data;
}

/* =========================================================
   ADD NEED
========================================================= */

export async function addNeed({
  type,
  name,
  phone,
  location,
  description = "",
  audioNote = null,
  car = null,
  bike = null,
  property = null,
  electronics = null,
}) {
  try {
    const body = {
      type,
      name: String(name || "").trim(),
      phone: String(phone || "").trim(),
      location: String(location || "").trim(),
      description: String(description || "").trim(),
      audioNote: audioNote || null,

      ...(car ? { car } : {}),
      ...(bike ? { bike } : {}),
      ...(property ? { property } : {}),
      ...(electronics ? { electronics } : {}),
    };

    const data = await fetchJSON(`${NEED_URL}/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("addNeed error:", error);

    return {
      success: false,
      message: error.message || "Failed to submit request",
    };
  }
}

/* =========================================================
   GET MY NEEDS
========================================================= */

export async function getMyNeeds() {
  try {
    const data = await fetchJSON(`${NEED_URL}/my`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const list =
      data?.cars ||
      data?.needs ||
      data?.requests ||
      [];

    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("getMyNeeds error:", error);
    throw error;
  }
}

/* =========================================================
   GET NEEDS BY TYPE
========================================================= */

export async function getNeedsByType(type) {
  try {
    const params = new URLSearchParams();

    if (type) {
      params.set("type", type);
    }

    const query = params.toString();

    const data = await fetchJSON(
      `${NEED_URL}${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const list =
      data?.cars ||
      data?.needs ||
      data?.requests ||
      [];

    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("getNeedsByType error:", error);
    throw error;
  }
}

/* =========================================================
   GET NEEDS WITH FILTER
========================================================= */

export async function getNeeds({
  type = "",
  status = "",
} = {}) {
  try {
    const params = new URLSearchParams();

    if (type) {
      params.set("type", type);
    }

    if (status) {
      params.set("status", status);
    }

    const query = params.toString();

    const data = await fetchJSON(
      `${NEED_URL}${query ? `?${query}` : ""}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const list =
      data?.cars ||
      data?.needs ||
      data?.requests ||
      [];

    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("getNeeds error:", error);
    throw error;
  }
}

/* =========================================================
   GET ALL NEEDS
========================================================= */

export async function getAllNeeds() {
  try {
    const data = await fetchJSON(NEED_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const list =
      data?.cars ||
      data?.needs ||
      data?.requests ||
      [];

    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error("getAllNeeds error:", error);
    throw error;
  }
}

/* =========================================================
   GET SINGLE NEED
========================================================= */

export async function getNeedById(id) {
  if (!id) {
    throw new Error("Need ID is required");
  }

  try {
    const data = await fetchJSON(
      `${NEED_URL}/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    return (
      data?.car ||
      data?.need ||
      data?.request ||
      data ||
      null
    );
  } catch (error) {
    console.error("getNeedById error:", error);
    throw error;
  }
}

/* =========================================================
   UPDATE STATUS
========================================================= */

export async function updateNeedStatus({
  id,
  status,
  adminNote = "",
}) {
  if (!id) {
    throw new Error("Need ID is required");
  }

  try {
    const body = {
      status,
      ...(adminNote
        ? { adminNote: String(adminNote).trim() }
        : {}),
    };

    const data = await fetchJSON(
      `${NEED_URL}/${encodeURIComponent(id)}/status`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      }
    );

    return data?.success === true;
  } catch (error) {
    console.error("updateNeedStatus error:", error);
    return false;
  }
}

/* =========================================================
   DELETE NEED
========================================================= */

export async function deleteNeed(id) {
  if (!id) {
    throw new Error("Need ID is required");
  }

  try {
    const response = await fetch(
      `${NEED_URL}/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    const text = await response.text();

    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Delete failed (${response.status})`
      );
    }

    return data?.success !== false;
  } catch (error) {
    console.error("deleteNeed error:", error);
    return false;
  }
}

/* =========================================================
   HELPERS
========================================================= */

export function getNeedId(item) {
  if (!item) return "";

  if (typeof item._id === "object" && item._id?.$oid) {
    return String(item._id.$oid);
  }

  if (item._id) {
    return String(item._id);
  }

  if (item.id) {
    return String(item.id);
  }

  return "";
}

export function getNeedType(item) {
  return String(item?.type || "").toLowerCase();
}

export function isVisibleNeed(item) {
  const status = String(item?.status || "").toLowerCase();

  return (
    status !== "draft" &&
    status !== "drift"
  );
}