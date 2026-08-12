// src/services/testimonialApi.js

/* =========================================================
   TESTIMONIAL API
   React version of Flutter TestimonialApi
========================================================= */

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://rebuy-api.onrender.com/api";

const TIMEOUT = 20000;

/* =========================================================
   AUTH TOKEN
========================================================= */

const getToken = () => {
  /*
    Flutter:
      SharedPreferences
        .getString("auth_token")

    React:
      localStorage
        auth_token
  */

  const token =
    localStorage.getItem("auth_token") ||
    localStorage.getItem("token");

  if (!token) {
    throw new Error("Login required");
  }

  return token;
};

/* =========================================================
   AUTH HEADERS
========================================================= */

const authHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* =========================================================
   REQUEST WITH TIMEOUT
========================================================= */

const fetchWithTimeout = async (
  url,
  options = {}
) => {
  const controller =
    new AbortController();

  const timeoutId =
    setTimeout(() => {
      controller.abort();
    }, TIMEOUT);

  try {
    const response =
      await fetch(url, {
        ...options,
        signal:
          controller.signal,
      });

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

/* =========================================================
   SAFE JSON
========================================================= */

const parseResponse = async (
  response
) => {
  const text =
    await response.text();

  let data = {};

  try {
    data = text
      ? JSON.parse(text)
      : {};
  } catch {
    data = {
      message: text,
    };
  }

  return data;
};

/* =========================================================
   NORMALIZE TESTIMONIAL
========================================================= */

const normalizeTestimonial = (
  item = {}
) => {
  const id =
    item._id?.$oid ||
    item._id ||
    item.id ||
    "";

  return {
    _id: String(id),

    name:
      item.name || "",

    description:
      item.description || "",

    location:
      item.location || "",

    rating:
      Number(item.rating) || 0,

    phone:
      item.phone || "",

    image:
      item.imageUrl ||
      item.image ||
      "",

    imageUrl:
      item.imageUrl ||
      item.image ||
      "",

    video:
      item.videoUrl ||
      item.video ||
      "",

    videoUrl:
      item.videoUrl ||
      item.video ||
      "",
  };
};

/* =========================================================
   GET TESTIMONIALS
   PUBLIC
========================================================= */

export const getTestimonials =
  async () => {
    try {
      const response =
        await fetchWithTimeout(
          `${BASE_URL}/testimonials`,
          {
            method: "GET",
            headers: {
              Accept:
                "application/json",
            },
          }
        );

      const data =
        await parseResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Testimonial fetch failed"
        );
      }

      const list =
        Array.isArray(
          data?.testimonials
        )
          ? data.testimonials
          : [];

      return list.map(
        normalizeTestimonial
      );
    } catch (error) {
      console.error(
        "GET TESTIMONIALS ERROR:",
        error
      );

      throw error;
    }
  };

/* =========================================================
   ADMIN - GET TESTIMONIALS
   AUTH REQUIRED
========================================================= */

export const getTestimonialsAdmin =
  async () => {
    try {
      const response =
        await fetchWithTimeout(
          `${BASE_URL}/testimonials`,
          {
            method: "GET",
            headers: {
              Accept:
                "application/json",

              ...authHeaders(),
            },
          }
        );

      const data =
        await parseResponse(
          response
        );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Admin testimonial fetch failed"
        );
      }

      const list =
        Array.isArray(
          data?.testimonials
        )
          ? data.testimonials
          : [];

      return list.map(
        normalizeTestimonial
      );
    } catch (error) {
      console.error(
        "ADMIN TESTIMONIAL FETCH ERROR:",
        error
      );

      throw error;
    }
  };

/* =========================================================
   ADD TESTIMONIAL
   POST /testimonials/add

   Required:
     name
     description
     location
     rating
     phone
     imageFile

   Optional:
     videoFile
========================================================= */

