// src/services/apiService.js

const BASE_URL = 'https://rebuy-api.onrender.com/api';

// ─── Helpers ──────────────────────────────────────────────

/**
 * Get headers for API requests.
 * @param {boolean} auth - Whether to include Authorization header.
 * @returns {Promise<Object>} Headers object.
 */
const getHeaders = async (auth = false) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (auth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Safely parse response body as JSON.
 * @param {Response} response - Fetch response object.
 * @returns {Promise<any>} Parsed JSON.
 */
const handleResponse = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { success: false, message: 'Invalid JSON response' };
  }
};

// ─── AUTH ──────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.phone
 * @param {string} params.password
 * @param {string} params.category
 * @param {string} params.district
 * @param {string} params.address - default 'NA'
 * @param {string} [params.email] - optional
 * @returns {Promise<Object>}
 */
export const registerUser = async ({
  name,
  phone,
  password,
  category,
  district,
  address = 'NA',
  email,
}) => {
  try {
    const payload = { name, phone, password, category, district, address };
    if (email && email.trim()) payload.email = email.trim();

    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(response);

    if (data.success && data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('role', data.user?.role?.toString() || 'user');
    }

    return data;
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, message: 'Register failed' };
  }
};

/**
 * Login user.
 * @param {Object} params
 * @param {string} params.identifier - phone or email
 * @param {string} params.password
 * @returns {Promise<Object>}
 */
export const loginUser = async ({ identifier, password }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ identifier, password }),
    });

    const data = await handleResponse(response);

    if (data.success && data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('role', data.user?.role?.toString() || 'user');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed' };
  }
};

/**
 * Get current user details.
 * @returns {Promise<Object>}
 */
export const getMe = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: await getHeaders(true),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Get me error:', error);
    return { success: false, message: 'Get user failed' };
  }
};

/**
 * Logout – clear all stored auth data.
 */
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('role');
  // Optionally clear other user-related items
};

// ─── USER PROFILE (non‑admin) ────────────────────────────

/**
 * Get user details (alias for getMe, but returns user object or null).
 * @returns {Promise<Object|null>}
 */
export const getUserDetails = async () => {
  const data = await getMe();
  return data.success ? data.user : null;
};

/**
 * Get user verification status.
 * @returns {Promise<string|null>}
 */
export const getUserVerification = async () => {
  const user = await getUserDetails();
  return user?.verification || null;
};

/**
 * Update user profile (name, email, district, address, phone optional).
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.district
 * @param {string} params.address
 * @param {string} [params.phone] - optional
 * @returns {Promise<boolean>}
 */
export const updateUserDetails = async ({ name, email, district, address, phone }) => {
  try {
    const payload = { name, email, district, address };
    if (phone) payload.phone = phone;

    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: await getHeaders(true),
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('Update user details error:', error);
    return false;
  }
};

/**
 * Upload profile image.
 * @param {Object} params
 * @param {File} [params.imageFile] - from file input
 * @param {Uint8Array} [params.imageBytes] - raw image bytes
 * @returns {Promise<boolean>}
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

    const response = await fetch(`${BASE_URL}/users/upload-profile`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await handleResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('Upload profile image error:', error);
    return false;
  }
};

/**
 * Get the full URL for a profile image by key.
 * @param {string} key - Image filename/key.
 * @returns {string}
 */
export const profileImageUrl = (key) => `${BASE_URL}/users/image/${key}`;

/**
 * Change password (authenticated user).
 * @param {string} newPassword
 * @returns {Promise<boolean>}
 */
export const changePassword = async (newPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: await getHeaders(true),
      body: JSON.stringify({ newPassword }),
    });
    const data = await handleResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('Change password error:', error);
    return false;
  }
};

/**
 * Request password reset (forgot password).
 * @param {string} phone
 * @param {string} newPassword
 * @returns {Promise<boolean>}
 */
