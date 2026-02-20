// src/services/apiService.js

const BASE_URL = 'https://rebuy-api.onrender.com/api';

/**
 * Get headers for API requests
 * @param {boolean} auth - Whether to include Authorization header
 * @returns {Promise<Object>} Headers object
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
 * Handle response and parse JSON
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} Parsed JSON
 */
const handleResponse = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error('Invalid JSON response');
  }
};

/* ================= AUTH ================= */

/**
 * Register a new user
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.phone
 * @param {string} params.password
 * @param {string} params.category
 * @param {string} [params.email]
 * @returns {Promise<Object>}
 */
export const registerUser = async ({ name, phone, password, category, email }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({
        name,
        phone,
        password,
        category,
        location: 'NA',
        address: 'NA',
        ...(email && email.trim() ? { email: email.trim() } : {}),
      }),
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
 * Login user
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
 * Get current user info
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
 * Logout user – clear localStorage
 */
export const logout = () => {
  localStorage.clear(); // safer – clears all items
};

/* ================= ADMIN ================= */

/**
 * Get all users (admin only)
 * @returns {Promise<Array|null>} Array of users or null
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/admin/users`, {
      method: 'GET',
      headers: await getHeaders(true),
    });

    const data = await handleResponse(response);

    if (data.success) {
      return data.users || [];
    }
    return null;
  } catch (error) {
    console.error('Get all users error:', error);
    return null;
  }
};

/**
 * Delete a user (admin only)
 * @param {string} id - User ID
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
 * Reset forgotten password (admin only)
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
 * Simple update user (name & phone only) – admin only
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
 * Full update user – admin only
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.name
 * @param {string} params.phone
 * @param {string} params.email
 * @param {string} params.category
 * @param {string} params.location
 * @param {string} params.address
 * @returns {Promise<boolean>}
 */
export const updateUserFull = async ({ id, name, phone, email, category, location, address }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/admin/users/${id}`, {
      method: 'PUT',
      headers: await getHeaders(true),
      body: JSON.stringify({ name, phone, email, category, location, address }),
    });

    const data = await handleResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('Full update error:', error);
    return false;
  }
};

// Export base URL if needed
export { BASE_URL };