// src/services/api.js

import axios from "axios";

/* =========================================================
   CONFIG
========================================================= */

export const BASE_URL =
  "https://rebuy-api.onrender.com/api";

const API_TIMEOUT = 20000;

/*
  Memory cache.
  Page/tab change ஆனாலும் data இருக்கும்.
  Browser refresh செய்தால் மட்டும் reset ஆகும்.
*/
const memoryCache = new Map();

/*
  Same API ஒரே நேரத்தில் பல components call செய்தால்
  duplicate request போகாமல் ஒரே Promise share ஆகும்.
*/
const pendingRequests = new Map();

/* =========================================================
   AXIOS INSTANCE
========================================================= */

const API = axios.create({
  baseURL: BASE_URL,

  timeout: API_TIMEOUT,

  headers: {
    Accept: "application/json",
  },

  /*
    Browser HTTP cache-ஐ allow செய்கிறது.
  */
  transitional: {
    clarifyTimeoutError: true,
  },
});

/* =========================================================
   AUTH
========================================================= */

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "auth_token"
      );

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

/* =========================================================
   RESPONSE
========================================================= */

API.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    /*
      Don't crash the whole UI.
    */

    if (
      error?.response?.status ===
      401
    ) {
      /*
        Token invalid என்றால்
        token மட்டும் remove செய்கிறோம்.
        Navigation automatically செய்யவில்லை.
      */
      localStorage.removeItem(
        "auth_token"
      );
    }

    return Promise.reject(
      error
    );
  }
);

/* =========================================================
   CACHE HELPERS
========================================================= */

export const clearApiCache = (
  key = null
) => {
  if (key) {
    memoryCache.delete(key);
    return;
  }

  memoryCache.clear();
};

export const clearApiCachePrefix = (
  prefix
) => {
  for (
    const key of memoryCache.keys()
  ) {
    if (
      key.startsWith(prefix)
    ) {
      memoryCache.delete(key);
    }
  }
};

/* =========================================================
   GET WITH MEMORY CACHE
========================================================= */

export const cachedGet = async (
  url,
  options = {}
) => {
  const {
    params,
    ttl = 60 * 1000,
    force = false,
  } = options;

  /*
    Params stable key.
  */
  const query =
    params &&
    Object.keys(params).length
      ? JSON.stringify(
          Object.keys(params)
            .sort()
            .reduce(
              (obj, key) => {
                obj[key] =
                  params[key];

                return obj;
              },
              {}
            )
        )
      : "";

  const cacheKey =
    `${url}?${query}`;

  /* -------------------------------------------------------
     CACHE HIT
  ------------------------------------------------------- */

  if (!force) {
    const cached =
      memoryCache.get(
        cacheKey
      );

    if (cached) {
      const age =
        Date.now() -
        cached.timestamp;

      if (age < ttl) {
        return cached.data;
      }

      memoryCache.delete(
        cacheKey
      );
    }
  }

  /* -------------------------------------------------------
     DUPLICATE REQUEST PROTECTION
  ------------------------------------------------------- */

  if (
    pendingRequests.has(
      cacheKey
    )
  ) {
    return pendingRequests.get(
      cacheKey
    );
  }

  /* -------------------------------------------------------
     API REQUEST
  ------------------------------------------------------- */

  const request =
    API.get(url, {
      params,
    })
      .then((response) => {
        const data =
          response?.data;

        memoryCache.set(
          cacheKey,
          {
            data,
            timestamp:
              Date.now(),
          }
        );

        return data;
      })
      .finally(() => {
        pendingRequests.delete(
          cacheKey
        );
      });

  pendingRequests.set(
    cacheKey,
    request
  );

  return request;
};

/* =========================================================
   PREFETCH
   ---------------------------------------------------------
   Background API loading.
========================================================= */

export const prefetchGet = (
  url,
  options = {}
) => {
  return cachedGet(
    url,
    {
      ...options,
      force: false,
    }
  ).catch(() => null);
};

/* =========================================================
   AUTH HEADER
========================================================= */

export const getAuthHeaders =
  () => {
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
    };
  };

/* =========================================================
   SAFE ID
========================================================= */

export const extractId = (
  value
) => {
  if (!value) return "";

  if (
    typeof value ===
    "object"
  ) {
    if (value.$oid) {
      return String(
        value.$oid
      );
    }

    if (value._id) {
      return String(
        value._id
      );
    }
  }

  return String(value);
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default API;