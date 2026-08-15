// ======================= src/services/need.js =======================

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://rebuy-api.onrender.com/api";

const NEED_URL = `${BASE_URL}/buycar`;

/* ============================================================
   AUTH
============================================================ */

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

/* ============================================================
   SAFE JSON
============================================================ */

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

/* ============================================================
   ADD NEED
============================================================ */

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
      type: String(type || "").trim(),
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
      success: data?.success !== false,
      data,
      message:
        data?.message ||
        "Request submitted successfully",
    };
  } catch (error) {
    console.error("addNeed error:", error);

    return {
      success: false,
      data: null,
      message:
        error?.message ||
        "Failed to submit request",
    };
  }
}

/* ============================================================
   GET MY NEEDS

   Expected backend:

   {
     success: true,
     active: [],
     deleted: []
   }
============================================================ */

export async function getMyNeeds() {
  try {
    const data = await fetchJSON(`${NEED_URL}/my`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (
      Array.isArray(data?.active) ||
      Array.isArray(data?.deleted)
    ) {
      return {
        active: Array.isArray(data.active)
          ? data.active
          : [],

        deleted: Array.isArray(data.deleted)
          ? data.deleted
          : [],
      };
    }

    /* OLD BACKEND */

    const list =
      data?.cars ||
      data?.needs ||
      data?.requests ||
      [];

    return {
      active: Array.isArray(list)
        ? list.filter(
            (item) => !item?.isDeleted
          )
        : [],

      deleted: Array.isArray(list)
        ? list.filter(
            (item) => item?.isDeleted
          )
        : [],
    };
  } catch (error) {
    console.error("getMyNeeds error:", error);
    throw error;
  }
}

/* ============================================================
   DELETE MY NEED

   IMPORTANT:
   USER DELETE = SOFT DELETE

   Backend should set:

   isDeleted = true
   deletedAt = new Date()
   deleteExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
   )
============================================================ */

export async function deleteMyNeed(id) {
  if (!id) {
    return {
      success: false,
      data: null,
      recoverUntil: null,
      message: "Need ID is required",
    };
  }

  try {
    const data = await fetchJSON(
      `${NEED_URL}/my/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    return {
      success: data?.success === true,

      data:
        data?.data ||
        data?.car ||
        data?.need ||
        null,

      recoverUntil:
        data?.recoverUntil ||
        data?.deleteExpiresAt ||
        null,

      message:
        data?.message || "",
    };
  } catch (error) {
    console.error(
      "deleteMyNeed error:",
      error
    );

    return {
      success: false,
      data: null,
      recoverUntil: null,
      message:
        error?.message ||
        "Delete failed",
    };
  }
}

/* ============================================================
   RESTORE
============================================================ */

export async function restoreMyNeed(id) {
  if (!id) {
    return {
      success: false,
      data: null,
      message: "Need ID is required",
    };
  }

  try {
    const data = await fetchJSON(
      `${NEED_URL}/my/${encodeURIComponent(id)}/restore`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
      }
    );

    return {
      success:
        data?.success === true,

      data:
        data?.data ||
        data?.car ||
        data?.need ||
        null,

      message:
        data?.message || "",
    };
  } catch (error) {
    console.error(
      "restoreMyNeed error:",
      error
    );

    return {
      success: false,
      data: null,
      message:
        error?.message ||
        "Recovery failed",
    };
  }
}

/* ============================================================
   GET SINGLE
============================================================ */

export async function getNeedById(id) {
  if (!id) {
    throw new Error(
      "Need ID is required"
    );
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

/* ============================================================
   ADMIN GET
============================================================ */

export async function getAllNeeds() {
  try {
    const data = await fetchJSON(
      NEED_URL,
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

    return Array.isArray(list)
      ? list
      : [];
  } catch (error) {
    console.error(
      "getAllNeeds error:",
      error
    );

    throw error;
  }
}

/* ============================================================
   ADMIN STATUS
============================================================ */

export async function updateNeedStatus({
  id,
  status,
  adminNote = "",
}) {
  if (!id) {
    throw new Error(
      "Need ID is required"
    );
  }

  try {
    const data = await fetchJSON(
      `${NEED_URL}/${encodeURIComponent(id)}/status`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status,
          ...(adminNote
            ? {
                adminNote:
                  String(adminNote).trim(),
              }
            : {}),
        }),
      }
    );

    return {
      success:
        data?.success === true,

      data:
        data?.car ||
        data?.data ||
        null,

      message:
        data?.message || "",
    };
  } catch (error) {
    console.error(
      "updateNeedStatus error:",
      error
    );

    return {
      success: false,
      data: null,
      message:
        error?.message ||
        "Status update failed",
    };
  }
}

/* ============================================================
   ADMIN PERMANENT DELETE
============================================================ */

export async function deleteNeed(id) {
  if (!id) {
    throw new Error(
      "Need ID is required"
    );
  }

  try {
    const data = await fetchJSON(
      `${NEED_URL}/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    return {
      success:
        data?.success !== false,

      data:
        data?.car ||
        data?.data ||
        null,

      message:
        data?.message || "",
    };
  } catch (error) {
    console.error(
      "deleteNeed error:",
      error
    );

    return {
      success: false,
      data: null,
      message:
        error?.message ||
        "Delete failed",
    };
  }
}

/* ============================================================
   ID
============================================================ */

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

/* ============================================================
   TYPE
============================================================ */

export function getNeedType(item) {
  return String(
    item?.type || ""
  ).toLowerCase();
}

/* ============================================================
   AUDIO URL
============================================================ */

export function getAudioUrl(item) {
  const value =
    item?.audioNote ||
    item?.audio ||
    item?.audioUrl ||
    "";

  if (!value) return "";

  const url =
    String(value).trim();

  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  /*
    Old Flutter local path:

    /data/user/0/com.rebuy.app/...

    Browser cannot play this.
  */

  return "";
}

/* ============================================================
   AUDIO
============================================================ */

export function hasAudio(item) {
  return Boolean(
    getAudioUrl(item)
  );
}

/* ============================================================
   DELETED
============================================================ */

export function isDeletedNeed(item) {
  return Boolean(
    item?.isDeleted
  );
}

/* ============================================================
   DELETED DATE
============================================================ */

export function getDeletedAt(item) {
  if (!item?.deletedAt) {
    return null;
  }

  const date =
    new Date(item.deletedAt);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
}

/* ============================================================
   DELETE EXPIRY
============================================================ */

export function getDeleteExpiresAt(item) {
  if (
    item?.deleteExpiresAt
  ) {
    const date =
      new Date(
        item.deleteExpiresAt
      );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return date;
    }
  }

  const deletedAt =
    getDeletedAt(item);

  if (!deletedAt) {
    return null;
  }

  return new Date(
    deletedAt.getTime() +
      24 *
        60 *
        60 *
        1000
  );
}

/* ============================================================
   CAN RECOVER
============================================================ */

export function canRecoverNeed(item) {
  if (!item?.isDeleted) {
    return false;
  }

  const expiresAt =
    getDeleteExpiresAt(item);

  if (!expiresAt) {
    return false;
  }

  return (
    Date.now() <
    expiresAt.getTime()
  );
}

/* ============================================================
   RECOVERY TIME
============================================================ */

export function getRecoveryTimeLeft(item) {
  const expiresAt =
    getDeleteExpiresAt(item);

  if (!expiresAt) {
    return 0;
  }

  return Math.max(
    0,
    expiresAt.getTime() -
      Date.now()
  );
}

/* ============================================================
   FORMAT TIMER
============================================================ */

export function formatRecoveryTime(item) {
  const remaining =
    getRecoveryTimeLeft(item);

  if (remaining <= 0) {
    return "Recovery expired";
  }

  const totalSeconds =
    Math.floor(
      remaining / 1000
    );

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60
    );

  const seconds =
    totalSeconds % 60;

  return `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

/* ============================================================
   VISIBLE ACTIVE NEED
============================================================ */

export function isVisibleNeed(item) {
  if (!item) {
    return false;
  }

  return (
    !item.isDeleted &&
    String(
      item.status || ""
    ).toLowerCase() !== "draft" &&
    String(
      item.status || ""
    ).toLowerCase() !== "drift"
  );
}

/* ============================================================
   AUDIO MIME
============================================================ */

export function getAudioMimeType(
  url = ""
) {
  const cleanUrl =
    String(url)
      .split("?")[0]
      .toLowerCase();

  if (
    cleanUrl.endsWith(".mp3")
  ) {
    return "audio/mpeg";
  }

  if (
    cleanUrl.endsWith(".wav")
  ) {
    return "audio/wav";
  }

  if (
    cleanUrl.endsWith(".ogg")
  ) {
    return "audio/ogg";
  }

  if (
    cleanUrl.endsWith(".webm")
  ) {
    return "audio/webm";
  }

  if (
    cleanUrl.endsWith(".aac")
  ) {
    return "audio/aac";
  }

  if (
    cleanUrl.endsWith(".m4a")
  ) {
    return "audio/mp4";
  }

  return "audio/mpeg";
}