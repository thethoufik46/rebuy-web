// src/services/bikeBrandApi.js
import { API_BASE_URL } from './apiConfig';

const BASE_URL = `${API_BASE_URL}/bike-brands`;
const TIMEOUT = 15000; // 15 seconds

// ─── Helper: auth headers ──────────────────────────────────
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('Login required');
  return { Authorization: `Bearer ${token}` };
};

// ─── Helper: fetch with timeout ────────────────────────────
const fetchWithTimeout = (url, options = {}, timeout = TIMEOUT) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(id));
};

// ─── Helper: parse JSON response ──────────────────────────
const parseResponse = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { success: false, message: 'Invalid JSON response' };
  }
};

/* =========================================================
   🟢 USER SIDE – Public (no auth)
========================================================= */
export const getBrandsForUser = async () => {
  try {
    const response = await fetchWithTimeout(BASE_URL);
    if (!response.ok) throw new Error('Bike brand fetch failed');
    const data = await parseResponse(response);
    const list = data.brands || [];
    return list.map((b) => ({
      name: b.name || '',
      logoUrl: b.logoUrl || '',
    }));
  } catch (error) {
    console.error('❌ getBrandsForUser error:', error);
    return [];
  }
};

/* =========================================================
   🔴 ADMIN SIDE – with auth
========================================================= */
export const getBrandsForAdmin = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await fetchWithTimeout(BASE_URL, { headers });
    if (!response.ok) throw new Error('Bike brand fetch failed');
    const data = await parseResponse(response);
    const list = data.brands || [];
    return list.map((b) => ({
      _id: b._id?.toString() || '',
      name: b.name || '',
      logoUrl: b.logoUrl || '',
    }));
  } catch (error) {
    console.error('❌ getBrandsForAdmin error:', error);
    return [];
  }
};

/* =========================================================
   ✅ ADD BRAND
========================================================= */
export const addBrand = async ({ name, logoFile }) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    // logoFile is a File object (from input or drop)
    formData.append('logo', logoFile, 'brand.webp');

    const headers = getAuthHeaders();
    // Do NOT set Content-Type – browser will set it with boundary
    const response = await fetchWithTimeout(`${BASE_URL}/add`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await parseResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('❌ addBrand error:', error);
    return false;
  }
};

/* =========================================================
   ✅ UPDATE BRAND
========================================================= */
export const updateBrand = async ({ brandId, name, logoFile }) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    if (logoFile) {
      formData.append('logo', logoFile, 'brand.webp');
    }

    const headers = getAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/${brandId}`, {
      method: 'PUT',
      headers,
      body: formData,
    });

    const data = await parseResponse(response);
    return data.success === true;
  } catch (error) {
    console.error('❌ updateBrand error:', error);
    return false;
  }
};

/* =========================================================
   ❌ DELETE BRAND
========================================================= */
export const deleteBrand = async (brandId) => {
  try {
    const headers = getAuthHeaders();
    const response = await fetchWithTimeout(`${BASE_URL}/${brandId}`, {
      method: 'DELETE',
      headers,
    });
    return response.ok;
  } catch (error) {
    console.error('❌ deleteBrand error:', error);
    return false;
  }
};