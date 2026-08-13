// src/services/property.js

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://rebuy-api.onrender.com/api";

const PROPERTIES_URL =
  `${BASE_URL}/properties`;

const LOCATIONS_URL =
  `${BASE_URL}/locations/tamilnadu`;

/* =========================================================
   FAST MEMORY CACHE
========================================================= */

const cache = new Map();
const pending = new Map();

const PUBLIC_CACHE_TTL =
  60 * 1000; // 60 seconds

const LOCATION_CACHE_TTL =
  24 * 60 * 60 * 1000; // 24 hours

function getCached(key) {
  const item = cache.get(key);

  if (!item) return null;

  if (
    Date.now() - item.time >
    item.ttl
  ) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

function setCached(
  key,
  data,
  ttl = PUBLIC_CACHE_TTL
) {
  cache.set(key, {
    data,
    time: Date.now(),
    ttl,
  });

  return data;
}

function clearCache(
  prefix = ""
) {
  if (!prefix) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

async function cachedFetchJSON(
  url,
  {
    cacheKey = url,
    ttl = PUBLIC_CACHE_TTL,
    force = false,
    options = {},
  } = {}
) {
  /* -------------------------------------------------------
     CACHE HIT
  ------------------------------------------------------- */

  if (!force) {
    const cached =
      getCached(cacheKey);

    if (cached !== null) {
      return cached;
    }
  }

  /* -------------------------------------------------------
     DUPLICATE REQUEST PROTECTION
  ------------------------------------------------------- */

  if (
    !force &&
    pending.has(cacheKey)
  ) {
    return pending.get(
      cacheKey
    );
  }

  /* -------------------------------------------------------
     REQUEST
  ------------------------------------------------------- */

  const request = fetch(
    url,
    {
      ...options,
      headers: {
        Accept:
          "application/json",
        ...(options.headers || {}),
      },
    }
  )
    .then(async (res) => {
      if (!res.ok) {
        const errorText =
          await res.text();

        throw new Error(
          `API error (${res.status}): ${errorText}`
        );
      }

      return res.json();
    })
    .then((data) => {
      setCached(
        cacheKey,
        data,
        ttl
      );

      return data;
    })
    .finally(() => {
      pending.delete(
        cacheKey
      );
    });

  pending.set(
    cacheKey,
    request
  );

  return request;
}

/* =========================================================
   AUTH
========================================================= */

function getAuthHeaders() {
  const token =
    localStorage.getItem(
      "auth_token"
    );

  if (!token) {
    throw new Error(
      "Login required"
    );
  }

  return {
    Authorization:
      `Bearer ${token}`,
    Accept:
      "application/json",
  };
}

/* =========================================================
   PUBLIC
========================================================= */

/**
 * Get properties
 *
 * Cached for 60 seconds.
 * Same request made simultaneously shares one Promise.
 */
export async function getProperties({
  page = 1,
  limit = 20,
  force = false,
} = {}) {
  try {
    const params =
      new URLSearchParams();

    params.set(
      "page",
      String(page)
    );

    params.set(
      "limit",
      String(limit)
    );

    const query =
      params.toString();

    const url =
      `${PROPERTIES_URL}?${query}`;

    const data =
      await cachedFetchJSON(
        url,
        {
          cacheKey:
            `properties?${query}`,
          ttl:
            PUBLIC_CACHE_TTL,
          force,
        }
      );

    return Array.isArray(
      data?.properties
    )
      ? data.properties
      : [];
  } catch (err) {
    console.error(
      "getProperties error:",
      err
    );

    return [];
  }
}

/**
 * Filter properties
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
  force = false,
} = {}) {
  try {
    const params =
      new URLSearchParams();

    params.set(
      "page",
      String(page)
    );

    params.set(
      "limit",
      String(limit)
    );

    if (mainType) {
      params.set(
        "mainType",
        String(mainType)
      );
    }

    if (category) {
      params.set(
        "category",
        String(category)
      );
    }

    if (district) {
      params.set(
        "district",
        String(district)
      );
    }

    if (city) {
      params.set(
        "city",
        String(city)
      );
    }

    if (
      minPrice !== undefined &&
      minPrice !== null &&
      minPrice !== ""
    ) {
      params.set(
        "minPrice",
        String(minPrice)
      );
    }

    if (
      maxPrice !== undefined &&
      maxPrice !== null &&
      maxPrice !== ""
    ) {
      params.set(
        "maxPrice",
        String(maxPrice)
      );
    }

    if (
      bedrooms !== undefined &&
      bedrooms !== null &&
      bedrooms !== ""
    ) {
      params.set(
        "bedrooms",
        String(bedrooms)
      );
    }

    const query =
      params.toString();

    const url =
      `${PROPERTIES_URL}?${query}`;

    const data =
      await cachedFetchJSON(
        url,
        {
          cacheKey:
            `properties?${query}`,
          ttl:
            PUBLIC_CACHE_TTL,
          force,
        }
      );

    return Array.isArray(
      data?.properties
    )
      ? data.properties
      : [];
  } catch (err) {
    console.error(
      "filterProperties error:",
      err
    );

    return [];
  }
}

/**
 * Tamil Nadu locations
 *
 * Cached for 24 hours.
 */
export async function getLocations() {
  try {
    const data =
      await cachedFetchJSON(
        LOCATIONS_URL,
        {
          cacheKey:
            "locations:tamilnadu",
          ttl:
            LOCATION_CACHE_TTL,
        }
      );

    return (
      data?.locations ||
      {}
    );
  } catch (err) {
    console.error(
      "getLocations error:",
      err
    );

    return {};
  }
}

/**
 * Single property
 */
export async function getProperty(
  id,
  {
    force = false,
  } = {}
) {
  if (!id) return null;

  try {
    const url =
      `${PROPERTIES_URL}/${id}`;

    const data =
      await cachedFetchJSON(
        url,
        {
          cacheKey:
            `property:${id}`,
          ttl:
            PUBLIC_CACHE_TTL,
          force,
        }
      );

    return (
      data?.property ||
      null
    );
  } catch (err) {
    console.error(
      "getProperty error:",
      err
    );

    return null;
  }
}

/* =========================================================
   ADMIN
   ---------------------------------------------------------
   NO CACHE
========================================================= */

export async function getAllPropertiesAdmin() {
  try {
    const headers =
      getAuthHeaders();

    const data =
      await fetchJSON(
        PROPERTIES_URL,
        {
          headers,
        }
      );

    return (
      data?.properties ||
      []
    );
  } catch (err) {
    console.error(
      "getAllPropertiesAdmin error:",
      err
    );

    return [];
  }
}

/* =========================================================
   ADD PROPERTY
========================================================= */

export async function addProperty({
  data,
  banner,
  gallery = [],
  audio = null,
  video = [],
}) {
  try {
    const formData =
      new FormData();

    Object.entries(
      data || {}
    ).forEach(
      ([key, value]) => {
        if (
          value !== null &&
          value !== undefined
        ) {
          formData.append(
            key,
            String(value)
          );
        }
      }
    );

    if (banner) {
      formData.append(
        "banner",
        banner
      );
    }

    gallery.forEach(
      (file) => {
        formData.append(
          "gallery",
          file
        );
      }
    );

    if (audio) {
      formData.append(
        "audio",
        audio
      );
    }

    video.forEach(
      (file) => {
        formData.append(
          "video",
          file
        );
      }
    );

    const res =
      await fetch(
        `${PROPERTIES_URL}/add`,
        {
          method: "POST",
          headers:
            getAuthHeaders(),
          body: formData,
        }
      );

    if (res.status === 201) {
      clearCache(
        "properties?"
      );

      return true;
    }

    return false;
  } catch (err) {
    console.error(
      "addProperty error:",
      err
    );

    return false;
  }
}

/* =========================================================
   UPDATE PROPERTY
========================================================= */

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
    const formData =
      new FormData();

    Object.entries(
      data || {}
    ).forEach(
      ([key, value]) => {
        if (
          value !== null &&
          value !== undefined
        ) {
          if (
            Array.isArray(
              value
            )
          ) {
            formData.append(
              key,
              JSON.stringify(
                value
              )
            );
          } else {
            formData.append(
              key,
              String(value)
            );
          }
        }
      }
    );

    if (
      existingGallery.length
    ) {
      formData.append(
        "existingGallery",
        JSON.stringify(
          existingGallery
        )
      );
    }

    if (
      existingVideos.length
    ) {
      formData.append(
        "existingVideos",
        JSON.stringify(
          existingVideos
        )
      );
    }

    if (banner) {
      formData.append(
        "banner",
        banner
      );
    }

    gallery.forEach(
      (file) => {
        formData.append(
          "gallery",
          file
        );
      }
    );

    if (audio) {
      formData.append(
        "audio",
        audio
      );
    }

    video.forEach(
      (file) => {
        formData.append(
          "video",
          file
        );
      }
    );

    const res =
      await fetch(
        `${PROPERTIES_URL}/${propertyId}`,
        {
          method: "PUT",
          headers:
            getAuthHeaders(),
          body: formData,
        }
      );

    if (res.status === 200) {
      clearCache(
        "properties?"
      );

      clearCache(
        `property:${propertyId}`
      );

      return true;
    }

    return false;
  } catch (err) {
    console.error(
      "updateProperty error:",
      err
    );

    return false;
  }
}

