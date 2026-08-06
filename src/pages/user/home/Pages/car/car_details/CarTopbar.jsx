// src/pages/user/home/Pages/car/car_details/CarTopbar.jsx
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

const brandName = (car) => {
  const brandData = car?.brand;
  if (brandData && typeof brandData === 'object' && brandData.name) return brandData.name.toString();
  return 'Brand';
};

const model = (car) => car?.model?.toString() || 'Car';

export default function CarTopbar({ car, onWishlist }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const carId = extractId(car?._id);
  const brand = brandName(car);
  const modelName = model(car);

  // Check initial wishlist status
  useEffect(() => {
    if (!carId) return;
    const checkWishlist = async () => {
      try {
        const result = await isInWishlist(carId, 'Car');
        setIsWishlisted(result);
      } catch (err) {
        console.error('Wishlist check error:', err);
      }
    };
    checkWishlist();
  }, [carId]);

  // Toggle wishlist
  const handleToggle = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const action = await toggleWishlist({ itemId: carId, itemType: 'Car' });
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
        <p className="text-sm text-black/60">{brand}</p>
        <p className="text-base font-bold text-black uppercase">{modelName}</p>
      </div>
      {carId && (
        <button
          onClick={handleToggle}
          className="p-2"
          disabled={loading}
        >
          {isWishlisted ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <FaRegHeart className="w-5 h-5 text-black" />
          )}
        </button>
      )}
    </div>
  );
}