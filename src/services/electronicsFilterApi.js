// src/services/electronicsFilterApi.js
import API from './api';

const BASE_URL = '/electronics';

// ─── Get a single electronics item by ID ──────────────────
export const getElectronicsById = async (electronicsId) => {
  try {
    const response = await API.get(`${BASE_URL}/${electronicsId}`);
    return response.data.electronics || null;
  } catch (error) {
    console.error('❌ getElectronicsById error:', error);
    return null;
  }
};

// ─── Filter electronics with parameters ────────────────────
export const getFilteredElectronics = async ({
  category,
  brand,
  district,
  minPrice,
  maxPrice,
} = {}) => {
  try {
    const params = {};

    // Join arrays into comma-separated strings (like Flutter)
    if (category && category.length) {
      params.category = category.join(',');
    }
    if (brand && brand.length) {
      params.brand = brand.join(',');
    }
    if (district && district.length) {
      params.district = district.join(',');
    }
    if (minPrice != null) params.minPrice = minPrice.toString();
    if (maxPrice != null) params.maxPrice = maxPrice.toString();

    const response = await API.get(BASE_URL, { params });

    // Expecting { electronics: [...] }
    return response.data.electronics || [];
  } catch (error) {
    console.error('❌ getFilteredElectronics error:', error);
    throw new Error('Electronics API Error');
  }
};

// ─── Convenience: get by category ─────────────────────────
export const getElectronicsByCategory = async (category) => {
  return getFilteredElectronics({ category: [category] });
};

// ─── Convenience: get by brand ────────────────────────────
export const getElectronicsByBrand = async (brand) => {
  return getFilteredElectronics({ brand: [brand] });
};