// src/pages/user/home/Pages/car/car_details/CarTopbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toggleWishlist, isInWishlist } from '@/services/wishlistApi';

/* ================= HELPERS ================= */
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
  const [isChecking, setIsChecking] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [toast, setToast] = useState(null);
  const [iconKey, setIconKey] = useState(0);

  const carId = extractId(car?._id);
  const brand = brandName(car);
  const modelName = model(car);
  const toastTimerRef = useRef(null);

  // ─── Check wishlist status on mount ──────────────────
  useEffect(() => {
    if (!carId) {
      console.warn('⚠️ CarTopbar: No carId found!');
      setIsChecking(false);
      return;
    }

    let isMounted = true;
    const checkStatus = async () => {
      try {
        console.log(`🔍 Checking wishlist for carId: ${carId}`);
        const response = await isInWishlist(carId, 'Car');
        console.log('📦 Raw API response (isInWishlist):', response);

        // ─── ROBUST PARSING ──────────────────────────────
        let exists = false;
        if (typeof response === 'boolean') {
          exists = response;
        } else if (response && typeof response === 'object') {
          // Try common response shapes: { exists: true }, { data: true }, { success: true }
          exists = !!response.exists || !!response.data || !!response.success;
          // If the response itself is { _id: ... } it means it returned the item, so it exists
          if (response._id || response.id) exists = true;
        }

        console.log(`✅ Parsed result (isWishlisted): ${exists}`);
        if (isMounted) {
          setIsWishlisted(exists);
        }
      } catch (err) {
        console.error('❌ Wishlist check error:', err);
        if (isMounted) setIsWishlisted(false);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    checkStatus();
    return () => { isMounted = false; };
  }, [carId]);

  // ─── Auto-dismiss toast ──────────────────────────────
  useEffect(() => {
    if (!toast) return;
    toastTimerRef.current = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(toastTimerRef.current);
  }, [toast]);

  // ─── Toggle wishlist ──────────────────────────────────
  const handleToggle = async (e) => {
    e.stopPropagation();
    if (isToggling || isChecking) return;

    setIsToggling(true);
    try {
      console.log(`🔄 Toggling wishlist for carId: ${carId}`);
      const action = await toggleWishlist({ itemId: carId, itemType: 'Car' });
      console.log('📦 Raw API response (toggle):', action);

      // ─── ROBUST PARSING for toggle response ──────────
      let newState = false;
      if (typeof action === 'string') {
        newState = action === 'added';
      } else if (action && typeof action === 'object') {
        newState = action.action === 'added' || action.success === true;
        if (action.exists !== undefined) newState = action.exists;
      }

      console.log(`✅ New wishlist state: ${newState}`);
      setIsWishlisted(newState);
      onWishlist?.(newState);

      setToast({
        message: newState ? 'Added to Wishlist ❤️' : 'Removed from Wishlist',
        type: newState ? 'added' : 'removed',
      });
      setIconKey((prev) => prev + 1);
    } catch (err) {
      console.error('❌ Wishlist toggle error:', err);
    } finally {
      setIsToggling(false);
    }
  };

  // ─── Render heart icon ────────────────────────────────
  const renderHeart = () => {
    if (isChecking) {
      return (
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
      );
    }
    return (
      <motion.div
        key={iconKey}
        whileTap={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {isWishlisted ? (
          <FaHeart className="w-5 h-5 text-red-500" />
        ) : (
          <FaRegHeart className="w-5 h-5 text-black" />
        )}
      </motion.div>
    );
  };

  return (
    <>
      <div className="bg-white flex items-center justify-between px-4 h-16 relative">
        {/* Back button */}
        <button onClick={() => window.history.back()} className="p-2">
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>

        {/* Brand + Model */}
        <div className="flex-1 text-center">
          <p className="text-sm text-black/60">{brand}</p>
          <p className="text-base font-bold text-black uppercase">{modelName}</p>
        </div>

        {/* Heart button */}
        {carId && (
          <button
            onClick={handleToggle}
            className="p-2"
            disabled={isChecking || isToggling}
          >
            {renderHeart()}
          </button>
        )}
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-sm font-medium ${
              toast.type === 'added'
                ? 'bg-red-500 text-white'
                : 'bg-gray-800 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}