export const addTestimonial =
  async ({
    name,
    description,
    location,
    rating,
    phone,
    imageFile,
    videoFile = null,
  }) => {
    try {
      if (!imageFile) {
        throw new Error(
          "Testimonial image is required"
        );
      }

      const formData =
        new FormData();

      formData.append(
        "name",
        name || ""
      );

      formData.append(
        "description",
        description || ""
      );

      formData.append(
        "location",
        location || ""
      );

      formData.append(
        "rating",
        String(rating || 0)
      );

      formData.append(
        "phone",
        phone || ""
      );

      /* IMAGE */

      formData.append(
        "image",
        imageFile,
        imageFile.name ||
          "testimonial-image.jpg"
      );

      /* VIDEO */

      if (videoFile) {
        formData.append(
          "video",
          videoFile,
          videoFile.name ||
            "testimonial-video.mp4"
        );
      }

      const response =
        await fetchWithTimeout(
          `${BASE_URL}/testimonials/add`,
          {
            method: "POST",

            headers: {
              ...authHeaders(),
            },

            body: formData,
          }
        );

      const data =
        await parseResponse(
          response
        );

      console.log(
        "ADD TESTIMONIAL RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Add testimonial failed"
        );
      }

      return (
        data?.success === true ||
        response.ok
      );
    } catch (error) {
      console.error(
        "ADD TESTIMONIAL ERROR:",
        error
      );

      throw error;
    }
  };

/* =========================================================
   UPDATE TESTIMONIAL
   PUT /testimonials/:id

   imageFile optional
   videoFile optional
========================================================= */

export const updateTestimonial =
  async ({
    testimonialId,
    name,
    description,
    location,
    rating,
    phone,
    imageFile = null,
    videoFile = null,
  }) => {
    try {
      if (!testimonialId) {
        throw new Error(
          "Testimonial ID is required"
        );
      }

      const formData =
        new FormData();

      formData.append(
        "name",
        name || ""
      );

      formData.append(
        "description",
        description || ""
      );

      formData.append(
        "location",
        location || ""
      );

      formData.append(
        "rating",
        String(rating || 0)
      );

      formData.append(
        "phone",
        phone || ""
      );

      /* NEW IMAGE */

      if (imageFile) {
        formData.append(
          "image",
          imageFile,
          imageFile.name ||
            "testimonial-image.jpg"
        );
      }

      /* NEW VIDEO */

      if (videoFile) {
        formData.append(
          "video",
          videoFile,
          videoFile.name ||
            "testimonial-video.mp4"
        );
      }

      const response =
        await fetchWithTimeout(
          `${BASE_URL}/testimonials/${encodeURIComponent(
            testimonialId
          )}`,
          {
            method: "PUT",

            headers: {
              ...authHeaders(),
            },

            body: formData,
          }
        );

      const data =
        await parseResponse(
          response
        );

      console.log(
        "UPDATE TESTIMONIAL RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Update testimonial failed"
        );
      }

      return (
        data?.success === true ||
        response.ok
      );
    } catch (error) {
      console.error(
        "UPDATE TESTIMONIAL ERROR:",
        error
      );

      throw error;
    }
  };

/* =========================================================
   DELETE TESTIMONIAL
   DELETE /testimonials/:id
========================================================= */

export const deleteTestimonial =
  async (
    testimonialId
  ) => {
    try {
      if (!testimonialId) {
        throw new Error(
          "Testimonial ID is required"
        );
      }

      const response =
        await fetchWithTimeout(
          `${BASE_URL}/testimonials/${encodeURIComponent(
            testimonialId
          )}`,
          {
            method: "DELETE",

            headers: {
              Accept:
                "application/json",

              ...authHeaders(),
            },
          }
        );

      const data =
        await parseResponse(
          response
        );

      console.log(
        "DELETE TESTIMONIAL RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Delete testimonial failed"
        );
      }

      return (
        data?.success === true ||
        response.status === 200
      );
    } catch (error) {
      console.error(
        "DELETE TESTIMONIAL ERROR:",
        error
      );

      throw error;
    }
  };

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const TestimonialApi = {
  getTestimonials,
  getTestimonialsAdmin,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
};

export default TestimonialApi;