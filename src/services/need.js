// ============================================================
// src/services/need.js
// FINAL - BUYCAR / NEED API
// ============================================================

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://rebuy-api.onrender.com/api";

const NEED_URL = `${BASE_URL}/buycar`;

// ============================================================
// AUTH
// ============================================================

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("Login required");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

// ============================================================
// JSON REQUEST
// ============================================================

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

// ============================================================
// ADD NEED
// IMPORTANT: AUDIO MUST BE FILE + FORMDATA
// ============================================================

export async function addNeed({
  type,
  name,
  phone,
  location,
  description = "",
  audioFile = null,
  car = null,
  bike = null,
  property = null,
  electronics = null,
}) {
  try {
    const headers = getAuthHeaders();

    const formData = new FormData();

    formData.append("type", String(type || "").trim());
    formData.append("name", String(name || "").trim());
    formData.append("phone", String(phone || "").trim());
    formData.append(
      "location",
      String(location || "").trim()
    );
    formData.append(
      "description",
      String(description || "").trim()
    );

    // ========================================================
    // NESTED OBJECTS
    // ========================================================

    if (car) {
      formData.append("car", JSON.stringify(car));
    }

    if (bike) {
      formData.append("bike", JSON.stringify(bike));
    }

    if (property) {
      formData.append(
        "property",
        JSON.stringify(property)
      );
    }

    if (electronics) {
      formData.append(
        "electronics",
        JSON.stringify(electronics)
      );
    }

    // ========================================================
    // AUDIO FILE
    // ========================================================

    if (audioFile instanceof File) {
      formData.append("audio", audioFile);
    }

    // IMPORTANT:
    // Do NOT manually set Content-Type.
    // Browser automatically adds multipart boundary.

    const response = await fetch(
      `${NEED_URL}/add`,
      {
        method: "POST",
        headers,
        body: formData,
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
          `Submit failed (${response.status})`
      );
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("addNeed error:", error);

    return {
      success: false,
      message:
        error?.message ||
        "Failed to submit request",
    };
  }
}

// ============================================================
// GET MY NEEDS
// ============================================================

export async function getMyNeeds() {
  const data = await fetchJSON(
    `${NEED_URL}/my`,
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
}

// ============================================================
// GET NEEDS
// ADMIN
// ============================================================

export async function getNeeds({
  type = "",
  status = "",
} = {}) {
  const params = new URLSearchParams();

  if (type) params.set("type", type);
  if (status) params.set("status", status);

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
}

// ============================================================
// GET BY TYPE
// ============================================================

export async function getNeedsByType(type) {
  return getNeeds({ type });
}

// ============================================================
// GET SINGLE
// ============================================================

export async function getNeedById(id) {
  if (!id) {
    throw new Error("Need ID is required");
  }

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
}

// ============================================================
// DELETE MY NEED
// ============================================================

export async function deleteMyNeed(id) {
  if (!id) return false;

  try {
    const data = await fetchJSON(
      `${NEED_URL}/my/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    return data?.success !== false;
  } catch (error) {
    console.error(
      "deleteMyNeed error:",
      error
    );

    return false;
  }
}

// ============================================================
// ADMIN STATUS
// ============================================================

export async function updateNeedStatus({
  id,
  status,
  adminNote = "",
}) {
  try {
    const data = await fetchJSON(
      `${NEED_URL}/${encodeURIComponent(id)}/status`,
      {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          ...(adminNote
            ? { adminNote: adminNote.trim() }
            : {}),
        }),
      }
    );

    return data?.success === true;
  } catch (error) {
    console.error(
      "updateNeedStatus error:",
      error
    );

    return false;
  }
}

// ============================================================
// ADMIN DELETE
// ============================================================

export async function deleteNeedAdmin(id) {
  if (!id) return false;

  try {
    const data = await fetchJSON(
      `${NEED_URL}/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    return data?.success !== false;
  } catch (error) {
    console.error(
      "deleteNeedAdmin error:",
      error
    );

    return false;
  }
}

// ============================================================
// HELPERS
// ============================================================

export function getNeedId(item) {
  if (!item) return "";

  if (
    typeof item._id === "object" &&
    item._id?.$oid
  ) {
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
  return String(
    item?.type || ""
  ).toLowerCase();
}

// ============================================================
// AUDIO URL VALIDATION
// ============================================================

export function getAudioUrl(item) {
  const value = String(
    item?.audioNote || ""
  ).trim();

  if (!value) return "";

  // Old Flutter local path:
  // /data/user/0/...
  // Cannot be played by browser.
  if (
    value.startsWith("/data/") ||
    value.startsWith("file://") ||
    value.startsWith("content://") ||
    value.includes("/code_cache/")
  ) {
    return "";
  }

  // Only proper web URL
  if (
    value.startsWith("https://") ||
    value.startsWith("http://") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  return "";
}