// src/services/bikeFilterApi.js
import API from './api';

const BASE_URL = '/bikes';

// ─── Get a single bike by ID ──────────────────────────────
export const getBikeById = async (bikeId) => {
  try {
    const response = await API.get(`${BASE_URL}/${bikeId}`);
    return response.data.bike || null;
  } catch (error) {
    console.error('❌ getBikeById error:', error);
    return null;
  }
};

// ─── Get filtered bikes (brand, model, etc.) ──────────────
export const getFilteredBikes = async (filters = {}) => {
  try {
    const response = await API.get(BASE_URL, { params: filters });
    return response.data.bikes || [];
  } catch (error) {
    console.error('❌ getFilteredBikes error:', error);
    return [];
  }
};