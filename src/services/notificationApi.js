import axios from "axios";

/* =========================
   BASE API CONFIG
========================= */
const API = axios.create({
  baseURL: "https://rebuy-api.onrender.com/api", // ✅ PRODUCTION BACKEND
  timeout: 20000,
});


/* =========================
   🔑 AUTH HEADER
========================= */
function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("Login required");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

/* =========================
   🔔 GET ALL NOTIFICATIONS
========================= */
export async function getNotifications() {
  try {
    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error("Notification fetch failed");
    }

    const data = await res.json();

    return (data.notifications || []).map((n) => ({
      _id: n._id,
      title: n.title || "",
      description: n.description || "",
      image: n.image || "",
      link: n.link || "",
      createdAt: n.createdAt,
    }));
  } catch (err) {
    console.error("❌ Notifications error:", err);
    return [];
  }
}

/* =========================
   🔢 UNREAD COUNT (BADGE)
========================= */
export async function getUnreadCount() {
  try {
    const res = await fetch(
      `${BASE_URL}/notifications/unread-count`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!res.ok) return 0;

    const data = await res.json();
    return data.count || 0;
  } catch (err) {
    console.error("❌ Badge count error:", err);
    return 0;
  }
}

/* =========================
   👁 MARK ALL AS SEEN
========================= */
export async function markAllAsSeen() {
  try {
    const res = await fetch(
      `${BASE_URL}/notifications/mark-seen`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );

    return res.ok;
  } catch (err) {
    console.error("❌ Mark seen error:", err);
    return false;
  }
}

/* =========================
   🟢 ADD NOTIFICATION (ADMIN)
========================= */
export async function addNotification({
  title,
  description,
  link,
  imageFile,
}) {
  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    if (link) formData.append("link", link);
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch(`${BASE_URL}/notifications/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    return res.ok;
  } catch (err) {
    console.error("❌ Add notification error:", err);
    return false;
  }
}

/* =========================
   🟡 UPDATE NOTIFICATION (ADMIN)
========================= */
export async function updateNotification({
  notificationId,
  title,
  description,
  link,
  imageFile,
}) {
  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    if (link) formData.append("link", link);
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch(
      `${BASE_URL}/notifications/${notificationId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: formData,
      }
    );

    return res.ok;
  } catch (err) {
    console.error("❌ Update notification error:", err);
    return false;
  }
}

/* =========================
   🔴 DELETE NOTIFICATION (ADMIN)
========================= */
export async function deleteNotification(id) {
  try {
    const res = await fetch(`${BASE_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return res.ok;
  } catch (err) {
    console.error("❌ Delete notification error:", err);
    return false;
  }
}