/* =========================================================
   DELETE PROPERTY
========================================================= */

export async function deleteProperty(
  propertyId
) {
  try {
    const res =
      await fetch(
        `${PROPERTIES_URL}/${propertyId}`,
        {
          method: "DELETE",
          headers:
            getAuthHeaders(),
        }
      );

    if (res.status === 200) {
      clearCache(
        "properties?"
      );

      clearCache(
        `property:${propertyId}`
      );

      return true;
    }

    return false;
  } catch (err) {
    console.error(
      "deleteProperty error:",
      err
    );

    return false;
  }
}

/* =========================================================
   USER ADD PROPERTY
========================================================= */

export async function userAddProperty({
  data,
  gallery = [],
  audio = null,
  video = [],
}) {
  try {
    const formData =
      new FormData();

    Object.entries(
      data || {}
    ).forEach(
      ([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          String(value).trim() !== ""
        ) {
          formData.append(
            key,
            String(value)
          );
        }
      }
    );

    gallery.forEach(
      (file) => {
        formData.append(
          "gallery",
          file
        );
      }
    );

    if (audio) {
      formData.append(
        "audio",
        audio
      );
    }

    video.forEach(
      (file) => {
        formData.append(
          "video",
          file
        );
      }
    );

    const res =
      await fetch(
        `${PROPERTIES_URL}/user-add`,
        {
          method: "POST",
          headers:
            getAuthHeaders(),
          body: formData,
        }
      );

    if (res.status === 201) {
      clearCache(
        "properties?"
      );

      return true;
    }

    return false;
  } catch (err) {
    console.error(
      "userAddProperty error:",
      err
    );

    return false;
  }
}

