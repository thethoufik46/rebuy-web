import axios from "axios";

/* =========================
   BASE API CONFIG
========================= */
const API = axios.create({
  baseURL: "https://rebuy-api.onrender.com/api",
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
   🔵 GET STORIES
========================= */
export async function getStories() {
  try {
    const res = await fetch(`${BASE_URL}/stories`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error("Story fetch failed");
    }

    const data = await res.json();

    return (data.stories || []).map((s) => ({
      _id: String(s._id),
      title: s.title || "",
      media: s.media || "",
      mediaType: s.mediaType || "image",
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
    }));
  } catch (err) {
    console.error("❌ Stories error:", err);
    return [];
  }
}

/* =========================
   🟢 ADD STORY
========================= */
export async function addStory({ mediaFile, title = "" }) {
  try {
    const formData = new FormData();

    if (title.trim()) {
      formData.append("title", title.trim());
    }

    formData.append("media", mediaFile);

    const res = await fetch(`${BASE_URL}/stories/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!res.ok) return false;

    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("❌ Add story error:", err);
    return false;
  }
}

/* =========================
   🟡 UPDATE STORY
========================= */
export async function updateStory({
  storyId,
  mediaFile,
  title,
}) {
  try {
    const formData = new FormData();

    if (title !== undefined) {
      formData.append("title", title.trim());
    }

    if (mediaFile) {
      formData.append("media", mediaFile);
    }

    const res = await fetch(
      `${BASE_URL}/stories/${storyId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: formData,
      }
    );

    if (!res.ok) return false;

    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("❌ Update story error:", err);
    return false;
  }
}

/* =========================
   🔴 DELETE STORY
========================= */
export async function deleteStory(storyId) {
  try {
    const res = await fetch(
      `${BASE_URL}/stories/${storyId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    return res.ok;
  } catch (err) {
    console.error("❌ Delete story error:", err);
    return false;
  }
}