export const forgotRequest = async (phone, newPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/forgot-request`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ phone, newPassword }),
    });
    const data = await handleResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('Forgot request error:', error);
    return false;
  }
};

/**
 * Delete the current user account.
 * @returns {Promise<boolean>}
 */
export const deleteMyAccount = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'DELETE',
      headers: await getHeaders(true),
    });
    const data = await handleResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('Delete account error:', error);
    return false;
  }
};

// ─── ADMIN ──────────────────────────────────────────────────

/**
 * Get all users (admin only).
 * @returns {Promise<Array|null>} Array of user objects or null.
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/admin/users`, {
      method: 'GET',
      headers: await getHeaders(true),
    });
    const data = await handleResponse(response);
    return data.success ? data.users || [] : null;
  } catch (error) {
    console.error('Get all users error:', error);
    return null;
  }
};

/**
 * Delete a user (admin only).
 * @param {string} id - User ID.
 * @returns {Promise<boolean>}
 */
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/admin/users/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(true),
    });
    const data = await handleResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('Delete user error:', error);
    return false;
  }
};

/**
 * Reset a user's password (admin only).
 * @param {Object} params
 * @param {string} params.phone
 * @param {string} params.newPassword
 * @returns {Promise<boolean>}
 */
export const resetForgotPassword = async ({ phone, newPassword }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/admin/reset-password`, {
      method: 'PUT',
      headers: await getHeaders(true),
      body: JSON.stringify({ phone, newPassword }),
    });
    const data = await handleResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('Reset password error:', error);
    return false;
  }
};

/**
 * Update user name and phone (admin only).
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.name
 * @param {string} params.phone
 * @returns {Promise<boolean>}
 */
export const updateUser = async ({ id, name, phone }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/admin/users/${id}`, {
      method: 'PUT',
      headers: await getHeaders(true),
      body: JSON.stringify({ name, phone }),
    });
    const data = await handleResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('Update user error:', error);
    return false;
  }
};

/**
 * Update user with full details including verification (admin only).
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.name
 * @param {string} params.phone
 * @param {string} params.email
 * @param {string} params.category
 * @param {string} params.district
 * @param {string} params.address
 * @param {string} params.verification - e.g., 'pending', 'verified', 'rejected'
 * @returns {Promise<boolean>}
 */
export const updateUserFull = async ({
  id,
  name,
  phone,
  email,
  category,
  district,
  address,
  verification,
}) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/admin/users/${id}`, {
      method: 'PUT',
      headers: await getHeaders(true),
      body: JSON.stringify({
        name,
        phone,
        email,
        category,
        district,
        address,
        verification,
      }),
    });
    const data = await handleResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('Full update error:', error);
    return false;
  }
};

// ─── RECENTLY VIEWED ───────────────────────────────────────

/**
 * Add an item to the user's recently viewed list.
 * @param {string} itemId
 * @param {string} itemType - e.g., 'car', 'bike'
 * @returns {Promise<boolean>}
 */
export const addRecentlyViewed = async (itemId, itemType) => {
  try {
    const response = await fetch(`${BASE_URL}/recently-viewed`, {
      method: 'POST',
      headers: await getHeaders(true),
      body: JSON.stringify({ itemId, itemType }),
    });
    const data = await handleResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('Add recently viewed error:', error);
    return false;
  }
};

/**
 * Get the user's recently viewed items.
 * @returns {Promise<Array>}
 */
export const getRecentlyViewed = async () => {
  try {
    const response = await fetch(`${BASE_URL}/recently-viewed`, {
      method: 'GET',
      headers: await getHeaders(true),
    });
    const data = await handleResponse(response);
    return data.success ? data.items || [] : [];
  } catch (error) {
    console.error('Get recently viewed error:', error);
    return [];
  }
};

// ─── DISTRICTS ─────────────────────────────────────────────

/**
 * Load district list from a static JSON file.
 * Place your JSON file at `public/data/tamilnadu_locations.json`
 * or import it directly (see alternative below).
 * @returns {Promise<string[]>}
 */
export const loadDistricts = async () => {
  try {
    const response = await fetch('/data/tamilnadu_locations.json');
    if (!response.ok) throw new Error('Failed to load districts');
    const data = await response.json();
    return Object.keys(data);
  } catch (error) {
    console.error('Load districts error:', error);
    return [];
  }
};

// ─── EXPORT BASE URL ───────────────────────────────────────

export { BASE_URL };