/* =========================================================
   MY PROPERTIES
   ---------------------------------------------------------
   Private data = no cache
========================================================= */

export async function getMyPropertiesGrouped() {
  try {
    const headers =
      getAuthHeaders();

    const data =
      await fetchJSON(
        `${PROPERTIES_URL}/my`,
        {
          headers,
        }
      );

    const properties =
      data?.properties ||
      [];

    const draft =
      properties.filter(
        (p) =>
          p.status ===
          "draft"
      );

    const live =
      properties.filter(
        (p) =>
          p.status !==
          "draft"
      );

    return {
      draft,
      live,
    };
  } catch (err) {
    console.error(
      "getMyPropertiesGrouped error:",
      err
    );

    return {
      draft: [],
      live: [],
    };
  }
}

/* =========================================================
   REQUEST DELETE
========================================================= */

export async function requestDeleteProperty(
  propertyId
) {
  try {
    const res =
      await fetch(
        `${PROPERTIES_URL}/${propertyId}/request-delete`,
        {
          method: "PUT",
          headers:
            getAuthHeaders(),
        }
      );

    if (!res.ok) {
      return false;
    }

    const data =
      await res.json();

    if (
      data?.success === true
    ) {
      clearCache(
        "properties?"
      );

      clearCache(
        `property:${propertyId}`
      );

      return true;
    }

    return false;
  } catch (err) {
    console.error(
      "requestDeleteProperty error:",
      err
    );

    return false;
  }
}

/* =========================================================
   BASIC FETCH HELPER
========================================================= */

async function fetchJSON(
  url,
  options = {}
) {
  const res =
    await fetch(
      url,
      {
        ...options,
        headers: {
          Accept:
            "application/json",
          ...(options.headers || {}),
        },
      }
    );

  if (!res.ok) {
    const text =
      await res.text();

    throw new Error(
      `API error (${res.status}): ${text}`
    );
  }

  return res.json();
}

/* =========================================================
   MANUAL CACHE CONTROL
========================================================= */

export function clearPropertyCache() {
  clearCache();
}

export function refreshPropertyCache() {
  clearCache(
    "properties?"
  );
}