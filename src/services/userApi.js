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
 * Handle response and parse JSON
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

/* ================= GET USER DETAILS ================= */
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

/* ================= UPDATE PROFILE ================= */
export const updateUserDetails = async ({ name, phone, email, location, address }) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, email, location, address }),
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
export const uploadProfileImage = async ({ imageFile, imageBytes }) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    const formData = new FormData();

    if (imageFile) {
      // If it's a File object (from file input)
      formData.append('image', imageFile);
    } else if (imageBytes) {
      // If we have raw bytes – create a Blob and append
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
export const profileImageUrl = (key) => {
  return `${BASE_URL}/users/image/${key}`;
};

/* ================= CHANGE PASSWORD ================= */
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
export const logout = () => {
  localStorage.removeItem('auth_token');
  // Optionally remove other user-related data
};