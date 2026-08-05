// src/services/userApi.js

import { BASE_URL } from './apiService';

/**
 * Get auth headers with token from localStorage
 * @returns {Object} Headers object
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Handle response and parse JSON safely
 * @param {Response} response - Fetch response
 * @returns {Promise<any>} Parsed JSON
 */
const handleResponse = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
};

/* ================= LOAD DISTRICTS FROM JSON ================= */
/**
 * Loads district list from a static JSON file.
 * Place your JSON file in `public/data/tamilnadu_locations.json`
 * @returns {Promise<string[]>} Array of district names
 */
export const loadDistricts = async () => {
  try {
    const res = await fetch('/data/tamilnadu_locations.json');
    if (!res.ok) throw new Error('Failed to load districts');
    const data = await res.json();
    return Object.keys(data);
  } catch (error) {
    console.error('❌ loadDistricts error 👉', error);
    return [];
  }
};

/* ================= GET USER DETAILS ================= */
/**
 * Fetch current user details
 * @returns {Promise<Object|null>} User object or null
 */
export const getUserDetails = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    console.log('ME STATUS 👉', res.status);
    const data = await handleResponse(res);
    console.log('ME BODY 👉', data);

    if (res.ok && data.success) {
      return data.user || null;
    }
    return null;
  } catch (error) {
    console.error('❌ getUserDetails error 👉', error);
    return null;
  }
};

/**
 * Get user verification status
 * @returns {Promise<string|null>} Verification status or null
 */
export const getUserVerification = async () => {
  const user = await getUserDetails();
  return user?.verification || null;
};

/* ================= UPDATE PROFILE ================= */
/**
 * Update user profile details
 * @param {Object} params
 * @param {string} params.name
 * @param {string} [params.phone] – optional
 * @param {string} params.email
 * @param {string} params.district
 * @param {string} params.address
 * @returns {Promise<boolean>} Success status
 */
export const updateUserDetails = async ({ name, phone, email, district, address }) => {
  try {
    const payload = { name, email, district, address };
    // phone is optional, only include if provided
    if (phone) payload.phone = phone;

    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    console.log('UPDATE STATUS 👉', res.status);
    const data = await handleResponse(res);
    console.log('UPDATE BODY 👉', data);

    return res.ok && data.success === true;
  } catch (error) {
    console.error('❌ updateUserDetails error 👉', error);
    return false;
  }
};

/* ================= UPLOAD PROFILE IMAGE ================= */
/**
 * Upload a profile image (File or bytes)
 * @param {Object} params
 * @param {File} [params.imageFile] – from file input
 * @param {Uint8Array} [params.imageBytes] – raw image bytes
 * @returns {Promise<boolean>} Success status
 */
export const uploadProfileImage = async ({ imageFile, imageBytes }) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    const formData = new FormData();

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (imageBytes) {
      const blob = new Blob([imageBytes], { type: 'image/png' });
      formData.append('image', blob, 'profile.png');
    } else {
      return false;
    }

    const res = await fetch(`${BASE_URL}/users/upload-profile`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type – browser will set it with boundary
      },
      body: formData,
    });

    console.log('UPLOAD STATUS 👉', res.status);
    const text = await res.text();
    console.log('UPLOAD BODY 👉', text);
    const data = text ? JSON.parse(text) : {};

    return res.ok && data.success === true;
  } catch (error) {
    console.error('❌ uploadProfileImage error 👉', error);
    return false;
  }
};

/* ================= IMAGE VIEW URL ================= */
/**
 * Get the full URL for a user's profile image
 * @param {string} key – image key (filename)
 * @returns {string} Full image URL
 */
export const profileImageUrl = (key) => {
  return `${BASE_URL}/users/image/${key}`;
};

/* ================= CHANGE PASSWORD ================= */
/**
 * Change user password
 * @param {string} newPassword – new password (plain text)
 * @returns {Promise<boolean>} Success status
 */
export const changePassword = async (newPassword) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ newPassword }),
    });

    console.log('PASSWORD STATUS 👉', res.status);
    const data = await handleResponse(res);
    console.log('PASSWORD BODY 👉', data);

    return res.ok && data.success === true;
  } catch (error) {
    console.error('❌ changePassword error 👉', error);
    return false;
  }
};

/* ================= FORGOT PASSWORD REQUEST ================= */
/**
 * Request a password reset (forgot password)
 * @param {string} phone – user's phone number
 * @param {string} newPassword – new password
 * @returns {Promise<boolean>} Success status
 */
export const forgotRequest = async (phone, newPassword) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/forgot-request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ phone, newPassword }),
    });

    console.log('FORGOT STATUS 👉', res.status);
    const data = await handleResponse(res);
    console.log('FORGOT BODY 👉', data);

    return res.ok && data.success === true;
  } catch (error) {
    console.error('❌ forgotRequest error 👉', error);
    return false;
  }
};

/* ================= DELETE ACCOUNT ================= */
/**
 * Delete the current user account
 * @returns {Promise<boolean>} Success status
 */
export const deleteMyAccount = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    console.log('DELETE STATUS 👉', res.status);
    const data = await handleResponse(res);
    console.log('DELETE BODY 👉', data);

    return res.ok && data.success === true;
  } catch (error) {
    console.error('❌ deleteMyAccount error 👉', error);
    return false;
  }
};

/* ================= LOGOUT ================= */
/**
 * Remove auth token from localStorage (logout)
 */
export const logout = () => {
  localStorage.removeItem('auth_token');
  // Optional: clear other user data if stored
};