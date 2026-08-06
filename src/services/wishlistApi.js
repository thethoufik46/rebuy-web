// src/services/wishlistApi.js
import API from './api';

const BASE_URL = '/wishlist'; // baseURL is already set in API instance
const DEBUG = process.env.NODE_ENV !== 'production';

export async function getWishlist() {
  try {
    const response = await API.get(BASE_URL);
    if (DEBUG) {
      console.log('📥 Wishlist status:', response.status);
      console.log('📥 Wishlist data:', response.data);
    }
    return response.data.wishlist || [];
  } catch (error) {
    console.error('❌ Wishlist GET error:', error);
    return [];
  }
}

export async function toggleWishlist({ itemId, itemType }) {
  try {
    const response = await API.post(`${BASE_URL}/toggle`, { itemId, itemType });
    if (DEBUG) {
      console.log('📤 Toggle payload:', { itemId, itemType });
      console.log('📥 Toggle response:', response.data);
    }
    return response.data.action; // "added" or "removed"
  } catch (error) {
    console.error('❌ Wishlist toggle error:', error);
    return null;
  }
}

export async function isInWishlist(itemId, itemType) {
  try {
    const wishlist = await getWishlist();
    return wishlist.some(item => item.itemId === itemId && item.itemType === itemType);
  } catch {
    return false;
  }
}