// src/services/userApi.js

import { BASE_URL } from "./apiService";

// =========================================================
// DISTRICTS JSON
// =========================================================
// File location:
// src/assets/data/tamilnadu_locations.json

import districtsData from "@/assets/data/tamilnadu_locations.json";


/* =========================================================
   AUTH HEADERS
========================================================= */

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};


/* =========================================================
   SAFE RESPONSE HANDLER
========================================================= */

const handleResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(
      "❌ JSON parse error 👉",
      error
    );

    return {};
  }
};


/* =========================================================
   LOAD DISTRICTS
========================================================= */

// IMPORTANT:
//
// tamilnadu_locations.json is inside:
// src/assets/data/
//
// So DON'T use:
// fetch("/data/tamilnadu_locations.json")
//
// We import it directly and get district names
// using Object.keys().

export const loadDistricts = async () => {
  try {
    if (
      !districtsData ||
      typeof districtsData !== "object"
    ) {
      console.error(
        "❌ Invalid tamilnadu_locations.json"
      );

      return [];
    }

    const districts =
      Object.keys(districtsData);

    console.log(
      "✅ DISTRICTS LOADED 👉",
      districts
    );

    return districts;
  } catch (error) {
    console.error(
      "❌ loadDistricts error 👉",
      error
    );

    return [];
  }
};


/* =========================================================
   GET USER DETAILS
========================================================= */

