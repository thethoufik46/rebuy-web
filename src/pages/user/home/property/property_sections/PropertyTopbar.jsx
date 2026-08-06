// src/pages/user/home/Pages/property/property_details/PropertyTopbar.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toggleWishlist, isInWishlist } from '@/services/wishlistApi';

const extractId = (value) => {
  if (!value) return '';
  if (typeof value === 'object') {
    if (value.$oid) return value.$oid.toString();
    if (value._id) return value._id.toString();
    if (Array.isArray(value) && value.length) return extractId(value[0]);
  }
  return value.toString();
};

const categoryName = (property) => property?.category?.toString() || 'Property';

export default function PropertyTopbar({ property, onWishlist }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const propertyId = extractId(property?._id);
  const category = categoryName(property);

  useEffect(() => {
    if (!propertyId) return;
    const check = async () => {
      try {
        const result = await isInWishlist(propertyId, 'Property');
        setIsWishlisted(result);
      } catch {}
    };
    check();
  }, [propertyId]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const action = await toggleWishlist({ itemId: propertyId, itemType: 'Property' });
      const newState = action === 'added';
      setIsWishlisted(newState);
      onWishlist?.(action);
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex items-center justify-between px-4 h-16">
      <button onClick={() => window.history.back()} className="p-2">
        <ArrowLeft className="w-5 h-5 text-black" />
      </button>
      <div className="flex-1 text-center">
        <p className="text-sm text-black/60">{category}</p>
        <p className="text-base font-bold text-black uppercase">{property?.mainType || 'Property'}</p>
      </div>
      {propertyId && (
        <button onClick={handleToggle} className="p-2" disabled={loading}>
          {isWishlisted ? <FaHeart className="w-5 h-5 text-red-500" /> : <FaRegHeart className="w-5 h-5 text-black" />}
        </button>
      )}
    </div>
  );
}