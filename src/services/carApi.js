import API, {
  cachedGet,
  clearApiCache,
  getAuthHeaders,
} from "@/services/api";

/* =========================================================
   PUBLIC CARS
========================================================= */

export const getCars = async (
  filters = {},
  options = {}
) => {
  try {
    const data =
      await cachedGet(
        "/cars",
        {
          params: filters,

          /*
            Home data 60 sec cache.
            Search/filter data 30 sec.
          */
          ttl:
            options.ttl ??
            60 * 1000,

          force:
            options.force ??
            false,
        }
      );

    return (
      data?.cars || []
    );
  } catch (error) {
    console.error(
      "Cars error 👉",
      error
    );

    return [];
  }
};

/* =========================================================
   ADMIN CARS
   ---------------------------------------------------------
   Don't cache private/admin data.
========================================================= */

export const getAllCarsAdmin =
  async () => {
    try {
      const res =
        await API.get(
          "/cars",
          {
            headers:
              getAuthHeaders(),
          }
        );

      return (
        res.data?.cars ||
        []
      );
    } catch (error) {
      console.error(
        "Admin cars error 👉",
        error
      );

      return [];
    }
  };

/* =========================================================
   MY CARS
========================================================= */

export const getMyCars =
  async () => {
    try {
      const res =
        await API.get(
          "/cars/my",
          {
            headers:
              getAuthHeaders(),
          }
        );

      return (
        res.data?.cars ||
        []
      );
    } catch (error) {
      console.error(
        "My cars error 👉",
        error
      );

      return [];
    }
  };

/* =========================================================
   GET LOCATIONS
========================================================= */

export const getLocations =
  async () => {
    try {
      const data =
        await cachedGet(
          "/locations",
          {
            ttl:
              24 *
              60 *
              60 *
              1000,
          }
        );

      return (
        data?.locations ||
        {}
      );
    } catch (error) {
      console.error(
        "Locations error 👉",
        error
      );

      return {};
    }
  };

/* =========================================================
   GET BRANDS
========================================================= */

export const getBrands =
  async () => {
    try {
      const data =
        await cachedGet(
          "/brands",
          {
            ttl:
              24 *
              60 *
              60 *
              1000,
          }
        );

      const brands =
        data?.brands ||
        data?.data ||
        data ||
        [];

      return Array.isArray(
        brands
      )
        ? brands
        : [];
    } catch (error) {
      console.error(
        "Brands error 👉",
        error
      );

      return [];
    }
  };

/* =========================================================
   VARIANTS
========================================================= */

export const getVariantsByBrand =
  async (brandId) => {
    if (!brandId) {
      return [];
    }

    try {
      const data =
        await cachedGet(
          `/variants/brand/${brandId}`,
          {
            ttl:
              24 *
              60 *
              60 *
              1000,
          }
        );

      return (
        data?.variants ||
        []
      );
    } catch (error) {
      console.error(
        "Variants error 👉",
        error
      );

      return [];
    }
  };

/* =========================================================
   AFTER ADD / UPDATE / DELETE
   ---------------------------------------------------------
   Home next time fresh data.
========================================================= */

export const refreshCarsCache =
  () => {
    clearApiCache(
      "/cars?"
    );

    clearApiCache(
      "/cars"
    );
  };