export const getUserDetails = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/auth/me`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    console.log(
      "ME STATUS 👉",
      response.status
    );

    const data =
      await handleResponse(response);

    console.log(
      "ME BODY 👉",
      data
    );

    if (
      response.status === 200 &&
      data.success === true
    ) {
      return data.user || null;
    }

    return null;
  } catch (error) {
    console.error(
      "❌ getUserDetails error 👉",
      error
    );

    return null;
  }
};


/* =========================================================
   GET USER VERIFICATION
========================================================= */

export const getUserVerification = async () => {
  const user =
    await getUserDetails();

  return (
    user?.verification || null
  );
};


/* =========================================================
   UPDATE USER DETAILS
========================================================= */

export const updateUserDetails = async ({
  name,
  phone,
  email,
  district,
  address,
}) => {
  try {
    /*
      Flutter API currently sends:

      name
      email
      district
      address

      Verification is NOT sent.
    */

    const payload = {
      name:
        String(name || "").trim(),

      email:
        String(email || "").trim(),

      district:
        String(district || "").trim(),

      address:
        String(address || "").trim(),
    };


    /*
      Keep phone parameter available,
      but don't send it because the Flutter
      implementation currently doesn't send it.
    */

    console.log(
      "UPDATE PROFILE PAYLOAD 👉",
      payload
    );


    const response = await fetch(
      `${BASE_URL}/auth/me`,
      {
        method: "PUT",

        headers:
          getAuthHeaders(),

        body:
          JSON.stringify(payload),
      }
    );


    console.log(
      "UPDATE STATUS 👉",
      response.status
    );


    const data =
      await handleResponse(
        response
      );


    console.log(
      "UPDATE BODY 👉",
      data
    );


    return (
      response.status === 200 &&
      data.success === true
    );
  } catch (error) {
    console.error(
      "❌ updateUserDetails error 👉",
      error
    );

    return false;
  }
};


/* =========================================================
   UPLOAD PROFILE IMAGE
========================================================= */

export const uploadProfileImage = async ({
  imageFile,
  imageBytes,
}) => {
  try {
    const token =
      localStorage.getItem(
        "auth_token"
      );


    if (!token) {
      console.error(
        "❌ No auth token"
      );

      return false;
    }


    const formData =
      new FormData();


    /* ==============================================
       FILE
    ============================================== */

    if (imageFile) {
      formData.append(
        "image",
        imageFile
      );
    }


    /* ==============================================
       BYTES
    ============================================== */

    else if (imageBytes) {
      const blob = new Blob(
        [imageBytes],
        {
          type: "image/png",
        }
      );

      formData.append(
        "image",
        blob,
        "profile.png"
      );
    }


    /* ==============================================
       NOTHING SELECTED
    ============================================== */

    else {
      console.error(
        "❌ No profile image"
      );

      return false;
    }


    const response =
      await fetch(
        `${BASE_URL}/users/upload-profile`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          // IMPORTANT:
          // Don't set Content-Type manually.
          // Browser automatically creates
          // multipart/form-data boundary.

          body: formData,
        }
      );


    console.log(
      "UPLOAD STATUS 👉",
      response.status
    );


    const text =
      await response.text();


    console.log(
      "UPLOAD BODY 👉",
      text
    );


    let data = {};

    try {
      data = text
        ? JSON.parse(text)
        : {};
    } catch (error) {
      console.error(
        "❌ Upload JSON parse error 👉",
        error
      );

      return false;
    }


    return (
      response.status === 200 &&
      data.success === true
    );
  } catch (error) {
    console.error(
      "❌ uploadProfileImage error 👉",
      error
    );

    return false;
  }
};


/* =========================================================
   PROFILE IMAGE URL
========================================================= */

export const profileImageUrl = (key) => {
  if (!key) {
    return "";
  }


  // Already full URL
  if (
    typeof key === "string" &&
    (
      key.startsWith("http://") ||
      key.startsWith("https://") ||
      key.startsWith("data:")
    )
  ) {
    return key;
  }


  return `${BASE_URL}/users/image/${encodeURIComponent(
    key
  )}`;
};


/* =========================================================
   CHANGE PASSWORD
========================================================= */

export const changePassword = async (
  newPassword
) => {
  try {
    const response =
      await fetch(
        `${BASE_URL}/auth/change-password`,
        {
          method: "PUT",

          headers:
            getAuthHeaders(),

          body:
            JSON.stringify({
              newPassword,
            }),
        }
      );


    console.log(
      "PASSWORD STATUS 👉",
      response.status
    );


    const data =
      await handleResponse(
        response
      );


    console.log(
      "PASSWORD BODY 👉",
      data
    );


    return (
      response.status === 200 &&
      data.success === true
    );
  } catch (error) {
    console.error(
      "❌ changePassword error 👉",
      error
    );

    return false;
  }
};


/* =========================================================
   FORGOT PASSWORD REQUEST
========================================================= */

export const forgotRequest = async (
  phone,
  newPassword
) => {
  try {
    const response =
      await fetch(
        `${BASE_URL}/auth/forgot-request`,
        {
          method: "POST",

          headers:
            getAuthHeaders(),

          body:
            JSON.stringify({
              phone,
              newPassword,
            }),
        }
      );


    console.log(
      "FORGOT STATUS 👉",
      response.status
    );


    const data =
      await handleResponse(
        response
      );


    console.log(
      "FORGOT BODY 👉",
      data
    );


    return (
      response.status === 200 &&
      data.success === true
    );
  } catch (error) {
    console.error(
      "❌ forgotRequest error 👉",
      error
    );

    return false;
  }
};


/* =========================================================
   DELETE ACCOUNT
========================================================= */

export const deleteMyAccount = async () => {
  try {
    const response =
      await fetch(
        `${BASE_URL}/auth/me`,
        {
          method: "DELETE",

          headers:
            getAuthHeaders(),
        }
      );


    console.log(
      "DELETE STATUS 👉",
      response.status
    );


    const data =
      await handleResponse(
        response
      );


    console.log(
      "DELETE BODY 👉",
      data
    );


    const success =
      response.status === 200 &&
      data.success === true;


    if (success) {
      localStorage.removeItem(
        "auth_token"
      );

      sessionStorage.removeItem(
        "re2buy_user_profile"
      );
    }


    return success;
  } catch (error) {
    console.error(
      "❌ deleteMyAccount error 👉",
      error
    );

    return false;
  }
};


/* =========================================================
   LOGOUT
========================================================= */

export const logout = () => {
  localStorage.removeItem(
    "auth_token"
  );

  sessionStorage.removeItem(
    "re2buy_user_profile"
  );
};


/* =========================================================
   DEFAULT API OBJECT
========================================================= */

const UserApi = {
  loadDistricts,

  getUserDetails,

  getUserVerification,

  updateUserDetails,

  uploadProfileImage,

  profileImageUrl,

  changePassword,

  forgotRequest,

  deleteMyAccount,

  logout,
};


export default UserApi;