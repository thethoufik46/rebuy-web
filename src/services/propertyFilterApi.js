// src/services/propertyFilterApi.js
import API from './api';

const BASE_URL = '/properties';

// ─── GET SINGLE PROPERTY (for details page) ──────────────
export const getPropertyById = async (propertyId) => {
  try {
    const response = await API.get(`${BASE_URL}/${propertyId}`);
    const data = response.data;

    // Debug: log the response to see its shape
    console.log('🔍 Property API response:', data);

    // Try multiple possible response structures
    return data.property || data.data || data || null;
  } catch (error) {
    console.error('❌ getPropertyById error:', error);
    return null;
  }
};

// ─── FILTER PROPERTIES (exact match to Flutter) ──────────
export const getFilteredProperties = async ({
  district,
  mainType,
  category,
  direction,
  minPrice,
  maxPrice,
  bedrooms,
  minLandArea,
  maxLandArea,
} = {}) => {
  try {
    const params = {};

    // ── 1. District ──
    if (district && district.trim()) params.district = district.trim();

    // ── 2. Main Type ──
    if (mainType && mainType.trim()) params.mainType = mainType.trim();

    // ── 3. Category ──
    if (category && category.trim()) params.category = category.trim();

    // ── 4. Direction ──
    if (direction && direction.trim()) params.direction = direction.trim();

    // ── 5. Price ──
    if (minPrice != null) params.minPrice = minPrice.toString();
    if (maxPrice != null) params.maxPrice = maxPrice.toString();

    // ── 6. Bedrooms ──
    if (bedrooms && bedrooms.trim()) params.bedrooms = bedrooms.trim();

    // ── 7. Land Area ──
    if (minLandArea != null) params.minLandArea = minLandArea.toString();
    if (maxLandArea != null) params.maxLandArea = maxLandArea.toString();

    const response = await API.get(BASE_URL, { params });

    // Expecting { properties: [...] } – same as Flutter
    return response.data.properties || [];
  } catch (error) {
    console.error('❌ getFilteredProperties error:', error);
    throw new Error('Failed to fetch properties');
  }
};

// ─── CONVENIENCE: get by main type ──────────────────────
export const getPropertiesByType = async (mainType) => {
  return getFilteredProperties({ mainType });
};

// ─── CONVENIENCE: get by district ───────────────────────
export const getPropertiesByDistrict = async (district) => {
  return getFilteredProperties({ district });
};