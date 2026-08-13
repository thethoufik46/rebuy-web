// src/services/bike.js

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://rebuy-api.onrender.com/api";

const BIKES_URL = `${BASE_URL}/bikes`;
const BRANDS_URL = `${BASE_URL}/bike-brands`;
const LOCATIONS_URL = `${BASE_URL}/locations`;

/* =========================================================
   FAST MEMORY CACHE
========================================================= */

const cache = new Map();
const pending = new Map();

const PUBLIC_CACHE_TTL = 60 * 1000; // 60 seconds
const LOCATION_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const BRAND_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/* =========================================================
   CACHE HELPERS
========================================================= */

function getCached(key) {
  const item = cache.get(key);

  if (!item) return null;

  if (Date.now() - item.time > item.ttl) {
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

function clearCache(prefix = "") {
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

/* =========================================================
   FAST FETCH
   ---------------------------------------------------------
   Same API request at same time = only ONE network call
========================================================= */

async function cachedFetchJSON(
  url,
  {
    cacheKey = url,
    ttl = PUBLIC_CACHE_TTL,
    force = false,
    options = {},
  } = {}
) {
  /* CACHE HIT */

  if (!force) {
    const cached = getCached(cacheKey);

    if (cached !== null) {
      return cached;
    }
  }

  /* DUPLICATE REQUEST */

  if (!force && pending.has(cacheKey)) {
    return pending.get(cacheKey);
  }

  /* NETWORK REQUEST */

  const request = fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();

        throw new Error(
          `API error (${res.status}): ${text}`
        );
      }

      return res.json();
    })
    .then((data) => {
      setCached(cacheKey, data, ttl);
      return data;
    })
    .finally(() => {
      pending.delete(cacheKey);
    });

  pending.set(cacheKey, request);

  return request;
}

/* =========================================================
   AUTH
========================================================= */

function getAuthHeaders() {
  const token =
    localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("Login required");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

/* =========================================================
   ID HELPER
========================================================= */

export function extractId(value) {
  if (!value) return "";

  if (typeof value === "object") {
    if (value.$oid) {
      return value.$oid.toString();
    }

    if (value._id) {
      return value._id.toString();
    }

    if (value.id) {
      return value.id.toString();
    }
  }

  return value.toString();
}

/* =========================================================
   GET LOCATIONS
   ---------------------------------------------------------
   PUBLIC + 24H CACHE
========================================================= */

export async function getLocations() {
  try {
    const data = await cachedFetchJSON(
      LOCATIONS_URL,
      {
        cacheKey: "bike:locations",
        ttl: LOCATION_CACHE_TTL,
      }
    );

    return data?.locations || {};
  } catch (err) {
    console.error(
      "Bike locations error:",
      err
    );

    return {};
  }
}

/* =========================================================
   GET BIKE BRANDS
   ---------------------------------------------------------
   PUBLIC + 24H CACHE
========================================================= */

export async function getBikeBrands({
  force = false,
} = {}) {
  try {
    const data = await cachedFetchJSON(
      BRANDS_URL,
      {
        cacheKey: "bike:brands",
        ttl: BRAND_CACHE_TTL,
        force,
      }
    );

    const brands =
      data?.brands ||
      data?.data ||
      data ||
      [];

    return Array.isArray(brands)
      ? brands
      : [];
  } catch (err) {
    console.error(
      "Bike brands error:",
      err
    );

    return [];
  }
}

/* =========================================================
   ALIAS
   ---------------------------------------------------------
   Some existing components may use getBrands()
========================================================= */

export async function getBrands(options = {}) {
  return getBikeBrands(options);
}

/* =========================================================
   GET PUBLIC BIKES
   ---------------------------------------------------------
   FILTERS:
   brand
   model
   district
   city
   minPrice
   maxPrice
   minYear
   maxYear

   CACHE: 60 seconds
========================================================= */

export async function getBikes({
  brand,
  model,
  district,
  city,
  minPrice,
  maxPrice,
  minYear,
  maxYear,
  force = false,
} = {}) {
  try {
    const params =
      new URLSearchParams();

    if (brand) {
      params.set(
        "brand",
        String(brand)
      );
    }

    if (model) {
      params.set(
        "model",
        String(model)
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
      minYear !== undefined &&
      minYear !== null &&
      minYear !== ""
    ) {
      params.set(
        "minYear",
        String(minYear)
      );
    }

    if (
      maxYear !== undefined &&
      maxYear !== null &&
      maxYear !== ""
    ) {
      params.set(
        "maxYear",
        String(maxYear)
      );
    }

    const query =
      params.toString();

    const url = query
      ? `${BIKES_URL}?${query}`
      : BIKES_URL;

    const data =
      await cachedFetchJSON(
        url,
        {
          cacheKey:
            `bikes?${query}`,
          ttl:
            PUBLIC_CACHE_TTL,
          force,
        }
      );

    return Array.isArray(
      data?.bikes
    )
      ? data.bikes
      : [];
  } catch (err) {
    console.error(
      "getBikes error:",
      err
    );

    return [];
  }
}

/* =========================================================
   GET SINGLE BIKE
========================================================= */

export async function getBike(
  bikeId,
  {
    force = false,
  } = {}
) {
  if (!bikeId) {
    return null;
  }

  const id =
    extractId(bikeId);

  if (!id) {
    return null;
  }

  try {
    const url =
      `${BIKES_URL}/${id}`;

    const data =
      await cachedFetchJSON(
        url,
        {
          cacheKey:
            `bike:${id}`,
          ttl:
            PUBLIC_CACHE_TTL,
          force,
        }
      );

    return (
      data?.bike ||
      data?.data ||
      data ||
      null
    );
  } catch (err) {
    console.error(
      "getBike error:",
      err
    );

    return null;
  }
}

/* =========================================================
   GET BIKE VARIANTS BY BRAND
========================================================= */

export async function getVariantsByBrand(
  brandId,
  {
    force = false,
  } = {}
) {
  if (!brandId) {
    return [];
  }

  const id =
    extractId(brandId);

  try {
    const url =
      `${BASE_URL}/variants/brand/${id}`;

    const data =
      await cachedFetchJSON(
        url,
        {
          cacheKey:
            `bike:variants:${id}`,
          ttl:
            BRAND_CACHE_TTL,
          force,
        }
      );

    return Array.isArray(
      data?.variants
    )
      ? data.variants
      : [];
  } catch (err) {
    console.error(
      "Bike variants error:",
      err
    );

    return [];
  }
}

/* =========================================================
   GET BIKE MODELS BY BRAND
   ---------------------------------------------------------
   Supports existing API naming if backend uses
   /bike-models/brand/:id
========================================================= */

export async function getBikeModelsByBrand(
  brandId,
  {
    force = false,
  } = {}
) {
  if (!brandId) {
    return [];
  }

  const id =
    extractId(brandId);

  try {
    const url =
      `${BASE_URL}/bike-models/brand/${id}`;

    const data =
      await cachedFetchJSON(
        url,
        {
          cacheKey:
            `bike:models:${id}`,
          ttl:
            BRAND_CACHE_TTL,
          force,
        }
      );

    return (
      data?.models ||
      data?.bikeModels ||
      data?.variants ||
      []
    );
  } catch (err) {
    console.error(
      "Bike models error:",
      err
    );

    return [];
  }
}

/* =========================================================
   ADMIN → GET ALL BIKES
   ---------------------------------------------------------
   PRIVATE DATA = NO CACHE
========================================================= */

export async function getAllBikesAdmin() {
  try {
    const data =
      await fetchJSON(
        BIKES_URL,
        {
          headers:
            getAuthHeaders(),
        }
      );

    return Array.isArray(
      data?.bikes
    )
      ? data.bikes
      : [];
  } catch (err) {
    console.error(
      "Admin bikes error:",
      err
    );

    return [];
  }
}

/* =========================================================
   ADMIN ADD BIKE
========================================================= */

export async function addBike({
  data,
  banner,
  gallery = [],
  audio = null,
  videos = [],
  videoLink = null,
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

    /* VIDEO LINK */

    if (
      videoLink &&
      videoLink.trim()
    ) {
      formData.append(
        "videoLink",
        videoLink.trim()
      );
    }

    /* BANNER */

    if (banner) {
      formData.append(
        "banner",
        banner
      );
    }

    /* GALLERY */

    gallery.forEach(
      (file) => {
        formData.append(
          "gallery",
          file
        );
      }
    );

    /* AUDIO */

    if (audio) {
      formData.append(
        "audio",
        audio
      );
    }

    /* VIDEOS */

    videos.forEach(
      (file) => {
        formData.append(
          "video",
          file
        );
      }
    );

    const res =
      await fetch(
        `${BIKES_URL}/add`,
        {
          method: "POST",
          headers:
            getAuthHeaders(),
          body: formData,
        }
      );

    if (!res.ok) {
      return false;
    }

    const result =
      await res.json();

    if (
      result?.success === true ||
      res.status === 201
    ) {
      clearCache(
        "bikes?"
      );

      return true;
    }

    return false;
  } catch (err) {
    console.error(
      "addBike error:",
      err
    );

    return false;
  }
}

/* =========================================================
   UPDATE BIKE
========================================================= */

export async function updateBike({
  bikeId,
  data,
  banner = null,
  gallery = [],
  audio = null,
  videos = [],
  videoLink = null,
  existingGallery = [],
  existingVideos = [],
}) {
  const id =
    extractId(bikeId);

  if (!id) {
    return false;
  }

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

    /* VIDEO LINK */

    if (videoLink !== null) {
      formData.append(
        "videoLink",
        String(videoLink)
      );
    }

    /* EXISTING GALLERY */

    if (
      existingGallery !== null
    ) {
      formData.append(
        "existingGallery",
        JSON.stringify(
          existingGallery
        )
      );
    }

    /* EXISTING VIDEOS */

    if (
      existingVideos !== null
    ) {
      formData.append(
        "existingVideos",
        JSON.stringify(
          existingVideos
        )
      );
    }

    /* NEW BANNER */

    if (banner) {
      formData.append(
        "banner",
        banner
      );
    }

    /* NEW GALLERY */

    gallery.forEach(
      (file) => {
        formData.append(
          "gallery",
          file
        );
      }
    );

    /* AUDIO */

    if (audio) {
      formData.append(
        "audio",
        audio
      );
    }

    /* VIDEOS */

    videos.forEach(
      (file) => {
        formData.append(
          "video",
          file
        );
      }
    );

    const res =
      await fetch(
        `${BIKES_URL}/${id}`,
        {
          method: "PUT",
          headers:
            getAuthHeaders(),
          body: formData,
        }
      );

    if (!res.ok) {
      return false;
    }

    const result =
      await res.json();

    if (
      result?.success === true ||
      res.status === 200
    ) {
      clearCache(
        "bikes?"
      );

      clearCache(
        `bike:${id}`
      );

      return true;
    }

    return false;
  } catch (err) {
    console.error(
      "updateBike error:",
      err
    );

    return false;
  }
}

/* =========================================================
   DELETE BIKE
========================================================= */

export async function deleteBike(
  bikeId
) {
  const id =
    extractId(bikeId);

  if (!id) {
    return false;
  }

  try {
    const res =
      await fetch(
        `${BIKES_URL}/${id}`,
        {
          method: "DELETE",
          headers:
            getAuthHeaders(),
        }
      );

    if (!res.ok) {
      return false;
    }

    clearCache(
      "bikes?"
    );

    clearCache(
      `bike:${id}`
    );

    return true;
  } catch (err) {
    console.error(
      "deleteBike error:",
      err
    );

    return false;
  }
}

/* =========================================================
   USER ADD BIKE
========================================================= */

export async function userAddBike({
  data,
  gallery = [],
  audio = null,
  videos = [],
  videoLink = null,
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

    /* VIDEO LINK */

    if (
      videoLink &&
      videoLink.trim()
    ) {
      formData.append(
        "videoLink",
        videoLink.trim()
      );
    }

    /* GALLERY */

    gallery.forEach(
      (file) => {
        formData.append(
          "gallery",
          file
        );
      }
    );

    /* AUDIO */

    if (audio) {
      formData.append(
        "audio",
        audio
      );
    }

    /* VIDEOS */

    videos.forEach(
      (file) => {
        formData.append(
          "video",
          file
        );
      }
    );

    const res =
      await fetch(
        `${BIKES_URL}/user-add`,
        {
          method: "POST",
          headers:
            getAuthHeaders(),
          body: formData,
        }
      );

    if (!res.ok) {
      return false;
    }

    const result =
      await res.json();

    if (
      result?.success === true ||
      res.status === 201
    ) {
      clearCache(
        "bikes?"
      );

      return true;
    }

    return false;
  } catch (err) {
    console.error(
      "userAddBike error:",
      err
    );

    return false;
  }
}

/* =========================================================
   GET MY BIKES
   ---------------------------------------------------------
   PRIVATE = NO CACHE
========================================================= */

export async function getMyBikesGrouped() {
  try {
    const data =
      await fetchJSON(
        `${BIKES_URL}/my`,
        {
          headers:
            getAuthHeaders(),
        }
      );

    const bikes =
      Array.isArray(
        data?.bikes
      )
        ? data.bikes
        : [];

    const draft =
      bikes.filter(
        (bike) =>
          bike.status ===
          "draft"
      );

    const live =
      bikes.filter(
        (bike) =>
          bike.status !==
          "draft"
      );

    return {
      draft,
      live,
    };
  } catch (err) {
    console.error(
      "getMyBikesGrouped error:",
      err
    );

    return {
      draft: [],
      live: [],
    };
  }
}

/* =========================================================
   REQUEST DELETE BIKE
========================================================= */

export async function requestDeleteBike(
  bikeId
) {
  const id =
    extractId(bikeId);

  if (!id) {
    return false;
  }

  try {
    const res =
      await fetch(
        `${BIKES_URL}/${id}/request-delete`,
        {
          method: "PUT",
          headers:
            getAuthHeaders(),
        }
      );

    if (!res.ok) {
      return false;
    }

    const result =
      await res.json();

    if (
      result?.success === true
    ) {
      clearCache(
        "bikes?"
      );

      clearCache(
        `bike:${id}`
      );

      return true;
    }

    return false;
  } catch (err) {
    console.error(
      "requestDeleteBike error:",
      err
    );

    return false;
  }
}

/* =========================================================
   BASIC FETCH
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
   CACHE CONTROL
========================================================= */

export function clearBikeCache() {
  clearCache();
}

export function refreshBikeCache() {
  clearCache("bikes?");
}